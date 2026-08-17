// src/data/bills/<slug>.ts 뼈대.
//
// 이 파일을 src/data/bills/ 아래로 복사하고, 아래 TODO를 전부 지울 때까지 채운다.
// 필드별 규칙은 .claude/skills/add-bill/references/bill-fields.md 참고.
//
// 마지막에 src/data/bills/index.ts의 bills 배열에 등록하는 것을 잊지 말 것.

import type { Bill } from "@/types/bill";

// 같은 출처를 여러 곳에서 쓰면 상수로 빼 둔다. 오타로 인한 불일치를 막는다.
const S_LAW = {
  label: "TODO: 자료 제목",
  publisher: "TODO: 발행 주체",
  type: "법령", // 법령 | 법안원문 | 공식통계 | 연구자료 | 보도자료 | 언론보도 | 국회회의록 | 기타
  date: "TODO: YYYY-MM-DD",
  url: "TODO: https://",
} as const;

export const myBill2026: Bill = {
  slug: "my-bill-2026", // TODO: 영문 소문자-하이픈-연도. 나중에 바꾸지 않는다
  title: "TODO: 정식 법안명 — 부제",
  shortTitle: "TODO: 짧은 이름", // 12자 안팎. 매트릭스 행 이름이 된다
  category: "TODO", // 기존 값: 복지·연금 | 노동 | 세제 | 사법 | 정치개혁
  tags: ["TODO", "TODO"], // 검색어. 중요한 별칭을 앞에. 카드에는 3개까지 보인다
  status: "심사중", // 발의 | 심사중 | 본회의_계류 | 통과 | 공포 | 시행 | 폐기

  // status와 짝이 맞아야 한다. 지나지 않은 단계의 날짜는 넣지 않는다.
  proposedDate: "TODO: YYYY-MM-DD",
  // passedDate: "",
  // promulgatedDate: "",
  // effectiveDate: "",
  lastUpdated: "TODO: YYYY-MM-DD", // 이 문서를 마지막으로 손본 날

  // ── ① 30초 요약 ────────────────────────────────────────────
  // 결론부터. 무엇이 어떻게 바뀌는지 → 언제 → 무엇이 빠졌는지.
  // 앞 155자가 카드 요약·메타 설명으로 잘려 나간다.
  summary30s: "TODO",

  // ── ② 현재 vs 변경 후 ──────────────────────────────────────
  comparison: [
    {
      aspect: "TODO: 짧은 명사구",
      before: "TODO: 현행 제도. 없으면 '제도 없음'이라고 명시",
      after: "TODO: 바뀐 뒤",
      note: "TODO: 표만 보면 오해할 수 있는 것 (선택)",
    },
  ],
  comparisonNote: "TODO: 표에서 뺀 것과 그 이유 (선택)",

  // ── ③④ 찬반 논리 ──────────────────────────────────────────
  // 양쪽에서 '가장 설득력 있는' 논리를 옮긴다. 약한 주장을 골라 넣지 않는다.
  proponentArguments: [
    {
      point: "TODO: 그쪽 입장에서 쓴 한 문장",
      detail: "TODO: 근거와 맥락",
      claimType: "official_claim", // fact | official_claim | interpretation | forecast | allegation
      attribution: "TODO: 주체 (정당명 대신 역할로)",
      source: S_LAW,
    },
  ],
  opponentArguments: [
    {
      point: "TODO",
      detail: "TODO",
      claimType: "interpretation",
      attribution: "TODO",
    },
  ],

  // ── ⑤ 실제 작동 구조 ───────────────────────────────────────
  mechanismSummary: "TODO: 무엇이 자동으로 일어나고 무엇이 누군가의 판단에 달렸는지",
  mechanismSteps: [
    { step: "TODO: 단계 이름", detail: "TODO: 무엇이 일어나는지" },
  ],

  // ── ⑥ 이득과 부담 ──────────────────────────────────────────
  // pathwayId는 src/data/impact/<slug>.ts의 경로 id와 연결한다.
  // 방향이 확정된(benefit/burden) 경로는 연결되지 않으면 검증에서 경고가 뜬다.
  beneficiaries: [
    {
      who: "TODO: 집단 이름",
      how: "TODO: 어떤 경로로 이득이 생기는지",
      // scale: "TODO: 단위와 기준을 함께",
      claimType: "interpretation",
      // pathwayId: "my-bill-…",
    },
  ],
  costBearers: [
    {
      who: "TODO",
      how: "TODO",
      claimType: "fact",
      // pathwayId: "my-bill-…",
    },
  ],
  fiscalImpact: "TODO: 나라 살림에 미치는 영향. 없으면 '없다'고 근거와 함께 적는다",
  sideEffectRisks: [
    "TODO: 의도하지 않은 결과만. 반대 측 주장을 여기 옮기지 않는다",
  ],

  // ── ⑦ 근거와 한계 ──────────────────────────────────────────
  evidence: [
    {
      text: "TODO: 확인된 내용 한 문장",
      claimType: "fact",
      certainty: "높음", // 높음 | 중간 | 낮음
      source: S_LAW,
    },
  ],
  uncertainties: [
    "TODO: 무엇을 아직 모르는가. 자료가 언제 나오는지까지 적으면 좋다",
  ],

  // ── ⑧ 입법로그 분석 ────────────────────────────────────────
  analysisFacts: ["TODO: 자료로 뒷받침되는 것만"],
  analysisJudgment: ["[의견] TODO: 모든 항목을 [의견]으로 시작한다"],

  // ── ⑨ 예측 기록 ────────────────────────────────────────────
  // 나중에 고치지 않는다. 채점만 한다.
  predictions: [
    {
      id: "TODO-1", // 법안 안에서 유일한 짧은 키
      by: "TODO: 예측 주체 (입법로그 자신의 예측도 넣는다)",
      date: "TODO: YYYY-MM-DD",
      claim: "TODO: 무엇이 어떻게 될 것이라는 주장",
      horizon: "1년", // 6개월 | 1년 | 3년
      fallsifiedBy: "TODO: 무엇을 확인하면 검증되는가. 구체적인 통계·보고서 이름",
    },
  ],

  // ── ⑩ 결과 추적 ────────────────────────────────────────────
  // 세 시점을 미리 만들어 둔다. 아직이면 추적예정.
  outcomeTracking: [
    {
      horizon: "6개월",
      checkDate: "TODO: YYYY-MM-DD 또는 'YYYY년 예정'",
      status: "추적예정", // 적중 | 부분적중 | 빗나감 | 판단보류 | 추적예정
      findings: "TODO: 언제 무엇을 볼 것인지",
      relatedPredictionIds: ["TODO-1"],
    },
    { horizon: "1년", checkDate: "TODO", status: "추적예정", findings: "TODO" },
    { horizon: "3년", checkDate: "TODO", status: "추적예정", findings: "TODO" },
  ],

  // ── 출처 ───────────────────────────────────────────────────
  // 본문에서 쓴 출처는 전부 여기 있어야 한다. 1차 자료를 앞에.
  sources: [S_LAW],
};
