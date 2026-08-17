import Link from "next/link";
import type { Bill, BillStatus } from "@/types/bill";
import StatusBadge from "./StatusBadge";

const MAX_TAGS = 3;

// 발의 → 통과 → 공포 → 시행. 카드에서도 어디까지 왔는지 한눈에 보이게 한다.
const STAGES: { key: string; reachedBy: BillStatus[] }[] = [
  { key: "발의", reachedBy: ["발의", "심사중", "본회의_계류", "통과", "공포", "시행"] },
  { key: "통과", reachedBy: ["통과", "공포", "시행"] },
  { key: "공포", reachedBy: ["공포", "시행"] },
  { key: "시행", reachedBy: ["시행"] },
];

function StageDots({ status }: { status: BillStatus }) {
  const discarded = status === "폐기";
  const reached = STAGES.map((s) => !discarded && s.reachedBy.includes(status));
  const done = reached.filter(Boolean).length;

  return (
    <span
      className="inline-flex items-center gap-1"
      title={
        discarded
          ? "폐기된 법안입니다"
          : `입법 4단계(발의·통과·공포·시행) 중 ${done}단계까지 진행`
      }
    >
      <span aria-hidden className="flex items-center gap-[3px]">
        {reached.map((on, i) => (
          <span
            key={STAGES[i].key}
            className={`h-1.5 w-1.5 rounded-full ${
              on ? "bg-brand" : "bg-paper-line"
            }`}
          />
        ))}
      </span>
      <span className="sr-only">
        {discarded
          ? "폐기된 법안"
          : `입법 4단계 중 ${done}단계 진행`}
      </span>
      <span
        aria-hidden
        className={`ml-0.5 text-[11px] text-ink-faint ${discarded ? "" : "num"}`}
      >
        {discarded ? "폐기" : `${done}/4`}
      </span>
    </span>
  );
}

export default function BillCard({ bill }: { bill: Bill }) {
  const shown = bill.tags.slice(0, MAX_TAGS);
  const rest = bill.tags.length - shown.length;

  return (
    <Link
      href={`/bills/${bill.slug}`}
      className="card-interactive group flex flex-col p-5 sm:p-6"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-brand-strong sm:text-xs">
          {bill.category}
        </span>
        <StatusBadge status={bill.status} />
      </div>

      <h3 className="mt-3.5 font-serif text-xl font-bold leading-snug text-ink transition-colors duration-150 group-hover:text-brand-strong">
        {bill.shortTitle}
      </h3>

      {/* 정식 법안명은 카드에서 보조 정보로 내린다. */}
      <p className="mt-1.5 line-clamp-1 text-xs text-ink-faint">{bill.title}</p>

      <p className="mt-3.5 line-clamp-3 flex-1 text-sm leading-ko-tight text-ink-soft">
        {bill.summary30s}
      </p>

      <ul className="mt-4 flex flex-wrap gap-1.5">
        {shown.map((tag) => (
          <li
            key={tag}
            className="rounded-full bg-paper-dim px-2 py-0.5 text-[11px] text-ink-faint ring-1 ring-inset ring-paper-line-soft"
          >
            #{tag}
          </li>
        ))}
        {rest > 0 && (
          <li className="px-1 py-0.5 text-[11px] text-ink-faint">외 {rest}개</li>
        )}
      </ul>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-paper-line pt-3.5">
        <StageDots status={bill.status} />
        <span className="text-[11px] text-ink-faint">
          <span className="num">{bill.lastUpdated}</span> 갱신
        </span>
      </div>

      <span
        aria-hidden
        className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-strong"
      >
        자세히 보기
        <svg
          viewBox="0 0 24 24"
          className="h-3.5 w-3.5 transition-transform duration-200 ease-out group-hover:translate-x-1"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h13M13 6l6 6-6 6" />
        </svg>
      </span>
    </Link>
  );
}
