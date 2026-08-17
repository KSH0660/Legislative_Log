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
  // 돈과 위험이 어느 쪽으로 흐르는지를 부호와 화살표 방향으로 함께 표시한다.
  const styles =
    tone === "gain"
      ? {
          head: "text-claim-fact",
          chip: "bg-claim-fact-bg text-claim-fact ring-claim-fact/25",
          rule: "bg-claim-fact",
          arrow: "M12 19V5M6 11l6-6 6 6",
        }
      : {
          head: "text-claim-forecast",
          chip: "bg-claim-forecast-bg text-claim-forecast ring-claim-forecast/25",
          rule: "bg-claim-forecast",
          arrow: "M12 5v14M6 13l6 6 6-6",
        };

  return (
    <section>
      <div className="flex items-center gap-2.5">
        <span
          aria-hidden
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ring-1 ring-inset ${styles.chip}`}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d={styles.arrow} />
          </svg>
        </span>
        <h3 className="font-serif text-lg font-bold text-ink">{title}</h3>
      </div>
      <p className="mt-2 text-xs leading-ko-tight text-ink-faint">{hint}</p>
      <span
        aria-hidden
        className={`mt-3.5 block h-0.5 w-10 rounded ${styles.rule}`}
      />

      <ul className="mt-5 space-y-3">
        {entries.map((e, i) => (
          <li key={i} className="card p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="font-semibold text-ink">{e.who}</p>
              <ClaimBadge type={e.claimType} short />
            </div>
            <p className="mt-2 text-sm leading-ko text-ink-soft">{e.how}</p>
            {e.scale && (
              <p className="mt-2.5 inline-flex items-center gap-2 rounded-md bg-paper-dim px-2.5 py-1.5 text-xs font-medium text-ink-soft ring-1 ring-inset ring-paper-line-soft">
                <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">
                  규모
                </span>
                <span>{e.scale}</span>
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
    <div className="grid gap-8 md:grid-cols-2 md:gap-10">
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
