export default function SectionHeading({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-6 flex items-start gap-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink font-serif text-base font-bold text-paper">
        {number}
      </span>
      <div>
        <h2 className="font-serif text-2xl font-bold text-ink">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-ink-faint">{description}</p>
        )}
      </div>
    </div>
  );
}
