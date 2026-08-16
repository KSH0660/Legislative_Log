import type { EvidenceItem } from "@/types/bill";
import ClaimBadge from "./ClaimBadge";
import SourceTag from "./SourceTag";

const CERTAINTY_STYLE: Record<EvidenceItem["certainty"], string> = {
  높음: "text-claim-fact",
  중간: "text-claim-forecast",
  낮음: "text-claim-allegation",
};

export default function EvidenceList({ items }: { items: EvidenceItem[] }) {
  return (
    <ul className="space-y-4">
      {items.map((item, i) => (
        <li
          key={i}
          className="flex flex-col gap-2 rounded-lg border border-paper-line bg-white p-4 sm:flex-row sm:items-start sm:justify-between"
        >
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <ClaimBadge type={item.claimType} />
              <span
                className={`text-xs font-semibold ${CERTAINTY_STYLE[item.certainty]}`}
              >
                확실성 {item.certainty}
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-ink">{item.text}</p>
            {item.source && <SourceTag source={item.source} />}
          </div>
        </li>
      ))}
    </ul>
  );
}
