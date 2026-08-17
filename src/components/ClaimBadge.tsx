import {
  CLAIM_TYPE_DESCRIPTION,
  CLAIM_TYPE_LABEL,
  CLAIM_TYPE_SHORT,
  type ClaimType,
} from "@/types/bill";

const STYLES: Record<ClaimType, string> = {
  fact: "bg-claim-fact-bg text-claim-fact ring-claim-fact/25",
  official_claim:
    "bg-claim-official-bg text-claim-official ring-claim-official/25",
  interpretation:
    "bg-claim-interpretation-bg text-claim-interpretation ring-claim-interpretation/25",
  forecast: "bg-claim-forecast-bg text-claim-forecast ring-claim-forecast/25",
  allegation:
    "bg-claim-allegation-bg text-claim-allegation ring-claim-allegation/25",
};

// 색을 못 보거나 흑백으로 인쇄해도 구분되도록, 표식마다 다른 모양을 함께 준다.
// (사실=채운 원, 주장=따옴표, 해석=마름모, 전망=화살표, 의혹=물음표)
const MARK: Record<ClaimType, string> = {
  fact: "M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16z",
  official_claim:
    "M9 6H5v6h4l-2 6h3l2-6V6zm10 0h-4v6h4l-2 6h3l2-6V6z",
  interpretation: "M12 3l9 9-9 9-9-9 9-9z",
  forecast: "M3 17h5l4-8 4 5h5",
  allegation:
    "M9 8.5a3 3 0 1 1 4 2.8c-.7.3-1 1-1 1.8v.4m0 4h.01",
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
  const filled = type === "fact" || type === "interpretation";

  return (
    <span
      title={`${full} — ${CLAIM_TYPE_DESCRIPTION[type]}`}
      className={`chip shrink-0 gap-1.5 ring-1 ring-inset ${STYLES[type]} ${className}`}
    >
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="h-[11px] w-[11px] shrink-0"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={MARK[type]} />
      </svg>
      <span className="sr-only">문장 표식: </span>
      {short ? CLAIM_TYPE_SHORT[type] : full}
    </span>
  );
}
