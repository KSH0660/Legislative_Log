import type { Source } from "@/types/bill";

export default function SourceTag({ source }: { source: Source }) {
  const content = (
    <>
      <span className="font-medium">{source.publisher}</span>
      <span className="text-ink-faint">· {source.label}</span>
    </>
  );

  return (
    <p className="mt-1.5 text-xs text-ink-faint">
      <span className="rounded bg-paper-dim px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink-soft">
        {source.type}
      </span>{" "}
      {source.url ? (
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-brand hover:underline"
        >
          {content}
        </a>
      ) : (
        content
      )}
      {source.date && <span> ({source.date})</span>}
    </p>
  );
}
