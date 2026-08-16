import Link from "next/link";
import type { Bill } from "@/types/bill";
import StatusBadge from "./StatusBadge";

export default function BillCard({ bill }: { bill: Bill }) {
  return (
    <Link
      href={`/bills/${bill.slug}`}
      className="group flex flex-col rounded-xl border border-paper-line bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-brand-dark">
          {bill.category}
        </span>
        <StatusBadge status={bill.status} />
      </div>
      <h3 className="mt-3 font-serif text-xl font-bold leading-snug text-ink group-hover:text-brand-dark">
        {bill.shortTitle}
      </h3>
      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-ink-soft">
        {bill.summary30s}
      </p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {bill.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-paper-dim px-2 py-0.5 text-xs text-ink-faint"
          >
            #{tag}
          </span>
        ))}
      </div>
      <p className="mt-4 text-xs text-ink-faint">최근 업데이트 {bill.lastUpdated}</p>
    </Link>
  );
}
