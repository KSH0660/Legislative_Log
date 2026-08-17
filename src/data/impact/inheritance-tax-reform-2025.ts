import type { Source } from "@/types/bill";
import type { BillImpactData } from "@/types/impact";

// 유산취득세 전환(상속세법 개정안) 개인 영향경로.
//
// 핵심 편집 원칙: 소득을 재산의 대리변수로 쓰지 않는다. (§15)
// 상속 관련성은 현재 소득이 아니라 상속관계를 직접 물어서만 판정한다.
// 아직 국회 심사 단계이므로 모든 문구는 §5.5의 조건부 시제를 따른다.

const BILL = "inheritance-tax-reform-2025";
const REVIEWED = "2026-08-17";
const BASELINE_VERSION =
  "기획재정부 2025-03-19 입법예고안 / 현행 상속세및증여세법 기준";
const BASELINE = "현행 유산세 방식 — 전체 유산액에 누진세율 적용, 일괄공제 5억원, 최고세율 50%";

const S_MOEF: Source = {
  label: "유산취득세 도입을 위한 상속세법 등 입법예고",
  publisher: "기획재정부",
  type: "보도자료",
  date: "2025-03-19",
  url: "https://mofe.go.kr/nw/nes/detailNesDtaView.do?searchBbsId1=MOSFBBS_000000000028&searchNttId1=MOSF_000000000073155&menuNo=4010100",
};

const S_NABO: Source = {
  label: "국회예산정책처 개정세법 2025.12 — 2025년 개정세법 심의 결과 및 주요 내용",
  publisher: "국회예산정책처",
  type: "연구자료",
  url: "https://www.nabo.go.kr/board/file/bulkDown.do?idx=9022&bid=19",
};

const S_KDI: Source = {
  label: "75년 만에 바뀌는 상속세… 유산취득세 도입으로 과세 합리화 기대",
  publisher: "KDI 경제교육·정보센터",
  type: "언론보도",
  url: "https://eiec.kdi.re.kr/publish/naraView.do?fcode=00002000040000100009&cidx=15163&sel_year=2025&sel_month=05",
};

const S_LAWTALK: Source = {
  label: "2028년부터 시행되는 새로운 상속세, 세부 개정 내용 총정리",
  publisher: "로톡",
  type: "언론보도",
  url: "https://www.lawtalk.co.kr/posts/104218",
};

/** 상속 당사자가 될 수 있는 관계 */
const INHERITANCE_PARTIES = ["expected_heir", "in_progress", "bequeather"];

