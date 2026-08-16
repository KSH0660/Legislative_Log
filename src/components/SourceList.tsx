import type { Source } from "@/types/bill";

export default function SourceList({ sources }: { sources: Source[] }) {
  return (
    <ol className="grid gap-3 sm:grid-cols-2">
      {sources.map((s, i) => (
        <li
          key={i}
          className="rounded-lg border border-paper-line bg-white p-4 text-sm"
        >
          <span className="mr-2 inline-block rounded bg-paper-dim px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink-soft">
            {s.type}
          </span>
          {s.url ? (
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-ink hover:text-brand hover:underline"
            >
              {s.label}
            </a>
          ) : (
            <span className="font-medium text-ink">{s.label}</span>
          )}
          <p className="mt-1 text-xs text-ink-faint">
            {s.publisher}
            {s.date ? ` · ${s.date}` : ""}
          </p>
        </li>
      ))}
    </ol>
  );
}
