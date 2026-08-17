// 영향 지도 — 6범주 완전 분할과 매트릭스 셀 판정. §9.2 · §9.3

import type { ImpactDomain } from "@/types/impact";
import type { BillRelevance, PathwayEvaluation } from "./match";

/** 영향 방향 상태. 기호는 이 표에서 벗어나 쓰지 않는다. §5.2 */
export type CellState =
  | "benefit" // +
  | "burden" // −
  | "mixed" // ±
  | "no_change" // 0
  | "insufficient" // ?
  | "not_applicable"; // ·

export const CELL_SYMBOL: Record<CellState, string> = {
  benefit: "+",
  burden: "−",
  mixed: "±",
  no_change: "0",
  insufficient: "?",
  not_applicable: "·",
};

export const CELL_LABEL: Record<CellState, string> = {
  benefit: "혜택 방향",
  burden: "부담 방향",
  mixed: "상반·시점별 다름",
  no_change: "확인된 직접 변화 없음",
  insufficient: "판단자료 부족",
  not_applicable: "검토 대상 아님",
};

export const CELL_DESCRIPTION: Record<CellState, string> = {
  benefit: "현금 증가, 부담 감소, 권리·접근성 개선 등 긍정 경로가 확인됐습니다.",
  burden:
    "세금·보험료·가격·시간부담 증가, 권리·접근성 축소 등 부정 경로가 확인됐습니다.",
  mixed: "같은 조건에서 혜택과 부담이 함께 있거나, 단기와 장기의 방향이 다릅니다.",
  no_change: "검토 범위 안에서 직접 변화가 없다는 근거가 있습니다.",
  insufficient: "방향이나 규모를 판정할 근거가 부족합니다. 영향이 없다는 뜻이 아닙니다.",
  not_applicable: "이 법안에는 해당 생활영역 경로 자체가 없습니다.",
};

/**
 * 일치 경로들의 방향으로부터 상태를 정한다. §9.3
 *
 * 방향이 확인된 경로가 하나라도 있으면 그 방향으로 판정하고,
 * 남은 `unknown` 경로는 셀을 흐리지 않고 상세에 "방향 미확정 경로 n건"으로 표기한다.
 * 그렇게 하지 않으면 근거가 하나 늘 때마다 셀이 `?`로 후퇴하는 이상한 동작이 나온다.
 */
export function directionsToState(evaluations: PathwayEvaluation[]): CellState {
  if (evaluations.length === 0) return "not_applicable";

  const directions = new Set(
    evaluations
      .map((e) => e.pathway.direction)
      .filter((d) => d !== "unknown"),
  );

  if (directions.size === 0) return "insufficient";
  if (directions.size === 1) {
    const only = [...directions][0];
    if (only === "benefit") return "benefit";
    if (only === "burden") return "burden";
    if (only === "no_direct_change") return "no_change";
    return "mixed"; // {mixed}
  }
  return "mixed";
}

/** 셀 하나 = (법안, 생활영역) 쌍. §9.3 */
export function cellState(
  relevance: BillRelevance,
  domains: ImpactDomain[],
): CellState {
  const paths = relevance.matched.filter((e) =>
    domains.includes(e.pathway.domain),
  );
  return directionsToState(paths);
}

/** 셀 상세에 필요한 부속 정보 */
export interface CellDetail {
  state: CellState;
  paths: PathwayEvaluation[];
  /** 방향 미확정 경로 수 — 셀 기호를 흐리지 않고 여기에만 표기한다 */
  directionUnknownCount: number;
}

export function cellDetail(
  relevance: BillRelevance,
  domains: ImpactDomain[],
): CellDetail {
  const paths = relevance.matched.filter((e) =>
    domains.includes(e.pathway.domain),
  );
  return {
    state: directionsToState(paths),
    paths,
    directionUnknownCount: paths.filter(
      (e) => e.pathway.direction === "unknown",
    ).length,
  };
}

