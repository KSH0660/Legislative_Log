import type { Bill } from "@/types/bill";
import { nationalPensionReform2025 } from "./national-pension-reform-2025";
import { yellowEnvelopeAct2025 } from "./yellow-envelope-act-2025";
import { inheritanceTaxReform2025 } from "./inheritance-tax-reform-2025";
import { prosecutionReform2026 } from "./prosecution-reform-2026";
import { nationalAssemblyActReform2026 } from "./national-assembly-act-reform-2026";

export const bills: Bill[] = [
  prosecutionReform2026,
  nationalAssemblyActReform2026,
  nationalPensionReform2025,
  yellowEnvelopeAct2025,
  inheritanceTaxReform2025,
];
