// 슬러그 → 개인화 영향경로 매핑. §12.3
//
// 기존 법안 파일(src/data/bills/*)은 건드리지 않는다.
// 개인화 레이어가 없어도 사이트는 그대로 동작하고, 검증 스크립트는 이 레이어만
// 따로 검사할 수 있다.

import type { BillImpactData } from "@/types/impact";
import { nationalPensionImpact } from "./national-pension-reform-2025";
import { yellowEnvelopeImpact } from "./yellow-envelope-act-2025";
import { inheritanceTaxImpact } from "./inheritance-tax-reform-2025";
import { prosecutionReformImpact } from "./prosecution-reform-2026";
import { nationalAssemblyActImpact } from "./national-assembly-act-reform-2026";
import { depositProtectionImpact } from "./deposit-protection-limit-2025";
import { parentalLeaveImpact } from "./parental-leave-expansion-2025";
import { jeonseFraudImpact } from "./jeonse-fraud-minimum-guarantee-2026";
import { retirementAgeImpact } from "./retirement-age-extension-2026";

export const impactData: BillImpactData[] = [
  nationalPensionImpact,
  yellowEnvelopeImpact,
  inheritanceTaxImpact,
  prosecutionReformImpact,
  nationalAssemblyActImpact,
  depositProtectionImpact,
  parentalLeaveImpact,
  jeonseFraudImpact,
  retirementAgeImpact,
];

export const impactBySlug: Map<string, BillImpactData> = new Map(
  impactData.map((d) => [d.review.billSlug, d]),
);

export function getImpactData(slug: string): BillImpactData | undefined {
  return impactBySlug.get(slug);
}
