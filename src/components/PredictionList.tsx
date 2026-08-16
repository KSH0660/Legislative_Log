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
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
            <span className="chip gap-1.5 bg-ink text-paper">
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="h-3 w-3"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.4}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
              {p.horizon} 뒤에 확인
            </span>
            <span className="text-xs font-semibold text-ink-soft">{p.by}</span>
            <span className="text-xs text-ink-faint">
              <span className="num">{p.date}</span>에 한 말
            </span>
          </div>

          {/* 당시 발언은 손대지 않고 그대로 옮긴다 — 인용부호로 그 성격을 드러낸다. */}
          <blockquote className="relative mt-3.5 border-l-2 border-brand/50 pl-4 text-[15px] leading-ko text-ink">
            <span
              aria-hidden
              className="absolute -left-px -top-1 select-none font-serif text-2xl leading-none text-brand/25"
            >
              &ldquo;
            </span>
            {p.claim}
          </blockquote>

          {p.fallsifiedBy && (
            <div className="mt-3.5 rounded-lg bg-paper-dim px-3.5 py-3 ring-1 ring-inset ring-paper-line-soft">
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">
                무엇을 보면 맞았는지 알 수 있나
              </p>
              <p className="mt-1.5 text-xs leading-ko text-ink-soft">
                {p.fallsifiedBy}
              </p>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
