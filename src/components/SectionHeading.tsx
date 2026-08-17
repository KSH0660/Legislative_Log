export default function SectionHeading({
  label,
  title,
  lede,
  anchor,
  titleId,
}: {
  label: string;
  title: string;
  lede?: string;
  anchor?: string;
  titleId?: string;
}) {
  return (
    <div className="mb-7">
      {/* 단계 번호 · 실선 · 앵커. 번호를 크게 두어 지금 몇 단계인지 멀리서도 잡히게 한다. */}
      <div className="flex items-center gap-3">
        <span className="num text-sm font-bold tracking-[0.18em] text-brand-strong">
          {label}
        </span>
        <span aria-hidden className="h-px flex-1 bg-paper-line" />
        {anchor && (
          <a
            href={`#${anchor}`}
            data-print-hide
            aria-label={`${title} 위치로 링크 복사`}
            className="-m-1.5 rounded p-1.5 text-xs text-ink-faint opacity-0 transition-opacity duration-150 hover:text-brand-strong focus-visible:opacity-100 group-hover:opacity-100"
          >
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5" />
              <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5" />
            </svg>
          </a>
        )}
      </div>

      <h2
        id={titleId}
        className="mt-3 max-w-3xl font-serif text-heading font-bold text-ink"
      >
        {title}
      </h2>

      {lede && (
        <p className="mt-2.5 max-w-prose text-sm leading-ko text-ink-faint sm:text-[15px]">
          {lede}
        </p>
      )}
    </div>
  );
}
