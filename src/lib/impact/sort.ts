// 결정론적 정렬. §7.5
//
// 임의 가중치 합산 대신 사전순(lexicographic) 규칙을 쓴다.
// 마지막 키가 slug이므로 **어떤 입력 순서에서도 결과 순서가 같다**.
// 배열 초기 순서에 의존하는 안정 정렬은 데이터 파일 순서가 바뀌면 결과가 달라지므로
// 결정론의 근거로 삼지 않는다.

import type { Bill } from "@/types/bill";
import { EVIDENCE_METHOD_RANK } from "@/types/impact";
import type { BillRelevance } from "./match";
import { effectRank } from "./status";

/** 정렬 4번 키 — 일치 경로 중 가장 강한 근거 방식 */
function bestEvidenceRank(relevance: BillRelevance): number {
  return relevance.matched.reduce(
    (best, e) => Math.max(best, EVIDENCE_METHOD_RANK[e.pathway.evidenceMethod]),
    0,
  );
}

/** 정렬 5번 키 — 법안 본문과 개인화 분석 중 더 최근 갱신일 */
function updatedAt(bill: Bill, relevance: BillRelevance): string {
  return relevance.evaluations.reduce(
    (latest, e) =>
      e.pathway.reviewedAt > latest ? e.pathway.reviewedAt : latest,
    bill.lastUpdated,
  );
}

export interface SortContext {
  relevanceBySlug: Map<string, BillRelevance>;
  asOf: string;
}

/**
 * 관련 순서로 정렬한다. 원본 배열은 건드리지 않는다.
 *
 * 1. 관련성 강도 (내림차순)
 * 2. 필수 조건 완전성 (unknown 개수 오름차순)
 * 3. 현재 효력·시행 임박성 (내림차순)
 * 4. 근거 방식 (내림차순)
 * 5. 법안·분석 갱신일 (내림차순)
 * 6. slug 사전순 ← 최종 타이브레이커
 */
export function sortByRelevance(bills: Bill[], ctx: SortContext): Bill[] {
  return [...bills].sort((a, b) => {
    const ra = ctx.relevanceBySlug.get(a.slug);
    const rb = ctx.relevanceBySlug.get(b.slug);
    if (ra && rb) {
      if (ra.strength !== rb.strength) return rb.strength - ra.strength;
      if (ra.pendingConditionCount !== rb.pendingConditionCount) {
        return ra.pendingConditionCount - rb.pendingConditionCount;
      }
      const ea = effectRank(a, ctx.asOf);
      const eb = effectRank(b, ctx.asOf);
      if (ea !== eb) return eb - ea;

      const va = bestEvidenceRank(ra);
      const vb = bestEvidenceRank(rb);
      if (va !== vb) return vb - va;

      const ua = updatedAt(a, ra);
      const ub = updatedAt(b, rb);
      if (ua !== ub) return ua < ub ? 1 : -1;
    }
    // 6. 값 기반 최종 타이브레이커. 이게 없으면 같은 갱신일 법안들의 순서가
    //    데이터 파일의 배열 순서에 좌우된다.
    return a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0;
  });
}
