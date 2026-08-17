import type { Source } from "@/types/bill";
import type { BillImpactData } from "@/types/impact";

// 노란봉투법 개인 영향경로.
//
// 이 법은 금전 순효과를 계산할 근거가 없다. §15의 원칙대로 권리·고용·행정 부담
// 중심의 정성 경로로만 작성하고, 금액은 만들지 않는다.

const BILL = "yellow-envelope-act-2025";
const REVIEWED = "2026-08-17";
const BASELINE_VERSION =
  "노동조합법 2·3조 2025-09-12 공포 개정법률 / 2026-03-10 시행 기준";
const BASELINE = "개정 전 노동조합법 2·3조 (직접 근로계약 당사자만 사용자, 쟁의 손해 연대책임)";
const EFFECTIVE = "2026-03-10";

const S_LAWTIMES: Source = {
  label: "노동조합 및 노동관계조정법 일부개정법률안(노란봉투법)의 주요 내용",
  publisher: "법률신문",
  type: "언론보도",
  url: "https://www.lawtimes.co.kr/LawFirm-NewsLetter/212819",
};

const S_JIPYONG: Source = {
  label: "[노동] 노동조합 및 노동관계조정법 제2, 3조 개정('노란봉투법')",
  publisher: "법무법인 지평",
  type: "언론보도",
  url: "https://www.jipyong.com/kr/board/news_view.php?seq=14368",
};

const S_CODIT: Source = {
  label: "노란봉투법 시행: 노사관계 환경 변화와 기업의 대응 전략",
  publisher: "CODIT Insights",
  type: "언론보도",
  url: "https://thecodit.com/blog/yellow-envelope-act-takes-effect-kr",
};

const S_SEOUL: Source = {
  label: "일주일 남은 노란봉투법… 현장은 사용자성·교섭단위 '해석 전쟁'",
  publisher: "서울신문",
  type: "언론보도",
  date: "2026-03-02",
  url: "https://www.seoul.co.kr/news/society/2026/03/02/20260302032001",
};

const S_DAERYUN: Source = {
  label: "노란봉투법, 기업의 법적 리스크와 대응 방법",
  publisher: "법무법인 대륜",
  type: "언론보도",
  url: "https://www.daeryunlaw-comp.com/lawInfo_new/9426",
};

/** 개정 조항이 직접 겨냥하는 계약 형태 */
const COVERED_RELATIONS = ["subcontract", "special_type", "platform"];

