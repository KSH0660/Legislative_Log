// 골든 사용자 시나리오. §18 단계 0
//
// 프로필 JSON과 기대 판정 결과를 한곳에 모아 두고, UI 없이 재현할 수 있게 한다.

import type { ProfileKey } from "@/types/impact";
import type { ProfileAnswer, UserProfile } from "@/types/profile";
import {
  AGE_BANDS,
  HOUSEHOLD_ADULT_BANDS,
  HOUSEHOLD_INCOME_BANDS,
  MONTHLY_STANDARD_INCOME_BANDS,
  NET_INCOME_BANDS,
} from "@/lib/profile/questions";

function band(options: { code: string; range?: unknown }[], code: string): ProfileAnswer {
  const found = options.find((o) => o.code === code);
  if (!found) throw new Error(`없는 선택지: ${code}`);
  return {
    values: [code],
    range: found.range as ProfileAnswer["range"],
  };
}

export const age = (code: string) => band(AGE_BANDS, code);
export const adults = (code: string) => band(HOUSEHOLD_ADULT_BANDS, code);
export const income = (code: string) => band(HOUSEHOLD_INCOME_BANDS, code);
export const netIncome = (code: string) => band(NET_INCOME_BANDS, code);
export const ownIncome = (code: string) =>
  band(MONTHLY_STANDARD_INCOME_BANDS, code);
export const pick = (...values: string[]): ProfileAnswer => ({ values });
export const declined = (): ProfileAnswer => ({ values: [], declined: true });

/** 기본 4개 질문에만 답한 30대 직장인 — 가장 흔한 출발점 */
export const employee30: UserProfile = {
  ageBand: age("30_39"),
  economicRoles: pick("employee"),
  householdAdults: adults("adults_2"),
  childAgeBands: pick("child_0_5"),
  householdGrossIncomeBand: income("6000_8000"),
};

/** 조건부 질문까지 답해 unknown을 해소한 30대 직장인 */
export const employee30Full: UserProfile = {
  ...employee30,
  pensionStatus: pick("insured_workplace"),
  monthlyStandardIncome: ownIncome("m_300_400"),
  employmentRelation: pick("regular"),
  inheritanceSituation: pick("none"),
};

/** 하청 플랫폼 노동자이자 조합원 */
export const platformWorker: UserProfile = {
  ageBand: age("18_29"),
  economicRoles: pick("employee"),
  householdAdults: adults("adults_1"),
  childAgeBands: pick(), // 자녀 없음 — '해당 없음'이 확정된 상태
  householdGrossIncomeBand: income("2400_4000"),
  employmentRelation: pick("platform", "union_member"),
  pensionStatus: pick("insured_workplace"),
};

/** 고용원 없는 자영업자 */
export const selfEmployed40: UserProfile = {
  ageBand: age("40_49"),
  economicRoles: pick("self_employed"),
  householdAdults: adults("adults_2"),
  childAgeBands: pick("child_6_11", "child_12_17"),
  householdGrossIncomeBand: income("4000_6000"),
  pensionStatus: pick("insured_regional"),
  monthlyStandardIncome: ownIncome("m_200_300"),
};

/** 이미 연금을 받고 있는 사람 */
export const retiree: UserProfile = {
  ageBand: age("65_over"),
  economicRoles: pick("pension_recipient"),
  householdAdults: adults("adults_2"),
  childAgeBands: pick(),
  householdGrossIncomeBand: income("under_2400"),
  pensionStatus: pick("receiving"),
};

/** 직원을 둔 사업주 */
export const employer50: UserProfile = {
  ageBand: age("50_59"),
  economicRoles: pick("employer"),
  householdAdults: adults("adults_3plus"),
  childAgeBands: pick("child_18_over"),
  householdGrossIncomeBand: income("over_10000"),
  employmentRelation: pick("principal_employer"),
  pensionStatus: pick("insured_workplace"),
};

/** 아무것도 답하지 않은 상태 */
export const empty: UserProfile = {};

/** 소득을 월 실수령액으로 답해, 세전 구간이 밴드 경계를 걸치는 경우 */
export const netAnswerer: UserProfile = {
  ageBand: age("30_39"),
  economicRoles: pick("employee"),
  householdGrossIncomeBand: netIncome("net_300_400"),
};

/** 모든 질문에 '답하지 않음'을 고른 경우 — 미응답과 결과가 같아야 한다 */
export const allDeclined: UserProfile = {
  ageBand: declined(),
  economicRoles: declined(),
  householdAdults: declined(),
  childAgeBands: declined(),
  householdGrossIncomeBand: declined(),
};

export const ALL_PROFILES: { name: string; profile: UserProfile }[] = [
  { name: "employee30", profile: employee30 },
  { name: "employee30Full", profile: employee30Full },
  { name: "platformWorker", profile: platformWorker },
  { name: "selfEmployed40", profile: selfEmployed40 },
  { name: "retiree", profile: retiree },
  { name: "employer50", profile: employer50 },
  { name: "empty", profile: empty },
  { name: "netAnswerer", profile: netAnswerer },
  { name: "allDeclined", profile: allDeclined },
];

export const PROFILE_FIELDS: ProfileKey[] = [
  "ageBand",
  "economicRoles",
  "householdAdults",
  "childAgeBands",
  "householdGrossIncomeBand",
  "pensionStatus",
  "employmentRelation",
  "housingStatus",
  "region",
  "inheritanceSituation",
  "monthlyStandardIncome",
];

/** 기준 시각. 테스트는 현재 시각을 읽지 않는다 — 읽으면 결정론이 깨진다. */
export const AS_OF = "2026-08-17";
