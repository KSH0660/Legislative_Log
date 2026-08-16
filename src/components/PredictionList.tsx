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
          className="card scroll-mt-[7.25rem] p-4 sm:p-5 lg:scroll-mt-24"
        >
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="chip bg-ink text-paper">{p.horizon} 뒤에 확인</span>
            <span className="font-semibold text-ink-soft">{p.by}</span>
            <span className="text-ink-faint">· {p.date}에 한 말</span>
          </div>

          <blockquote className="mt-3 border-l-2 border-brand/50 pl-3 text-sm leading-ko text-ink">
            {p.claim}
          </blockquote>

          {p.fallsifiedBy && (
            <p className="mt-3 rounded-lg bg-paper-dim px-3 py-2 text-xs leading-ko-tight text-ink-soft">
              <span className="font-semibold text-ink">
                무엇을 보면 맞았는지 알 수 있나
              </span>
              <br />
              {p.fallsifiedBy}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
