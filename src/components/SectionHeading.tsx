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
    <div className="mb-6">
      <div className="flex items-baseline gap-3">
        <span className="font-serif text-sm font-bold tracking-widest text-brand-strong">
          {label}
        </span>
        <span aria-hidden className="h-px flex-1 bg-paper-line" />
        {anchor && (
          <a
            href={`#${anchor}`}
            data-print-hide
            aria-label={`${title} 위치로 링크 복사`}
            className="text-xs text-ink-faint opacity-0 transition-opacity hover:text-brand-strong focus-visible:opacity-100 group-hover:opacity-100"
          >
            #
          </a>
        )}
      </div>
      <h2
        id={titleId}
        className="mt-2 font-serif text-2xl font-bold leading-snug text-ink sm:text-[1.7rem]"
      >
        {title}
      </h2>
      {lede && (
        <p className="mt-2 max-w-prose text-sm leading-ko text-ink-faint">
          {lede}
        </p>
      )}
    </div>
  );
}
