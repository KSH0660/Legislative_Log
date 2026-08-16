import {
  CLAIM_TYPE_DESCRIPTION,
  CLAIM_TYPE_LABEL,
  CLAIM_TYPE_SHORT,
  type ClaimType,
} from "@/types/bill";

const STYLES: Record<ClaimType, string> = {
  fact: "bg-claim-fact-bg text-claim-fact ring-claim-fact/20",
  official_claim: "bg-claim-official-bg text-claim-official ring-claim-official/20",
  interpretation:
    "bg-claim-interpretation-bg text-claim-interpretation ring-claim-interpretation/20",
  forecast: "bg-claim-forecast-bg text-claim-forecast ring-claim-forecast/20",
  allegation:
    "bg-claim-allegation-bg text-claim-allegation ring-claim-allegation/20",
};

export default function ClaimBadge({
  type,
  short = false,
  className = "",
}: {
  type: ClaimType;
  /** 좁은 공간에서 '확인된 사실' 대신 '사실'처럼 짧게 표시 */
  short?: boolean;
  className?: string;
}) {
  const full = CLAIM_TYPE_LABEL[type];
  return (
    <span
      title={`${full} — ${CLAIM_TYPE_DESCRIPTION[type]}`}
      className={`chip shrink-0 ring-1 ring-inset ${STYLES[type]} ${className}`}
    >
      <span className="sr-only">문장 표식: </span>
      {short ? CLAIM_TYPE_SHORT[type] : full}
    </span>
  );
}
