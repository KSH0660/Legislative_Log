// §5.5 법안 진행 단계별 문구 규칙

import { describe, expect, it } from "vitest";
import { effectRank, isInEffect, pathwayTiming, statusPhrase } from "@/lib/impact/status";
import { getAllBills, getBillBySlug } from "@/lib/bills";
import type { Bill, BillStatus } from "@/types/bill";
import { AS_OF } from "./fixtures/profiles";

const base: Bill = getBillBySlug("national-pension-reform-2025")!;

function withStatus(status: BillStatus, extra: Partial<Bill> = {}): Bill {
  return { ...base, status, ...extra };
}

describe("BillStatus 7종 모두에 시제가 정의돼 있다", () => {
  const ALL: BillStatus[] = [
    "발의",
    "심사중",
    "본회의_계류",
    "통과",
    "공포",
    "시행",
    "폐기",
  ];

  it("모든 상태에서 문구가 나온다", () => {
    for (const status of ALL) {
      const phrase = statusPhrase(withStatus(status), AS_OF);
      expect(phrase.text.length, status).toBeGreaterThan(0);
    }
  });

  it("시행 전 5개 상태는 모두 조건부 문구를 쓴다", () => {
    for (const status of ["발의", "심사중", "본회의_계류", "통과", "공포"] as BillStatus[]) {
      expect(statusPhrase(withStatus(status), AS_OF).conditional, status).toBe(true);
    }
  });

  it("공포 상태는 현재형으로 서술되지 않는다", () => {
    // v1의 사고 지점. 검찰개혁이 여기 해당한다.
    const prosecution = getBillBySlug("prosecution-reform-2026")!;
    expect(prosecution.status).toBe("공포");
    const phrase = statusPhrase(prosecution, AS_OF);
    expect(phrase.tense).toBe("conditional_pre_effect");
    expect(phrase.text).toContain(prosecution.effectiveDate!);
  });

  it("시행 상태여도 시행일 전이면 현재형을 쓰지 않는다", () => {
    const future = withStatus("시행", { effectiveDate: "2027-01-01" });
    expect(statusPhrase(future, AS_OF).tense).toBe("conditional_pre_effect");
    expect(isInEffect(future, AS_OF)).toBe(false);
  });

  it("시행일이 지난 시행 상태만 현재형", () => {
    expect(statusPhrase(base, AS_OF).tense).toBe("present");
    expect(isInEffect(base, AS_OF)).toBe(true);
  });
});

describe("단계 시행 조항의 적용 시점", () => {
  const stub = {
    id: "x",
    billSlug: base.slug,
    title: "x",
    relationship: "self" as const,
    conditions: [],
    domain: "social_insurance" as const,
    direction: "burden" as const,
    timeframe: "current" as const,
    baseline: "",
    baselineVersion: "v1",
    mechanism: "",
    evidenceMethod: "statutory_rule" as const,
    assumptions: [],
    uncertainties: [],
    legalBasis: [],
    reviewedAt: AS_OF,
  };

  it("appliesFrom이 지났으면 적용 중으로 서술한다", () => {
    expect(pathwayTiming({ ...stub, appliesFrom: "2026-01-01" }, AS_OF)).toContain(
      "적용되고 있습니다",
    );
  });

  it("appliesFrom이 아직이면 미래형으로 서술한다", () => {
    expect(pathwayTiming({ ...stub, appliesFrom: "2033-01-01" }, AS_OF)).toContain(
      "부터 적용됩니다",
    );
  });

  it("appliesFrom이 없으면 시점 문구를 만들지 않는다", () => {
    expect(pathwayTiming(stub, AS_OF)).toBeNull();
  });
});

describe("§7.5 정렬 3번 키 — 효력·임박성", () => {
  it("시행 중 > 시행 임박 > 심사 중 > 폐기", () => {
    const inEffect = effectRank(base, AS_OF);
    const promulgated = effectRank(getBillBySlug("prosecution-reform-2026")!, AS_OF);
    const pending = effectRank(getBillBySlug("inheritance-tax-reform-2025")!, AS_OF);
    const discarded = effectRank(withStatus("폐기"), AS_OF);
    expect(inEffect).toBeGreaterThan(promulgated);
    expect(promulgated).toBeGreaterThan(pending);
    expect(pending).toBeGreaterThan(discarded);
  });

  it("모든 실제 법안이 순위를 가진다", () => {
    for (const bill of getAllBills()) {
      expect(effectRank(bill, AS_OF)).toBeGreaterThanOrEqual(0);
    }
  });
});
