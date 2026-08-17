// 경로 매칭과 법안 단위 집계. §7.2 · §7.3 · §7.4
//
// 이 파일의 함수는 React·DOM·전역 상태에 의존하지 않는 순수함수다. (§13.1)

import type {
  BillImpactData,
  ImpactPathway,
  ImpactRelationship,
  ProfileCondition,
} from "@/types/impact";
import type { UserProfile } from "@/types/profile";
import { evaluateCondition, type Tri } from "./conditions";

export type MatchResult =
  | "MATCHED"
  | "PARTIAL"
  | "UNDECIDABLE"
  | "EXCLUDED"
  | "NO_MATCH";

export type Relevance =
  | "direct"
  | "conditional"
  | "indirect"
  | "undecidable"
  | "none";

/**
 * 관련성 강도. §5.1
 * `판단 불가`(1)가 `개인화할 직접 근거 없음`(0)보다 높은 이유는 §4.6이다.
 * "모른다"를 "없다"로 내려 보내지 않는다.
 */
export const RELEVANCE_STRENGTH: Record<Relevance, number> = {
  direct: 4,
  conditional: 3,
  indirect: 2,
  undecidable: 1,
  none: 0,
};

export const RELEVANCE_LABEL: Record<Relevance, string> = {
  direct: "직접 대상",
  conditional: "조건부 대상",
  indirect: "간접 영향 가능",
  undecidable: "판단 불가",
  none: "개인화할 직접 근거 없음",
};

export const RELEVANCE_DESCRIPTION: Record<Relevance, string> = {
  direct: "본인 또는 가구 경로의 필수 조건이 모두 맞고, 제외 조건도 모두 아닙니다.",
  conditional:
    "모순되는 조건은 없지만, 확인되지 않은 조건이 남아 있어 직접 적용 여부를 단정할 수 없습니다.",
  indirect:
    "고용주·소비자·공공 경로로 연결됩니다. 조건이 모두 맞아도 개인에게 얼마나 전가되는지는 별개 문제라 이 상태를 넘지 않습니다.",
  undecidable:
    "법안 문안이나 시행령이 아직 정해지지 않아 경로 자체를 판정할 수 없습니다.",
  none: "개인 생활조건으로 우선순위를 정할 근거가 없다는 뜻이지, 법안이 중요하지 않다는 뜻이 아닙니다.",
};

/** `self`·`household`만 '직접'으로 판정될 수 있다. §7.3 */
export function isDirectRelationship(rel: ImpactRelationship): boolean {
  return rel === "self" || rel === "household";
}

export interface ConditionEvaluation {
  condition: ProfileCondition;
  result: Tri;
}

/**
 * 조건 평가를 가로채는 함수. `whatWouldChange`가 "이 항목에 답했다면"을
 * 가정해 판정을 다시 돌려 보기 위해 쓴다. undefined를 돌려주면 실제 평가를 따른다.
 */
export type ConditionOverride = (condition: ProfileCondition) => Tri | undefined;

/** 조건 전체를 평가한다. 순서는 데이터 순서를 그대로 유지한다(결정론). */
export function evaluateConditions(
  pathway: ImpactPathway,
  profile: UserProfile,
  override?: ConditionOverride,
): ConditionEvaluation[] {
  return pathway.conditions.map((condition) => ({
    condition,
    result: override?.(condition) ?? evaluateCondition(condition, profile),
  }));
}

/**
 * 이미 평가된 조건 결과로부터 매칭 결과를 구한다. §7.2
 * `whatWouldChange`가 조건 결과를 가정해 다시 계산할 수 있도록 분리해 둔다.
 */
export function matchFromEvaluations(
  pathway: ImpactPathway,
  evaluations: ConditionEvaluation[],
): MatchResult {
  // 1. 법안 문안·시행령 미확정
  if (pathway.undecidable) return "UNDECIDABLE";

  // 2. 제외조건
  let excludeUncertain = false;
  for (const { condition, result } of evaluations) {
    if (condition.role !== "excluding") continue;
    if (result === "true") return "EXCLUDED";
    if (result === "unknown") excludeUncertain = true;
  }

  // 3. 필수조건
  let match: MatchResult = "MATCHED";
  for (const { condition, result } of evaluations) {
    if (condition.role !== "required") continue;
    if (result === "false") return "NO_MATCH";
    if (result === "unknown") match = "PARTIAL";
  }

  // 4. 제외조건 확인이 남아 있으면 강등한다.
  //    이 단계가 없으면 "제외 대상인지 아직 모르는 사람"이 직접 대상으로 판정된다.
  if (excludeUncertain && match === "MATCHED") match = "PARTIAL";

  return match;
}

export function matchImpactPathway(
  pathway: ImpactPathway,
  profile: UserProfile,
): MatchResult {
  return matchFromEvaluations(pathway, evaluateConditions(pathway, profile));
}

