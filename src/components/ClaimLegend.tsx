import {
  CLAIM_TYPE_DESCRIPTION,
  CLAIM_TYPE_LABEL,
  type ClaimType,
} from "@/types/bill";
import ClaimBadge from "./ClaimBadge";

const TYPES = Object.keys(CLAIM_TYPE_LABEL) as ClaimType[];

export default function ClaimLegend({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <ul className="flex flex-wrap gap-x-4 gap-y-2">
        {TYPES.map((type) => (
          <li key={type}>
            <ClaimBadge type={type} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {TYPES.map((type) => (
        <li key={type} className="card p-4">
          <ClaimBadge type={type} />
          <p className="mt-2.5 text-sm leading-ko-tight text-ink-soft">
            {CLAIM_TYPE_DESCRIPTION[type]}
          </p>
        </li>
      ))}
    </ul>
  );
}
