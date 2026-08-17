// 골든 사용자 시나리오. §18 단계 0 완료조건
//
// "UI 없이 npm test만으로 프로필 JSON과 법안 데이터에서 설명 가능한 판정 결과를 재현할 수 있다."

import { describe, expect, it } from "vitest";
import { getAllBills } from "@/lib/bills";
import { impactBySlug } from "@/data/impact";
import { personalize, whatWouldChange } from "@/lib/impact";
import {
  AS_OF,
  employee30,
  employee30Full,
  employer50,
  empty,
  netAnswerer,
  platformWorker,
  retiree,
  pick,
  selfEmployed40,
} from "./fixtures/profiles";
import type { UserProfile } from "@/types/profile";

const bills = getAllBills();
const run = (profile: UserProfile) =>
  personalize(bills, impactBySlug, profile, AS_OF);

describe("기본 4개 질문만 답한 30대 직장인", () => {
  const result = run(employee30);
  const nps = result.bySlug.get("national-pension-reform-2025")!;

  it("국민연금은 아직 확인할 조건이 남아 조건부 대상이다", () => {
    // 이미 연금을 받고 있는지(제외조건)를 모르므로 §7.2 4단계가 강등한다.
    expect(nps.relevance.relevance).toBe("conditional");
  });

  it("고용주 전가 경로는 조건이 다 맞아도 간접에 머문다", () => {
    const passthrough = nps.relevance.matched.find(
      (e) => e.pathway.id === "nps-employer-passthrough",
    )!;
    expect(passthrough.match).toBe("MATCHED");
    expect(passthrough.relevance).toBe("indirect");
  });

  it("혜택과 부담 경로가 함께 맞아 상반으로 분류된다", () => {
    expect(nps.bucket).toBe("mixed");
  });

  it("검찰개혁·국회법은 연결 없음이 정상 결과다", () => {
    expect(result.bySlug.get("prosecution-reform-2026")!.relevance.relevance).toBe("none");
    expect(result.bySlug.get("national-assembly-act-reform-2026")!.relevance.relevance).toBe("none");
  });

  it("연결 없음 법안에는 왜 없는지가 기록돼 있다", () => {
    const review = result.bySlug.get("prosecution-reform-2026")!.relevance.review;
    expect(review?.noPersonalPathwayReason).toBeTruthy();
  });

  it("아직 답하지 않았고 판정을 바꿀 수 있는 질문만 추가로 묻는다", () => {
    expect(result.pendingFields).toContain("pensionStatus");
    expect(result.pendingFields).toContain("employmentRelation");
    expect(result.pendingFields).toContain("inheritanceSituation");
    // 이미 답한 항목은 추가 질문 목록에 없다.
    expect(result.pendingFields).not.toContain("ageBand");
  });

  it("6범주 합이 전체 건수와 같고 분모가 드러난다", () => {
    const sum = Object.values(result.counts).reduce((a, b) => a + b, 0);
    expect(sum).toBe(result.total);
    expect(result.total).toBe(5);
  });
});

describe("조건부 질문까지 답한 30대 직장인", () => {
  const result = run(employee30Full);
  const nps = result.bySlug.get("national-pension-reform-2025")!;

  it("제외조건이 확인되면 직접 대상으로 확정된다", () => {
    expect(nps.relevance.relevance).toBe("direct");
  });

  it("이미 수급 중인 경우의 경로는 제외된다", () => {
    const recipient = nps.relevance.evaluations.find(
      (e) => e.pathway.id === "nps-current-recipient-no-change",
    )!;
    expect(recipient.match).toBe("NO_MATCH");
  });

  it("상속 예정이 없다고 답하면 상속세는 연결 없음이 된다", () => {
    expect(result.bySlug.get("inheritance-tax-reform-2025")!.relevance.relevance).toBe("none");
  });

  it("정규직·비조합원이면 노란봉투법은 확인된 직접 변화 없음이 포함된다", () => {
    const yea = result.bySlug.get("yellow-envelope-act-2025")!;
    const noChange = yea.relevance.matched.find(
      (e) => e.pathway.id === "yea-direct-employment-no-change",
    );
    expect(noChange?.match).toBe("MATCHED");
  });

  it("남은 미확인 조건이 없다", () => {
    expect(nps.relevance.pendingConditionCount).toBe(0);
  });
});

describe("플랫폼 노동자이자 조합원", () => {
  const result = run(platformWorker);
  const yea = result.bySlug.get("yellow-envelope-act-2025")!;

  it("노란봉투법의 직접 대상이다", () => {
    expect(yea.relevance.relevance).toBe("direct");
  });

  it("권리 경로는 혜택 방향으로 확인된다", () => {
    const rights = yea.relevance.matched.filter(
      (e) => e.pathway.domain === "rights_risk",
    );
    expect(rights.map((e) => e.pathway.direction)).toContain("benefit");
  });

  it("방향이 확인되지 않은 경로는 셀을 흐리지 않고 따로 센다", () => {
    expect(yea.relevance.directionUnknownCount).toBeGreaterThan(0);
  });
});

describe("이미 연금을 받고 있는 사람", () => {
  const result = run(retiree);
  const nps = result.bySlug.get("national-pension-reform-2025")!;

  it("보험료 인상 경로에서 제외된다", () => {
    const contribution = nps.relevance.evaluations.find(
      (e) => e.pathway.id === "nps-employee-contribution",
    )!;
    // §7.2는 제외조건을 필수조건보다 먼저 평가한다. 연령·직업 조건도 맞지 않지만,
    // 판정은 '수급 중'이라는 제외조건에서 먼저 끊긴다.
    expect(contribution.match).toBe("EXCLUDED");
    expect(contribution.relevance).toBeNull();
  });

  it("소급 적용 없음이 `확인된 직접 변화 없음`으로 표시된다", () => {
    expect(nps.bucket).toBe("no_change");
    expect(nps.relevance.relevance).toBe("direct");
  });
});

