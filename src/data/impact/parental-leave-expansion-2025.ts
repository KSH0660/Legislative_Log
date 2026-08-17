import type { Source } from "@/types/bill";
import type { BillImpactData } from "@/types/impact";

// 육아지원 3법 개인 영향경로.
//
// 이 법은 '권리'(휴직·휴가·단축근무)와 '급여'(고용보험)를 함께 바꿨다.
// 두 가지는 생활영역이 다르므로 반드시 다른 경로로 쪼갠다. (§9.3)
// 자녀 연령 밴드가 법정 경계(만 8세·만 12세)를 걸치는 구간이 있어,
// 그 경우 조용히 true로 떨어뜨리지 않고 불확실성으로 남긴다. (§7.1)

const BILL = "parental-leave-expansion-2025";
const REVIEWED = "2026-08-17";
const BASELINE_VERSION =
  "육아지원 3법 2024-09-26 국회 통과 / 2025-02-23 시행 기준 (급여는 2025-01 적용 고용보험법 시행령)";
const BASELINE =
  "현행(2025-02-22까지) — 육아휴직 각각 최대 1년·분할 2회, 배우자 출산휴가 10일, 육아기 근로시간 단축은 만 8세 이하 자녀";

const S_MOEL_PASS: Source = {
  label: "(참고) 육아지원 3법, 상습체불 근절법 등 국회 본회의 통과",
  publisher: "고용노동부",
  type: "보도자료",
  date: "2024-09-26",
  url: "https://www.moel.go.kr/news/enews/report/enewsView.do?news_seq=17104",
};

const S_MOEL_CARD: Source = {
  label: "[카드뉴스] 육아지원 3법 개정",
  publisher: "고용노동부",
  type: "보도자료",
  url: "https://www.moel.go.kr/news/cardinfo/view.do?bbs_seq=20241100119",
};

const S_BRIEFING: Source = {
  label: "2025년 고용노동부 달라지는 제도 ① 육아휴직",
  publisher: "대한민국 정책브리핑",
  type: "보도자료",
  url: "https://www.korea.kr/news/policyNewsView.do?newsId=148938182",
};

const S_MOEL_STATS: Source = {
  label: "올해 9월 육아휴직 사용자 14만명 돌파",
  publisher: "고용노동부",
  type: "공식통계",
  date: "2025-10-28",
  url: "https://www.moel.go.kr/news/enews/report/enewsView.do?news_seq=18514",
};

/** 육아휴직 대상 자녀 연령(만 8세 이하)과 겹치는 밴드 */
const LEAVE_ELIGIBLE_CHILDREN = ["child_0_5", "child_6_11"];

/** 육아기 근로시간 단축 대상 자녀 연령(만 12세 이하)과 겹치는 밴드 */
const REDUCED_HOURS_CHILDREN = ["child_0_5", "child_6_11", "child_12_17"];