/**
 * 매칭 결과 × 관계 유형 → 관련성. §7.3
 *
 * 핵심 불변식: `relationship`이 `self`·`household`가 아닌 경로는
 * 조건이 완전히 일치해도 `간접 영향 가능`을 넘지 못한다.
 * 경로가 제외됐으면 null(경로 제외)을 돌려준다.
 */
export function resolveRelevance(
  match: MatchResult,
  relationship: ImpactRelationship,
): Relevance | null {
  if (match === "UNDECIDABLE") return "undecidable";
  if (match === "EXCLUDED" || match === "NO_MATCH") return null;
  if (!isDirectRelationship(relationship)) return "indirect";
  return match === "MATCHED" ? "direct" : "conditional";
}

export interface PathwayEvaluation {
  pathway: ImpactPathway;
  conditions: ConditionEvaluation[];
  match: MatchResult;
  /** 경로가 제외됐으면 null */
  relevance: Relevance | null;
  /** 판정에 쓰인 조건 중 결과가 true인 것 — "일치한 조건" */
  satisfied: ProfileCondition[];
  /** 판정에 쓰인 조건 중 결과가 unknown인 것 — "더 알려주시면" 목록 */
  pending: ProfileCondition[];
}

export function evaluatePathway(
  pathway: ImpactPathway,
  profile: UserProfile,
  override?: ConditionOverride,
): PathwayEvaluation {
  const conditions = evaluateConditions(pathway, profile, override);
  const match = matchFromEvaluations(pathway, conditions);
  const judging = conditions.filter(
    (c) => c.condition.role === "required" || c.condition.role === "excluding",
  );
  return {
    pathway,
    conditions,
    match,
    relevance: resolveRelevance(match, pathway.relationship),
    satisfied: judging
      .filter((c) => c.result === "true" && c.condition.role === "required")
      .map((c) => c.condition),
    pending: judging.filter((c) => c.result === "unknown").map((c) => c.condition),
  };
}

export interface BillRelevance {
  billSlug: string;
  relevance: Relevance;
  strength: number;
  /** 전체 경로 평가 결과 (제외된 것 포함) */
  evaluations: PathwayEvaluation[];
  /** MATCHED 또는 PARTIAL인 경로 */
  matched: PathwayEvaluation[];
  /** 아직 판정할 수 없는 경로. 일치 경로가 있어도 사라지지 않는다. §7.4 */
  undecidable: PathwayEvaluation[];
  /** 일치 경로에 남아 있는 unknown 필수·제외 조건 개수. §7.5 정렬 2번 키 */
  pendingConditionCount: number;
  /** 방향이 확인되지 않은 일치 경로 수. §9.3에서 셀 상세에 별도 표기한다. */
  directionUnknownCount: number;
  review: BillImpactData["review"] | null;
}

/**
 * 경로 평가 결과들로부터 법안 단위 관련성을 구한다. §7.4
 *
 * 일치 경로가 있으면 그중 가장 강한 관련성,
 * 없고 판정 불가 경로만 있으면 `판단 불가`,
 * 둘 다 없으면 `개인화할 직접 근거 없음`. 어떤 입력에서도 값을 돌려주는 전함수다.
 */
export function aggregateRelevance(evaluations: PathwayEvaluation[]): Relevance {
  const matched = evaluations.filter(
    (e) => e.match === "MATCHED" || e.match === "PARTIAL",
  );
  if (matched.length > 0) {
    return matched.reduce<Relevance>((best, e) => {
      const r = e.relevance;
      if (!r) return best;
      return RELEVANCE_STRENGTH[r] > RELEVANCE_STRENGTH[best] ? r : best;
    }, "none");
  }
  if (evaluations.some((e) => e.match === "UNDECIDABLE")) return "undecidable";
  return "none";
}

/**
 * 법안 단위 관련성 집계. §7.4
 *
 * 영향 방향은 집계하지 않고 모든 일치 경로를 그대로 보존한다.
 */
export function summarizeBillRelevance(
  billSlug: string,
  data: BillImpactData | undefined,
  profile: UserProfile,
  override?: ConditionOverride,
): BillRelevance {
  const evaluations = (data?.pathways ?? []).map((p) =>
    evaluatePathway(p, profile, override),
  );
  const matched = evaluations.filter(
    (e) => e.match === "MATCHED" || e.match === "PARTIAL",
  );
  const undecidable = evaluations.filter((e) => e.match === "UNDECIDABLE");
  const relevance = aggregateRelevance(evaluations);

  return {
    billSlug,
    relevance,
    strength: RELEVANCE_STRENGTH[relevance],
    evaluations,
    matched,
    undecidable,
    pendingConditionCount: matched.reduce((n, e) => n + e.pending.length, 0),
    directionUnknownCount: matched.filter(
      (e) => e.pathway.direction === "unknown",
    ).length,
    review: data?.review ?? null,
  };
}
