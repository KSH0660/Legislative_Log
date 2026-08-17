// §7.2 경로 매칭 · §7.3 매칭 × 관계 유형 · §7.4 법안 단위 집계

import { describe, expect, it } from "vitest";
import {
  matchImpactPathway,
  resolveRelevance,
  summarizeBillRelevance,
} from "@/lib/impact/match";
import type { BillImpactData, ImpactPathway, ProfileCondition } from "@/types/impact";

const SOURCE = {
  label: "테스트 근거",
  publisher: "입법로그",
  type: "법령" as const,
  url: "https://example.test/basis",
};

function pathway(partial: Partial<ImpactPathway> = {}): ImpactPathway {
  return {
    id: "test-path",
    billSlug: "test-bill",
    title: "테스트 경로",
    relationship: "self",
    conditions: [],
    domain: "social_insurance",
    direction: "burden",
    timeframe: "current",
    baseline: "현행",
    baselineVersion: "v1",
    mechanism: "테스트",
    evidenceMethod: "statutory_rule",
    assumptions: ["테스트"],
    uncertainties: ["테스트"],
    legalBasis: [SOURCE],
    reviewedAt: "2026-08-17",
    ...partial,
  };
}

const required = (value: string): ProfileCondition => ({
  field: "economicRoles",
  operator: "includes",
  value,
  role: "required",
  explanation: "필수 조건",
});

const excluding = (value: string): ProfileCondition => ({
  field: "pensionStatus",
  operator: "equals",
  value,
  role: "excluding",
  explanation: "제외 조건",
});

describe("§7.2 매칭 절차", () => {
  it("필수조건이 전부 true면 MATCHED", () => {
    const p = pathway({ conditions: [required("employee")] });
    expect(matchImpactPathway(p, { economicRoles: { values: ["employee"] } })).toBe("MATCHED");
  });

  it("필수조건 하나가 false면 NO_MATCH", () => {
    const p = pathway({ conditions: [required("employee")] });
    expect(matchImpactPathway(p, { economicRoles: { values: ["employer"] } })).toBe("NO_MATCH");
  });

  it("필수조건의 unknown은 PARTIAL로 낮춘다", () => {
    const p = pathway({ conditions: [required("employee")] });
    expect(matchImpactPathway(p, {})).toBe("PARTIAL");
  });

  it("제외조건이 true면 필수조건이 전부 맞아도 EXCLUDED", () => {
    const p = pathway({
      conditions: [required("employee"), excluding("receiving")],
    });
    expect(
      matchImpactPathway(p, {
        economicRoles: { values: ["employee"] },
        pensionStatus: { values: ["receiving"] },
      }),
    ).toBe("EXCLUDED");
  });

  it("제외조건의 unknown도 MATCHED를 PARTIAL로 낮춘다 (§7.2 4단계)", () => {
    // v1에는 없던 규칙. 없으면 "제외 대상인지 아직 모르는 사람"이 직접 대상이 된다.
    const p = pathway({
      conditions: [required("employee"), excluding("receiving")],
    });
    expect(
      matchImpactPathway(p, { economicRoles: { values: ["employee"] } }),
    ).toBe("PARTIAL");
  });

  it("undecidable 플래그는 조건보다 먼저 판정된다", () => {
    const p = pathway({
      conditions: [required("employee")],
      undecidable: { reason: "시행령 미확정" },
    });
    expect(
      matchImpactPathway(p, { economicRoles: { values: ["employer"] } }),
    ).toBe("UNDECIDABLE");
  });

  it("informative 조건은 판정을 바꾸지 않는다", () => {
    const p = pathway({
      conditions: [
        required("employee"),
        {
          field: "monthlyStandardIncome",
          operator: "withinRange",
          value: { min: 0, max: null },
          role: "informative",
          explanation: "금액 계산용",
        },
      ],
    });
    expect(
      matchImpactPathway(p, { economicRoles: { values: ["employee"] } }),
    ).toBe("MATCHED");
  });
});

