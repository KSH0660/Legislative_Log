// §8.1 · §18 단계 3 — 구간 입력 → 구간 출력, 재현 가능한 산식

import { describe, expect, it } from "vitest";
import { formatAmountRange, runCalculator } from "@/lib/impact/calculators";
import { employee30, employee30Full, ownIncome, pick, selfEmployed40 } from "./fixtures/profiles";
import type { UserProfile } from "@/types/profile";

describe("국민연금 보험료 계산기", () => {
  it("필요한 입력이 없으면 금액을 만들지 않는다", () => {
    const outcome = runCalculator("nps-contribution", employee30);
    expect(outcome?.ok).toBe(false);
    if (outcome && !outcome.ok) {
      expect(outcome.needs).toContain("본인 세전 월소득");
    }
  });

  it("직장가입자는 본인 부담이 절반이다", () => {
    // 월 300만~399만9999원 × (9.5% − 9%) × 1/2 = 7,500원 ~ 10,000원
    const outcome = runCalculator("nps-contribution", employee30Full);
    expect(outcome?.ok).toBe(true);
    if (!outcome?.ok) return;
    expect(outcome.delta.min).toBe(7_500);
    expect(outcome.delta.max).toBe(10_000);
    expect(outcome.baseline.min).toBe(135_000); // 300만 × 9% × 1/2
    expect(outcome.revised.min).toBe(142_500); // 300만 × 9.5% × 1/2
  });

  it("지역가입자는 전액을 본인이 낸다", () => {
    // 월 200만~299만9999원 × 0.5%p × 1 = 10,000원 ~ 15,000원
    const outcome = runCalculator("nps-contribution", selfEmployed40);
    expect(outcome?.ok).toBe(true);
    if (!outcome?.ok) return;
    expect(outcome.delta.min).toBe(10_000);
    expect(outcome.delta.max).toBe(15_000);
  });

  it("구간으로 답하면 결과도 구간으로 낸다 — 점추정을 만들지 않는다", () => {
    const outcome = runCalculator("nps-contribution", employee30Full);
    if (!outcome?.ok) throw new Error("계산 실패");
    expect(outcome.delta.max).toBeGreaterThan(outcome.delta.min);
  });

  it("2033년 도달 시점을 현재와 분리해 보여준다", () => {
    const outcome = runCalculator("nps-contribution", employee30Full);
    if (!outcome?.ok) throw new Error("계산 실패");
    const step2033 = outcome.steps.find((s) => s.label.includes("2033"));
    // 300만 × (13% − 9%) × 1/2 = 60,000원
    expect(step2033?.delta.min).toBe(60_000);
  });

  it("상한 없는 소득 구간은 '이상'으로 끝난다", () => {
    const profile: UserProfile = {
      economicRoles: pick("employee"),
      pensionStatus: pick("insured_workplace"),
      monthlyStandardIncome: ownIncome("m_700_over"),
    };
    const outcome = runCalculator("nps-contribution", profile);
    if (!outcome?.ok) throw new Error("계산 실패");
    expect(outcome.delta.max).toBeNull();
    expect(formatAmountRange(outcome.delta)).toContain("이상");
  });

  it("제외 항목과 가정을 반드시 함께 낸다", () => {
    const outcome = runCalculator("nps-contribution", employee30Full);
    if (!outcome?.ok) throw new Error("계산 실패");
    expect(outcome.excluded.length).toBeGreaterThan(0);
    expect(outcome.assumptions.length).toBeGreaterThan(0);
    expect(outcome.appliedYear).toBe("2026");
    expect(outcome.basis).toBe("명목");
    expect(outcome.behavioral).toBe(false);
    expect(outcome.sources.length).toBeGreaterThan(0);
    // 지금의 비용과 미래 급여를 하나의 순이익으로 합치지 않는다는 사실을 밝힌다. §8.3
    expect(outcome.excluded.join(" ")).toContain("연금 급여");
  });

  it("가입 형태를 모르면 절반으로 추측하지 않는다", () => {
    const ambiguous: UserProfile = {
      economicRoles: pick("employee", "self_employed"),
      monthlyStandardIncome: ownIncome("m_300_400"),
    };
    const outcome = runCalculator("nps-contribution", ambiguous);
    expect(outcome?.ok).toBe(false);
    if (outcome && !outcome.ok) {
      expect(outcome.needs).toContain("국민연금 가입 형태");
    }
  });

  it("없는 계산기를 부르면 null", () => {
    expect(runCalculator("존재하지-않음", employee30Full)).toBeNull();
  });
});

describe("금액 표기", () => {
  it("구간·단일값·상한 없음을 구분해 표기한다", () => {
    expect(formatAmountRange({ min: 7500, max: 10000 })).toBe("7,500원 ~ 10,000원");
    expect(formatAmountRange({ min: 7500, max: 7500 })).toBe("7,500원");
    expect(formatAmountRange({ min: 7500, max: null })).toBe("7,500원 이상");
  });
});
