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

// 표식을 처음 보는 사람도 바로 이해할 수 있게 쉬운 말로 풀어 쓴다.
export const CLAIM_TYPE_DESCRIPTION: Record<ClaimType, string> = {
  fact: "법 조문이나 정부 통계 같은 원자료에서 그대로 확인할 수 있는 내용입니다.",
  official_claim:
    "정부·정당·이해관계자가 공식적으로 밝힌 입장입니다. 그 말이 맞는지와는 별개입니다.",
  interpretation:
    "확인된 사실들을 엮어 입법로그가 내린 분석입니다. 다르게 볼 여지가 있습니다.",
  forecast: "아직 결과가 나오지 않은 일에 대한 예상입니다. 틀릴 수 있습니다.",
  allegation:
    "누군가 제기했지만 아직 사실로 확인되지 않은 이야기입니다. 사실로 읽지 마세요.",
};

// 좁은 화면에서 쓰는 한 단어 요약
export const CLAIM_TYPE_SHORT: Record<ClaimType, string> = {
  fact: "사실",
  official_claim: "주장",
  interpretation: "해석",
  forecast: "전망",
  allegation: "의혹",
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

// 입법 용어를 처음 접하는 사람을 위한 한 줄 설명
export const BILL_STATUS_DESCRIPTION: Record<BillStatus, string> = {
  발의: "국회의원이나 정부가 법안을 국회에 제출한 단계입니다.",
  심사중: "해당 상임위원회에서 내용을 따져 보고 있는 단계입니다.",
  본회의_계류: "위원회는 통과했지만 아직 본회의 표결을 기다리는 단계입니다.",
  통과: "본회의 표결을 통과했습니다. 아직 시행 전입니다.",
  공포: "정부가 확정된 법을 공식적으로 알린 단계입니다. 아직 시행 전입니다.",
  시행: "실제로 효력이 생겨 현장에 적용되고 있습니다.",
  폐기: "임기 만료나 부결 등으로 없던 일이 된 법안입니다.",
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
  /**
   * 대응하는 개인화 영향경로(ImpactPathway)의 id.
   * 자유문장 요약과 구조화된 개인화 레이어가 서로 다른 말을 하는 것을 막는 연결고리다.
   * 선택 항목이며, 링크가 없으면 검증 스크립트가 경고만 낸다.
   */
  pathwayId?: string;
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
  적중: "예측대로",
  부분적중: "일부만 맞음",
  빗나감: "빗나감",
  판단보류: "아직 판단 못 함",
  추적예정: "확인 예정",
};

export const OUTCOME_STATUS_DESCRIPTION: Record<OutcomeStatus, string> = {
  적중: "당시 예측이 실제 데이터로 확인됐습니다.",
  부분적중: "방향은 맞았지만 크기나 시점이 예측과 달랐습니다.",
  빗나감: "실제 결과가 예측과 다르게 나타났습니다.",
  판단보류:
    "자료는 나왔지만 원인을 정책 하나로 돌리기 어려워 판정을 미뤘습니다.",
  추적예정: "아직 그 시점이 오지 않았거나, 확인할 공개 자료가 없습니다.",
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