/**
 * 매트릭스 열 묶음. §8.2
 * 9개 열은 데스크톱에서도 넓어서 기본은 5개 묶음으로 보여주고 펼치기로 전체를 연다.
 * 묶음 매핑은 고정 상수다.
 */
export interface DomainGroup {
  id: string;
  label: string;
  /** 좁은 화면용 짧은 이름 */
  short: string;
  domains: ImpactDomain[];
}

export const DOMAIN_GROUPS: DomainGroup[] = [
  {
    id: "income",
    label: "소득·세금·생활비",
    short: "소득",
    domains: ["disposable_income", "tax", "social_insurance", "living_cost"],
  },
  {
    id: "employment",
    label: "고용·임금·근로조건",
    short: "고용",
    domains: ["employment"],
  },
  {
    id: "service",
    label: "서비스·돌봄",
    short: "서비스",
    domains: ["service_access", "care_education_health"],
  },
  {
    id: "time",
    label: "신청·행정 부담",
    short: "시간",
    domains: ["administrative_time"],
  },
  {
    id: "rights",
    label: "권리·법적 보호",
    short: "권리",
    domains: ["rights_risk"],
  },
];

/** 전체 9개 열을 펼쳤을 때의 순서. DOMAIN_GROUPS의 나열 순서를 그대로 따른다. */
export const ALL_DOMAINS: ImpactDomain[] = DOMAIN_GROUPS.flatMap(
  (g) => g.domains,
);

/** 요약 집계의 6범주. 상호배타적이고 전수적이다. §9.2 */
export type SummaryBucket =
  | "benefit"
  | "burden"
  | "mixed"
  | "no_change"
  | "insufficient"
  | "unrelated";

export const BUCKET_LABEL: Record<SummaryBucket, string> = {
  benefit: "혜택 방향",
  burden: "부담 방향",
  mixed: "상반·시점별 다름",
  no_change: "확인된 직접 변화 없음",
  insufficient: "판단자료 부족",
  unrelated: "내 조건과 연결 없음",
};

export const BUCKET_ORDER: SummaryBucket[] = [
  "benefit",
  "burden",
  "mixed",
  "no_change",
  "insufficient",
  "unrelated",
];

/**
 * 법안 하나를 6범주 중 정확히 하나에 넣는다. §9.2
 *
 * `{benefit, no_direct_change}`처럼 표에 명시되지 않은 조합은 §9.3의 셀 규칙과
 * 똑같이 `상반·시점별 다름`으로 떨어진다. 요약 줄과 매트릭스가 서로 다른 말을
 * 하지 않게 하기 위해서다.
 */
export function bucketOf(relevance: BillRelevance): SummaryBucket {
  if (relevance.relevance === "none") return "unrelated";
  if (relevance.relevance === "undecidable") return "insufficient";

  const state = directionsToState(relevance.matched);
  switch (state) {
    case "benefit":
      return "benefit";
    case "burden":
      return "burden";
    case "mixed":
      return "mixed";
    case "no_change":
      return "no_change";
    // 일치 경로가 있는데 방향이 모두 unknown인 경우와,
    // 일치 경로가 하나도 없는 경우(관련성이 none/undecidable이 아니면 생기지 않는다)
    default:
      return "insufficient";
  }
}

export type BucketCounts = Record<SummaryBucket, number>;

/**
 * 전체 법안을 6범주로 완전 분할한다.
 * Σ(6개 범주 건수) === 전체 법안 수 N 이 항상 성립한다. (§17.1 속성 테스트)
 */
export function partitionBills(
  relevances: BillRelevance[],
): { counts: BucketCounts; bySlug: Map<string, SummaryBucket>; total: number } {
  const counts: BucketCounts = {
    benefit: 0,
    burden: 0,
    mixed: 0,
    no_change: 0,
    insufficient: 0,
    unrelated: 0,
  };
  const bySlug = new Map<string, SummaryBucket>();
  for (const r of relevances) {
    const bucket = bucketOf(r);
    counts[bucket] += 1;
    bySlug.set(r.billSlug, bucket);
  }
  return { counts, bySlug, total: relevances.length };
}
