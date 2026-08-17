// 사용자에게 묻는 질문과 선택지 정의. §6
//
// 밴드 경계는 데이터가 아니라 **법정 경계에서 역산**한다. (§6.2)
// 실제 법이 쓰는 경계(만 18세·만 60세·만 65세 등)를 밴드 경계로 삼으면
// 구간이 조건 경계를 걸쳐 `unknown`이 되는 빈도가 크게 줄어든다.

import type { ProfileKey } from "@/types/impact";
import type { ProfileOption, ProfileQuestion } from "@/types/profile";

const 만 = 10_000;

/**
 * 연령 밴드.
 * 경계 근거 — 만 18세: 국민연금 사업장·지역가입 하한. 만 60세: 의무가입 종료.
 * 만 65세: 기초연금·노인복지 기준.
 */
export const AGE_BANDS: ProfileOption[] = [
  { code: "under_18", label: "만 18세 미만", range: { min: 0, max: 17 } },
  { code: "18_29", label: "만 18~29세", range: { min: 18, max: 29 } },
  { code: "30_39", label: "만 30~39세", range: { min: 30, max: 39 } },
  { code: "40_49", label: "만 40~49세", range: { min: 40, max: 49 } },
  { code: "50_59", label: "만 50~59세", range: { min: 50, max: 59 } },
  { code: "60_64", label: "만 60~64세", range: { min: 60, max: 64 } },
  { code: "65_over", label: "만 65세 이상", range: { min: 65, max: null } },
];

/**
 * 가구 **세전** 연소득 밴드 (원).
 * 가처분소득은 §8.1의 계산 결과로만 등장하며, 입력으로 받지 않는다. (§6.1)
 * 이 값은 집단 비교와 질문 분기에만 쓰고, 세·보험료 산식에는 쓰지 않는다.
 */
export const HOUSEHOLD_INCOME_BANDS: ProfileOption[] = [
  { code: "under_2400", label: "2,400만원 미만", range: { min: 0, max: 2400 * 만 - 1 } },
  { code: "2400_4000", label: "2,400만~4,000만원", range: { min: 2400 * 만, max: 4000 * 만 - 1 } },
  { code: "4000_6000", label: "4,000만~6,000만원", range: { min: 4000 * 만, max: 6000 * 만 - 1 } },
  { code: "6000_8000", label: "6,000만~8,000만원", range: { min: 6000 * 만, max: 8000 * 만 - 1 } },
  { code: "8000_10000", label: "8,000만~1억원", range: { min: 8000 * 만, max: 10000 * 만 - 1 } },
  { code: "over_10000", label: "1억원 이상", range: { min: 10000 * 만, max: null } },
];

/**
 * 보조 입력 — 월 실수령액으로 답한 경우의 세전 연소득 환산 구간.
 *
 * 실수령/세전 비율은 부양가족 수·비과세 항목·4대보험 적용 여부에 따라 크게 달라진다.
 * 그래서 0.78~0.92라는 **넓은** 폭으로 환산한다. (§6.1)
 * 그 결과 이 구간은 위 밴드 경계를 걸치는 경우가 많고, 걸치면 `unknown`이 된다. 의도된 동작이다. (§7.1)
 */
const NET_TO_GROSS_LOW = 0.78;
const NET_TO_GROSS_HIGH = 0.92;

function fromNetMonthly(minNet: number, maxNet: number | null): {
  min: number;
  max: number | null;
} {
  return {
    min: Math.round((minNet * 12) / NET_TO_GROSS_HIGH),
    max: maxNet === null ? null : Math.round((maxNet * 12) / NET_TO_GROSS_LOW),
  };
}

export const NET_INCOME_BANDS: ProfileOption[] = [
  { code: "net_under_200", label: "월 200만원 미만", range: fromNetMonthly(0, 200 * 만) },
  { code: "net_200_300", label: "월 200만~300만원", range: fromNetMonthly(200 * 만, 300 * 만) },
  { code: "net_300_400", label: "월 300만~400만원", range: fromNetMonthly(300 * 만, 400 * 만) },
  { code: "net_400_500", label: "월 400만~500만원", range: fromNetMonthly(400 * 만, 500 * 만) },
  { code: "net_500_700", label: "월 500만~700만원", range: fromNetMonthly(500 * 만, 700 * 만) },
  { code: "net_700_over", label: "월 700만원 이상", range: fromNetMonthly(700 * 만, null) },
];

