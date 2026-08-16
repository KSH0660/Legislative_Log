// 입법로그 핵심 데이터 모델
// 모든 주장·근거는 claimType으로 사실/주장/해석/전망/의혹을 구분한다. (핵심원칙 3)

export type ClaimType =
  | "fact" // 확인된 사실
  | "official_claim" // 공식 주장
  | "interpretation" // 해석
  | "forecast" // 전망
  | "allegation"; // 확인되지 않은 의혹

export const CLAIM_TYPE_LABEL: Record<ClaimType, string> = {
  fact: "확인된 사실",
  official_claim: "공식 주장",
  interpretation: "해석",
  forecast: "전망",
  allegation: "미확인 의혹",
};

export type SourceType =
  | "법령"
  | "법안원문"
  | "공식통계"
  | "연구자료"
  | "보도자료"
  | "언론보도"
  | "국회회의록"
  | "기타";

export interface Source {
  label: string;
  publisher: string;
  type: SourceType;
  date?: string;
  url?: string;
}

export type BillStatus =
  | "발의"
  | "심사중"
  | "본회의_계류"
  | "통과"
  | "공포"
  | "시행"
  | "폐기";

export const BILL_STATUS_LABEL: Record<BillStatus, string> = {
  발의: "발의",
  심사중: "심사중",
  본회의_계류: "본회의 계류",
  통과: "국회 통과",
  공포: "공포",
  시행: "시행 중",
  폐기: "폐기",
};

export interface ComparisonRow {
  aspect: string;
  before: string;
  after: string;
  note?: string;
}

export interface ArgumentPoint {
  point: string;
  detail: string;
  claimType: ClaimType;
  attribution: string; // 이 주장을 하는 주체 (예: "보건복지부", "경영계", "청년 세대")
  source?: Source;
}

export interface StakeholderEntry {
  who: string;
  how: string;
  scale?: string;
  claimType: ClaimType;
  source?: Source;
}

export interface EvidenceItem {
  text: string;
  claimType: ClaimType;
  certainty: "높음" | "중간" | "낮음";
  source?: Source;
}

export interface MechanismStep {
  step: string;
  detail: string;
}

export type PredictionHorizon = "6개월" | "1년" | "3년";

export interface PredictionEntry {
  id: string;
  by: string; // 예측 주체
  date: string; // 예측 시점
  claim: string;
  horizon: PredictionHorizon;
  fallsifiedBy?: string; // 무엇을 확인하면 검증되는지
}

export type OutcomeStatus =
  | "적중"
  | "부분적중"
  | "빗나감"
  | "판단보류"
  | "추적예정";

export const OUTCOME_STATUS_LABEL: Record<OutcomeStatus, string> = {
  적중: "적중",
  부분적중: "부분 적중",
  빗나감: "빗나감",
  판단보류: "판단 보류",
  추적예정: "추적 예정",
};

export interface OutcomeCheck {
  horizon: PredictionHorizon;
  checkDate: string;
  status: OutcomeStatus;
  findings: string;
  relatedPredictionIds?: string[];
  source?: Source;
}

export interface Correction {
  date: string;
  billSlug: string;
  billTitle: string;
  description: string;
  reason: string;
}

export interface Bill {
  slug: string;
  title: string;
  shortTitle: string;
  category: string;
  tags: string[];
  status: BillStatus;
  proposedDate?: string;
  passedDate?: string;
  promulgatedDate?: string;
  effectiveDate?: string;
  lastUpdated: string;

  // ① 30초 요약
  summary30s: string;

  // ② 현재 vs 변경 후
  comparison: ComparisonRow[];
  comparisonNote?: string;

  // ③ ④ 추진/반대 측 주장
  proponentArguments: ArgumentPoint[];
  opponentArguments: ArgumentPoint[];

  // ⑤ 실제 작동 구조
  mechanismSummary: string;
  mechanismSteps: MechanismStep[];

  // ⑥ 수혜자와 비용 부담자
  beneficiaries: StakeholderEntry[];
  costBearers: StakeholderEntry[];
  fiscalImpact: string;
  sideEffectRisks: string[];

  // ⑦ 근거와 불확실성
  evidence: EvidenceItem[];
  uncertainties: string[];

  // ⑧ 입법로그 분석 (사실과 가치판단 분리)
  analysisFacts: string[];
  analysisJudgment: string[];

  // ⑨ 예측 기록
  predictions: PredictionEntry[];

  // ⑩ 결과 추적
  outcomeTracking: OutcomeCheck[];

  sources: Source[];
}
