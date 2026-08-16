import type { PredictionEntry } from "@/types/bill";

export default function PredictionList({
  predictions,
}: {
  predictions: PredictionEntry[];
}) {
  return (
    <ul className="space-y-3">
      {predictions.map((p) => (
        <li
          key={p.id}
          id={`prediction-${p.id}`}
          className="rounded-lg border border-paper-line bg-white p-4"
        >
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full bg-ink px-2.5 py-0.5 font-semibold text-paper">
              {p.horizon} 후 검증
            </span>
            <span className="font-semibold text-ink-soft">{p.by}</span>
            <span className="text-ink-faint">· {p.date} 예측</span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-ink">
            &ldquo;{p.claim}&rdquo;
          </p>
          {p.fallsifiedBy && (
            <p className="mt-1.5 text-xs text-ink-faint">
              검증 기준: {p.fallsifiedBy}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
