import type { StakeholderEntry } from "@/types/bill";
import ClaimBadge from "./ClaimBadge";
import SourceTag from "./SourceTag";

function Column({
  title,
  hint,
  tone,
  entries,
}: {
  title: string;
  hint: string;
  tone: "gain" | "burden";
  entries: StakeholderEntry[];
}) {
  const styles =
    tone === "gain"
      ? { head: "text-claim-fact", rule: "bg-claim-fact", sign: "＋" }
      : { head: "text-claim-forecast", rule: "bg-claim-forecast", sign: "－" };

  return (
    <section>
      <div className="flex items-baseline gap-2">
        <span
          aria-hidden
          className={`font-serif text-lg font-bold ${styles.head}`}
        >
          {styles.sign}
        </span>
        <h3 className="font-serif text-lg font-bold text-ink">{title}</h3>
      </div>
      <p className="mt-1 text-xs leading-ko-tight text-ink-faint">{hint}</p>
      <span aria-hidden className={`mt-3 block h-0.5 w-10 rounded ${styles.rule}`} />

      <ul className="mt-4 space-y-3">
        {entries.map((e, i) => (
          <li key={i} className="card p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="font-semibold text-ink">{e.who}</p>
              <ClaimBadge type={e.claimType} short />
            </div>
            <p className="mt-1.5 text-sm leading-ko text-ink-soft">{e.how}</p>
            {e.scale && (
              <p className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-paper-dim px-2 py-1 text-xs font-medium text-ink-soft">
                <span className="text-ink-faint">규모</span>
                {e.scale}
              </p>
            )}
            {e.source && <SourceTag source={e.source} />}
          </li>
        ))}
      </ul>
    </section>
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
      <Column
        title="이득을 보는 쪽"
        hint="이 정책으로 돈·권리·시간을 얻게 되는 사람들"
        tone="gain"
        entries={beneficiaries}
      />
      <Column
        title="부담을 지는 쪽"
        hint="비용을 내거나 위험·불편을 떠안게 되는 사람들"
        tone="burden"
        entries={costBearers}
      />
    </div>
  );
}