describe("§7.3 매칭 결과 × 관계 유형", () => {
  it("self·household만 직접 대상이 될 수 있다", () => {
    expect(resolveRelevance("MATCHED", "self")).toBe("direct");
    expect(resolveRelevance("MATCHED", "household")).toBe("direct");
    expect(resolveRelevance("PARTIAL", "self")).toBe("conditional");
  });

  it("employer·consumer·public은 조건이 전부 맞아도 간접을 넘지 않는다", () => {
    // 이 불변식이 없으면 '고용주 비용 → 임금 전가' 경로에서 직접 대상이 나온다. §4.4
    for (const rel of ["employer", "consumer", "public"] as const) {
      expect(resolveRelevance("MATCHED", rel)).toBe("indirect");
      expect(resolveRelevance("PARTIAL", rel)).toBe("indirect");
    }
  });

  it("UNDECIDABLE은 관계 유형과 무관하게 판단 불가", () => {
    expect(resolveRelevance("UNDECIDABLE", "self")).toBe("undecidable");
    expect(resolveRelevance("UNDECIDABLE", "employer")).toBe("undecidable");
  });

  it("EXCLUDED·NO_MATCH는 경로에서 빠진다", () => {
    expect(resolveRelevance("EXCLUDED", "self")).toBeNull();
    expect(resolveRelevance("NO_MATCH", "self")).toBeNull();
  });

  it("조건이 전부 맞는 employer 경로는 실제 집계에서도 간접에 머문다", () => {
    const data: BillImpactData = {
      review: { billSlug: "test-bill", reviewedAt: "2026-08-17", baselineVersion: "v1" },
      pathways: [
        pathway({
          id: "passthrough",
          relationship: "employer",
          conditions: [required("employee")],
        }),
      ],
    };
    const summary = summarizeBillRelevance("test-bill", data, {
      economicRoles: { values: ["employee"] },
    });
    expect(summary.relevance).toBe("indirect");
    expect(summary.strength).toBe(2);
  });
});

describe("§7.4 법안 단위 집계", () => {
  const data = (pathways: ImpactPathway[]): BillImpactData => ({
    review: { billSlug: "test-bill", reviewedAt: "2026-08-17", baselineVersion: "v1" },
    pathways,
  });

  it("일치 경로 중 가장 강한 관련성을 쓴다", () => {
    const summary = summarizeBillRelevance(
      "test-bill",
      data([
        pathway({ id: "a", relationship: "employer", conditions: [required("employee")] }),
        pathway({ id: "b", relationship: "self", conditions: [required("employee")] }),
      ]),
      { economicRoles: { values: ["employee"] } },
    );
    expect(summary.relevance).toBe("direct");
    expect(summary.matched).toHaveLength(2);
  });

  it("매칭 경로가 없고 판단 불가 경로만 있으면 판단 불가", () => {
    const summary = summarizeBillRelevance(
      "test-bill",
      data([
        pathway({ id: "a", conditions: [required("employee")] }),
        pathway({ id: "b", undecidable: { reason: "미확정" } }),
      ]),
      { economicRoles: { values: ["employer"] } },
    );
    expect(summary.relevance).toBe("undecidable");
  });

  it("판단 불가 경로는 매칭 경로가 있어도 사라지지 않는다", () => {
    const summary = summarizeBillRelevance(
      "test-bill",
      data([
        pathway({ id: "a", conditions: [required("employee")] }),
        pathway({ id: "b", undecidable: { reason: "미확정" } }),
      ]),
      { economicRoles: { values: ["employee"] } },
    );
    expect(summary.relevance).toBe("direct");
    expect(summary.undecidable).toHaveLength(1);
  });

  it("경로가 하나도 없으면 개인화할 직접 근거 없음", () => {
    const summary = summarizeBillRelevance("test-bill", data([]), {});
    expect(summary.relevance).toBe("none");
    expect(summary.strength).toBe(0);
  });

  it("개인화 데이터 자체가 없어도 전함수로 동작한다", () => {
    const summary = summarizeBillRelevance("unknown-bill", undefined, {});
    expect(summary.relevance).toBe("none");
  });
});
