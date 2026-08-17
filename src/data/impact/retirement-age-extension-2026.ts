import type { Source } from "@/types/bill";
import type { BillImpactData } from "@/types/impact";

// 정년 65세 연장 논의 개인 영향경로.
//
// 아직 심사 단계이므로 모든 문구는 §5.5의 조건부 시제로 나간다.
// 방향 판정에서 주의할 점: 이 법안은 정년 연장과 임금체계 개편 특례가 한 묶음이라,
// 근로자 본인에게는 혜택과 부담이 함께 있다. 순이익으로 합치지 않고 `mixed`로 둔다. (§8.3)
//
// 연령 조건의 경계는 법정 정년(만 60세)에서 역산했다. AGE_BANDS가 이 경계에
// 맞춰 설계돼 있어 60_64·65_over는 깔끔하게 false로 떨어진다. (§6.2)

const BILL = "retirement-age-extension-2026";
const REVIEWED = "2026-08-17";
const BASELINE_VERSION =
  "현행 고령자고용법 제19조(정년 60세) / 2026-06 보도 기준 여당 절충안(2029년 61세→2037년 65세)";
const BASELINE =
  "현행 — 법정 정년 만 60세. 정년 이후 재고용 여부는 노사 자율이며, 국민연금 수급 개시 연령은 2033년까지 65세로 상향";

const S_LAW: Source = {
  label: "고용상 연령차별금지 및 고령자고용촉진에 관한 법률 제19조(정년)",
  publisher: "국가법령정보센터",
  type: "법령",
  url: "https://www.law.go.kr/법령/고용상연령차별금지및고령자고용촉진에관한법률/제19조",
};

const S_KHAN: Source = {
  label: "'청년 고용 눈치보기' 정년 연장 숙제, 결국 하반기로 미뤘다",
  publisher: "경향신문",
  type: "언론보도",
  date: "2026-06-30",
  url: "https://www.khan.co.kr/article/202606302129005",
};

const S_KHAN_DELAY: Source = {
  label: "6월 입법도 무산…정년연장 논의, 결국 하반기로",
  publisher: "경향신문",
  type: "언론보도",
  date: "2026-06-30",
  url: "https://www.khan.co.kr/article/202606301608011",
};

const S_LABOR_GAP: Source = {
  label: "[기획좌담회] 해 넘은 정년연장 입법 논의 — 소득공백조차 해소 못해",
  publisher: "매일노동뉴스",
  type: "언론보도",
  url: "https://www.labortoday.co.kr/news/articleView.html?idxno=232066",
};

const S_LABOR_TIERED: Source = {
  label: "정년연장 '규모·산업·업종별 차등화' 꺼낸 국민의힘",
  publisher: "매일노동뉴스",
  type: "언론보도",
  url: "https://www.labortoday.co.kr/news/articleView.html?idxno=232108",
};

/** 정년에 아직 도달하지 않은 연령 구간. 경계는 법정 정년 60세에서 역산했다. */
const BEFORE_RETIREMENT_AGE = { min: 18, max: 59 };

