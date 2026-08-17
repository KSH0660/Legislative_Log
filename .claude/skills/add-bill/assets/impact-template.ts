// src/data/impact/<slug>.ts 뼈대.
//
// 규칙은 .claude/skills/add-bill/references/impact-pathways.md 참고.
// 다 쓰면 src/data/impact/index.ts의 impactData 배열에 등록한다.
//
// 쪼개는 기준 세 가지:
//   1. 생활영역(domain) 하나당 경로 하나
//   2. relationship이 다르면 다른 경로 (self ≠ employer)
//   3. 시점(timeframe)이 다르면 대개 다른 경로

import type { Source } from "@/types/bill";
import type { BillImpactData } from "@/types/impact";

const BILL = "my-bill-2026"; // TODO: 법안 slug와 정확히 같아야 한다
const REVIEWED = "TODO: YYYY-MM-DD"; // 오늘. 미래 날짜 금지
const BASELINE_VERSION = "TODO: 예) …법 2026-03-24 공포 개정법률 / 2026-10-02 시행 예정 기준";
const BASELINE = "TODO: 무엇과 비교했는지. 현행 제도 서술";

const S_LAW: Source = {
  label: "TODO: 자료 제목",
  publisher: "TODO",
  type: "법령",
  url: "TODO: https://",
};

export const myBillImpact: BillImpactData = {
  review: {
    billSlug: BILL,
    reviewedAt: REVIEWED,
    baselineVersion: BASELINE_VERSION,

    // 개인 경로가 하나도 없을 때만 채운다. 이 문장은 화면에 그대로 보인다.
    // "검토를 안 했다"가 아니라 "검토했더니 없더라, 이유는 이렇다"로 읽히게 쓴다.
    // noPersonalPathwayReason: "TODO",
  },

  pathways: [
    {
      id: `${BILL}-TODO`, // 전체에서 유일해야 한다
      billSlug: BILL,
      title: "TODO: 이 경로가 무엇인지 한 줄. 카드의 '왜 관련 있나'에 그대로 쓰인다",

      // self·household만 '직접 대상'이 될 수 있다.
      // 전가 경로는 employer/consumer/public로 두고 별도 경로로 쪼갠다.
      relationship: "self",

      // 정확히 하나. 여러 영역에 걸치면 경로를 나눈다.
      // disposable_income | tax | social_insurance | living_cost | employment
      // | service_access | care_education_health | administrative_time | rights_risk
      domain: "social_insurance",

      // benefit | burden | mixed | no_direct_change | unknown
      // 자료가 없으면 unknown. no_direct_change는 근거가 있을 때만 (검증 규칙 5).
      direction: "burden",

      timeframe: "current", // current | short_term | long_term
      // appliesFrom: "2026-01-01",   // 단계 시행 조항이면 넣는다

      conditions: [
        {
          field: "economicRoles", // ProfileKey — src/lib/profile/questions.ts 참고
          operator: "includes", // 복수선택 질문에는 includes만 쓴다
          value: "employee", // 실제 선택지 코드여야 한다
          role: "required", // required | excluding | informative
          explanation: "TODO: '…여야 합니다' 꼴의 완성된 문장. 사용자에게 그대로 보인다",
        },
        {
          field: "ageBand",
          operator: "withinRange",
          value: { min: 18, max: 59 }, // 법이 실제로 쓰는 경계로 적는다
          role: "required",
          explanation: "TODO",
        },
        // 제외조건. unknown이어도 판정을 '조건부'로 낮춘다.
        // {
        //   field: "pensionStatus",
        //   operator: "equals",
        //   value: "receiving",
        //   role: "excluding",
        //   explanation: "TODO",
        // },
        // 판정은 안 바꾸지만 금액 계산에 필요한 값.
        // {
        //   field: "monthlyStandardIncome",
        //   operator: "withinRange",
        //   value: { min: 0, max: null },
        //   role: "informative",
        //   explanation: "TODO",
        // },
      ],

      baseline: BASELINE,
      baselineVersion: BASELINE_VERSION,
      mechanism: "TODO: 어떤 경로로 그렇게 되는지. 사용자에게 그대로 보인다",

      // 대부분은 qualitative_only다. 법정 산식이 있고 계산기가 등록돼 있을 때만
      // statutory_calculation을 쓴다 (검증 규칙 6).
      magnitude: {
        kind: "qualitative_only",
        // eligibilityChange: "TODO: 자격·권리 변화는 단위가 없으므로 여기 문장으로",
      },

      // statutory_rule | official_estimate | representative_model
      // | causal_study | qualitative_pathway
      evidenceMethod: "statutory_rule",

      // 둘 다 비울 수 없다. "모르는 것이 없다"는 답은 거의 언제나 틀렸다.
      assumptions: ["TODO: 이 판정이 놓은 가정"],
      uncertainties: ["TODO: 아직 모르는 것"],

      legalBasis: [S_LAW], // 최소 1건
      reviewedAt: REVIEWED,
    },
  ],
};
