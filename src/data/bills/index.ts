import type { Bill } from "@/types/bill";
import { nationalPensionReform2025 } from "./national-pension-reform-2025";
import { yellowEnvelopeAct2025 } from "./yellow-envelope-act-2025";
import { inheritanceTaxReform2025 } from "./inheritance-tax-reform-2025";

export const bills: Bill[] = [
  nationalPensionReform2025,
  yellowEnvelopeAct2025,
  inheritanceTaxReform2025,
];
