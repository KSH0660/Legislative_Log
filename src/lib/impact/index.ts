// 개인화 규칙 엔진의 공개 진입점.
//
// 여기 있는 것은 모두 순수함수다. React·DOM·전역 상태에 의존하지 않는다. (§13.1)
// 덕분에 UI 없이 `npm test`만으로 판정 결과를 재현할 수 있다. (§18 단계 0 완료조건)

import type { Bill } from "@/types/bill";
import type { BillImpactData, ProfileKey } from "@/types/impact";
import type { UserProfile } from "@/types/profile";
import { summarizeBillRelevance, type BillRelevance } from "./match";
import { bucketOf, partitionBills, type BucketCounts, type SummaryBucket } from "./map";
import { sortByRelevance } from "./sort";
import { statusPhrase, type StatusPhrase } from "./status";
import {
  calculationGaps,
  whatWouldChange,
  type DecisiveField,
} from "./explain";

export * from "./conditions";
export * from "./match";
export * from "./map";
export * from "./sort";
export * from "./status";
export * from "./explain";
export * from "./calculators";

export interface PersonalizedBill {
  bill: Bill;
  relevance: BillRelevance;
  bucket: SummaryBucket;
  phrase: StatusPhrase;
  /** 판정을 바꿀 수 있는 조건들 (답한 것 + 아직 답하지 않은 것) */
  decisive: DecisiveField[];
  /** 판정은 그대로지만 금액 계산을 가능하게 하는 미응답 항목 (§7.2 informative) */
  calculationFields: ProfileKey[];
}

export interface PersonalizationResult {
  /** §7.5 규칙으로 정렬된 결과 */
  items: PersonalizedBill[];
  /** §9.2 6범주 집계. 합은 언제나 total과 같다. */
  counts: BucketCounts;
  total: number;
  /** 아직 답하지 않았고 판정을 바꿀 수 있는 항목 (조건부 질문 노출용) */
  pendingFields: ProfileKey[];
  /** 이미 답해서 판정에 실제로 쓰인 항목 */
  usedFields: ProfileKey[];
  bySlug: Map<string, PersonalizedBill>;
}

/**
 * 법안 목록 전체를 사용자 프로필로 개인화한다.
 *
 * `asOf`는 명시적으로 받는다. 함수 안에서 현재 시각을 읽으면 같은 입력에 대해
 * 다른 결과가 나올 수 있어 결정론(§3.1)이 깨지고 테스트도 쓸 수 없다.
 */
export function personalize(
  bills: Bill[],
  impact: Map<string, BillImpactData>,
  profile: UserProfile,
  asOf: string,
): PersonalizationResult {
  const relevanceBySlug = new Map<string, BillRelevance>();
  for (const bill of bills) {
    relevanceBySlug.set(
      bill.slug,
      summarizeBillRelevance(bill.slug, impact.get(bill.slug), profile),
    );
  }

  const sorted = sortByRelevance(bills, { relevanceBySlug, asOf });

  const pendingFields: ProfileKey[] = [];
  const usedFields: ProfileKey[] = [];
  const items: PersonalizedBill[] = sorted.map((bill) => {
    const relevance = relevanceBySlug.get(bill.slug)!;
    const data = impact.get(bill.slug);
    const decisive = whatWouldChange(bill.slug, data, profile);
    for (const d of decisive) {
      const target = d.answered ? usedFields : pendingFields;
      if (!target.includes(d.field)) target.push(d.field);
    }
    const calculationFields = calculationGaps(bill.slug, data, profile);
    for (const f of calculationFields) {
      if (!pendingFields.includes(f)) pendingFields.push(f);
    }
    return {
      bill,
      relevance,
      bucket: bucketOf(relevance),
      phrase: statusPhrase(bill, asOf),
      decisive,
      calculationFields,
    };
  });

  const { counts, total } = partitionBills(
    sorted.map((b) => relevanceBySlug.get(b.slug)!),
  );

  return {
    items,
    counts,
    total,
    pendingFields,
    usedFields,
    bySlug: new Map(items.map((i) => [i.bill.slug, i])),
  };
}

/** 프로필에 답이 하나라도 있는가. 개인화를 켤 수 있는 최소 조건이다. */
export function hasAnyAnswer(profile: UserProfile): boolean {
  return Object.values(profile).some((a) => a && !a.declined);
}
