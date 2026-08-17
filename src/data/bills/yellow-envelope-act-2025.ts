import type { Bill } from "@/types/bill";

export const yellowEnvelopeAct2025: Bill = {
  slug: "yellow-envelope-act-2025",
  title: "노동조합 및 노동관계조정법 2·3조 개정안 (노란봉투법)",
  shortTitle: "노란봉투법",
  category: "노동",
  tags: ["노동조합법", "손해배상", "하청노동자", "노란봉투법"],
  status: "시행",
  passedDate: "2025-08-24",
  promulgatedDate: "2025-09-12",
  effectiveDate: "2026-03-10",
  lastUpdated: "2026-08-16",

  summary30s:
    "하청·특수고용 노동자에 대해 실질적 지배력을 행사하는 원청도 단체교섭 상대방인 '사용자'로 인정하고, 파업으로 인한 손해배상 책임을 노조 전체가 아닌 조합원 개인의 가담 정도에 따라 개별화하는 법이다. 2025년 8월 24일 국회 본회의를 재석 186명 중 찬성 183표로 통과했고, 2026년 3월 10일부터 시행됐다. 경영계는 사용자 개념 확대가 현장의 법적 불확실성을 키운다고 우려하고, 노동계는 원청의 책임 회피를 막는 최소한의 보완이라고 본다.",

  comparison: [
    {
      aspect: "'사용자'의 정의",
      before: "근로계약을 직접 체결한 사업주만 단체교섭의 상대방인 사용자로 인정",
      after: "근로조건에 대해 실질적·구체적인 지배력을 행사하는 원청 등도 사용자로 인정될 수 있음",
      note: "하청·특수고용(플랫폼 배달·택배기사 등) 노동자가 실질적 결정권을 가진 원청에 직접 교섭을 요구할 근거가 생긴다.",
    },
    {
      aspect: "노동쟁의의 대상 범위",
      before: "임금·근로시간 등 근로조건의 결정에 관한 사항으로 좁게 해석",
      after: "해석 범위가 다소 넓어져 근로조건과 밀접히 연관된 사항까지 쟁의 대상이 될 여지 확대",
      note: "경영계는 이 부분이 구조조정 등 경영상 판단까지 쟁의 대상으로 넓힐 수 있다고 우려한다.",
    },
    {
      aspect: "쟁의행위 손해배상 책임",
      before: "노조 및 참여 조합원 전체에게 연대책임을 물어 거액 소송(이른바 '손배가압류') 가능",
      after: "법원이 배상액을 정할 때 조합원 개인의 가담 정도·역할을 고려해 책임을 개별화",
      note: "노조 자체에 대한 손해배상 청구 자체가 금지되는 것은 아니다.",
    },
  ],

  proponentArguments: [
    {
      point: "실질적 사용자와 교섭해야 노동3권이 실질적으로 보장된다",
      detail:
        "하청업체는 임금·근로조건에 대한 실질적 결정권이 없는 경우가 많아, 정작 결정권을 가진 원청과 교섭할 길이 없던 하청·특수고용 노동자에게 실질적인 교섭 상대방을 열어준다는 것이 노동계의 핵심 논리다.",
      claimType: "official_claim",
      attribution: "노동계(민주노총·한국노총 등)",
      source: {
        label: "노동조합 및 노동관계조정법 일부개정법률안(노란봉투법)의 주요 내용",
        publisher: "법률신문",
        type: "언론보도",
        url: "https://www.lawtimes.co.kr/LawFirm-NewsLetter/212819",
      },
    },
    {
      point: "손배가압류가 조합원 개인의 삶을 파괴하는 수단으로 남용돼 왔다",
      detail:
        "쟁의행위에 대해 노조와 조합원 전원에게 거액의 연대 손해배상을 청구하는 관행이 개별 조합원의 생계와 가정을 위협하는 수단으로 쓰여왔다는 것이 법 개정의 계기가 된 문제의식이다. '노란봉투법'이라는 이름 자체가 손배가압류에 시달린 노동자를 돕기 위한 시민 모금(노란 봉투)에서 유래했다.",
      claimType: "official_claim",
      attribution: "노동계 및 발의 측",
      source: {
        label: "노란봉투법",
        publisher: "위키백과",
        type: "기타",
        url: "https://ko.wikipedia.org/wiki/%EB%85%B8%EB%9E%80%EB%B4%89%ED%88%AC%EB%B2%95",
      },
    },
  ],

  opponentArguments: [
    {
      point: "사용자 개념이 모호해져 예측 불가능한 분쟁이 늘어날 것",
      detail:
        "'실질적·구체적 지배력'이라는 기준 자체가 사건마다 법원 판단에 좌우될 수밖에 없어, 어디까지가 사용자성 인정 범위인지 기업이 사전에 예측하기 어렵다는 것이 경영계의 핵심 우려다.",
      claimType: "official_claim",
      attribution: "경영계(경총·대한상의 등)",
      source: {
        label: "노란봉투법, 기업의 법적 리스크와 대응 방법",
        publisher: "법무법인 대륜",
        type: "언론보도",
        url: "https://www.daeryunlaw-comp.com/lawInfo_new/9426",
      },
    },
    {
      point: "원청이 다수 하청노조의 개별 교섭 요구에 노출될 수 있다",
      detail:
        "교섭창구 단일화 절차가 법에 명확히 규정되지 않은 상태에서 원청의 사용자성이 인정되면, 여러 하청업체 노조가 동시에 원청에 교섭을 요구하는 상황에서 법적 혼란이 생길 수 있다는 지적이다.",
      claimType: "forecast",
      attribution: "경영계",
      source: {
        label: "노란봉투법의 뜻과 주요 쟁점 3가지, 현황 정리",
        publisher: "법무법인 대륜",
        type: "언론보도",
        url: "https://www.daeryunlaw-labor.com/lawInfo_new/2174",
      },
    },
    {
      point: "손해배상 실효성이 약화돼 불법 쟁의행위 억제력이 떨어질 것",
      detail:
        "책임 개별화로 조합원 개인에 대한 청구는 가능하지만 기업이 개인별 가담 정도를 입증해야 하는 부담이 커져, 사실상 손해배상 청구의 실효성이 약해질 수 있다는 우려다.",
      claimType: "forecast",
      attribution: "경영계",
    },
  ],

  mechanismSummary:
    "노동조합이 원청에 교섭을 요구할 때, 원청이 하청 노동자의 근로조건에 실질적 지배력을 행사한다고 인정되면 원청은 교섭에 응할 의무를 진다. 응하지 않으면 부당노동행위 구제신청의 대상이 될 수 있다. 쟁의행위로 손해가 발생해 소송이 제기되면, 법원은 조합원 개인의 위법행위 가담 정도·역할·손해에 대한 기여도를 심리해 배상 책임 범위를 각자 다르게 산정한다.",
  mechanismSteps: [
    {
      step: "노동조합의 교섭 요구",
      detail: "하청·특수고용 노동자 노조가 원청을 상대로 단체교섭을 요구한다.",
    },
    {
      step: "'사용자성' 판단",
      detail:
        "원청이 실질적·구체적 지배력을 행사하는지가 노동위원회·법원의 개별 판단 대상이 된다. 이 판단 기준이 아직 판례로 충분히 쌓이지 않은 것이 현재의 핵심 불확실성이다.",
    },
    {
      step: "쟁의행위 및 손해 발생 시 책임 산정",
      detail:
        "손해배상 소송에서 법원이 조합원별 가담 정도를 심리해 개별적으로 배상액을 정한다.",
    },
  ],

  beneficiaries: [
    {
      who: "하청·특수고용 노동자 (사내하청, 플랫폼 배달·택배기사 등)",
      how: "근로조건에 실질적 권한이 없는 하청업체가 아니라, 실제 결정권을 가진 원청에 교섭을 요구할 법적 근거를 얻는다.",
      claimType: "fact",
      pathwayId: "yea-subcontract-bargaining",
    },
    {
      who: "손배가압류 위험에 노출됐던 개별 조합원",
      how: "쟁의행위 손해배상 책임이 개인의 가담 정도에 따라 개별화되어, 노조 전체에 대한 연대책임을 이유로 한 개인 대상 거액 청구 위험이 줄어든다.",
      claimType: "fact",
      pathwayId: "yea-liability-individualization",
    },
  ],
  costBearers: [
    {
      who: "원청 기업",
      how: "하청 노동자에 대한 신규 교섭 의무와 사용자성 판단을 둘러싼 법적 분쟁 위험을 새로 부담하게 된다.",
      claimType: "interpretation",
      pathwayId: "yea-principal-employer-cost",
    },
    {
      who: "하청업체",
      how: "원청의 사용자성이 인정되는 사안이 늘어날수록 하청업체 자체의 교섭 당사자로서 입지와 경영자율성이 상대적으로 좁아질 수 있다는 우려가 있다.",
      claimType: "interpretation",
    },
  ],
  fiscalImpact:
    "정부 예산이 직접 투입되는 사업이 아니어서 재정지출에 미치는 직접적 영향은 없다. 다만 산업현장의 분쟁 비용, 소송 비용 등 간접적인 경제적 비용이 발생할 수 있는지는 아직 통계로 확인되지 않는다.",
  sideEffectRisks: [
    "'실질적 지배력'의 판단 기준을 둘러싼 소송·부당노동행위 구제신청의 급증",
    "교섭창구 단일화 절차 미비로 인한 원청-다수 하청노조 간 교섭 혼란",
    "사용자성 인정 범위에 대한 하급심 판단이 엇갈릴 경우의 현장 혼선",
  ],

  evidence: [
    {
      text: "법은 2025년 8월 24일 국회 본회의에서 재석 186명 중 찬성 183표, 반대 3표로 가결됐다.",
      claimType: "fact",
      certainty: "높음",
      source: {
        label: "노란봉투법",
        publisher: "위키백과",
        type: "기타",
        url: "https://ko.wikipedia.org/wiki/%EB%85%B8%EB%9E%80%EB%B4%89%ED%88%AC%EB%B2%95",
      },
    },
    {
      text: "공포 후 6개월이 경과한 2026년 3월 10일부터 시행됐다.",
      claimType: "fact",
      certainty: "높음",
      source: {
        label: "노란봉투법 시행: 노사관계 환경 변화와 기업의 대응 전략",
        publisher: "CODIT Insights",
        type: "언론보도",
        url: "https://thecodit.com/blog/yellow-envelope-act-takes-effect-kr",
      },
    },
    {
      text: "시행을 앞두고 현장에서는 '사용자성'과 교섭단위를 둘러싼 해석이 엇갈리는 상황이 보도됐다.",
      claimType: "fact",
      certainty: "중간",
      source: {
        label: "일주일 남은 노란봉투법… 현장은 사용자성·교섭단위 '해석 전쟁'",
        publisher: "서울신문",
        type: "언론보도",
        date: "2026-03-02",
        url: "https://www.seoul.co.kr/news/society/2026/03/02/20260302032001",
      },
    },
  ],
  uncertainties: [
    "'실질적·구체적 지배력'의 구체적 판단 기준은 아직 충분한 판례가 쌓이지 않아 현장에서 확립되지 않았다.",
    "사용자성 인정 범위를 둘러싼 소송·구제신청 건수의 공식 통계는 아직 정기적으로 공개되지 않고 있다.",
    "손해배상 청구의 실제 인용률·배상액 변화는 시행 이후 판결례가 축적돼야 확인할 수 있다.",
  ],

  analysisFacts: [
    "이번 개정은 사용자 정의 확대와 손해배상 책임 개별화라는 두 가지 조항 변경으로 구성된다.",
    "시행 시점을 전후해 현장에서는 사용자성·교섭단위 해석을 둘러싼 혼란이 실제로 보도됐다.",
    "노사 양측이 공식적으로 밝힌 전망은 정반대 방향이며, 아직 어느 쪽도 공식 통계로 확정되지 않았다.",
  ],
  analysisJudgment: [
    "[의견] 이 법은 '노동3권의 실질화'와 '경영 예측가능성'이라는 두 가치가 정면으로 충돌하는 사안이다. 판례가 쌓이기 전까지는 양측의 주장 모두 검증되지 않은 전망으로 다뤄야 한다.",
    "[의견] 시행 직전부터 나타난 해석 분쟁 보도는 경영계가 우려한 '예측 불가능성' 시나리오와 방향이 일치하지만, 이것이 일시적 적응 비용인지 구조적 문제인지는 최소 1년 이상의 데이터가 필요하다.",
  ],

  predictions: [
    {
      id: "yea-1",
      by: "노동계(민주노총 등)",
      date: "2026-03-10",
      claim: "원청과의 직접 교섭이 가능해지면서 하청 노동자의 임금·처우가 개선되고 노사 갈등이 줄어들 것이다.",
      horizon: "1년",
      fallsifiedBy: "하청·특수고용 노동자 임금 및 처우 관련 통계, 노동쟁의 발생 건수",
    },
    {
      id: "yea-2",
      by: "경영계(경총 등)",
      date: "2026-03-10",
      claim: "사용자성을 다투는 소송이 급증하고 기업의 경영 불확실성이 커질 것이다.",
      horizon: "1년",
      fallsifiedBy: "부당노동행위 구제신청·사용자성 관련 소송 건수 통계",
    },
    {
      id: "yea-3",
      by: "입법로그",
      date: "2026-03-10",
      claim: "시행 첫 6개월 동안 사용자성을 다투는 부당노동행위 구제신청·소송이 눈에 띄게 늘고, 노사 양측 모두 초기에는 패소 리스크를 우려해 신중한 태도를 보일 것이다.",
      horizon: "6개월",
      fallsifiedBy: "노동위원회 부당노동행위 구제신청 접수 통계",
    },
  ],

  outcomeTracking: [
    {
      horizon: "6개월",
      checkDate: "2026-08-16",
      status: "판단보류",
      findings:
        "시행 직전인 2026년 3월 초부터 현장에서 사용자성·교섭단위를 둘러싼 '해석 전쟁'이 보도돼, 초기 혼란에 대한 우려(yea-2, yea-3)와 방향은 일치한다. 다만 부당노동행위 구제신청·소송 건수를 집계한 공식 통계가 아직 확인되지 않아, 예측이 실제로 '적중'했다고 판정하기에는 이르다. 노동계가 예측한 임금·처우 개선(yea-1) 효과 역시 아직 검증할 수 있는 공개 데이터가 없다.",
      relatedPredictionIds: ["yea-2", "yea-3"],
      source: {
        label: "일주일 남은 노란봉투법… 현장은 사용자성·교섭단위 '해석 전쟁'",
        publisher: "서울신문",
        type: "언론보도",
        date: "2026-03-02",
        url: "https://www.seoul.co.kr/news/society/2026/03/02/20260302032001",
      },
    },
    {
      horizon: "1년",
      checkDate: "2027-03",
      status: "추적예정",
      findings:
        "시행 1주년 시점에 노동위원회·법원 통계, 하청노동자 처우 관련 조사 결과를 확인해 세 예측(yea-1, yea-2, yea-3)의 적중 여부를 판정할 예정이다.",
    },
    {
      horizon: "3년",
      checkDate: "2029년 예정",
      status: "추적예정",
      findings: "판례 축적 이후 '사용자성' 판단 기준이 실제로 어떻게 정착됐는지 확인할 예정이다.",
    },
  ],

  sources: [
    {
      label: "노동조합 및 노동관계조정법 일부개정법률안(노란봉투법)의 주요 내용",
      publisher: "법률신문",
      type: "언론보도",
      url: "https://www.lawtimes.co.kr/LawFirm-NewsLetter/212819",
    },
    {
      label: "노란봉투법",
      publisher: "위키백과",
      type: "기타",
      url: "https://ko.wikipedia.org/wiki/%EB%85%B8%EB%9E%80%EB%B4%89%ED%88%AC%EB%B2%95",
    },
    {
      label: "[노동] 노동조합 및 노동관계조정법 제2, 3조 개정('노란봉투법')",
      publisher: "법무법인 지평",
      type: "언론보도",
      url: "https://www.jipyong.com/kr/board/news_view.php?seq=14368",
    },
    {
      label: "일주일 남은 노란봉투법… 현장은 사용자성·교섭단위 '해석 전쟁'",
      publisher: "서울신문",
      type: "언론보도",
      date: "2026-03-02",
      url: "https://www.seoul.co.kr/news/society/2026/03/02/20260302032001",
    },
    {
      label: "노란봉투법 시행: 노사관계 환경 변화와 기업의 대응 전략",
      publisher: "CODIT Insights",
      type: "언론보도",
      url: "https://thecodit.com/blog/yellow-envelope-act-takes-effect-kr",
    },
    {
      label: "노란봉투법, 기업의 법적 리스크와 대응 방법",
      publisher: "법무법인 대륜",
      type: "언론보도",
      url: "https://www.daeryunlaw-comp.com/lawInfo_new/9426",
    },
  ],
};
