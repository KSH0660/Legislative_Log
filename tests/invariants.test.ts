// §17.1 불변식 (속성 기반 테스트)
//
// 단조성 / 완전 분할 / 결정론 / 중립성

import { describe, expect, it } from "vitest";
import { getAllBills } from "@/lib/bills";
import { impactBySlug } from "@/data/impact";
import {
  bucketOf,
  BUCKET_ORDER,
  partitionBills,
  personalize,
  summarizeBillRelevance,
  matchImpactPathway,
} from "@/lib/impact";
import type { Bill } from "@/types/bill";
import type { UserProfile } from "@/types/profile";
import { ALL_PROFILES, AS_OF, PROFILE_FIELDS } from "./fixtures/profiles";

const bills = getAllBills();

/** 프로필의 한 항목만 '모름'으로 바꾼 사본 */
function erase(profile: UserProfile, field: (typeof PROFILE_FIELDS)[number]): UserProfile {
  return { ...profile, [field]: { values: [], declined: true } };
}

describe("단조성 — 정보를 지우면 판정이 확정되지 않는다", () => {
  // 계획서 §17.1은 "관련성 강도는 절대 올라가지 않는다"고 적었지만,
  // §5.1의 사다리에서 `판단 불가`(1)·`조건부`(3)가 `연결 없음`(0)보다 높기 때문에
  // "불일치가 확인된 상태(0)" → "확인되지 않은 상태(3)"로 올라가는 경우가 원리상 존재한다.
  // 이건 §4.6("모른다를 없다로 내려 보내지 않는다")이 요구하는 동작이기도 하다.
  //
  // 그래서 §20의 위험("정보 부족이 판정을 강화")이 실제로 막고자 하는 것,
  // 즉 **정보를 지워서 확정 판정이 새로 생기는 일**을 불변식으로 검사한다.
  // 자세한 근거는 docs/personalized-bill-impact-implementation-notes.md에 적어 두었다.

  it("어떤 항목을 지워도 경로가 MATCHED로 승격되지 않는다", () => {
    for (const { name, profile } of ALL_PROFILES) {
      for (const field of PROFILE_FIELDS) {
        const weaker = erase(profile, field);
        for (const bill of bills) {
          const data = impactBySlug.get(bill.slug);
          for (const p of data?.pathways ?? []) {
            const before = matchImpactPathway(p, profile);
            const after = matchImpactPathway(p, weaker);
            if (after === "MATCHED") {
              expect(
                before,
                `${name} / ${field} / ${p.id}: 정보를 지웠는데 MATCHED로 승격됨`,
              ).toBe("MATCHED");
            }
          }
        }
      }
    }
  });

  it("어떤 항목을 지워도 법안이 `직접 대상`으로 승격되지 않는다", () => {
    for (const { name, profile } of ALL_PROFILES) {
      for (const field of PROFILE_FIELDS) {
        const weaker = erase(profile, field);
        for (const bill of bills) {
          const data = impactBySlug.get(bill.slug);
          const before = summarizeBillRelevance(bill.slug, data, profile).relevance;
          const after = summarizeBillRelevance(bill.slug, data, weaker).relevance;
          if (after === "direct") {
            expect(
              before,
              `${name} / ${field} / ${bill.slug}: 정보를 지웠는데 직접 대상으로 승격됨`,
            ).toBe("direct");
          }
        }
      }
    }
  });

  it("`모름`을 고른 것과 질문을 건너뛴 것의 결과가 같다", () => {
    for (const { profile } of ALL_PROFILES) {
      for (const field of PROFILE_FIELDS) {
        const declinedProfile = erase(profile, field);
        const skipped = { ...profile };
        delete skipped[field];
        for (const bill of bills) {
          const data = impactBySlug.get(bill.slug);
          expect(summarizeBillRelevance(bill.slug, data, declinedProfile).relevance).toBe(
            summarizeBillRelevance(bill.slug, data, skipped).relevance,
          );
        }
      }
    }
  });
});

describe("완전 분할 — 6범주 합 = 전체 법안 수", () => {
  it("임의 프로필에 대해 Σ(6개 범주) === N", () => {
    for (const { name, profile } of ALL_PROFILES) {
      const relevances = bills.map((b) =>
        summarizeBillRelevance(b.slug, impactBySlug.get(b.slug), profile),
      );
      const { counts, total } = partitionBills(relevances);
      const sum = BUCKET_ORDER.reduce((n, k) => n + counts[k], 0);
      expect(sum, `${name}: 6범주 합이 전체 건수와 다르다`).toBe(total);
      expect(total).toBe(bills.length);
    }
  });

  it("각 법안은 정확히 하나의 범주에 들어간다", () => {
    for (const { profile } of ALL_PROFILES) {
      for (const bill of bills) {
        const bucket = bucketOf(
          summarizeBillRelevance(bill.slug, impactBySlug.get(bill.slug), profile),
        );
        expect(BUCKET_ORDER).toContain(bucket);
      }
    }
  });

  it("자료 부족을 무영향으로 바꾸지 않는다 — 연결 없음과 자료 부족은 다른 범주다", () => {
    const relevances = bills.map((b) =>
      summarizeBillRelevance(b.slug, impactBySlug.get(b.slug), ALL_PROFILES[0].profile),
    );
    const { counts } = partitionBills(relevances);
    expect(counts).toHaveProperty("insufficient");
    expect(counts).toHaveProperty("unrelated");
    expect(counts).toHaveProperty("no_change");
  });
});

