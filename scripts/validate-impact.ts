/**
 * 개인화 영향경로 데이터 검증. docs/personalized-bill-impact-plan.md §12.4
 *
 * 정적 사이트라 데이터가 곧 코드다. 그래서 이 규칙들은 문서상의 약속이 아니라
 * **빌드 전에 실행되어 빌드를 막는** 검사로 강제한다. (`prebuild` → `npm run build`)
 *
 *   npm run validate:impact
 */

import { bills } from "@/data/bills";
import { impactData } from "@/data/impact";
import { getQuestion, PROFILE_QUESTIONS } from "@/lib/profile/questions";
import { hasCalculator } from "@/lib/impact/calculators";
import type { Bill } from "@/types/bill";
import type {
  BillImpactData,
  ImpactPathway,
  NumericRange,
  ProfileCondition,
  ProfileKey,
} from "@/types/impact";

type Level = "error" | "warn";

interface Finding {
  level: Level;
  rule: string;
  where: string;
  message: string;
}

const findings: Finding[] = [];

function fail(rule: string, where: string, message: string) {
  findings.push({ level: "error", rule, where, message });
}

function warn(rule: string, where: string, message: string) {
  findings.push({ level: "warn", rule, where, message });
}

const TODAY = new Date().toISOString().slice(0, 10);
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const billBySlug = new Map<string, Bill>(bills.map((b) => [b.slug, b]));
const PROFILE_KEYS = new Set<string>(PROFILE_QUESTIONS.map((q) => q.field));

// ── 규칙 1. 근거 ────────────────────────────────────────────────
function checkLegalBasis(p: ImpactPathway, where: string) {
  if (!p.legalBasis || p.legalBasis.length === 0) {
    fail("1", where, "legalBasis가 비어 있습니다. 최소 1건이 필요합니다.");
    return;
  }
  p.legalBasis.forEach((s, i) => {
    const identifiable = Boolean(s.url) || Boolean(s.publisher && s.date);
    if (!identifiable) {
      fail(
        "1",
        `${where} · legalBasis[${i}]`,
        "출처에 url이 없다면 publisher와 date가 함께 있어야 확인할 수 있습니다.",
      );
    }
  });
}

// ── 규칙 2. 검토일 ──────────────────────────────────────────────
function checkReviewedAt(date: string | undefined, where: string) {
  if (!date || !DATE_RE.test(date)) {
    fail("2", where, `reviewedAt이 없거나 YYYY-MM-DD 형식이 아닙니다: ${date}`);
    return;
  }
  if (date > TODAY) {
    fail("2", where, `reviewedAt이 미래 날짜입니다: ${date} (오늘 ${TODAY})`);
  }
}

// ── 규칙 5. `변화 없음`의 근거 ──────────────────────────────────
// "형식적"의 조작적 정의: 근거가 1건뿐이거나, 모든 출처 유형이 `기타`인 경우.
// 자료가 없다는 이유로 `확인된 직접 변화 없음`을 붙이는 것을 막기 위한 문턱이다. (§5.3)
function checkNoChangeEvidence(p: ImpactPathway, where: string) {
  if (p.direction !== "no_direct_change") return;
  if (p.legalBasis.length < 2) {
    fail(
      "5",
      where,
      "`확인된 직접 변화 없음`은 검토 근거가 있을 때만 씁니다. 근거를 2건 이상 제시하세요.",
    );
  }
  if (p.legalBasis.every((s) => s.type === "기타")) {
    fail(
      "5",
      where,
      "`확인된 직접 변화 없음`의 근거가 모두 `기타` 유형입니다. 법령·법안원문·공식통계·연구자료 중 최소 1건이 필요합니다.",
    );
  }
}

// ── 규칙 6. 금액 계산 ───────────────────────────────────────────
function checkMagnitude(p: ImpactPathway, where: string) {
  const m = p.magnitude;
  if (!m) return;
  if (m.kind === "statutory_calculation") {
    if (!m.calculatorId) {
      fail("6", where, "statutory_calculation인데 calculatorId가 없습니다.");
    } else if (!hasCalculator(m.calculatorId)) {
      fail("6", where, `등록되지 않은 calculatorId입니다: ${m.calculatorId}`);
    }
  }
  if (m.kind !== "statutory_calculation" && m.calculatorId) {
    fail("6", where, "계산기가 없는 kind에 calculatorId가 붙어 있습니다.");
  }
}

