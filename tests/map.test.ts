// §9.2 6범주 완전 분할 · §9.3 매트릭스 셀 판정 · §8.2 열 묶음

import { describe, expect, it } from "vitest";
import {
  ALL_DOMAINS,
  BUCKET_ORDER,
  CELL_LABEL,
  CELL_SYMBOL,
  cellDetail,
  cellState,
  DOMAIN_GROUPS,
  directionsToState,
} from "@/lib/impact/map";
import { summarizeBillRelevance } from "@/lib/impact/match";
import { IMPACT_DOMAIN_LABEL } from "@/types/impact";
import type { BillImpactData, ImpactDirection, ImpactDomain, ImpactPathway } from "@/types/impact";

const SOURCE = {
  label: "테스트 근거",
  publisher: "입법로그",
  type: "법령" as const,
  url: "https://example.test/basis",
};

function pathway(
  id: string,
  domain: ImpactDomain,
  direction: ImpactDirection,
): ImpactPathway {
  return {
    id,
    billSlug: "test-bill",
    title: id,
    relationship: "self",
    conditions: [],
    domain,
    direction,
    timeframe: "current",
    baseline: "현행",
    baselineVersion: "v1",
    mechanism: "테스트",
    evidenceMethod: "statutory_rule",
    assumptions: ["테스트"],
    uncertainties: ["테스트"],
    legalBasis: [SOURCE],
    reviewedAt: "2026-08-17",
  };
}

function summarize(pathways: ImpactPathway[]) {
  const data: BillImpactData = {
    review: { billSlug: "test-bill", reviewedAt: "2026-08-17", baselineVersion: "v1" },
    pathways,
  };
  return summarizeBillRelevance("test-bill", data, {});
}

describe("§9.3 셀 판정 규칙", () => {
  const domain: ImpactDomain = "social_insurance";

  it("해당 영역 경로가 없으면 검토 대상 아님", () => {
    expect(cellState(summarize([]), [domain])).toBe("not_applicable");
    expect(cellState(summarize([pathway("a", "tax", "burden")]), [domain])).toBe(
      "not_applicable",
    );
  });

  it("방향이 모두 unknown이면 판단자료 부족", () => {
    expect(cellState(summarize([pathway("a", domain, "unknown")]), [domain])).toBe(
      "insufficient",
    );
  });

  it("방향이 하나로 모이면 그 방향", () => {
    expect(cellState(summarize([pathway("a", domain, "benefit")]), [domain])).toBe("benefit");
    expect(cellState(summarize([pathway("a", domain, "burden")]), [domain])).toBe("burden");
    expect(
      cellState(summarize([pathway("a", domain, "no_direct_change")]), [domain]),
    ).toBe("no_change");
  });

  it("혜택과 부담이 함께 있으면 상반", () => {
    expect(
      cellState(
        summarize([pathway("a", domain, "benefit"), pathway("b", domain, "burden")]),
        [domain],
      ),
    ).toBe("mixed");
  });

  it("mixed 경로 하나만 있어도 상반", () => {
    expect(cellState(summarize([pathway("a", domain, "mixed")]), [domain])).toBe("mixed");
  });

  it("근거가 하나 늘었다고 셀이 ?로 후퇴하지 않는다", () => {
    // 방향이 확인된 경로가 있으면 unknown 경로가 섞여도 그 방향으로 판정한다.
    const detail = cellDetail(
      summarize([
        pathway("a", domain, "burden"),
        pathway("b", domain, "unknown"),
        pathway("c", domain, "unknown"),
      ]),
      [domain],
    );
    expect(detail.state).toBe("burden");
    expect(detail.directionUnknownCount).toBe(2);
  });
});

describe("§5.2 기호표", () => {
  it("기호는 표에 있는 6개만 쓴다", () => {
    expect(Object.values(CELL_SYMBOL).sort()).toEqual(
      ["+", "0", "?", "·", "±", "−"].sort(),
    );
  });

  it("표에 없는 기호(-, /)를 쓰지 않는다", () => {
    const symbols = Object.values(CELL_SYMBOL);
    expect(symbols).not.toContain("-"); // 하이픈이 아니라 U+2212 마이너스를 쓴다
    expect(symbols).not.toContain("−/+");
  });

  it("모든 상태에 텍스트 레이블이 있다 — 기호만으로 표시하지 않는다", () => {
    for (const state of Object.keys(CELL_SYMBOL) as (keyof typeof CELL_SYMBOL)[]) {
      expect(CELL_LABEL[state]).toBeTruthy();
    }
  });
});

describe("§8.2 열 묶음", () => {
  it("5개 묶음이 9개 생활영역을 빠짐없이 정확히 한 번씩 덮는다", () => {
    expect(DOMAIN_GROUPS).toHaveLength(5);
    expect(ALL_DOMAINS).toHaveLength(9);
    expect(new Set(ALL_DOMAINS).size).toBe(9);
    for (const domain of Object.keys(IMPACT_DOMAIN_LABEL) as ImpactDomain[]) {
      expect(ALL_DOMAINS).toContain(domain);
    }
  });

  it("묶음 셀은 속한 영역 경로 전체로 판정한다", () => {
    const group = DOMAIN_GROUPS.find((g) => g.id === "income")!;
    const state = cellState(
      summarize([
        pathway("a", "social_insurance", "burden"),
        pathway("b", "disposable_income", "benefit"),
      ]),
      group.domains,
    );
    expect(state).toBe("mixed");
  });
});

describe("directionsToState는 전함수다", () => {
  it("6범주 이름이 모두 정의돼 있다", () => {
    expect(BUCKET_ORDER).toHaveLength(6);
  });

  it("표에 명시되지 않은 조합도 값을 돌려준다", () => {
    // {benefit, no_direct_change}는 §9.2 표의 네 행 어디에도 없다.
    // §9.3의 "그 외 → ±" 규칙을 그대로 따라 상반으로 떨어진다.
    expect(
      directionsToState(
        summarize([
          pathway("a", "tax", "benefit"),
          pathway("b", "tax", "no_direct_change"),
        ]).matched,
      ),
    ).toBe("mixed");
  });
});