export const parentalLeaveImpact: BillImpactData = {
  review: {
    billSlug: BILL,
    reviewedAt: REVIEWED,
    baselineVersion: BASELINE_VERSION,
  },
  pathways: [
    {
      id: "ple-leave-extension",
      billSlug: BILL,
      title: "육아휴직을 쓸 수 있는 기간이 1년에서 1년 6개월로 늘어남",
      relationship: "self",
      domain: "care_education_health",
      direction: "benefit",
      timeframe: "current",
      appliesFrom: "2025-02-23",
      conditions: [
        {
          field: "economicRoles",
          operator: "includes",
          value: "employee",
          role: "required",
          explanation:
            "육아휴직은 임금을 받고 일하는 근로자에게 적용됩니다. 자영업자는 대상이 아닙니다.",
        },
        {
          field: "childAgeBands",
          operator: "includes",
          value: LEAVE_ELIGIBLE_CHILDREN,
          role: "required",
          explanation:
            "만 8세 이하 또는 초등학교 2학년 이하의 자녀가 있어야 합니다.",
        },
        {
          field: "householdAdults",
          operator: "withinRange",
          value: { min: 2, max: null },
          role: "informative",
          explanation:
            "6개월 연장은 부모가 각각 3개월 이상 사용한 경우에 성립합니다. 한부모는 이 요건 없이 1년 6개월을 쓸 수 있습니다.",
        },
      ],
      baseline: BASELINE,
      baselineVersion: BASELINE_VERSION,
      mechanism:
        "부모가 같은 자녀에 대해 각각 3개월 이상 육아휴직을 사용하면 각자의 사용 가능 기간이 1년에서 1년 6개월로 늘어난다. 한부모와 중증 장애아동의 부모는 이 요건 없이 1년 6개월을 쓸 수 있다. 분할 사용 횟수도 2회에서 4회로 늘어, 필요한 시기에 나눠 쓰기 쉬워졌다. 요건을 갖춘 신청을 사업주가 거부할 수 없다는 점은 자동으로 작동하지만, 대체인력 확보는 사업장에 맡겨져 있어 실제 사용 가능성은 사업장마다 다르다.",
      magnitude: {
        kind: "qualitative_only",
        eligibilityChange:
          "요건을 채우면 자녀 1명당 쓸 수 있는 육아휴직이 6개월 더 생기고, 나눠 쓸 수 있는 횟수가 2회에서 4회로 늘어난다.",
      },
      evidenceMethod: "statutory_rule",
      assumptions: [
        "고용보험에 가입된 임금근로자를 전제한다. 가입 이력이 짧거나 적용 제외 대상이면 실제로는 쓰지 못할 수 있다.",
        "배우자가 육아휴직을 쓸 수 있는 고용 형태인지는 묻지 않는다. 배우자가 자영업자이거나 고용보험 대상이 아니면 6개월 연장 요건을 채우기 어렵다.",
      ],
      uncertainties: [
        "만 6~11세 밴드는 법이 쓰는 경계(만 8세·초2)를 걸치므로, 실제 대상 여부는 자녀의 정확한 나이와 학년에 달려 있다.",
        "법상 권리와 사업장에서의 실제 사용 가능성은 다르다. 규모별 사용률 격차를 보여주는 최신 자료를 확보하지 못했다.",
      ],
      legalBasis: [S_MOEL_PASS, S_MOEL_CARD],
      reviewedAt: REVIEWED,
    },
    {
      id: "ple-benefit-increase",
      billSlug: BILL,
      title: "육아휴직 기간에 받는 급여가 오르고 사후지급이 없어짐",
      relationship: "self",
      domain: "disposable_income",
      direction: "benefit",
      timeframe: "short_term",
      appliesFrom: "2025-01-01",
      conditions: [
        {
          field: "economicRoles",
          operator: "includes",
          value: "employee",
          role: "required",
          explanation:
            "고용보험에 가입한 임금근로자여야 육아휴직급여를 받을 수 있습니다.",
        },
        {
          field: "childAgeBands",
          operator: "includes",
          value: LEAVE_ELIGIBLE_CHILDREN,
          role: "required",
          explanation:
            "만 8세 이하 또는 초등학교 2학년 이하의 자녀가 있어야 합니다.",
        },
      ],
      baseline:
        "현행(2024년까지) — 육아휴직급여 상한 월 150만원, 급여의 25%는 복직 6개월 후에 지급(사후지급금)",
      baselineVersion: BASELINE_VERSION,
      mechanism:
        "육아휴직급여 상한이 월 250만원으로 오르고, 복직 6개월 뒤에 주던 사후지급금 방식이 없어져 휴직 기간 중 전액을 받는다. 사후지급 폐지는 총액뿐 아니라 '언제 받느냐'를 바꾸는 변화여서, 휴직 중 소득 공백을 실제로 메우는 효과가 있다. 정부 설명 기준으로 12개월을 사용하면 총액이 1,800만원에서 2,310만원으로 약 510만원 늘어난다.",
      magnitude: {
        kind: "model_range",
        unit: "KRW_year",
        eligibilityChange:
          "12개월 사용 기준 총 급여가 1,800만원에서 2,310만원으로 늘어난다는 것이 정부 제시 수치다. 실제 금액은 통상임금에 따라 달라진다.",
      },
      evidenceMethod: "official_estimate",
      assumptions: [
        "정부가 제시한 1,800만원→2,310만원은 상한액을 모두 받는 경우의 대표값이다. 통상임금이 상한에 못 미치면 증가폭이 작아진다.",
        "개인의 통상임금을 묻지 않으므로 금액을 개인별로 계산하지 않는다. 기준소득월액 질문은 국민연금 보험료 산식용이며 이 급여 산식에 그대로 쓸 수 없다.",
      ],
      uncertainties: [
        "본인의 통상임금 수준에 따라 실제 증가액이 크게 달라지는데, 이를 계산할 법정 산식 계산기가 아직 등록돼 있지 않다.",
        "'6+6 부모육아휴직제'처럼 부모가 함께 쓸 때 적용되는 별도 상한 구조가 개인의 사용 순서·시점에 따라 달라진다.",
      ],
      legalBasis: [S_BRIEFING, S_MOEL_STATS],
      reviewedAt: REVIEWED,
    },
    {
      id: "ple-spouse-leave",
      billSlug: BILL,
      title: "배우자 출산휴가가 10일에서 20일로 늘어남",
      relationship: "self",
      domain: "care_education_health",
      direction: "benefit",
      timeframe: "current",
      appliesFrom: "2025-02-23",
      conditions: [
        {
          field: "economicRoles",
          operator: "includes",
          value: "employee",
          role: "required",
          explanation: "임금을 받고 일하는 근로자여야 합니다.",
        },
        {
          field: "householdAdults",
          operator: "withinRange",
          value: { min: 2, max: null },
          role: "required",
          explanation: "출산하는 배우자가 있어야 적용되는 휴가입니다.",
        },
        {
          field: "childAgeBands",
          operator: "includes",
          value: "child_0_5",
          role: "informative",
          explanation:
            "이미 태어난 자녀가 아니라 앞으로의 출산에도 적용되므로, 자녀가 없어도 해당될 수 있습니다.",
        },
      ],
      baseline: BASELINE,
      baselineVersion: BASELINE_VERSION,
      mechanism:
        "배우자가 출산한 근로자가 쓸 수 있는 휴가가 10일에서 20일로 늘고, 사용 기한이 출산 후 90일에서 120일로 연장되며, 네 번까지 나눠 쓸 수 있다. 중소기업(우선지원대상기업) 근로자에 대한 정부 급여지원 기간도 5일에서 20일로 늘어, 휴가는 있는데 사업장이 감당하지 못해 못 쓰던 구간을 줄이려는 설계다.",
      magnitude: {
        kind: "qualitative_only",
        eligibilityChange:
          "쓸 수 있는 휴가가 10일에서 20일로 늘고, 출산 후 120일 이내에 네 번까지 나눠 쓸 수 있다.",
      },
      evidenceMethod: "statutory_rule",
      assumptions: [
        "성별을 묻지 않으므로 '배우자가 출산하는 쪽'인지는 판정하지 않는다. 가구에 성인이 둘 이상이라는 조건까지만 확인한다.",
        "출산 예정 여부를 묻지 않는다. 현재 자녀가 없어도 앞으로 해당될 수 있어 자녀 조건은 판정을 바꾸지 않는 참고 항목으로 둔다.",
      ],
      uncertainties: [
        "실제 사용 여부는 사업장 관행에 크게 좌우되며, 개정 이후 사용률 변화를 보여주는 자료를 확보하지 못했다.",
        "가구에 성인이 둘 이상이어도 배우자 관계가 아닐 수 있어, 조건 충족이 곧 적용을 뜻하지는 않는다.",
      ],
      legalBasis: [S_MOEL_PASS, S_MOEL_CARD],
      reviewedAt: REVIEWED,
    },
    {
      id: "ple-reduced-hours",
      billSlug: BILL,
      title: "휴직 대신 근로시간을 줄여 돌볼 수 있는 자녀 연령이 초6까지 넓어짐",
      relationship: "self",
      domain: "employment",
      direction: "benefit",
      timeframe: "current",
      appliesFrom: "2025-02-23",
      conditions: [
        {
          field: "economicRoles",
          operator: "includes",
          value: "employee",
          role: "required",
          explanation: "임금을 받고 일하는 근로자여야 합니다.",
        },
        {
          field: "childAgeBands",
          operator: "includes",
          value: REDUCED_HOURS_CHILDREN,
          role: "required",
          explanation:
            "만 12세 이하 또는 초등학교 6학년 이하의 자녀가 있어야 합니다.",
        },
      ],
      baseline: BASELINE,
      baselineVersion: BASELINE_VERSION,
      mechanism:
        "육아기 근로시간 단축을 쓸 수 있는 자녀 연령이 만 8세(초2)에서 만 12세(초6)로 올라가고, 최대 사용 기간은 3년, 최소 사용 단위는 3개월에서 1개월로 줄었다. 경력을 끊지 않고 일하면서 돌볼 수 있는 선택지가 넓어지는 대신, 근로시간이 줄어든 만큼 임금도 줄어들기 때문에 소득 측면은 별개로 봐야 한다.",
      magnitude: {
        kind: "qualitative_only",
        eligibilityChange:
          "초등학교 고학년(만 12세·초6)까지 근로시간 단축을 신청할 수 있고, 한 달 단위로도 쓸 수 있다.",
      },
      evidenceMethod: "statutory_rule",
      assumptions: [
        "권리의 확대만 판정한다. 단축 시간만큼의 임금 감소와 정부 지원금의 차액은 개인의 임금 수준에 달려 있어 여기서 계산하지 않는다.",
      ],
      uncertainties: [
        "만 12~17세 밴드는 법이 쓰는 경계(만 12세·초6)를 걸치므로, 실제 대상 여부는 자녀의 정확한 나이와 학년에 달려 있다.",
        "대상 확대 이후 실제 사용 실적을 보여주는 자료가 아직 제한적이다.",
      ],
      legalBasis: [S_MOEL_CARD, S_MOEL_PASS],
      reviewedAt: REVIEWED,
    },
    {
      id: "ple-employer-staffing",
      billSlug: BILL,
      title: "사업주로서 결원을 메워야 하는 기간이 길어짐",
      relationship: "self",
      domain: "employment",
      direction: "burden",
      timeframe: "current",
      appliesFrom: "2025-02-23",
      conditions: [
        {
          field: "economicRoles",
          operator: "includes",
          value: "employer",
          role: "required",
          explanation: "직원을 고용한 사업주여야 합니다.",
        },
      ],
      baseline: BASELINE,
      baselineVersion: BASELINE_VERSION,
      mechanism:
        "휴직·휴가·단축근무 기간이 길어지면 그만큼 자리를 비우는 기간도 길어진다. 급여는 고용보험이 지급하므로 사업주가 임금을 직접 부담하지는 않지만, 대체인력을 뽑고 가르치는 일과 그 사이의 업무 재배분은 사업장의 몫이다. 요건을 갖춘 신청은 거부할 수 없어, 인력 운영으로만 대응해야 한다.",
      magnitude: {
        kind: "qualitative_only",
        eligibilityChange:
          "요건을 갖춘 신청을 거부할 수 없고, 대체인력 확보 기간이 최대 1년 6개월까지 길어질 수 있다.",
      },
      evidenceMethod: "qualitative_pathway",
      assumptions: [
        "사업장 규모와 업종을 묻지 않는다. 부담의 크기는 규모가 작을수록 커지지만 이를 판정하지 않는다.",
        "대체인력 지원금 등 정부 지원을 받는 경우 부담이 일부 상쇄되지만, 수급 여부를 묻지 않는다.",
      ],
      uncertainties: [
        "사업장 규모별로 실제 인력 운영 부담이 얼마나 차이 나는지에 대한 공식 조사를 확보하지 못했다.",
        "대체인력 지원제도가 실제 결원 대응에 얼마나 기여했는지 측정한 자료가 없다.",
      ],
      legalBasis: [S_MOEL_PASS, S_BRIEFING],
      reviewedAt: REVIEWED,
    },
  ],
};
