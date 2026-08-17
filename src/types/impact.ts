// 개인화 영향경로 데이터 모델
//
// 이 파일은 docs/personalized-bill-impact-plan.md §12.2의 구현이다.
// 기존 `Bill` 타입(src/types/bill.ts)은 손대지 않고 별도 레이어로 얹는다.
// 두 레이어가 어긋나지 않도록 하는 장치는 scripts/validate-impact.ts에 있다.

import type { ClaimType, Source } from "./bill";

/** 사용자에게 물을 수 있는 생활조건의 키. §12.2 */
export type ProfileKey =
  | "ageBand"
  | "economicRoles"
  | "householdAdults"
  | "childAgeBands"
  | "householdGrossIncomeBand" // 세전 기준. 가처분소득은 §8.1의 계산 '출력'이라 입력으로 받지 않는다.
  | "pensionStatus"
  | "employmentRelation"
  | "housingStatus"
  | "region"
  | "inheritanceSituation"
  // 계획서 §12.2 목록에 없던 키. §6.1이 "보험료의 실제 산식 계산에는 기준소득월액을
  // 별도로 받아야 한다"고 요구하는데, 가구 세전 소득으로는 개인 기준소득월액을
  // 대신할 수 없어(맞벌이 가구에서 어긋난다) 단계 3 계산기를 위해 추가했다.
  | "monthlyStandardIncome";

export type ConditionOperator =
  | "equals" // 범주형 단일 일치
  | "oneOf" // 범주형 다중 후보
  | "includes" // 복수선택 항목 포함 (완결형 질문 전제)
  | "withinRange"; // 구간 대 구간 비교 — gte/lte를 대체한다

/** 양 끝을 포함하는 닫힌 구간. max가 없으면 상한 없음(예: 1억 원 이상). §6.2 */
export interface NumericRange {
  min: number;
  max: number | null;
}

/**
 * 조건의 역할. §7.2
 * - `required`   이 경로가 적용되기 위한 필수 조건
 * - `excluding`  하나라도 성립하면 이 경로가 적용되지 않는 조건
 * - `informative` 판정은 바꾸지 않지만 설명과 규모 계산에 필요한 조건
 */
export type ConditionRole = "required" | "excluding" | "informative";

export interface ProfileCondition {
  field: ProfileKey;
  operator: ConditionOperator;
  /** withinRange이면 NumericRange, 그 외에는 범주값 */
  value: string | string[] | NumericRange;
  role: ConditionRole;
  /** 사용자에게 보여줄 한 줄 설명. "직장가입자여야 합니다"처럼 쓴다. */
  explanation: string;
}

/** 생활영역. §8.2. 이 목록이 곧 영향 지도 매트릭스의 열이다. */
export type ImpactDomain =
  | "disposable_income"
  | "tax"
  | "social_insurance"
  | "living_cost"
  | "employment"
  | "service_access"
  | "care_education_health"
  | "administrative_time"
  | "rights_risk";

export const IMPACT_DOMAIN_LABEL: Record<ImpactDomain, string> = {
  disposable_income: "가처분소득",
  tax: "세금",
  social_insurance: "사회보험료",
  living_cost: "생활비·주거비",
  employment: "고용·임금·근로조건",
  service_access: "공공서비스·지원 자격",
  care_education_health: "돌봄·교육·건강",
  administrative_time: "신청·행정 부담",
  rights_risk: "권리·법적 보호",
};

export type ImpactDirection =
  | "benefit"
  | "burden"
  | "mixed"
  | "no_direct_change"
  | "unknown";

/**
 * 사용자와 법안 사이의 관계 유형.
 * `self`·`household`만 '직접 대상'으로 판정될 수 있다. §7.3
 * 법적 부담자와 경제적 부담자를 섞지 않기 위한 장치이며,
 * 자연어 주의문구가 아니라 타입으로 강제한다. §4.4
 */
export type ImpactRelationship =
  | "self"
  | "household"
  | "employer"
  | "consumer"
  | "public";

export const RELATIONSHIP_LABEL: Record<ImpactRelationship, string> = {
  self: "본인",
  household: "가구",
  employer: "고용주",
  consumer: "소비자",
  public: "공공",
};

export type ImpactTimeframe = "current" | "short_term" | "long_term";