export const inheritanceTaxImpact: BillImpactData = {
  review: {
    billSlug: BILL,
    reviewedAt: REVIEWED,
    baselineVersion: BASELINE_VERSION,
  },
  pathways: [
    {
      id: "ita-acquisition-shift",
      billSlug: BILL,
      title: "과세 단위가 전체 유산에서 상속인별 취득분으로 바뀜",
      relationship: "household",
      domain: "tax",
      direction: "unknown",
      timeframe: "long_term",
      conditions: [
        {
          field: "inheritanceSituation",
          operator: "oneOf",
          value: INHERITANCE_PARTIES,
          role: "required",
          explanation: "상속을 받을 예정이거나 진행 중이거나 물려줄 예정이어야 합니다.",
        },
        {
          field: "householdAdults",
          operator: "withinRange",
          value: { min: 1, max: null },
          role: "informative",
          explanation:
            "상속인이 몇 명인지에 따라 각자의 과세표준 구간이 달라집니다.",
        },
      ],
      baseline: BASELINE,
      baselineVersion: BASELINE_VERSION,
      mechanism:
        "같은 유산이라도 몇 명에게 어떻게 나누느냐에 따라 각자의 과세표준 구간이 달라진다. 상속인이 많을수록 개인별 과세표준이 낮아져 전체 실효세율이 내려가는 구조다. 개인의 세부담이 늘지 줄지는 상속재산 규모와 상속인 구성에 달려 있는데, 입법로그는 재산 정보를 받지 않으므로 방향을 정하지 않는다.",
      magnitude: { kind: "qualitative_only" },
      evidenceMethod: "official_estimate",
      assumptions: [
        "상속재산 규모와 상속인 수를 묻지 않으므로 세액은 계산하지 않는다.",
        "현재 소득 구간을 재산의 대리변수로 쓰지 않는다.",
      ],
      uncertainties: [
        "국회 심사 과정에서 세율·공제 구간 등 세부 수치가 바뀔 수 있다.",
        "시행 목표는 2028년이지만 심사 일정에 따라 달라질 수 있다.",
      ],
      legalBasis: [S_MOEF, S_KDI],
      reviewedAt: REVIEWED,
    },
    {
      id: "ita-deduction-and-rate",
      billSlug: BILL,
      title: "공제 구조 개편과 최고세율 인하",
      relationship: "household",
      domain: "tax",
      direction: "unknown",
      timeframe: "long_term",
      conditions: [
        {
          field: "inheritanceSituation",
          operator: "oneOf",
          value: INHERITANCE_PARTIES,
          role: "required",
          explanation: "상속을 받을 예정이거나 진행 중이거나 물려줄 예정이어야 합니다.",
        },
        {
          field: "childAgeBands",
          operator: "includes",
          value: ["child_0_5", "child_6_11", "child_12_17", "child_18_over"],
          role: "informative",
          explanation:
            "자녀 1인당 5억원 공제로 바뀌므로 자녀 수가 공제 총액을 좌우합니다.",
        },
      ],
      baseline: BASELINE,
      baselineVersion: BASELINE_VERSION,
      mechanism:
        "일괄공제 5억원이 폐지되고 자녀 1인당 5억원 공제가 도입되며, 최고세율이 50%에서 40%로 낮아진다. 자녀가 많은 가구는 공제 총액이 커지지만, 자녀가 없거나 한 명인 경우 일괄공제 폐지로 불리해질 수 있다. 어느 쪽인지는 상속재산 규모와 상속인 구성에 달려 있어 개인 방향을 정하지 않는다.",
      magnitude: { kind: "qualitative_only" },
      evidenceMethod: "official_estimate",
      assumptions: [
        "배우자 공제 확대(10억원까지 법정상속분 초과분도 공제)는 배우자 상속인이 있는 경우에만 작동한다.",
      ],
      uncertainties: [
        "공제액·세율 구간은 국회 심사에서 조정될 수 있다.",
        "실제 세부담 변화 방향은 상속재산 규모별로 갈리며, 이를 판정하려면 재산 정보가 필요하다.",
      ],
      legalBasis: [S_MOEF, S_NABO],
      reviewedAt: REVIEWED,
    },
    {
      id: "ita-filing-burden",
      billSlug: BILL,
      title: "상속인별 개별 신고로 바뀌는 데 따른 절차 부담",
      relationship: "household",
      domain: "administrative_time",
      direction: "unknown",
      timeframe: "long_term",
      conditions: [
        {
          field: "inheritanceSituation",
          operator: "oneOf",
          value: INHERITANCE_PARTIES,
          role: "required",
          explanation: "상속을 받을 예정이거나 진행 중이거나 물려줄 예정이어야 합니다.",
        },
      ],
      baseline: BASELINE,
      baselineVersion: BASELINE_VERSION,
      mechanism:
        "과세 단위가 상속인별 취득분으로 바뀌면 신고·납부도 상속인 각자를 기준으로 이뤄지는 구조가 된다. 신고 단위가 늘어나는 만큼 절차가 번거로워질 수도 있고, 상속인 사이의 세액 배분 다툼이 줄어 오히려 단순해질 수도 있다.",
      magnitude: { kind: "qualitative_only" },
      evidenceMethod: "qualitative_pathway",
      assumptions: [
        "신고·납부 절차의 구체적 설계는 시행령과 국세청 고시에서 정해진다.",
      ],
      uncertainties: [
        "신고 단위·기한 등 절차 세부는 아직 확정되지 않았다.",
        "절차 부담 변화를 측정할 공식 자료가 없다.",
      ],
      legalBasis: [S_LAWTALK, S_KDI],
      reviewedAt: REVIEWED,
    },
  ],
};
