import type { Source } from "@/types/bill";
import type { BillImpactData } from "@/types/impact";

// 국민연금 개혁(2025) 개인 영향경로.
//
// 편집 원칙 (docs/personalized-bill-impact-plan.md §16)
// - 생활영역 하나당 경로 하나로 쪼갠다. 현재 보험료(social_insurance)와
//   미래 급여(disposable_income)는 시점도 영역도 달라 반드시 다른 경로다. (§15)
// - "내가 사업주로서 내는 돈"과 "내 고용주가 내는 돈이 나에게 전가되는 것"은
//   반드시 다른 경로다. 앞은 relationship: self, 뒤는 employer. (§7.3)

const BILL = "national-pension-reform-2025";
const REVIEWED = "2026-08-17";
const BASELINE_VERSION = "국민연금법 2025-03-20 개정법률 / 2026-01-01 시행 기준";
const BASELINE = "개정 전 보험료율 9%, 명목 소득대체율 40% 구조";

const S_NPS: Source = {
  label: "국민연금 온에어: 국민연금 보험료율, 내년부터 13%로 오른다고?",
  publisher: "국민연금공단",
  type: "공식통계",
  url: "https://www.npsonair.kr/finance/detail.html?strIdx=3709",
};

const S_LAW: Source = {
  label: "'국민연금법' 개정안 국회 통과, 2026년부터 보험료율 올라",
  publisher: "법무법인 대륜",
  type: "언론보도",
  url: "https://www.daeryunlaw.com/newsletter/amendment/144",
};

const S_NABO: Source = {
  label: "(2025년) 「국민연금법」 개정의 재정 및 정책효과 분석",
  publisher: "국회입법조사처",
  type: "연구자료",
  url: "https://nsp.nanet.go.kr/plan/subject/detail.do?nationalPlanControlNo=PLAN0000053220",
};

const S_KB: Source = {
  label: "국민연금 개혁안 정리! 보험료율, 소득대체율 의미는?",
  publisher: "KB의 생각",
  type: "언론보도",
  url: "https://kbthink.com/main/asset-management/wealth-manage-tip/kbthink-original/202503/third-national-pension.html",
};

const S_SUMMARY: Source = {
  label: "국민연금 개혁 2026 — 보험료율 인상·소득대체율 43% 변경사항 총정리",
  publisher: "기독일보",
  type: "언론보도",
  date: "2025",
  url: "https://www.christiandaily.co.kr/news/159948",
};

/** 국민연금 가입 대상 연령: 만 18세 이상 60세 미만 */
const INSURABLE_AGE = { min: 18, max: 59 } as const;

