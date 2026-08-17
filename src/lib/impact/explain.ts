// 결정적 조건 산출. §6.3 · §7.6
//
// 추가 질문은 **판정을 바꿀 수 있을 때만** 노출한다. 어떤 답을 하든 결과가 같으면 묻지 않는다.
// 상세화면의 "다른 답을 선택했을 때 달라지는 결정적 조건" 표시도 같은 계산을 쓴다.

import type {
  BillImpactData,
  ProfileCondition,
  ProfileKey,
} from "@/types/impact";
import type { UserProfile } from "@/types/profile";
import { evaluateCondition } from "./conditions";
import {
  RELEVANCE_STRENGTH,
  summarizeBillRelevance,
  type Relevance,
} from "./match";
import { bucketOf, type SummaryBucket } from "./map";

/** 하나의 가정 아래에서 나오는 판정. 관련성과 영향 방향 요약을 함께 본다. */
export interface Verdict {
  relevance: Relevance;
  bucket: SummaryBucket;
}

function sameVerdict(a: Verdict, b: Verdict): boolean {
  return a.relevance === b.relevance && a.bucket === b.bucket;
}

export interface DecisiveField {
  field: ProfileKey;
  /** 이 항목을 결정적으로 만드는 조건들. 설명 문구에 쓴다. */
  conditions: ProfileCondition[];
  /** 지금 이 항목에 답이 있는가 (모름·미응답이면 false) */
  answered: boolean;
  current: Verdict;
  /** 이 항목의 조건이 성립한다고 가정했을 때의 판정 */
  ifTrue: Verdict;
  /** 성립하지 않는다고 가정했을 때 */
  ifFalse: Verdict;
}

function verdictOf(
  billSlug: string,
  data: BillImpactData,
  profile: UserProfile,
  field?: ProfileKey,
  forced?: "true" | "false",
): Verdict {
  const summary = summarizeBillRelevance(billSlug, data, profile, (c) =>
    field && c.field === field ? forced : undefined,
  );
  return { relevance: summary.relevance, bucket: bucketOf(summary) };
}

/**
 * 이 법안의 판정을 바꿀 수 있는 프로필 항목을 찾는다.
 *
 * 항목 단위로 계산한다. 사용자가 답하는 단위가 질문(=항목) 하나이기 때문이다.
 * 한 항목에 걸린 조건이 여러 개면 전부 성립/불성립으로 가정해 양쪽을 비교한다.
 *
 * '판정'은 관련성만이 아니라 영향 방향 요약까지 포함한다. 관련성 등급이 같아도
 * 혜택·부담 방향이 갈리면 물어볼 가치가 있는 질문이기 때문이다.
 */
export function whatWouldChange(
  billSlug: string,
  data: BillImpactData | undefined,
  profile: UserProfile,
): DecisiveField[] {
  if (!data || data.pathways.length === 0) return [];

  const base = verdictOf(billSlug, data, profile);

  // 이 법안이 쓰는 프로필 항목을 데이터 순서대로 모은다(결정론).
  const fields: ProfileKey[] = [];
  const conditionsByField = new Map<ProfileKey, ProfileCondition[]>();
  for (const pathway of data.pathways) {
    for (const condition of pathway.conditions) {
      if (condition.role === "informative") continue;
      if (!conditionsByField.has(condition.field)) {
        conditionsByField.set(condition.field, []);
        fields.push(condition.field);
      }
      conditionsByField.get(condition.field)!.push(condition);
    }
  }

  const result: DecisiveField[] = [];
  for (const field of fields) {
    const conditions = conditionsByField.get(field)!;
    const ifTrue = verdictOf(billSlug, data, profile, field, "true");
    const ifFalse = verdictOf(billSlug, data, profile, field, "false");

    // 어떤 답을 하든 결과가 같으면 묻지 않는다.
    if (sameVerdict(ifTrue, ifFalse)) continue;

    const answer = profile[field];
    result.push({
      field,
      conditions,
      answered: Boolean(answer && !answer.declined),
      current: base,
      ifTrue,
      ifFalse,
    });
  }
  return result;
}

/**
 * 판정은 바꾸지 않지만 **금액 계산을 가능하게 하는** 항목을 찾는다.
 *
 * §7.2의 `informative` 역할은 "판정 영향 없음 (규모 계산 가능 여부에만 영향)"이다.
 * 판정만 기준으로 질문을 고르면 기준소득월액처럼 계산에만 쓰이는 항목을 영영 묻지
 * 못해 §18 단계 3의 계산기가 입력을 받을 길이 없어진다.
 * 일치한 경로에 걸린 것만 본다. 걸리지도 않은 경로 때문에 묻지는 않는다.
 */
export function calculationGaps(
  billSlug: string,
  data: BillImpactData | undefined,
  profile: UserProfile,
): ProfileKey[] {
  if (!data) return [];
  const fields: ProfileKey[] = [];
  const summary = summarizeBillRelevance(billSlug, data, profile);
  for (const evaluation of summary.matched) {
    if (!evaluation.pathway.magnitude) continue;
    if (evaluation.pathway.magnitude.kind === "qualitative_only") continue;
    for (const { condition, result } of evaluation.conditions) {
      if (condition.role !== "informative") continue;
      if (result !== "unknown") continue;
      if (!fields.includes(condition.field)) fields.push(condition.field);
    }
  }
  return fields;
}

/**
 * 아직 답하지 않았고 판정을 바꿀 수 있는 항목만 추린다.
 * 조건부 질문 노출과 카드의 "더 알려주시면" 목록이 이 결과를 쓴다.
 */
export function pendingQuestions(
  entries: { billSlug: string; data: BillImpactData | undefined }[],
  profile: UserProfile,
): ProfileKey[] {
  const fields: ProfileKey[] = [];
  for (const { billSlug, data } of entries) {
    for (const d of whatWouldChange(billSlug, data, profile)) {
      if (d.answered) continue;
      if (!fields.includes(d.field)) fields.push(d.field);
    }
  }
  return fields;
}

/**
 * 조건 하나가 지금 어떻게 평가되는지 사람이 읽는 문장으로 돌려준다.
 * 설명 가능성(§7.6) 1·3번 항목에 쓴다.
 */
export function describeCondition(
  condition: ProfileCondition,
  profile: UserProfile,
): { result: ReturnType<typeof evaluateCondition>; text: string } {
  const result = evaluateCondition(condition, profile);
  const prefix =
    result === "true" ? "맞음" : result === "false" ? "아님" : "확인 필요";
  return { result, text: `${prefix} — ${condition.explanation}` };
}

/** 관련성이 강해졌는지 비교한다. 단조성 테스트(§17.1)와 UI 문구에서 함께 쓴다. */
export function isStronger(a: Relevance, b: Relevance): boolean {
  return RELEVANCE_STRENGTH[a] > RELEVANCE_STRENGTH[b];
}