/**
 * 본인 세전 **월** 소득 밴드 (원). 국민연금 기준소득월액의 대리값이다.
 * 가구 소득으로는 개인 보험료를 계산할 수 없어(맞벌이 가구에서 어긋난다) 따로 받는다. (§6.1 · §6.3)
 */
export const MONTHLY_STANDARD_INCOME_BANDS: ProfileOption[] = [
  { code: "m_under_100", label: "100만원 미만", range: { min: 0, max: 100 * 만 - 1 } },
  { code: "m_100_200", label: "100만~200만원", range: { min: 100 * 만, max: 200 * 만 - 1 } },
  { code: "m_200_300", label: "200만~300만원", range: { min: 200 * 만, max: 300 * 만 - 1 } },
  { code: "m_300_400", label: "300만~400만원", range: { min: 300 * 만, max: 400 * 만 - 1 } },
  { code: "m_400_500", label: "400만~500만원", range: { min: 400 * 만, max: 500 * 만 - 1 } },
  { code: "m_500_700", label: "500만~700만원", range: { min: 500 * 만, max: 700 * 만 - 1 } },
  { code: "m_700_over", label: "700만원 이상", range: { min: 700 * 만, max: null } },
];

export const HOUSEHOLD_ADULT_BANDS: ProfileOption[] = [
  { code: "adults_1", label: "1명", range: { min: 1, max: 1 } },
  { code: "adults_2", label: "2명", range: { min: 2, max: 2 } },
  { code: "adults_3plus", label: "3명 이상", range: { min: 3, max: null } },
];

