import type { Source } from "@/types/bill";
import type { BillImpactData } from "@/types/impact";

// 예금보호한도 상향(예금자보호법 개정) 개인 영향경로.
//
// 이 법의 특징은 **조건이 거의 걸리지 않는다**는 점이다. 예금계좌를 가진 사람이면
// 나이·직업·가구와 무관하게 같은 조문이 적용된다. 그래서 조건을 억지로 만들지 않고
// 비워 두되, 실제 혜택 크기를 가르는 것(예치 금액)은 묻지 않는다는 사실을
// assumptions에 명시한다. 자산 규모를 소득으로 추정하지 않는다. (§15)

const BILL = "deposit-protection-limit-2025";
const REVIEWED = "2026-08-17";
const BASELINE_VERSION =
  "예금자보호법 2025-01-21 공포 개정법률 / 2025-09-01 시행 대통령령 기준";
const BASELINE =
  "현행(2025-08-31까지) — 1인당 금융회사별 원금과 소정이자를 합해 5천만원까지 보호";

const S_FSC: Source = {
  label: "오늘부터 새로운 예금보호한도 1억원 시대가 열립니다",
  publisher: "금융위원회",
  type: "보도자료",
  date: "2025-08-29",
  url: "https://www.fsc.go.kr/no010101/85200",
};

const S_BRIEFING: Source = {
  label: "9월 1일부터 예금보호한도 1억 원으로…24년 만에 상향",
  publisher: "대한민국 정책브리핑",
  type: "보도자료",
  url: "https://www.korea.kr/news/policyNewsView.do?newsId=148946400",
};

const S_LAW: Source = {
  label: "예금자보호법 제·개정 이력",
  publisher: "국가법령정보센터",
  type: "법령",
  url: "https://www.law.go.kr/LSW/lsRvsDocListP.do?lsId=001537&chrClsCd=010102",
};

const S_KDIC: Source = {
  label: "예금자보호제도 FAQ",
  publisher: "예금보험공사",
  type: "기타",
  url: "https://www.kdic.or.kr/sp/dpstrprot/ProtSystFaq/selectScrn.do",
};

/** 퇴직연금·연금저축 계좌를 가질 가능성이 있는 경제활동 상태 */
const PENSION_ACCOUNT_ROLES = [
  "employee",
  "self_employed",
  "employer",
  "jobseeker",
  "inactive",
  "pension_recipient",
];

