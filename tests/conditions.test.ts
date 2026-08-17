// §7.1 삼값 조건 평가 — 모든 연산자의 true/false/unknown, 구간 세 관계, 경계값

import { describe, expect, it } from "vitest";
import {
  evaluateCondition,
  rangeContains,
  rangesDisjoint,
} from "@/lib/impact/conditions";
import type { ProfileCondition } from "@/types/impact";
import type { UserProfile } from "@/types/profile";

function cond(partial: Partial<ProfileCondition>): ProfileCondition {
  return {
    field: "ageBand",
    operator: "equals",
    value: "30_39",
    role: "required",
    explanation: "테스트 조건",
    ...partial,
  };
}

describe("범주형 연산자", () => {
  const c = cond({ field: "pensionStatus", operator: "equals", value: "receiving" });

  it("응답했고 값이 조건을 만족하면 true", () => {
    expect(evaluateCondition(c, { pensionStatus: { values: ["receiving"] } })).toBe("true");
  });

  it("응답했고 만족하지 않으면 false", () => {
    expect(
      evaluateCondition(c, { pensionStatus: { values: ["insured_workplace"] } }),
    ).toBe("false");
  });

  it("질문을 건너뛰면 unknown", () => {
    expect(evaluateCondition(c, {})).toBe("unknown");
  });

  it("'모름'을 고르면 미응답과 같은 unknown", () => {
    expect(
      evaluateCondition(c, { pensionStatus: { values: [], declined: true } }),
    ).toBe("unknown");
  });

  it("oneOf는 후보 중 하나면 true", () => {
    const oc = cond({
      field: "inheritanceSituation",
      operator: "oneOf",
      value: ["expected_heir", "in_progress"],
    });
    expect(
      evaluateCondition(oc, { inheritanceSituation: { values: ["in_progress"] } }),
    ).toBe("true");
    expect(
      evaluateCondition(oc, { inheritanceSituation: { values: ["none"] } }),
    ).toBe("false");
    expect(evaluateCondition(oc, {})).toBe("unknown");
  });

  it("includes는 복수선택 항목 포함 여부로 판정한다", () => {
    const ic = cond({
      field: "economicRoles",
      operator: "includes",
      value: "employee",
    });
    expect(evaluateCondition(ic, { economicRoles: { values: ["employee", "employer"] } })).toBe("true");
    expect(evaluateCondition(ic, { economicRoles: { values: ["self_employed"] } })).toBe("false");
  });

  it("완결형 질문에서 '해당 없음'(빈 선택)은 unknown이 아니라 false다", () => {
    // 이 구분이 없으면 "선택 안 함"과 "응답 안 함"을 가릴 수 없다. §6.1
    const ic = cond({
      field: "economicRoles",
      operator: "includes",
      value: "employee",
    });
    expect(evaluateCondition(ic, { economicRoles: { values: [] } })).toBe("false");
    expect(evaluateCondition(ic, {})).toBe("unknown");
  });

  it("includes의 후보가 여러 개면 하나라도 포함될 때 true", () => {
    const ic = cond({
      field: "employmentRelation",
      operator: "includes",
      value: ["subcontract", "platform"],
    });
    expect(
      evaluateCondition(ic, { employmentRelation: { values: ["platform", "union_member"] } }),
    ).toBe("true");
    expect(
      evaluateCondition(ic, { employmentRelation: { values: ["regular"] } }),
    ).toBe("false");
  });
});

describe("구간 대 구간 비교 (withinRange)", () => {
  const c = cond({ operator: "withinRange", value: { min: 18, max: 59 } });
  const withAge = (min: number, max: number | null): UserProfile => ({
    ageBand: { values: ["custom"], range: { min, max } },
  });

  it("U ⊆ C — 완전 포함이면 true", () => {
    expect(evaluateCondition(c, withAge(30, 39))).toBe("true");
  });

  it("U ∩ C = ∅ — 완전 배제면 false", () => {
    expect(evaluateCondition(c, withAge(65, null))).toBe("false");
    expect(evaluateCondition(c, withAge(0, 17))).toBe("false");
  });

  it("경계를 걸치면 unknown — 이 설계의 핵심", () => {
    // 55~64세 밴드는 '60세 미만' 조건의 경계를 걸친다. true도 false도 아니다.
    expect(evaluateCondition(c, withAge(55, 64))).toBe("unknown");
  });

  it("경계값: 바로 아래·같음·바로 위", () => {
    expect(evaluateCondition(c, withAge(17, 17))).toBe("false"); // 바로 아래
    expect(evaluateCondition(c, withAge(18, 18))).toBe("true"); // 하한과 같음
    expect(evaluateCondition(c, withAge(59, 59))).toBe("true"); // 상한과 같음
    expect(evaluateCondition(c, withAge(60, 60))).toBe("false"); // 바로 위
  });

  it("상한 없는 사용자 구간은 상한 있는 조건에 담기지 않는다", () => {
    expect(evaluateCondition(c, withAge(20, null))).toBe("unknown");
  });

  it("구간 정보가 없는 답은 구간 비교를 할 수 없어 unknown", () => {
    expect(evaluateCondition(c, { ageBand: { values: ["30_39"] } })).toBe("unknown");
  });
});

describe("구간 헬퍼", () => {
  it("rangeContains", () => {
    expect(rangeContains({ min: 0, max: null }, { min: 5, max: null })).toBe(true);
    expect(rangeContains({ min: 0, max: 10 }, { min: 5, max: null })).toBe(false);
    expect(rangeContains({ min: 0, max: 10 }, { min: 0, max: 10 })).toBe(true);
  });

  it("rangesDisjoint는 대칭이다", () => {
    const a = { min: 0, max: 10 };
    const b = { min: 11, max: 20 };
    expect(rangesDisjoint(a, b)).toBe(true);
    expect(rangesDisjoint(b, a)).toBe(true);
    expect(rangesDisjoint(a, { min: 10, max: 20 })).toBe(false);
  });
});
