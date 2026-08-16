import type { Source } from "@/types/bill";

/** 본문 아래에 작게 붙는 출처 표시 */
export default function SourceTag({ source }: { source: Source }) {
  const text = (
    <>
      <span className="font-medium">{source.publisher}</span>
      <span className="text-ink-faint"> · {source.label}</span>
      {source.date && <span className="text-ink-faint"> ({source.date})</span>}
    </>
  );

  return (
    <p className="mt-2.5 flex flex-wrap items-baseline gap-x-1.5 gap-y-1 text-xs leading-ko-tight text-ink-soft">
      <span className="chip bg-paper-dim py-0 text-[10px] font-bold tracking-wide text-ink-faint">
        {source.type}
      </span>
      {source.url ? (
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline-offset-2 hover:text-brand-strong hover:underline"
        >
          {text}
          <span aria-hidden className="ml-0.5 text-ink-faint">
            ↗
          </span>
          <span className="sr-only">(새 창으로 열림)</span>
        </a>
      ) : (
        text
      )}
    </p>
  );
}