// ── 규칙 7. 조건 ────────────────────────────────────────────────
function isRange(v: ProfileCondition["value"]): v is NumericRange {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function checkCondition(c: ProfileCondition, where: string) {
  if (!PROFILE_KEYS.has(c.field)) {
    fail("7", where, `ProfileKey에 없는 field입니다: ${c.field}`);
    return;
  }
  const question = getQuestion(c.field as ProfileKey);

  if (c.operator === "withinRange") {
    if (!isRange(c.value)) {
      fail("7", where, "withinRange의 value는 NumericRange여야 합니다.");
      return;
    }
    if (c.value.max !== null && c.value.min > c.value.max) {
      fail("7", where, `구간이 뒤집혀 있습니다: min=${c.value.min}, max=${c.value.max}`);
    }
    if (!question.options.some((o) => o.range)) {
      fail(
        "7",
        where,
        `${c.field} 질문의 선택지에 구간(range)이 없어 withinRange로 비교할 수 없습니다.`,
      );
    }
    return;
  }

  // 범주형 — 연산자와 질문 종류가 맞는지, 값이 실제 선택지에 있는지 확인한다.
  if (isRange(c.value)) {
    fail("7", where, `${c.operator}의 value는 범주값이어야 합니다.`);
    return;
  }
  const expectedKind = c.operator === "includes" ? "multi" : "single";
  if (question.kind !== expectedKind) {
    fail(
      "7",
      where,
      `${c.operator}는 ${expectedKind} 선택 질문에만 씁니다. ${c.field}는 ${question.kind}입니다.`,
    );
  }
  const values = Array.isArray(c.value) ? c.value : [c.value];
  const known = new Set(question.options.map((o) => o.code));
  for (const v of values) {
    if (!known.has(v)) {
      fail("7", where, `${c.field}의 선택지에 없는 값입니다: ${v}`);
    }
  }
  if (values.length === 0) {
    fail("7", where, "범주형 조건의 후보가 비어 있습니다.");
  }
}

// ── 규칙 8·9. 법안 상태와 검토 시점 ─────────────────────────────
function checkBillFreshness(bill: Bill, data: BillImpactData) {
  const reviewedDates = [
    data.review.reviewedAt,
    ...data.pathways.map((p) => p.reviewedAt),
  ].filter((d) => DATE_RE.test(d));
  if (reviewedDates.length === 0) return;
  const lastReviewed = reviewedDates.reduce((a, b) => (a > b ? a : b));

  // 규칙 8 — 이미 일어난 상태 전이 중 마지막 검토일 이후의 것이 있으면 재검토 대상이다.
  const transitions: [string, string | undefined][] = [
    ["통과", bill.passedDate],
    ["공포", bill.promulgatedDate],
    ["시행", bill.effectiveDate],
  ];
  for (const [label, date] of transitions) {
    if (!date || !DATE_RE.test(date)) continue;
    if (date <= TODAY && date > lastReviewed) {
      fail(
        "8",
        bill.slug,
        `${label}(${date}) 이후 개인화 경로가 재검토되지 않았습니다. 마지막 검토일 ${lastReviewed}`,
      );
    }
  }

  // 규칙 9 — 법안 본문이 갱신됐는데 경로는 그대로면 경고
  if (bill.lastUpdated > lastReviewed) {
    warn(
      "9",
      bill.slug,
      `법안 본문이 ${bill.lastUpdated}에 갱신됐는데 개인화 경로의 마지막 검토는 ${lastReviewed}입니다.`,
    );
  }
}

// ── 규칙 10·11. 요약 레이어와의 정합 ────────────────────────────
function checkStakeholderLinks(bill: Bill, data: BillImpactData) {
  const entries = [...bill.beneficiaries, ...bill.costBearers];
  const linked = new Set(
    entries.map((e) => e.pathwayId).filter((id): id is string => Boolean(id)),
  );
  const ids = new Set(data.pathways.map((p) => p.id));

  for (const id of linked) {
    if (!ids.has(id)) {
      fail(
        "10",
        bill.slug,
        `StakeholderEntry.pathwayId가 존재하지 않는 경로를 가리킵니다: ${id}`,
      );
    }
  }
  for (const p of data.pathways) {
    if (p.direction !== "benefit" && p.direction !== "burden") continue;
    if (!linked.has(p.id)) {
      warn(
        "10",
        `${bill.slug} · ${p.id}`,
        "방향이 확인된 경로인데 대응하는 이득·부담 항목에 pathwayId 링크가 없습니다.",
      );
    }
  }

  // 규칙 11 — 전가 경로만 있고 본인 경로가 없으면 귀착 검토가 빠졌을 수 있다.
  const hasEmployer = data.pathways.some((p) => p.relationship === "employer");
  const hasSelf = data.pathways.some(
    (p) => p.relationship === "self" || p.relationship === "household",
  );
  if (hasEmployer && !hasSelf) {
    warn(
      "11",
      bill.slug,
      "고용주 경로만 있고 본인·가구 경로가 없습니다. 법적 부담자와 경제적 부담자 구분이 빠졌을 수 있습니다.",
    );
  }
}

// ── 구조 검사 (규칙표에 없지만 없으면 나머지가 무의미해지는 것들) ──
function checkStructure() {
  const seenSlug = new Set<string>();
  const seenPathwayId = new Set<string>();

  for (const data of impactData) {
    const slug = data.review.billSlug;
    if (seenSlug.has(slug)) {
      fail("구조", slug, "같은 법안에 개인화 데이터가 두 번 등록됐습니다.");
    }
    seenSlug.add(slug);

    // 규칙 3
    if (!billBySlug.has(slug)) {
      fail("3", slug, "실재하지 않는 법안 slug입니다.");
    }
    // 규칙 4
    if (!data.review.baselineVersion) {
      fail("4", slug, "review.baselineVersion이 없습니다.");
    }
    checkReviewedAt(data.review.reviewedAt, `${slug} · review`);

    for (const p of data.pathways) {
      const where = `${slug} · ${p.id}`;
      if (seenPathwayId.has(p.id)) {
        fail("구조", where, "경로 id가 중복됩니다.");
      }
      seenPathwayId.add(p.id);

      if (p.billSlug !== slug) {
        fail("3", where, `billSlug가 파일의 법안과 다릅니다: ${p.billSlug}`);
      }
      if (!p.baselineVersion) fail("4", where, "baselineVersion이 없습니다.");
      if (!p.baseline) fail("4", where, "baseline 설명이 없습니다.");
      if (!p.mechanism) fail("구조", where, "mechanism 설명이 없습니다.");

      checkReviewedAt(p.reviewedAt, where);
      checkLegalBasis(p, where);
      checkNoChangeEvidence(p, where);
      checkMagnitude(p, where);
      p.conditions.forEach((c, i) =>
        checkCondition(c, `${where} · conditions[${i}]`),
      );

      if (p.appliesFrom && !DATE_RE.test(p.appliesFrom)) {
        fail("구조", where, `appliesFrom이 YYYY-MM-DD 형식이 아닙니다: ${p.appliesFrom}`);
      }
      if (p.assumptions.length === 0) {
        fail("구조", where, "assumptions가 비어 있습니다. 무엇을 가정했는지 밝혀야 합니다.");
      }
      if (p.uncertainties.length === 0) {
        fail("구조", where, "uncertainties가 비어 있습니다. 모르는 것을 적어야 합니다.");
      }
    }

    const bill = billBySlug.get(slug);
    if (bill) {
      checkBillFreshness(bill, data);
      checkStakeholderLinks(bill, data);
    }
  }

  // §19 — 모든 법안이 검토된 경로 또는 명시적 `연결 없음` 판정을 가진다.
  for (const bill of bills) {
    const data = impactData.find((d) => d.review.billSlug === bill.slug);
    if (!data) {
      fail(
        "19",
        bill.slug,
        "개인화 검토 기록이 없습니다. src/data/impact/에 파일을 추가하세요.",
      );
      continue;
    }
    if (data.pathways.length === 0 && !data.review.noPersonalPathwayReason) {
      fail(
        "19",
        bill.slug,
        "경로가 없다면 왜 없는지(noPersonalPathwayReason)를 반드시 적어야 합니다. 검토하지 않은 것과 구분되어야 합니다.",
      );
    }
  }
}

checkStructure();

const errors = findings.filter((f) => f.level === "error");
const warnings = findings.filter((f) => f.level === "warn");

const pathwayCount = impactData.reduce((n, d) => n + d.pathways.length, 0);
console.log(
  `개인화 데이터 검증 — 법안 ${impactData.length}건, 영향경로 ${pathwayCount}건 (기준일 ${TODAY})`,
);

for (const f of warnings) {
  console.warn(`  경고 [규칙 ${f.rule}] ${f.where}\n        ${f.message}`);
}
for (const f of errors) {
  console.error(`  실패 [규칙 ${f.rule}] ${f.where}\n        ${f.message}`);
}

if (errors.length > 0) {
  console.error(`\n검증 실패: ${errors.length}건. 빌드를 중단합니다.`);
  process.exit(1);
}

console.log(
  warnings.length > 0
    ? `\n통과 (경고 ${warnings.length}건).`
    : "\n통과. 위반 없음.",
);