export const retirementAgeImpact: BillImpactData = {
  review: {
    billSlug: BILL,
    reviewedAt: REVIEWED,
    baselineVersion: BASELINE_VERSION,
  },
  pathways: [
    {
      id: "rae-employment-extension",
      billSlug: BILL,
      title: "일할 수 있는 기간은 늘지만 그 기간의 임금은 조정될 수 있음",
      relationship: "self",
      domain: "employment",
      direction: "mixed",
      timeframe: "long_term",
      conditions: [
        {
          field: "economicRoles",
          operator: "includes",
          value: "employee",
          role: "required",
          explanation:
            "법정 정년은 임금을 받고 일하는 근로자에게 적용됩니다. 자영업자에게는 정년 개념이 적용되지 않습니다.",
        },
        {
          field: "ageBand",
          operator: "withinRange",
          value: BEFORE_RETIREMENT_AGE,
          role: "required",
          explanation:
            "아직 현행 법정 정년(만 60세)에 이르지 않은 나이여야 합니다.",
        },
        {
          field: "employmentRelation",
          operator: "includes",
          value: ["regular", "nonregular", "union_member"],
          role: "informative",
          explanation:
            "정년 규정이 실제로 작동하는지는 고용 형태에 따라 다릅니다. 기간제 계약은 정년보다 계약 만료가 먼저 오는 경우가 많습니다.",
        },
      ],
      baseline: BASELINE,
      baselineVersion: BASELINE_VERSION,
      mechanism:
        "법정 정년이 단계적으로 올라가면, 자신이 몇 년생인지에 따라 적용되는 정년이 60세보다 높아진다. 여당 절충안 기준으로는 2029년 61세를 시작으로 2년마다 1세씩 올라 2037년에 65세가 된다. 다만 같은 절충안에는 연장된 기간의 근로시간과 임금체계를 노동조합 동의 없이 취업규칙으로 바꿀 수 있게 하는 특례가 함께 들어 있다. 그래서 고용 기간은 늘어나되 그 기간의 임금 수준은 사업장 판단으로 조정될 수 있고, 두 효과가 같은 사람에게 동시에 온다.",
      magnitude: {
        kind: "qualitative_only",
        eligibilityChange:
          "통과되면 출생연도에 따라 적용 정년이 60세보다 높아진다. 동시에 연장 기간의 임금이 취업규칙 변경으로 조정될 수 있다.",
      },
      evidenceMethod: "qualitative_pathway",
      assumptions: [
        "2026년 6월 보도된 여당 절충안(2029년 61세→2037년 65세, 재고용 병행, 취업규칙 변경 특례)을 기준으로 판정했다. 최종 문안이 아니다.",
        "출생연도를 묻지 않고 연령대만 받으므로, 개인에게 몇 세의 정년이 적용될지는 계산하지 않는다.",
        "혜택(고용 기간)과 부담(임금 조정)을 하나의 순이익으로 합치지 않는다.",
      ],
      uncertainties: [
        "법안 문안이 확정되지 않았다. 단계 일정과 취업규칙 변경 특례의 존치 여부가 모두 협의 대상이다.",
        "기업 규모·업종별 차등 적용이 최종안에 들어갈 경우, 어디서 일하느냐에 따라 적용 여부 자체가 달라진다.",
        "임금이 실제로 얼마나 조정될지는 사업장별 교섭에 달려 있어 사전에 추정할 수 없다.",
      ],
      legalBasis: [S_LAW, S_KHAN],
      reviewedAt: REVIEWED,
    },
    {
      id: "rae-income-gap",
      billSlug: BILL,
      title: "정년과 국민연금 수급 개시 사이의 소득 공백이 줄어듦",
      relationship: "self",
      domain: "disposable_income",
      direction: "benefit",
      timeframe: "long_term",
      conditions: [
        {
          field: "economicRoles",
          operator: "includes",
          value: "employee",
          role: "required",
          explanation: "정년이 적용되는 임금근로자여야 합니다.",
        },
        {
          field: "ageBand",
          operator: "withinRange",
          value: BEFORE_RETIREMENT_AGE,
          role: "required",
          explanation:
            "아직 현행 법정 정년(만 60세)에 이르지 않은 나이여야 합니다.",
        },
        {
          field: "pensionStatus",
          operator: "oneOf",
          value: ["insured_workplace", "insured_regional"],
          role: "informative",
          explanation:
            "국민연금에 가입 중이면 수급 개시 연령과 정년 사이의 간격이 그대로 본인의 소득 공백이 됩니다.",
        },
      ],
      baseline: BASELINE,
      baselineVersion: BASELINE_VERSION,
      mechanism:
        "국민연금 수급 개시 연령은 2033년까지 65세로 올라가도록 이미 정해져 있다. 법정 정년이 60세에 머무르면 그 사이 최대 5년 동안 임금도 연금도 없는 구간이 생긴다. 정년이 단계적으로 올라가면 이 구간이 좁아진다. 다만 절충안대로 2037년에 65세가 완성되면, 수급 개시가 65세가 되는 2033년부터 4년 동안은 공백이 남는다.",
      magnitude: {
        kind: "qualitative_only",
        eligibilityChange:
          "임금이 끊기는 시점과 연금이 시작되는 시점 사이의 간격이 좁아진다. 다만 단계 일정에 따라 완전히 사라지지는 않는다.",
      },
      evidenceMethod: "qualitative_pathway",
      assumptions: [
        "국민연금 수급 개시 연령 상향(2033년 65세)은 이미 확정된 일정이며 이 법안과 무관하게 진행된다고 전제한다.",
        "정년까지 계속 고용이 유지된다고 전제한다. 실제로는 정년 전 이직·퇴직이 흔하다.",
      ],
      uncertainties: [
        "최종 단계 일정이 확정되지 않아 개인별로 공백이 얼마나 줄어드는지 계산할 수 없다.",
        "2033~2037년 사이에 남는 공백에 대한 별도 대책이 마련될지 알 수 없다.",
        "정년까지 고용이 실제로 유지되는 비율에 대한 최신 자료를 확보하지 못했다.",
      ],
      legalBasis: [S_LABOR_GAP, S_KHAN],
      reviewedAt: REVIEWED,
    },
    {
      id: "rae-youth-hiring",
      billSlug: BILL,
      title: "신규 채용 자리가 줄어들 수 있다는 우려",
      relationship: "self",
      domain: "employment",
      direction: "unknown",
      timeframe: "short_term",
      conditions: [
        {
          field: "economicRoles",
          operator: "includes",
          value: "jobseeker",
          role: "required",
          explanation: "일자리를 찾고 있는 상태여야 합니다.",
        },
        {
          field: "ageBand",
          operator: "withinRange",
          value: { min: 18, max: 39 },
          role: "informative",
          explanation:
            "청년 고용 영향이 논의의 중심이지만, 신규 채용 축소 우려 자체는 연령과 무관하게 구직자 전반에 걸립니다.",
        },
      ],
      baseline: BASELINE,
      baselineVersion: BASELINE_VERSION,
      mechanism:
        "기존 인력의 재직 기간이 길어지면 그만큼 자리가 늦게 비고, 신규 채용 여력이 줄어들 수 있다는 것이 반대 측 논리다. 다만 이는 전망이지 관측이 아니다. 정년 연장이 청년 채용을 실제로 얼마나 줄이는지는 임금체계 개편이 함께 이뤄지는지, 기업이 인력을 어떻게 재배치하는지에 따라 달라진다. 이번 법안의 설계(단계 적용+재고용 병행)를 전제로 한 국내 실증 추계를 확보하지 못했으므로 방향을 정하지 않는다.",
      magnitude: { kind: "qualitative_only" },
      evidenceMethod: "qualitative_pathway",
      assumptions: [
        "정년 연장과 청년 채용 사이의 관계를 하나의 방향으로 단정하지 않는다. 근거가 전망뿐이기 때문이다.",
        "구직 중인 상태만 묻고, 지원하는 업종이나 기업 규모는 묻지 않는다.",
      ],
      uncertainties: [
        "이번 법안의 설계를 전제로 한 청년 고용 영향 추계가 없다.",
        "임금체계 개편 특례가 함께 도입되면 인건비 부담이 줄어 채용 위축 효과도 달라지는데, 그 상호작용을 추정한 자료가 없다.",
        "기업 규모·업종별 차등 적용 여부에 따라 영향의 분포가 크게 달라진다.",
      ],
      legalBasis: [S_KHAN, S_LABOR_TIERED],
      reviewedAt: REVIEWED,
    },
    {
      id: "rae-employer-cost",
      billSlug: BILL,
      title: "사업주로서 고임금 구간의 고용 기간이 길어짐",
      relationship: "self",
      domain: "employment",
      direction: "burden",
      timeframe: "long_term",
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
        "근속에 따라 임금이 오르는 연공형 체계에서는 정년이 늘어난 만큼 고임금 구간의 인건비가 그대로 늘어난다. 절충안에 담긴 임금체계 개편 특례와 퇴직 후 재고용 제도는 이 부담을 조정할 수 있게 하려는 장치이지만, 최종안에 어떤 형태로 남을지는 정해지지 않았다. 인력 구조가 얇은 소규모 사업장일수록 한 명의 재직 기간 연장이 신규 채용 여력에 미치는 영향이 크다.",
      magnitude: {
        kind: "qualitative_only",
        eligibilityChange:
          "통과되면 정년 도달 전 직원의 고용을 유지해야 하는 기간이 단계적으로 길어진다.",
      },
      evidenceMethod: "qualitative_pathway",
      assumptions: [
        "사업장의 임금체계(연공형인지 직무급인지)를 묻지 않는다. 부담의 크기는 임금체계에 크게 좌우된다.",
        "사업장 규모와 업종을 묻지 않는다. 차등 적용이 최종안에 들어가면 적용 여부 자체가 달라진다.",
      ],
      uncertainties: [
        "임금체계 개편 특례가 최종안에 남을지 알 수 없고, 남더라도 실제 조정 폭은 사업장별 교섭에 달려 있다.",
        "기업 규모·업종별 차등 적용 여부가 확정되지 않았다.",
        "인건비 증가분에 대한 공식 추계가 법안 미확정으로 존재하지 않는다.",
      ],
      legalBasis: [S_KHAN, S_KHAN_DELAY],
      reviewedAt: REVIEWED,
    },
  ],
};
