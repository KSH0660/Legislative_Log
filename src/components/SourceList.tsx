import type { Source } from "@/types/bill";

export default function SourceList({ sources }: { sources: Source[] }) {
  return (
    <ol className="grid gap-3 sm:grid-cols-2">
      {sources.map((s, i) => (
        <li key={i} className="card flex gap-3.5 p-4">
          <span
            aria-hidden
            className="num mt-0.5 shrink-0 text-sm font-bold text-ink-faint"
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className="min-w-0">
            <span className="chip mb-2 bg-paper-dim px-2 py-0 text-[11px] font-bold tracking-[0.02em] text-ink-faint">
              {s.type}
            </span>
            {s.url ? (
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded text-sm font-medium leading-ko-tight text-ink underline-offset-[3px] transition-colors hover:text-brand-strong hover:underline"
              >
                {s.label}
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  className="ml-1 inline-block h-3 w-3 -translate-y-px text-ink-faint"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 17 17 7M9 7h8v8" />
                </svg>
                <span className="sr-only">(새 창으로 열림)</span>
              </a>
            ) : (
              <p className="text-sm font-medium leading-ko-tight text-ink">
                {s.label}
              </p>
            )}
            <p className="mt-1.5 text-xs text-ink-faint">
              {s.publisher}
              {s.date ? <span className="num"> · {s.date}</span> : ""}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