export const PROFILE_QUESTIONS: ProfileQuestion[] = [
  {
    field: "ageBand",
    kind: "single",
    group: "basic",
    label: "연령대",
    why: "국민연금 가입 연령처럼 법이 직접 나이로 대상을 가르는 조항이 있습니다.",
    options: AGE_BANDS,
  },
  {
    field: "economicRoles",
    kind: "multi",
    group: "basic",
    label: "경제활동 상태",
    why: "같은 법도 임금근로자·자영업자·사업주에게 서로 다른 조항으로 적용됩니다.",
    noneLabel: "해당 없음",
    options: [
      { code: "employee", label: "직장인(임금근로)" },
      { code: "self_employed", label: "자영업(고용원 없음)" },
      { code: "employer", label: "사업주(고용원 있음)" },
      { code: "jobseeker", label: "구직 중" },
      { code: "inactive", label: "비경제활동(학생·전업돌봄 등)" },
      { code: "pension_recipient", label: "연금 수급" },
    ],
  },
  {
    field: "householdAdults",
    kind: "single",
    group: "basic",
    label: "가구의 성인 수",
    why: "혼인 여부 자체보다, 법적 계산이 쓰는 가구 단위가 판정에 필요합니다.",
    options: HOUSEHOLD_ADULT_BANDS,
  },
  {
    field: "childAgeBands",
    kind: "multi",
    group: "basic",
    label: "함께 사는 자녀의 연령대",
    why: "돌봄·교육·공제 관련 조항이 자녀 연령을 기준으로 갈립니다.",
    noneLabel: "자녀 없음",
    options: [
      { code: "child_0_5", label: "만 0~5세" },
      { code: "child_6_11", label: "만 6~11세" },
      { code: "child_12_17", label: "만 12~17세" },
      { code: "child_18_over", label: "만 18세 이상" },
    ],
  },
  {
    field: "householdGrossIncomeBand",
    kind: "single",
    group: "basic",
    label: "가구 세전 연소득",
    why: "집단 비교와 추가 질문 분기에만 씁니다. 세금·보험료 계산에는 쓰지 않습니다.",
    options: HOUSEHOLD_INCOME_BANDS,
    alternative: {
      label: "월 실수령액으로 답하기",
      note: "실수령액에서 세전 소득을 되짚으면 오차가 큽니다. 그래서 넓은 구간으로 바꿔 다루고, 경계를 걸치면 '더 확인 필요'로 남깁니다.",
      options: NET_INCOME_BANDS,
    },
  },

  // ── 아래는 판정을 바꿀 수 있을 때만 노출한다. (§6.3) ──────────────
  {
    field: "pensionStatus",
    kind: "single",
    group: "conditional",
    label: "국민연금 가입 형태",
    why: "보험료를 절반만 내는지 전액 내는지, 이미 받고 있는지에 따라 방향이 반대가 됩니다.",
    options: [
      { code: "insured_workplace", label: "직장가입자" },
      { code: "insured_regional", label: "지역가입자" },
      { code: "receiving", label: "이미 연금을 받고 있음" },
      { code: "not_insured", label: "가입 이력 없음" },
    ],
  },
  {
    field: "monthlyStandardIncome",
    kind: "single",
    group: "conditional",
    label: "본인 세전 월소득",
    why: "국민연금 보험료는 가구 소득이 아니라 본인의 기준소득월액으로 계산합니다.",
    options: MONTHLY_STANDARD_INCOME_BANDS,
  },
  {
    field: "employmentRelation",
    kind: "multi",
    group: "conditional",
    label: "일하는 관계",
    why: "원청·하청·특수고용 같은 계약 형태에 따라 적용 조항이 달라집니다.",
    noneLabel: "해당 없음",
    options: [
      { code: "regular", label: "정규직" },
      { code: "nonregular", label: "비정규직(기간제·단시간)" },
      { code: "subcontract", label: "하청·파견" },
      { code: "special_type", label: "특수고용" },
      { code: "platform", label: "플랫폼 노동" },
      { code: "union_member", label: "노동조합원" },
      { code: "principal_employer", label: "원청·도급을 주는 쪽" },
    ],
  },
  {
    field: "housingStatus",
    kind: "single",
    group: "conditional",
    label: "주거 형태",
    why: "주거비·임대차 관련 조항의 적용 대상을 가릅니다.",
    options: [
      { code: "owner", label: "자가" },
      { code: "jeonse", label: "전세" },
      { code: "monthly_rent", label: "월세" },
      { code: "other_housing", label: "그 밖(사택·기숙사 등)" },
    ],
  },
  {
    field: "region",
    kind: "single",
    group: "conditional",
    label: "거주 지역",
    why: "지역별로 적용 범위가 다른 조항이 있을 때만 씁니다. 정확한 주소는 묻지 않습니다.",
    options: [
      { code: "capital", label: "수도권" },
      { code: "metro", label: "광역시" },
      { code: "other_region", label: "그 밖의 지역" },
    ],
  },
  {
    field: "inheritanceSituation",
    kind: "single",
    group: "conditional",
    label: "상속 관계",
    why: "상속세 관련성을 현재 소득으로 추정하지 않기 위해 따로 묻습니다.",
    options: [
      { code: "none", label: "예정된 상속이 없음" },
      { code: "expected_heir", label: "상속받을 가능성이 있음" },
      { code: "in_progress", label: "상속이 진행 중임" },
      { code: "bequeather", label: "물려줄 예정임" },
    ],
  },
];

const QUESTION_BY_FIELD = new Map<ProfileKey, ProfileQuestion>(
  PROFILE_QUESTIONS.map((q) => [q.field, q]),
);

export function getQuestion(field: ProfileKey): ProfileQuestion {
  const q = QUESTION_BY_FIELD.get(field);
  if (!q) throw new Error(`알 수 없는 프로필 항목: ${field}`);
  return q;
}

export const BASIC_QUESTIONS = PROFILE_QUESTIONS.filter(
  (q) => q.group === "basic",
);

/** 선택지 코드 → 사람이 읽는 이름. 조건 설명과 요약 줄에서 쓴다. */
export function optionLabel(field: ProfileKey, code: string): string {
  const q = QUESTION_BY_FIELD.get(field);
  if (!q) return code;
  const all = [...q.options, ...(q.alternative?.options ?? [])];
  return all.find((o) => o.code === code)?.label ?? code;
}