export const yellowEnvelopeImpact: BillImpactData = {
  review: {
    billSlug: BILL,
    reviewedAt: REVIEWED,
    baselineVersion: BASELINE_VERSION,
  },
  pathways: [
    {
      id: "yea-subcontract-bargaining",
      billSlug: BILL,
      title: "하청·특수고용·플랫폼 노동자의 교섭 상대방 확대",
      relationship: "self",
      domain: "rights_risk",
      direction: "benefit",
      timeframe: "current",
      appliesFrom: EFFECTIVE,
      conditions: [
        {
          field: "employmentRelation",
          operator: "includes",
          value: COVERED_RELATIONS,
          role: "required",
          explanation:
            "하청·파견, 특수고용, 플랫폼 노동 중 하나에 해당해야 합니다.",
        },
      ],
      baseline: BASELINE,
      baselineVersion: BASELINE_VERSION,
      mechanism:
        "근로조건에 실질적·구체적 지배력을 행사하는 원청도 단체교섭 상대방인 '사용자'로 인정될 수 있게 된다. 실제 결정권을 가진 쪽에 교섭을 요구할 법적 근거가 생기는 것이며, 교섭 결과가 유리해진다는 뜻은 아니다.",
      magnitude: {
        kind: "qualitative_only",
        eligibilityChange:
          "원청을 상대로 단체교섭을 요구하고, 응하지 않을 때 부당노동행위 구제신청을 낼 수 있는 근거가 생긴다.",
      },
      evidenceMethod: "statutory_rule",
      assumptions: [
        "교섭 요구가 실제로 받아들여지는지는 사안별 사용자성 판단에 달려 있다.",
      ],
      uncertainties: [
        "'실질적·구체적 지배력'의 판단 기준이 아직 판례로 충분히 쌓이지 않았다.",
        "교섭창구 단일화 절차가 법에 명확히 규정되지 않아 현장 적용이 엇갈릴 수 있다.",
      ],
      legalBasis: [S_LAWTIMES, S_JIPYONG],
      reviewedAt: REVIEWED,
    },
    {
      id: "yea-liability-individualization",
      billSlug: BILL,
      title: "조합원 개인의 쟁의행위 손해배상 책임 개별화",
      relationship: "self",
      domain: "rights_risk",
      direction: "benefit",
      timeframe: "current",
      appliesFrom: EFFECTIVE,
      conditions: [
        {
          field: "employmentRelation",
          operator: "includes",
          value: "union_member",
          role: "required",
          explanation: "노동조합에 가입해 있어야 합니다.",
        },
      ],
      baseline: BASELINE,
      baselineVersion: BASELINE_VERSION,
      mechanism:
        "법원이 배상액을 정할 때 조합원 개인의 가담 정도·역할·기여도를 고려해 책임을 개별화한다. 노조 전체에 대한 연대책임을 근거로 개인에게 거액이 청구되던 구조가 바뀐다. 노조 자체에 대한 손해배상 청구가 금지되는 것은 아니다.",
      magnitude: {
        kind: "qualitative_only",
        eligibilityChange:
          "연대책임을 근거로 한 개인 대상 거액 청구 위험이 줄어든다. 금액은 사건별 판결에 달려 있어 계산하지 않는다.",
      },
      evidenceMethod: "statutory_rule",
      assumptions: [
        "위법한 쟁의행위에 대한 손해배상 청구 자체가 없어지는 것은 아니다.",
      ],
      uncertainties: [
        "실제 인용률과 배상액 변화는 시행 이후 판결례가 쌓여야 확인할 수 있다.",
      ],
      legalBasis: [S_LAWTIMES, S_JIPYONG],
      reviewedAt: REVIEWED,
    },
    {
      id: "yea-procedure-time",
      billSlug: BILL,
      title: "사용자성 다툼에 따르는 절차·시간 부담",
      relationship: "self",
      domain: "administrative_time",
      direction: "unknown",
      timeframe: "short_term",
      appliesFrom: EFFECTIVE,
      conditions: [
        {
          field: "employmentRelation",
          operator: "includes",
          value: [...COVERED_RELATIONS, "union_member"],
          role: "required",
          explanation:
            "하청·특수고용·플랫폼 노동자이거나 노동조합원이어야 합니다.",
        },
      ],
      baseline: BASELINE,
      baselineVersion: BASELINE_VERSION,
      mechanism:
        "원청의 사용자성은 노동위원회·법원의 개별 판단 대상이다. 교섭 요구가 곧바로 받아들여지지 않으면 구제신청·소송 절차에 시간이 든다. 반대로 교섭이 성립하면 개별 대응에 들던 시간이 줄어들 수도 있어, 방향을 한쪽으로 정하지 않는다.",
      magnitude: { kind: "qualitative_only" },
      evidenceMethod: "qualitative_pathway",
      assumptions: [
        "절차 소요 시간에 대한 공식 통계가 없어 방향을 정하지 않는다.",
      ],
      uncertainties: [
        "사용자성 인정 범위를 둘러싼 구제신청·소송 건수의 공식 통계가 아직 정기적으로 공개되지 않는다.",
      ],
      legalBasis: [S_SEOUL, S_CODIT],
      reviewedAt: REVIEWED,
    },
    {
      id: "yea-principal-employer-cost",
      billSlug: BILL,
      title: "원청·도급을 주는 쪽의 교섭 의무와 분쟁 위험",
      relationship: "self",
      domain: "employment",
      direction: "burden",
      timeframe: "current",
      appliesFrom: EFFECTIVE,
      conditions: [
        {
          field: "employmentRelation",
          operator: "includes",
          value: "principal_employer",
          role: "required",
          explanation: "도급을 주는 원청 쪽이어야 합니다.",
        },
      ],
      baseline: BASELINE,
      baselineVersion: BASELINE_VERSION,
      mechanism:
        "하청 노동자에 대한 신규 교섭 의무가 생기고, 사용자성 판단을 둘러싼 법적 분쟁 위험을 새로 부담하게 된다. 사용자 본인이 원청 지위에 있는 경우이므로 relationship은 self다.",
      magnitude: { kind: "qualitative_only" },
      evidenceMethod: "qualitative_pathway",
      assumptions: [
        "사업 규모와 도급 구조를 묻지 않으므로 비용은 계산하지 않는다.",
      ],
      uncertainties: [
        "어디까지가 사용자성 인정 범위인지 사전에 예측하기 어렵다는 것이 경영계의 주요 우려다.",
        "교섭창구 단일화 절차 미비로 다수 하청노조와의 교섭 부담이 커질지는 아직 확인되지 않았다.",
      ],
      legalBasis: [S_DAERYUN, S_CODIT],
      reviewedAt: REVIEWED,
    },
    {
      id: "yea-employer-passthrough",
      billSlug: BILL,
      title: "기업의 분쟁·교섭 비용 변화가 임금·고용으로 전가될 가능성",
      relationship: "employer",
      domain: "employment",
      direction: "unknown",
      timeframe: "long_term",
      appliesFrom: EFFECTIVE,
      conditions: [
        {
          field: "economicRoles",
          operator: "includes",
          value: "employee",
          role: "required",
          explanation: "임금을 받고 일하는 사람이어야 합니다.",
        },
      ],
      baseline: BASELINE,
      baselineVersion: BASELINE_VERSION,
      mechanism:
        "기업이 새로 지게 되는 교섭·분쟁 비용은 임금·고용·도급 구조 조정으로 옮겨갈 수 있다. 노사 양측의 공식 전망이 정반대 방향이고 어느 쪽도 통계로 확정되지 않아, 방향을 정하지 않는다.",
      magnitude: { kind: "qualitative_only" },
      evidenceMethod: "qualitative_pathway",
      assumptions: [
        "추진 측과 반대 측의 주장을 개인 영향의 확정 근거로 사용하지 않는다. (§14.2)",
      ],
      uncertainties: [
        "산업현장의 분쟁 비용·소송 비용 변화가 통계로 확인되지 않았다.",
        "전가가 실제로 일어나는지, 어느 경로로 나타나는지에 대한 국내 실증 근거가 없다.",
      ],
      legalBasis: [S_CODIT, S_DAERYUN],
      reviewedAt: REVIEWED,
    },
    {
      id: "yea-direct-employment-no-change",
      billSlug: BILL,
      title: "직접고용·비조합원인 경우 — 두 개정 조항의 직접 적용 대상 아님",
      relationship: "self",
      domain: "rights_risk",
      direction: "no_direct_change",
      timeframe: "current",
      appliesFrom: EFFECTIVE,
      conditions: [
        {
          field: "economicRoles",
          operator: "includes",
          value: "employee",
          role: "required",
          explanation: "임금을 받고 일하는 사람이어야 합니다.",
        },
        {
          field: "employmentRelation",
          operator: "includes",
          value: [...COVERED_RELATIONS, "union_member", "principal_employer"],
          role: "excluding",
          explanation:
            "하청·특수고용·플랫폼 노동자이거나, 노동조합원이거나, 원청 쪽이면 이 경로가 아닙니다.",
        },
      ],
      baseline: BASELINE,
      baselineVersion: BASELINE_VERSION,
      mechanism:
        "이번 개정은 ① 사용자 정의 확대와 ② 쟁의행위 손해배상 책임 개별화 두 조항으로 구성된다. 직접 근로계약을 맺은 사용자와 일하고 노동조합에 가입하지 않았다면 두 조항 모두 직접 적용되는 상황이 아니다. 이것은 '자료가 없어 모른다'가 아니라 조항 범위를 확인한 결과다.",
      magnitude: { kind: "qualitative_only" },
      evidenceMethod: "statutory_rule",
      assumptions: [
        "나중에 노동조합에 가입하거나 도급 구조가 바뀌면 판정도 바뀐다.",
      ],
      uncertainties: [
        "산업 전반의 노사관계 변화가 간접적으로 근로조건에 미치는 영향은 별도 경로(yea-employer-passthrough)에서 다룬다.",
      ],
      legalBasis: [S_LAWTIMES, S_JIPYONG],
      reviewedAt: REVIEWED,
    },
  ],
};