export const depositProtectionImpact: BillImpactData = {
  review: {
    billSlug: BILL,
    reviewedAt: REVIEWED,
    baselineVersion: BASELINE_VERSION,
  },
  pathways: [
    {
      id: "dpl-coverage-doubled",
      billSlug: BILL,
      title: "금융회사가 파산했을 때 돌려받을 수 있는 상한이 두 배가 됨",
      relationship: "self",
      domain: "rights_risk",
      direction: "benefit",
      timeframe: "current",
      appliesFrom: "2025-09-01",
      conditions: [
        {
          field: "ageBand",
          operator: "withinRange",
          value: { min: 0, max: null },
          role: "required",
          explanation:
            "예금계좌를 가진 사람이면 나이와 무관하게 모두 대상입니다. 예금 보유 여부를 따로 묻지 않기 때문에, 아무것도 답하지 않은 상태에서는 확정하지 않고 조건부로 남깁니다.",
        },
      ],
      baseline: BASELINE,
      baselineVersion: BASELINE_VERSION,
      mechanism:
        "예금보험 대상 금융회사가 파산해 예금을 지급하지 못하게 되면, 원금과 소정의 이자를 합해 1인당 금융회사별로 1억원까지 지급된다. 별도 신청 절차는 없고 시행일 이전에 가입한 예·적금에도 적용된다. 은행뿐 아니라 저축은행·보험·증권과 새마을금고·신협 등 상호금융에도 같은 시점에 같은 한도가 적용된다.",
      magnitude: {
        kind: "qualitative_only",
        eligibilityChange:
          "한 금융회사에 맡긴 돈 중 보호받는 금액의 상한이 5천만원에서 1억원으로 올라간다. 실제로 얼마가 더 보호되는지는 그 회사에 얼마를 맡겼는지에 달려 있다.",
      },
      evidenceMethod: "statutory_rule",
      assumptions: [
        "예금 보유 여부와 금액을 묻지 않는다. 예금계좌를 가진 사람이면 나이·직업·가구와 무관하게 같은 조문이 적용되기 때문이다.",
        "보호 대상 상품(예금·적금 등 원금이 보전되는 상품)에 한한다. 원래 보호 대상이 아닌 투자상품은 이 경로와 무관하다.",
        "한 금융회사에 5천만원 이하를 맡긴 사람에게는 보호 한도가 올라도 실제로 달라지는 것이 없다.",
      ],
      uncertainties: [
        "예치 금액을 묻지 않으므로 개인별로 얼마가 더 보호되는지는 계산하지 않는다.",
        "상호금융 각 중앙회 기금이 늘어난 한도를 실제로 감당할 수 있는지에 대한 공개 자료가 제한적이다.",
      ],
      legalBasis: [S_FSC, S_LAW],
      reviewedAt: REVIEWED,
    },
    {
      id: "dpl-retirement-separate-limit",
      billSlug: BILL,
      title: "퇴직연금·연금저축의 별도 보호한도도 함께 1억원으로 올라감",
      relationship: "self",
      domain: "rights_risk",
      direction: "benefit",
      timeframe: "long_term",
      appliesFrom: "2025-09-01",
      conditions: [
        {
          field: "economicRoles",
          operator: "includes",
          value: PENSION_ACCOUNT_ROLES,
          role: "required",
          explanation:
            "퇴직연금(DC·IRP)이나 연금저축 계좌를 가질 수 있는 경제활동 상태여야 합니다. 계좌 보유 여부를 직접 묻지 않기 때문에 이 항목으로 갈음합니다.",
        },
      ],
      baseline: BASELINE,
      baselineVersion: BASELINE_VERSION,
      mechanism:
        "퇴직연금·연금저축·사고보험금은 일반 예금과 합산하지 않고 별도로 한도가 계산된다. 이 별도 한도 구조 자체는 전부터 있었고, 이번에 그 금액이 5천만원에서 1억원으로 함께 올랐다. 같은 금융회사에 일반 예금과 퇴직연금을 모두 두고 있으면 각각 1억원씩 따로 보호된다.",
      magnitude: {
        kind: "qualitative_only",
        eligibilityChange:
          "노후자금 계좌가 일반 예금과 별도로 1억원까지 보호된다. 같은 회사에 둘 다 있으면 합산되지 않는다.",
      },
      evidenceMethod: "statutory_rule",
      assumptions: [
        "퇴직연금·연금저축 계좌 보유 여부를 직접 묻지 않고, 경제활동 상태로 가능성만 표시한다.",
        "실제로 보호되는 것은 해당 계좌 안의 원리금보장형 운용상품이며, 실적배당형 상품은 이 경로와 무관하다.",
      ],
      uncertainties: [
        "가입한 연금 상품의 운용 구성(원리금보장형 대 실적배당형)을 묻지 않으므로 실제 보호 범위는 개인마다 다르다.",
        "퇴직연금 계좌를 여러 금융회사에 나눠 둔 경우의 합산 처리 세부는 상품 약관과 사업자에 따라 달라질 수 있다.",
      ],
      legalBasis: [S_BRIEFING, S_KDIC],
      reviewedAt: REVIEWED,
    },
    {
      id: "dpl-account-splitting",
      billSlug: BILL,
      title: "한도에 맞춰 계좌를 쪼개 관리하던 부담이 줄어듦",
      relationship: "self",
      domain: "administrative_time",
      direction: "benefit",
      timeframe: "current",
      appliesFrom: "2025-09-01",
      conditions: [
        {
          field: "ageBand",
          operator: "withinRange",
          value: { min: 0, max: null },
          role: "required",
          explanation:
            "예금계좌를 가진 사람이면 나이와 무관하게 해당됩니다. 예치 금액을 묻지 않으므로, 아무것도 답하지 않은 상태에서는 확정하지 않습니다.",
        },
      ],
      baseline: BASELINE,
      baselineVersion: BASELINE_VERSION,
      mechanism:
        "보호한도가 5천만원이던 때에는 그 금액을 넘겨 예치하려면 금융회사를 나누는 것이 합리적인 선택이었다. 한도가 1억원이 되면 같은 금액을 관리하는 데 필요한 금융회사 수가 줄어, 계좌 개설·만기 관리·인증 절차에 드는 시간이 줄어든다.",
      magnitude: {
        kind: "qualitative_only",
        eligibilityChange:
          "같은 금액을 보호받기 위해 나눠 둬야 하는 금융회사 수가 줄어든다.",
      },
      evidenceMethod: "qualitative_pathway",
      assumptions: [
        "예치 금액을 묻지 않으므로 실제로 관리 부담이 줄어드는 사람인지는 판정하지 않는다.",
        "예금자가 금리보다 보호한도를 기준으로 금융회사를 나눠 왔다고 전제한다. 금리를 좇아 분산해 온 경우에는 달라지는 것이 없다.",
      ],
      uncertainties: [
        "실제로 계좌 분산이 줄었는지를 보여주는 통계가 없다.",
        "한도 상향이 오히려 금리를 좇는 이동을 늘려 관리 부담이 그대로일 가능성도 있다.",
      ],
      legalBasis: [S_FSC, S_KDIC],
      reviewedAt: REVIEWED,
    },
    {
      id: "dpl-premium-passthrough",
      billSlug: BILL,
      title: "예금보험료율 조정분이 예금·대출 금리로 옮겨올 가능성",
      relationship: "consumer",
      domain: "living_cost",
      direction: "unknown",
      timeframe: "long_term",
      conditions: [],
      baseline: BASELINE,
      baselineVersion: BASELINE_VERSION,
      mechanism:
        "예금보험기금은 금융회사가 내는 보험료로 조성된다. 보호한도가 오르면 요율 조정이 뒤따르고, 금융회사는 그 비용을 예금금리를 낮추거나 대출금리를 올려 일부 회수할 수 있다. 다만 조정된 요율은 2028년 납입분부터 적용될 예정이어서, 지금 시점에는 전가가 일어났는지 관측할 수 있는 자료 자체가 없다.",
      magnitude: { kind: "qualitative_only" },
      evidenceMethod: "qualitative_pathway",
      assumptions: [
        "법이 보험료를 지우는 대상은 금융회사이고, 소비자에게 오는 것은 가격을 통한 간접 경로다. 그래서 '직접 대상'이 될 수 없다.",
        "전가 정도는 업권별 경쟁 상황에 따라 달라지며, 하나의 비율로 가정하지 않는다.",
      ],
      uncertainties: [
        "조정될 예금보험료율의 구체적 수치가 아직 확인되지 않는다.",
        "요율 적용 시점(2028년 납입분)이 오기 전까지는 금리 전가 여부를 측정할 수 없다.",
        "예대금리차 변화가 나타나더라도 예금보험료율 때문인지 기준금리 등 다른 요인 때문인지 분리하기 어렵다.",
      ],
      legalBasis: [S_BRIEFING, S_FSC],
      reviewedAt: REVIEWED,
    },
  ],
};
