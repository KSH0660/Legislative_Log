import type { ArgumentPoint } from "@/types/bill";
import ClaimBadge from "./ClaimBadge";
import SourceTag from "./SourceTag";

export default function ArgumentList({
  title,
  accent,
  points,
}: {
  title: string;
  accent: "proponent" | "opponent";
  points: ArgumentPoint[];
}) {
  return (
    <div
      className={`rounded-xl border p-5 ${
        accent === "proponent"
          ? "border-claim-fact/30 bg-claim-fact-bg/40"
          : "border-claim-allegation/30 bg-claim-allegation-bg/40"
      }`}
    >
      <h3 className="mb-4 flex items-center gap-2 font-serif text-lg font-bold text-ink">
        <span
          className={
            accent === "proponent" ? "text-claim-fact" : "text-claim-allegation"
          }
        >
          {accent === "proponent" ? "▲" : "▼"}
        </span>
        {title}
      </h3>
      <ol className="space-y-5">
        {points.map((p, i) => (
          <li key={i} className="border-t border-ink/10 pt-4 first:border-t-0 first:pt-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-ink-faint">
                {p.attribution}
              </span>
              <ClaimBadge type={p.claimType} />
            </div>
            <p className="mt-1.5 font-semibold text-ink">{p.point}</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">
              {p.detail}
            </p>
            {p.source && <SourceTag source={p.source} />}
          </li>
        ))}
      </ol>
    </div>
  );
}