export const TIMEFRAME_LABEL: Record<ImpactTimeframe, string> = {
  current: "지금",
  short_term: "단기",
  long_term: "장기",
};

export type EvidenceMethod =
  | "statutory_rule"
  | "official_estimate"
  | "representative_model"
  | "causal_study"
  | "qualitative_pathway";

export const EVIDENCE_METHOD_LABEL: Record<EvidenceMethod, string> = {
  statutory_rule: "법문 산식",
  official_estimate: "공식 추계",
  representative_model: "대표자료 모형",
  causal_study: "유사정책 인과연구",
  qualitative_pathway: "정성적 영향경로",
};

/**
 * 근거 방식 → 기존 `ClaimType` 매핑. §5.4
 * 확신 표기 체계를 두 벌 만들지 않기 위해 개인화 레이어도 `ClaimBadge`를 재사용한다.
 * `EvidenceItem.certainty`(높음/중간/낮음) 눈금은 개인화 레이어로 확장하지 않는다.
 */
export const EVIDENCE_METHOD_CLAIM_TYPE: Record<EvidenceMethod, ClaimType> = {
  statutory_rule: "fact",
  official_estimate: "official_claim",
  representative_model: "interpretation",
  causal_study: "interpretation",
  qualitative_pathway: "interpretation",
};

/** 근거 방식의 강도. §7.5 정렬 4번 키. 값이 클수록 앞에 온다. */
export const EVIDENCE_METHOD_RANK: Record<EvidenceMethod, number> = {
  statutory_rule: 5,
  official_estimate: 4,
  representative_model: 3,
  causal_study: 2,
  qualitative_pathway: 1,
};

export interface ImpactMagnitude {
  kind: "statutory_calculation" | "model_range" | "qualitative_only";
  /** kind가 statutory_calculation이면 필수. §12.4 규칙 6 */
  calculatorId?: string;
  /** 실제 측정 단위만 온다. 'eligibility'처럼 단위가 아닌 값은 두지 않는다. */
  unit?: "KRW_month" | "KRW_year" | "hours_year";
  /** 자격 변화처럼 단위가 없는 결과는 이쪽에 서술한다. */
  eligibilityChange?: string;
}

export interface ImpactPathway {
  id: string;
  billSlug: string;
  title: string;
  relationship: ImpactRelationship;
  conditions: ProfileCondition[];

  /** 생활영역은 정확히 하나. 여러 영역에 걸치면 경로를 나눈다. §9.3 */
  domain: ImpactDomain;
  direction: ImpactDirection;

  timeframe: ImpactTimeframe;
  /** 이 경로가 실제로 적용되기 시작하는 시점 (단계 시행 대응). §5.5 */
  appliesFrom?: string;

  /** 법안 문안·시행령이 미확정이라 판정 자체가 불가능한 경로 */
  undecidable?: { reason: string };

  baseline: string;
  /** 비교 대상 기준선의 버전 식별자. 이 값이 바뀌면 재검토 대상이다. */
  baselineVersion: string;
  mechanism: string;

  magnitude?: ImpactMagnitude;
  evidenceMethod: EvidenceMethod;

  assumptions: string[];
  uncertainties: string[];
  /** 기존 Source 타입 재사용. 최소 1건. §12.4 규칙 1 */
  legalBasis: Source[];
  reviewedAt: string;
}

/**
 * 법안 하나에 대한 개인화 검토 기록.
 *
 * 계획서 §12.3은 경로 배열만 규정하지만, §19의 완료 기준
 * "모든 법안이 최소 한 개의 검토된 영향경로 **또는 명시적 연결 없음 판정**을 가진다"를
 * 만족하려면 "검토했으나 개인 경로가 없다"는 사실 자체를 기록할 자리가 필요하다.
 * 경로를 억지로 만들어 넣는 것보다 이쪽이 정직하다. (§15 검찰개혁·국회법)
 */
export interface BillImpactReview {
  billSlug: string;
  reviewedAt: string;
  baselineVersion: string;
  /** 개인 생활조건과 연결되는 경로를 찾지 못했을 때 그 이유 */
  noPersonalPathwayReason?: string;
}

export interface BillImpactData {
  review: BillImpactReview;
  pathways: ImpactPathway[];
}
