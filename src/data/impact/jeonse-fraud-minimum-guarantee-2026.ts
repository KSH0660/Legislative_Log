import type { Source } from "@/types/bill";
import type { BillImpactData } from "@/types/impact";

// 전세사기특별법 개정(최소보장제·선지급) 개인 영향경로.
//
// 이 법의 조항은 대상이 서로 다르다. 최소보장제는 '이미 피해를 입은 임차인',
// 예방 컨설팅은 '앞으로 계약할 임차인'을 향한다. 적용 시점도 6개월 차이가 난다.
// 그래서 같은 생활영역이어도 시점 기준으로 경로를 나눈다. (§9.3 기준 3)
//
// 피해 여부는 묻지 않는다. 전세사기 피해를 입었는지는 민감한 개인 사정이고,
// 묻지 않아도 '주거 형태'만으로 관련성 판정이 가능하기 때문이다.

const BILL = "jeonse-fraud-minimum-guarantee-2026";
const REVIEWED = "2026-08-17";
const BASELINE_VERSION =
  "전세사기피해자법 2026-05-12 공포 법률 제21634호 / 최소보장제 공포 후 6개월 시행 기준";
const BASELINE =
  "현행 — 피해주택 공공매입에 따른 경매차익으로 공공임대 무상거주 등을 지원하되, 회복 수준은 개별 주택의 낙찰가와 선순위 권리관계에 따라 달랐다";

const S_LAW: Source = {
  label:
    "전세사기피해자 지원 및 주거안정에 관한 특별법 (법률 제21634호, 2026-05-12 일부개정)",
  publisher: "국가법령정보센터",
  type: "법령",
  url: "https://www.law.go.kr/lsInfoP.do?lsId=014450&ancYnChk=0",
};

const S_HK_PASS: Source = {
  label: "'전세사기 선지급-후정산' 위한 전세사기특별법 국회 통과",
  publisher: "한국경제",
  type: "언론보도",
  date: "2026-04-23",
  url: "https://www.hankyung.com/article/202604232901i",
};

const S_HK_CHANGES: Source = {
  label: "전세사기 피해자라면 반드시 확인해야 할 6가지 변화",
  publisher: "한경부동산밸류업센터",
  type: "언론보도",
  date: "2026-05-04",
  url: "https://landvalueup.hankyung.com/issuecheck-202605040700",
};

const S_MOLIT_GUIDE: Source = {
  label: "전세사기피해자 지원 및 주거안정에 관한 특별법 안내",
  publisher: "국토교통부 전세사기 피해자 지원",
  type: "기타",
  url: "https://jeonse.kgeop.go.kr/infoYard/victimSpGuidance.do",
};

/** 보증금을 걸고 사는 주거 형태 */
const TENANT_HOUSING = ["jeonse", "monthly_rent"];