describe("자영업자·사업주", () => {
  it("지역가입자는 전액 부담 경로에 걸린다", () => {
    const nps = run(selfEmployed40).bySlug.get("national-pension-reform-2025")!;
    const regional = nps.relevance.matched.find(
      (e) => e.pathway.id === "nps-regional-contribution",
    );
    expect(regional?.match).toBe("MATCHED");
    expect(regional?.relevance).toBe("direct");
  });

  it("본인이 사업주인 경우는 전가 경로가 아니라 self 경로로 잡힌다", () => {
    // "내가 사업주로서 내는 돈"과 "내 고용주가 내는 돈의 전가"는 반드시 다른 경로다. §7.3
    const nps = run(employer50).bySlug.get("national-pension-reform-2025")!;
    const own = nps.relevance.matched.find(
      (e) => e.pathway.id === "nps-owner-payroll-cost",
    )!;
    expect(own.pathway.relationship).toBe("self");
    expect(own.relevance).toBe("direct");

    const passthrough = nps.relevance.evaluations.find(
      (e) => e.pathway.id === "nps-employer-passthrough",
    )!;
    expect(passthrough.match).toBe("NO_MATCH");
  });

  it("원청 사업주는 노란봉투법 부담 경로에 걸린다", () => {
    const yea = run(employer50).bySlug.get("yellow-envelope-act-2025")!;
    const principal = yea.relevance.matched.find(
      (e) => e.pathway.id === "yea-principal-employer-cost",
    )!;
    expect(principal.pathway.direction).toBe("burden");
  });
});

describe("아무것도 답하지 않은 상태", () => {
  const result = run(empty);

  it("추측하지 않고 조건부·판단 불가로 남긴다", () => {
    for (const item of result.items) {
      expect(["conditional", "indirect", "undecidable", "none"]).toContain(
        item.relevance.relevance,
      );
    }
  });

  it("직접 대상은 하나도 나오지 않는다", () => {
    expect(result.items.some((i) => i.relevance.relevance === "direct")).toBe(false);
  });
});

describe("월 실수령액으로 답한 경우", () => {
  it("세전 환산 구간이 넓어 소득 조건이 unknown으로 남는다", () => {
    const answer = netAnswerer.householdGrossIncomeBand!;
    expect(answer.range!.max).toBeGreaterThan(answer.range!.min);
    // 환산 폭이 6,000만원 밴드 하나에 담기지 않을 만큼 넓다.
    expect(answer.range!.max! - answer.range!.min!).toBeGreaterThan(20_000_000);
  });
});

describe("정렬 (§7.5)", () => {
  it("30대 직장인의 목록 순서가 결정론적으로 재현된다", () => {
    expect(run(employee30).items.map((i) => i.bill.slug)).toEqual([
      "national-pension-reform-2025",
      "inheritance-tax-reform-2025",
      "yellow-envelope-act-2025",
      "prosecution-reform-2026",
      "national-assembly-act-reform-2026",
    ]);
  });

  it("연결 없음 법안이 항상 뒤로 간다", () => {
    for (const profile of [employee30, employee30Full, platformWorker, retiree]) {
      const items = run(profile).items;
      const lastRelevant = items.findIndex((i) => i.relevance.relevance === "none");
      if (lastRelevant === -1) continue;
      for (let i = lastRelevant; i < items.length; i += 1) {
        expect(items[i].relevance.relevance).toBe("none");
      }
    }
  });
});

describe("설명 가능성 (§7.6)", () => {
  it("각 결과가 일치 조건·미확인 조건·근거·결정적 조건을 함께 낸다", () => {
    const nps = run(employee30).bySlug.get("national-pension-reform-2025")!;
    const first = nps.relevance.matched[0];
    expect(first.satisfied.length + first.pending.length).toBeGreaterThan(0);
    expect(first.pathway.legalBasis.length).toBeGreaterThan(0);
    expect(first.pathway.mechanism).toBeTruthy();

    const decisive = whatWouldChange(
      "national-pension-reform-2025",
      impactBySlug.get("national-pension-reform-2025"),
      employee30,
    );
    expect(decisive.length).toBeGreaterThan(0);
    for (const d of decisive) {
      // 어떤 답을 하든 결과가 같은 항목은 목록에 없어야 한다.
      expect(d.ifTrue).not.toEqual(d.ifFalse);
    }
  });
});

describe("금액 계산에 필요한 항목 (§7.2 informative)", () => {
  it("판정은 그대로여도 계산을 열어 주는 항목은 물어본다", () => {
    // 기준소득월액은 판정을 바꾸지 않는 informative 조건이라
    // 판정 기준으로만 질문을 고르면 영영 묻지 못한다.
    const withoutIncome: UserProfile = {
      ...employee30,
      pensionStatus: pick("insured_workplace"),
    };
    const result = run(withoutIncome);
    const nps = result.bySlug.get("national-pension-reform-2025")!;
    expect(nps.calculationFields).toContain("monthlyStandardIncome");
    expect(result.pendingFields).toContain("monthlyStandardIncome");
  });

  it("답하고 나면 더 묻지 않는다", () => {
    const result = run(employee30Full);
    const nps = result.bySlug.get("national-pension-reform-2025")!;
    expect(nps.calculationFields).toHaveLength(0);
  });

  it("정성 경로만 있는 법안에는 계산용 질문을 붙이지 않는다", () => {
    const yea = run(employee30Full).bySlug.get("yellow-envelope-act-2025")!;
    expect(yea.calculationFields).toHaveLength(0);
  });
});
