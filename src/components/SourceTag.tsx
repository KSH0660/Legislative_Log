import type { Source } from "@/types/bill";

/** 본문 아래에 작게 붙는 출처 표시 */
export default function SourceTag({ source }: { source: Source }) {
  const text = (
    <>
      <span className="font-medium">{source.publisher}</span>
      <span className="text-ink-faint"> · {source.label}</span>
      {source.date && (
        <span className="num text-ink-faint"> ({source.date})</span>
      )}
    </>
  );

  return (
    <p className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1 border-t border-paper-line-soft pt-2.5 text-xs leading-ko-tight text-ink-soft">
      <span className="chip bg-paper-dim px-2 py-0 text-[11px] font-bold tracking-[0.02em] text-ink-faint">
        {source.type}
      </span>
      {source.url ? (
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded underline-offset-[3px] transition-colors hover:text-brand-strong hover:underline"
        >
          {text}
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
        text
      )}
    </p>
  );
}