export const jeonseFraudImpact: BillImpactData = {
  review: {
    billSlug: BILL,
    reviewedAt: REVIEWED,
    baselineVersion: BASELINE_VERSION,
  },
  pathways: [
    {
      id: "jfm-minimum-guarantee",
      billSlug: BILL,
      title: "전세사기 피해를 입었을 때 보증금의 3분의 1이 회복의 하한선이 됨",
      relationship: "self",
      domain: "service_access",
      direction: "benefit",
      timeframe: "short_term",
      appliesFrom: "2026-11-12",
      conditions: [
        {
          field: "housingStatus",
          operator: "oneOf",
          value: TENANT_HOUSING,
          role: "required",
          explanation:
            "보증금을 걸고 남의 집에 사는 전세 또는 월세 임차인이어야 합니다.",
        },
      ],
      baseline: BASELINE,
      baselineVersion: BASELINE_VERSION,
      mechanism:
        "전세사기 피해자로 인정받은 임차인이 경·공매를 마친 뒤 실제로 회복한 금액이 임차보증금의 3분의 1에 미치지 못하면, 국가가 그 차액을 지원한다. 신탁사기 등 무권계약 피해자는 경·공매가 끝나기 전에 최소보장금의 전부 또는 일부를 먼저 받고 나중에 정산한다. 지원금은 양도·담보제공과 압류가 금지돼 다른 채권자에게 넘어가지 않는다. 이미 경·공매가 끝난 피해자에게도 소급 적용된다.",
      magnitude: {
        kind: "qualitative_only",
        eligibilityChange:
          "전세사기 피해자로 인정받은 경우, 경매로 회복한 금액이 보증금의 3분의 1에 못 미치면 그 차액을 국가에 신청할 수 있는 근거가 생긴다.",
      },
      evidenceMethod: "statutory_rule",
      assumptions: [
        "전세사기 피해를 실제로 입었는지는 묻지 않는다. 민감한 개인 사정이기 때문이며, 이 경로는 '해당 상황이 생겼을 때 쓸 수 있는 제도가 달라진다'는 뜻으로 읽어야 한다.",
        "보증금 금액을 묻지 않으므로 보장되는 절대금액은 계산하지 않는다. 비율 기준이어서 보증금이 클수록 보장액도 커진다.",
        "피해자로 인정받는 절차(대항요건·보증금 규모 요건·피해지원위원회 결정)를 거쳐야 작동한다. 이번 개정은 그 인정 요건을 바꾸지 않았다.",
      ],
      uncertainties: [
        "'보증금의 3분의 1'이라는 보장 비율의 산정 근거가 공개 자료로 확인되지 않는다.",
        "별도의 지원 상한 금액이 있는지 조문으로 직접 확인하지 못했다.",
        "정확한 시행일을 부칙 원문으로 확인하지 못했다. '공포 후 6개월'이라는 보도를 근거로 2026년 11월 12일로 적었다.",
        "확보된 재원(약 279억원)이 소급 적용 대상까지 감당할 수 있는지에 대한 공식 추계가 없어, 지급 지연 가능성을 배제할 수 없다.",
      ],
      legalBasis: [S_LAW, S_HK_CHANGES],
      reviewedAt: REVIEWED,
    },
    {
      id: "jfm-prevention-consulting",
      billSlug: BILL,
      title: "계약 전에 권리관계를 분석받을 수 있는 공적 창구가 생김",
      relationship: "self",
      domain: "service_access",
      direction: "benefit",
      timeframe: "current",
      appliesFrom: "2026-05-12",
      conditions: [
        {
          field: "housingStatus",
          operator: "oneOf",
          value: TENANT_HOUSING,
          role: "required",
          explanation:
            "보증금을 걸고 계약하는 전세 또는 월세 임차인이어야 합니다.",
        },
      ],
      baseline:
        "현행 — 전세사기 지원은 피해가 발생한 이후의 구제 중심이었고, 계약 전 권리관계 확인은 임차인이 스스로 해야 했다",
      baselineVersion: BASELINE_VERSION,
      mechanism:
        "전세사기피해지원센터가 예비 임차인에게 계약 전 권리관계 분석과 안전계약 컨설팅을 제공한다. 등기부만으로는 확인하기 어려운 선순위 권리나 신탁 여부를 계약 전에 짚어 볼 수 있는 공적 창구가 생기는 것이다. 이 조항은 공포일부터 바로 시행돼, 최소보장제보다 6개월 먼저 작동한다.",
      magnitude: {
        kind: "qualitative_only",
        eligibilityChange:
          "재계약이나 이사를 앞두고 있다면 계약 전에 공적 창구에서 권리관계 분석을 받을 수 있다.",
      },
      evidenceMethod: "statutory_rule",
      assumptions: [
        "이사·재계약 예정 여부를 묻지 않는다. 임차인이면 언젠가 계약을 갱신하거나 옮긴다고 전제한다.",
        "컨설팅의 구체적 범위와 신청 방법은 센터 운영 지침에서 정해진다.",
      ],
      uncertainties: [
        "실제 제공 범위와 처리 기간, 신청 방법이 아직 공개 자료로 확인되지 않는다.",
        "이용 실적이 별도로 공개되지 않으면 이 조항의 효과를 검증할 방법이 없다.",
      ],
      legalBasis: [S_HK_CHANGES, S_MOLIT_GUIDE],
      reviewedAt: REVIEWED,
    },
    {
      id: "jfm-fiscal-burden",
      billSlug: BILL,
      title: "사적 계약의 손실 일부를 공적 재원으로 부담하는 구조",
      relationship: "public",
      domain: "tax",
      direction: "unknown",
      timeframe: "short_term",
      conditions: [],
      baseline: BASELINE,
      baselineVersion: BASELINE_VERSION,
      mechanism:
        "최소보장금과 선지급금은 국가 재정에서 나간다. 정부는 2026년 제1회 추가경정예산으로 약 279억원을 확보했고, 선지급분은 경·공매 종료 후 정산으로 일부 회수한다. 개별 납세자의 세부담을 바꾸는 조항은 없으므로 세액 변화로 이어지지는 않지만, 사적 계약의 손실을 공적 재원으로 메우는 선례라는 점에서 재정 구조상의 경로로 기록한다.",
      magnitude: { kind: "qualitative_only" },
      evidenceMethod: "qualitative_pathway",
      assumptions: [
        "세율·공제 등 개인의 세액을 직접 바꾸는 조항은 없다.",
        "이 경로는 재정 일반을 통한 간접 경로이므로 '직접 대상'이 될 수 없다.",
      ],
      uncertainties: [
        "확보된 재원이 실제 수요에 못 미칠 경우의 추가 재정소요 규모를 알 수 없다.",
        "선지급분의 정산 회수율에 대한 전망 자료가 없다.",
      ],
      legalBasis: [S_HK_PASS, S_HK_CHANGES],
      reviewedAt: REVIEWED,
    },
  ],
};
