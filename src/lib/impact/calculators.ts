// 제한된 정량 계산. §8.1 · §18 단계 3
//
// 법정 산식이 명확한 것만 계산한다. 나머지는 정성적으로 기권한다. (§4.3)
// 사용자가 구간으로 답했으면 결과도 **구간으로** 낸다. 구간 입력에서 점추정을 내놓지 않는다.
// 구간 폭이 너무 넓어 방향조차 갈리면 금액을 표시하지 않고 `판단자료 부족`으로 되돌린다.

import type { Source } from "@/types/bill";
import type { NumericRange } from "@/types/impact";
import type { UserProfile } from "@/types/profile";

export interface AmountRange {
  min: number;
  max: number | null;
}

export interface CalculationStep {
  label: string;
  /** 현행 기준선 대비 변화 */
  delta: AmountRange;
  note?: string;
}

export interface CalculationResult {
  ok: true;
  calculatorId: string;
  title: string;
  unit: "KRW_month" | "KRW_year" | "hours_year";
  /** 현행 기준선(개정 전 산식) 적용 결과 */
  baseline: AmountRange;
  /** 개정법 적용 결과 */
  revised: AmountRange;
  /** ΔY = 개정안 적용 − 현행법 적용 */
  delta: AmountRange;
  /** 적용연도 */
  appliedYear: string;
  /** 명목·실질 기준 */
  basis: "명목";
  /** 행동변화 포함 여부 */
  behavioral: boolean;
  formula: string;
  steps: CalculationStep[];
  /** 계산에서 제외한 항목 */
  excluded: string[];
  assumptions: string[];
  sources: Source[];
}

export interface CalculationUnavailable {
  ok: false;
  calculatorId: string;
  title: string;
  /** 왜 계산할 수 없는지. 이 문구는 `판단자료 부족`으로 표시된다. */
  reason: string;
  /** 이 항목들에 답하면 계산할 수 있다 */
  needs: string[];
}

export type CalculationOutcome = CalculationResult | CalculationUnavailable;

function scaleRange(range: NumericRange, factor: number): AmountRange {
  return {
    min: Math.round(range.min * factor),
    max: range.max === null ? null : Math.round(range.max * factor),
  };
}

function subtractRange(a: AmountRange, b: AmountRange): AmountRange {
  // 두 값이 같은 기준소득월액에서 나온 단조 함수이므로 끝점끼리 빼면 된다.
  return {
    min: a.min - b.min,
    max: a.max === null || b.max === null ? null : a.max - b.max,
  };
}

const S_NPS: Source = {
  label: "국민연금 온에어: 국민연금 보험료율, 내년부터 13%로 오른다고?",
  publisher: "국민연금공단",
  type: "공식통계",
  url: "https://www.npsonair.kr/finance/detail.html?strIdx=3709",
};

const S_LAW: Source = {
  label: "'국민연금법' 개정안 국회 통과, 2026년부터 보험료율 올라",
  publisher: "법무법인 대륜",
  type: "언론보도",
  url: "https://www.daeryunlaw.com/newsletter/amendment/144",
};

/** 개정 전 보험료율 (1998년 이후 27년째 9%) */
const RATE_BEFORE = 0.09;
/** 2026년 적용 보험료율 */
const RATE_2026 = 0.095;
/** 2033년 도달 목표 보험료율 */
const RATE_2033 = 0.13;

const CALC_ID = "nps-contribution";
const CALC_TITLE = "국민연금 보험료 본인 부담 변화";

/**
 * 국민연금 보험료 = 기준소득월액 × 보험료율.
 * 직장가입자는 근로자와 사업주가 절반씩 부담하고, 지역가입자는 전액을 본인이 낸다.
 *
 * 본인 부담 비율은 프로필의 가입 형태에서 정한다. 답하지 않았으면 계산하지 않는다.
 * "잘 모르니 절반으로 가정한다" 같은 추측은 하지 않는다. (§19)
 */
function ownShare(profile: UserProfile): { share: number; label: string } | null {
  const status = profile.pensionStatus;
  if (status && !status.declined && status.values.length === 1) {
    if (status.values[0] === "insured_workplace") {
      return { share: 0.5, label: "직장가입자 — 절반은 사업주가 부담" };
    }
    if (status.values[0] === "insured_regional") {
      return { share: 1, label: "지역가입자 — 전액 본인 부담" };
    }
    return null; // 수급 중이거나 가입 이력 없음 → 이 계산의 대상이 아니다
  }

  // 가입 형태를 따로 답하지 않았어도 경제활동 상태만으로 정해지는 경우가 있다.
  const roles = profile.economicRoles;
  if (roles && !roles.declined) {
    const isEmployee = roles.values.includes("employee");
    const isSelfEmployed = roles.values.includes("self_employed");
    if (isEmployee && !isSelfEmployed) {
      return { share: 0.5, label: "직장가입자 — 절반은 사업주가 부담" };
    }
    if (isSelfEmployed && !isEmployee) {
      return { share: 1, label: "지역가입자 — 전액 본인 부담" };
    }
  }
  return null;
}

