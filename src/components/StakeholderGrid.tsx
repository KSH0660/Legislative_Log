import type { StakeholderEntry } from "@/types/bill";
import ClaimBadge from "./ClaimBadge";
import SourceTag from "./SourceTag";

function StakeholderColumn({
  title,
  icon,
  entries,
}: {
  title: string;
  icon: string;
  entries: StakeholderEntry[];
}) {
  return (
    <div>
      <h3 className="mb-3 flex items-center gap-2 font-serif text-lg font-bold text-ink">
        <span>{icon}</span>
        {title}
      </h3>
      <ul className="space-y-3">
        {entries.map((e, i) => (
          <li key={i} className="rounded-lg border border-paper-line bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="font-semibold text-ink">{e.who}</p>
              <ClaimBadge type={e.claimType} />
            </div>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">{e.how}</p>
            {e.scale && (
              <p className="mt-1.5 text-xs font-medium text-brand-dark">
                규모: {e.scale}
              </p>
            )}
            {e.source && <SourceTag source={e.source} />}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function StakeholderGrid({
  beneficiaries,
  costBearers,
}: {
  beneficiaries: StakeholderEntry[];
  costBearers: StakeholderEntry[];
}) {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <StakeholderColumn title="수혜자" icon="＋" entries={beneficiaries} />
      <StakeholderColumn title="비용·위험 부담자" icon="－" entries={costBearers} />
    </div>
  );
}
