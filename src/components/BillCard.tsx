import Link from "next/link";
import type { Bill } from "@/types/bill";
import StatusBadge from "./StatusBadge";

const MAX_TAGS = 3;

export default function BillCard({ bill }: { bill: Bill }) {
  const shown = bill.tags.slice(0, MAX_TAGS);
  const rest = bill.tags.length - shown.length;

  return (
    <Link
      href={`/bills/${bill.slug}`}
      className="card-interactive group flex flex-col p-5 sm:p-6"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold tracking-wide text-brand-strong">
          {bill.category}
        </span>
        <StatusBadge status={bill.status} />
      </div>

      <h3 className="mt-3 font-serif text-xl font-bold leading-snug text-ink transition-colors group-hover:text-brand-strong">
        {bill.shortTitle}
      </h3>

      {/* 정식 법안명은 카드에서 보조 정보로 내린다. */}
      <p className="mt-1 line-clamp-1 text-xs text-ink-faint">{bill.title}</p>

      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-ko-tight text-ink-soft">
        {bill.summary30s}
      </p>

      <ul className="mt-4 flex flex-wrap gap-1.5">
        {shown.map((tag) => (
          <li
            key={tag}
            className="rounded-full bg-paper-dim px-2 py-0.5 text-xs text-ink-faint"
          >
            #{tag}
          </li>
        ))}
        {rest > 0 && (
          <li className="rounded-full px-1 py-0.5 text-xs text-ink-faint">
            외 {rest}개
          </li>
        )}
      </ul>

      <div className="mt-4 flex items-center justify-between border-t border-paper-line pt-3 text-xs text-ink-faint">
        <span>{bill.lastUpdated} 업데이트</span>
        <span
          aria-hidden
          className="font-semibold text-brand-strong transition-transform group-hover:translate-x-0.5"
        >
          자세히 보기 →
        </span>
      </div>
    </Link>
  );
}