function calculateNpsContribution(profile: UserProfile): CalculationOutcome {
  const needs: string[] = [];
  const income = profile.monthlyStandardIncome;
  const hasIncome = Boolean(income && !income.declined && income.range);
  if (!hasIncome) needs.push("본인 세전 월소득");

  const share = ownShare(profile);
  if (!share) needs.push("국민연금 가입 형태");

  if (!hasIncome || !share) {
    return {
      ok: false,
      calculatorId: CALC_ID,
      title: CALC_TITLE,
      reason:
        "보험료는 가구 소득이 아니라 본인의 기준소득월액으로 계산합니다. 아래 항목에 답하면 법정 산식으로 실제 금액 구간을 계산해 드립니다.",
      needs,
    };
  }

  const range = income!.range!;
  const baseline = scaleRange(range, RATE_BEFORE * share.share);
  const revised = scaleRange(range, RATE_2026 * share.share);
  const delta = subtractRange(revised, baseline);
  const delta2033 = subtractRange(
    scaleRange(range, RATE_2033 * share.share),
    baseline,
  );

  return {
    ok: true,
    calculatorId: CALC_ID,
    title: CALC_TITLE,
    unit: "KRW_month",
    baseline,
    revised,
    delta,
    appliedYear: "2026",
    basis: "명목",
    behavioral: false,
    formula: `기준소득월액 × 보험료율 × 본인부담비율(${share.share === 1 ? "1" : "1/2"})`,
    steps: [
      {
        label: "2026년 (보험료율 9.5%)",
        delta,
        note: share.label,
      },
      {
        label: "2033년 도달 시 (보험료율 13%)",
        delta: delta2033,
        note: "매년 0.5%p씩 단계 인상된 뒤의 값입니다. 지금 확정된 인상 일정에 따른 것이고, 그 사이 소득이 변하지 않는다고 가정합니다.",
      },
    ],
    excluded: [
      "기준소득월액 상·하한(국민연금공단 고시)을 반영하지 않았습니다. 상한을 넘는 소득에서는 실제 부담이 이 계산보다 작습니다.",
      "건강보험료·고용보험료·소득세 등 다른 항목의 변화는 포함하지 않았습니다.",
      "미래에 받게 될 연금 급여의 변화는 합치지 않았습니다. 지금의 비용과 나중의 혜택을 하나의 순이익으로 합치려면 기대수명·임금경로·할인율 등 별도 가정이 필요합니다.",
      "납부예외·추후납부 등 개인 사정에 따른 실제 납부 개월 수는 반영하지 않았습니다.",
      "물가를 반영하지 않은 명목 금액입니다.",
    ],
    assumptions: [
      "기준소득월액을 답변하신 세전 월소득 구간과 같다고 봅니다.",
      "구간으로 답하셨으므로 결과도 구간으로 냅니다. 구간 안의 한 점을 골라 단일 금액을 만들지 않습니다.",
      "행동 변화(납부예외 신청, 소득 신고액 조정 등)는 반영하지 않았습니다.",
    ],
    sources: [S_NPS, S_LAW],
  };
}

const CALCULATORS: Record<
  string,
  (profile: UserProfile) => CalculationOutcome
> = {
  [CALC_ID]: calculateNpsContribution,
};

export function runCalculator(
  calculatorId: string,
  profile: UserProfile,
): CalculationOutcome | null {
  const fn = CALCULATORS[calculatorId];
  if (!fn) return null;
  return fn(profile);
}

export function hasCalculator(calculatorId: string): boolean {
  return calculatorId in CALCULATORS;
}

/** 원화 금액 구간을 사람이 읽는 문구로. 상한이 없으면 '이상'으로 끝낸다. */
export function formatAmountRange(range: AmountRange): string {
  const fmt = (n: number) => `${Math.round(n).toLocaleString("ko-KR")}원`;
  if (range.max === null) return `${fmt(range.min)} 이상`;
  if (range.min === range.max) return fmt(range.min);
  return `${fmt(range.min)} ~ ${fmt(range.max)}`;
}