describe("결정론 — 같은 입력이면 언제나 같은 순서", () => {
  function shuffled<T>(list: T[], seed: number): T[] {
    // 결정적인 의사난수. Math.random을 쓰면 실패를 재현할 수 없다.
    const out = [...list];
    let s = seed;
    for (let i = out.length - 1; i > 0; i -= 1) {
      s = (s * 1103515245 + 12345) % 2147483648;
      const j = s % (i + 1);
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  }

  it("법안 배열 순서를 섞어도 결과 순서가 같다", () => {
    for (const { name, profile } of ALL_PROFILES) {
      const expected = personalize(bills, impactBySlug, profile, AS_OF).items.map(
        (i) => i.bill.slug,
      );
      for (const seed of [1, 7, 42, 1234]) {
        const actual = personalize(
          shuffled(bills, seed),
          impactBySlug,
          profile,
          AS_OF,
        ).items.map((i) => i.bill.slug);
        expect(actual, `${name} (seed ${seed})`).toEqual(expected);
      }
    }
  });

  it("같은 호출을 반복해도 결과가 완전히 같다", () => {
    for (const { profile } of ALL_PROFILES) {
      const a = personalize(bills, impactBySlug, profile, AS_OF);
      const b = personalize(bills, impactBySlug, profile, AS_OF);
      expect(a.items.map((i) => i.bill.slug)).toEqual(b.items.map((i) => i.bill.slug));
      expect(a.counts).toEqual(b.counts);
    }
  });

  it("경로 배열 순서를 섞어도 판정이 같다", () => {
    for (const { profile } of ALL_PROFILES) {
      for (const bill of bills) {
        const data = impactBySlug.get(bill.slug);
        if (!data) continue;
        const base = summarizeBillRelevance(bill.slug, data, profile);
        const scrambled = {
          ...data,
          pathways: shuffled(data.pathways, 99),
        };
        const other = summarizeBillRelevance(bill.slug, scrambled, profile);
        expect(other.relevance).toBe(base.relevance);
        expect(bucketOf(other)).toBe(bucketOf(base));
      }
    }
  });
});

describe("중립성 — 정당·발의자 정보는 판정에 쓰이지 않는다", () => {
  /** 찬반 주장의 주체·내용만 바꾼 사본 */
  function repoliticize(bill: Bill): Bill {
    return {
      ...bill,
      proponentArguments: bill.proponentArguments.map((a) => ({
        ...a,
        attribution: "여당",
        point: "정치적 문구로 바꾼 주장",
      })),
      opponentArguments: bill.opponentArguments.map((a) => ({
        ...a,
        attribution: "야당",
        point: "정치적 문구로 바꾼 반론",
      })),
      analysisJudgment: ["[의견] 완전히 다른 정치적 평가"],
      tags: ["정치", "정당"],
    };
  }

  it("찬반 주장을 통째로 바꿔도 판정과 순서가 변하지 않는다", () => {
    const altered = bills.map(repoliticize);
    for (const { name, profile } of ALL_PROFILES) {
      const base = personalize(bills, impactBySlug, profile, AS_OF);
      const other = personalize(altered, impactBySlug, profile, AS_OF);
      expect(other.items.map((i) => i.bill.slug), name).toEqual(
        base.items.map((i) => i.bill.slug),
      );
      expect(other.counts, name).toEqual(base.counts);
    }
  });
});

describe("무관한 속성 변경", () => {
  it("판정에 쓰이지 않는 항목을 바꿔도 결과가 같다", () => {
    // 국회법·검찰개혁은 어떤 프로필 항목도 쓰지 않으므로 항상 같은 결과여야 한다.
    for (const slug of ["national-assembly-act-reform-2026", "prosecution-reform-2026"]) {
      const results = ALL_PROFILES.map(
        ({ profile }) => summarizeBillRelevance(slug, impactBySlug.get(slug), profile).relevance,
      );
      expect(new Set(results)).toEqual(new Set(["none"]));
    }
  });
});
