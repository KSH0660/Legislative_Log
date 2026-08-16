import type { Source } from "@/types/bill";

export default function SourceList({ sources }: { sources: Source[] }) {
  return (
    <ol className="grid gap-3 sm:grid-cols-2">
      {sources.map((s, i) => (
        <li key={i} className="card flex gap-3 p-4">
          <span
            aria-hidden
            className="mt-0.5 shrink-0 font-serif text-sm font-bold text-ink-faint"
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className="min-w-0">
            <span className="chip mb-1.5 bg-paper-dim py-0 text-[10px] font-bold tracking-wide text-ink-faint">
              {s.type}
            </span>
            {s.url ? (
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm font-medium leading-ko-tight text-ink underline-offset-2 hover:text-brand-strong hover:underline"
              >
                {s.label}
                <span aria-hidden className="ml-0.5 text-ink-faint">
                  ↗
                </span>
                <span className="sr-only">(새 창으로 열림)</span>
              </a>
            ) : (
              <p className="text-sm font-medium leading-ko-tight text-ink">
                {s.label}
              </p>
            )}
            <p className="mt-1 text-xs text-ink-faint">
              {s.publisher}
              {s.date ? ` · ${s.date}` : ""}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
