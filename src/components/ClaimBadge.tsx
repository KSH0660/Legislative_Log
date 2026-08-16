import { CLAIM_TYPE_LABEL, type ClaimType } from "@/types/bill";

const STYLES: Record<ClaimType, string> = {
  fact: "bg-claim-fact-bg text-claim-fact",
  official_claim: "bg-claim-official-bg text-claim-official",
  interpretation: "bg-claim-interpretation-bg text-claim-interpretation",
  forecast: "bg-claim-forecast-bg text-claim-forecast",
  allegation: "bg-claim-allegation-bg text-claim-allegation",
};

export default function ClaimBadge({
  type,
  className = "",
}: {
  type: ClaimType;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${STYLES[type]} ${className}`}
    >
      {CLAIM_TYPE_LABEL[type]}
    </span>
  );
}