export const nationalPensionImpact: BillImpactData = {
  review: {
    billSlug: BILL,
    reviewedAt: REVIEWED,
    baselineVersion: BASELINE_VERSION,
  },
  pathways: [
    {
      id: "nps-employee-contribution",
      billSlug: BILL,
      title: "직장가입자 본인 부담 보험료 인상",
      relationship: "self",
      domain: "social_insurance",
      direction: "burden",
      timeframe: "current",
      appliesFrom: "2026-01-01",
      conditions: [
        {
          field: "economicRoles",
          operator: "includes",
          value: "employee",
          role: "required",
          explanation: "임금을 받고 일하는 직장가입자여야 합니다.",
        },
        {
          field: "ageBand",
          operator: "withinRange",
          value: { min: INSURABLE_AGE.min, max: INSURABLE_AGE.max },
          role: "required",
          explanation:
            "국민연금 사업장가입 대상 연령(만 18세 이상 60세 미만)이어야 합니다.",
        },
        {
          field: "pensionStatus",
          operator: "equals",
          value: "receiving",
          role: "excluding",
          explanation:
            "이미 연금을 받고 있다면 보험료를 더 내는 대상이 아닙니다.",
        },
        {
          field: "monthlyStandardIncome",
          operator: "withinRange",
          value: { min: 0, max: null },
          role: "informative",
          explanation:
            "보험료 금액을 실제로 계산하려면 본인 세전 월소득이 필요합니다.",
        },
      ],
      baseline: BASELINE,
      baselineVersion: BASELINE_VERSION,
      mechanism:
        "보험료율이 2026년 9.5%로 오르고 2033년 13%까지 매년 0.5%p씩 단계 인상된다. 직장가입자는 근로자와 사업주가 절반씩 부담하므로 본인 부담률은 4.5%에서 4.75%(2026년)로 시작해 2033년 6.5%가 된다.",
      magnitude: {
        kind: "statutory_calculation",
        calculatorId: "nps-contribution",
        unit: "KRW_month",
      },
      evidenceMethod: "statutory_rule",
      assumptions: [
        "기준소득월액을 본인 세전 월소득과 같다고 본다.",
        "2026년 보험료율 9.5%, 본인 부담 절반을 적용한다.",
      ],
      uncertainties: [
        "기준소득월액 상·하한(공단 고시)은 계산에 반영하지 않았다. 상한을 넘는 소득에서는 실제 부담이 계산값보다 작다.",
        "납부예외·경력단절 등으로 실제 납부 개월 수가 달라질 수 있다.",
      ],
      legalBasis: [S_NPS, S_LAW],
      reviewedAt: REVIEWED,
    },
    {
      id: "nps-regional-contribution",
      billSlug: BILL,
      title: "지역가입자 보험료 전액 부담 증가",
      relationship: "self",
      domain: "social_insurance",
      direction: "burden",
      timeframe: "current",
      appliesFrom: "2026-01-01",
      conditions: [
        {
          field: "economicRoles",
          operator: "includes",
          value: "self_employed",
          role: "required",
          explanation: "고용원 없이 일하는 자영업자여야 합니다.",
        },
        {
          field: "ageBand",
          operator: "withinRange",
          value: { min: INSURABLE_AGE.min, max: INSURABLE_AGE.max },
          role: "required",
          explanation:
            "국민연금 지역가입 대상 연령(만 18세 이상 60세 미만)이어야 합니다.",
        },
        {
          field: "pensionStatus",
          operator: "equals",
          value: "receiving",
          role: "excluding",
          explanation:
            "이미 연금을 받고 있다면 보험료를 더 내는 대상이 아닙니다.",
        },
      ],
      baseline: BASELINE,
      baselineVersion: BASELINE_VERSION,
      mechanism:
        "지역가입자는 사업주 부담분이 없어 보험료 전액을 본인이 낸다. 따라서 인상분 0.5%p가 그대로 본인 부담이 된다.",
      magnitude: {
        kind: "statutory_calculation",
        calculatorId: "nps-contribution",
        unit: "KRW_month",
      },
      evidenceMethod: "statutory_rule",
      assumptions: [
        "기준소득월액을 본인 세전 월소득과 같다고 본다.",
        "2026년 보험료율 9.5%, 전액 본인 부담을 적용한다.",
      ],
      uncertainties: [
        "지역가입자의 기준소득월액은 신고 소득으로 정해지며 세전 월소득과 다를 수 있다.",
        "납부예외 신청 여부에 따라 실제 부담이 달라진다.",
      ],
      legalBasis: [S_NPS, S_SUMMARY],
      reviewedAt: REVIEWED,
    },
    {
      id: "nps-owner-payroll-cost",
      billSlug: BILL,
      title: "사업주가 직접 부담하는 사업장 보험료 증가",
      relationship: "self",
      domain: "social_insurance",
      direction: "burden",
      timeframe: "current",
      appliesFrom: "2026-01-01",
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
        "사업장가입자의 보험료는 근로자와 사업주가 절반씩 낸다. 요율이 오르면 사업주 부담분도 같은 폭으로 올라 인건비가 늘어난다. 이 경로는 사용자가 '본인이 사업주'인 경우이므로 전가 경로(nps-employer-passthrough)와 별도로 둔다.",
      magnitude: { kind: "qualitative_only" },
      evidenceMethod: "statutory_rule",
      assumptions: [
        "고용 인원과 임금 수준을 묻지 않으므로 금액은 계산하지 않는다.",
      ],
      uncertainties: [
        "고용 규모·임금 수준을 받지 않아 사업장 단위 증가액은 계산할 수 없다.",
        "두루누리 등 보험료 지원 사업 대상이면 실제 부담이 줄어든다.",
      ],
      legalBasis: [S_NPS, S_LAW],
      reviewedAt: REVIEWED,
    },
    {
      id: "nps-employer-passthrough",
      billSlug: BILL,
      title: "고용주 보험료 부담 증가가 임금·고용으로 전가될 가능성",
      relationship: "employer",
      domain: "employment",
      direction: "unknown",
      timeframe: "short_term",
      appliesFrom: "2026-01-01",
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
        "사업주가 법적으로 내는 보험료 인상분은 임금 인상 억제·고용 조정·가격 전가 등을 통해 근로자에게 옮겨갈 수 있다. 다만 얼마나, 언제 옮겨가는지는 이 개정만으로 정해지지 않는다. 법적 부담자와 경제적 부담자를 구분해야 하므로 이 경로는 개인의 직접 부담으로 단정하지 않는다.",
      magnitude: { kind: "qualitative_only" },
      evidenceMethod: "qualitative_pathway",
      assumptions: [
        "전가율을 추정할 국내 대표자료가 없어 방향을 정하지 않는다.",
      ],
      uncertainties: [
        "보험료 인상분의 임금 전가율에 대한 국내 실증 근거가 부족하다.",
        "전가가 임금·고용·가격 중 어디로 나타나는지는 업종과 노동시장 상황에 따라 다르다.",
      ],
      legalBasis: [S_NABO, S_NPS],
      reviewedAt: REVIEWED,
    },
    {
      id: "nps-future-benefit",
      billSlug: BILL,
      title: "명목 소득대체율 43% 상향에 따른 미래 급여 방향",
      relationship: "self",
      domain: "disposable_income",
      direction: "benefit",
      timeframe: "long_term",
      appliesFrom: "2026-01-01",
      conditions: [
        {
          field: "economicRoles",
          operator: "includes",
          value: ["employee", "self_employed", "employer"],
          role: "required",
          explanation: "국민연금에 보험료를 내는 가입자여야 합니다.",
        },
        {
          field: "ageBand",
          operator: "withinRange",
          value: { min: INSURABLE_AGE.min, max: INSURABLE_AGE.max },
          role: "required",
          explanation: "아직 가입 기간이 남은 연령(만 18세 이상 60세 미만)이어야 합니다.",
        },
        {
          field: "pensionStatus",
          operator: "equals",
          value: "receiving",
          role: "excluding",
          explanation:
            "이미 연금을 받고 있다면 이번 소득대체율 상향은 소급되지 않습니다.",
        },
      ],
      baseline: BASELINE,
      baselineVersion: BASELINE_VERSION,
      mechanism:
        "연금액 산정식의 기준 비율이 40%에서 43%로 올라, 앞으로 산정되는 급여가 개정 전 산식보다 높아진다. 방향은 법정 산식에서 확인되지만, 개인이 실제로 받게 될 금액은 가입 기간·소득 이력·수급 개시 시점에 따라 달라져 계산하지 않는다.",
      magnitude: {
        kind: "qualitative_only",
        eligibilityChange:
          "급여 산정식의 기준 비율이 40%에서 43%로 상향된다. 개인별 금액은 가입 이력이 있어야 계산할 수 있다.",
      },
      evidenceMethod: "statutory_rule",
      assumptions: [
        "지금 보험료를 더 내는 부담과 미래 급여 증가를 하나의 순이익으로 합치지 않는다. 합치려면 기대수명·임금경로·할인율 등 별도 가정이 필요하다. (§8.3)",
      ],
      uncertainties: [
        "개인별 급여 증가액은 가입 기간과 생애 소득 이력이 있어야 계산할 수 있다.",
        "2064년 이후 재정 상황에 따라 추가 개혁이 이뤄지면 실제 수령액이 달라질 수 있다.",
      ],
      legalBasis: [S_SUMMARY, S_NABO],
      reviewedAt: REVIEWED,
    },
    {
      id: "nps-current-recipient-no-change",
      billSlug: BILL,
      title: "이미 연금을 받고 있는 경우 — 소급 적용 없음",
      relationship: "self",
      domain: "disposable_income",
      direction: "no_direct_change",
      timeframe: "current",
      conditions: [
        {
          field: "pensionStatus",
          operator: "equals",
          value: "receiving",
          role: "required",
          explanation: "이미 국민연금을 받고 있어야 합니다.",
        },
      ],
      baseline: BASELINE,
      baselineVersion: BASELINE_VERSION,
      mechanism:
        "이번 소득대체율 인상은 앞으로 산정되는 급여에 적용되는 구조이며, 이미 수급 중인 사람의 연금액에 소급되지 않는다. 보험료 인상 역시 수급자에게는 적용되지 않는다. 즉 검토 범위 안에서 직접 변화가 없다는 근거가 있는 경우이며, '자료가 없어서 모른다'와는 다른 상태다.",
      magnitude: { kind: "qualitative_only" },
      evidenceMethod: "statutory_rule",
      assumptions: [
        "기존 수급자에 대한 물가연동 인상 등 개정과 무관한 변동은 이 경로의 검토 범위 밖이다.",
      ],
      uncertainties: [
        "향후 구조개혁 논의에서 기수급자 급여 조정이 다뤄질 가능성은 남아 있다.",
      ],
      legalBasis: [S_KB, S_SUMMARY],
      reviewedAt: REVIEWED,
    },
  ],
};
