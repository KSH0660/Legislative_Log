"use client";

import { useMemo, useState } from "react";
import type { Bill, BillStatus } from "@/types/bill";
import type { PersonalizationResult } from "@/lib/impact";
import BillCard from "./BillCard";
import BillCardPersonalization, {
  RelevanceHeader,
} from "./personalize/BillCardPersonalization";

// 상세한 진행 단계를 그대로 보여주면 고르기 어려워서, 세 덩어리로 묶는다.
const GROUPS = [
  { id: "all", label: "전체" },
  { id: "effect", label: "시행 중", hint: "이미 효력이 생긴 법" },
  { id: "pending", label: "국회 심사 중", hint: "아직 통과 전" },
  { id: "passed", label: "통과·공포", hint: "통과했지만 시행 전" },
] as const;

type GroupId = (typeof GROUPS)[number]["id"];

const GROUP_STATUSES: Record<Exclude<GroupId, "all">, BillStatus[]> = {
  effect: ["시행"],
  pending: ["발의", "심사중", "본회의_계류"],
  passed: ["통과", "공포"],
};

/** 필터 칩. 선택 상태는 색만이 아니라 굵기·테두리로도 드러낸다. */
function FilterChip({
  active,
  onClick,
  title,
  children,
}: {
  active: boolean;
  onClick: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      title={title}
      className={`inline-flex min-h-[2.25rem] cursor-pointer items-center gap-1.5 rounded-full border px-3.5 text-sm transition-[background-color,border-color,color] duration-150 ${
        active
          ? "border-ink bg-ink font-semibold text-paper"
          : "border-paper-line bg-surface font-medium text-ink-soft hover:border-brand/45 hover:bg-paper-dim hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

export default function BillBrowser({
  bills,
  /**
   * 개인화 결과. 있으면 정렬 기준만 §7.5로 바뀌고, 아래 필터는 그대로 작동한다.
   * 두 축은 직교한다. (§10.1)
   */
  personalized,
}: {
  bills: Bill[];
  personalized?: PersonalizationResult | null;
}) {
  const [group, setGroup] = useState<GroupId>("all");
  const [category, setCategory] = useState<string>("전체");
  const [query, setQuery] = useState("");

  const categories = useMemo(
    () => ["전체", ...Array.from(new Set(bills.map((b) => b.category)))],
    [bills],
  );

  // 개인화가 켜지면 목록 순서만 관련 순서로 바뀐다. 필터 결과 집합은 같다.
  const ordered = useMemo(
    () => (personalized ? personalized.items.map((i) => i.bill) : bills),
    [bills, personalized],
  );

  const counts = useMemo(() => {
    const map = new Map<GroupId, number>([["all", bills.length]]);
    (Object.keys(GROUP_STATUSES) as Exclude<GroupId, "all">[]).forEach((id) => {
      map.set(
        id,
        bills.filter((b) => GROUP_STATUSES[id].includes(b.status)).length,
      );
    });
    return map;
  }, [bills]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ordered.filter((bill) => {
      if (group !== "all" && !GROUP_STATUSES[group].includes(bill.status)) {
        return false;
      }
      if (category !== "전체" && bill.category !== category) return false;
      if (!q) return true;
      const haystack = [
        bill.title,
        bill.shortTitle,
        bill.category,
        bill.summary30s,
        ...bill.tags,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [ordered, group, category, query]);

  const filtering =
    group !== "all" || category !== "전체" || query.trim() !== "";

  function reset() {
    setGroup("all");
    setCategory("전체");
    setQuery("");
  }

  return (
    <div>
      {/* 검색 + 필터를 한 판에 묶어, 목록과 조작부를 시각적으로 분리한다. */}
      <div className="rounded-2xl border border-paper-line bg-paper-dim/70 p-4 sm:p-5">
        <div className="relative">
          <label htmlFor="bill-search" className="sr-only">
            법안 검색
          </label>
          <span
            aria-hidden
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-[18px] w-[18px]"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </span>
          <input
            id="bill-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="법안 이름이나 키워드로 찾기 (예: 연금, 노동)"
            className="w-full rounded-xl border border-paper-line bg-surface py-3 pl-11 pr-4 text-[15px] text-ink shadow-card transition-colors duration-150 placeholder:text-ink-faint hover:border-brand/35 focus:border-brand/60"
          />
        </div>

        {/* 진행 단계 */}
        <div className="mt-4">
          <p
            id="filter-stage"
            className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-ink-faint"
          >
            진행 단계
          </p>
          <div
            role="group"
            aria-labelledby="filter-stage"
            className="flex flex-wrap gap-2"
          >
            {GROUPS.map((g) => {
              const active = group === g.id;
              const count = counts.get(g.id) ?? 0;
              return (
                <FilterChip
                  key={g.id}
                  active={active}
                  onClick={() => setGroup(g.id)}
                  title={"hint" in g ? g.hint : undefined}
                >
                  {g.label}
                  <span
                    className={`num text-xs ${
                      active ? "text-paper/70" : "text-ink-faint"
                    }`}
                  >
                    {count}
                  </span>
                </FilterChip>
              );
            })}
          </div>
        </div>

        {/* 분야 */}
        {categories.length > 2 && (
          <div className="mt-4 border-t border-paper-line pt-4">
            <p
              id="filter-category"
              className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-ink-faint"
            >
              분야
            </p>
            <div
              role="group"
              aria-labelledby="filter-category"
              className="flex flex-wrap gap-2"
            >
              {categories.map((c) => (
                <FilterChip
                  key={c}
                  active={category === c}
                  onClick={() => setCategory(c)}
                >
                  {c}
                </FilterChip>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 결과 */}
      <div className="mt-6 flex items-center justify-between gap-4">
        <p aria-live="polite" className="text-sm text-ink-soft">
          <strong className="font-bold text-ink">
            <span className="num">{filtered.length}</span>건
          </strong>
          {filtering && (
            <span className="text-ink-faint"> / 전체 {bills.length}건</span>
          )}
          {personalized && (
            <span className="text-ink-faint"> · 내 조건에 맞춘 정렬</span>
          )}
        </p>
        {filtering && (
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-[2.25rem] cursor-pointer items-center gap-1.5 rounded-lg px-2.5 text-sm font-medium text-brand-strong transition-colors duration-150 hover:bg-paper-dim"
          >
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.4}
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
            조건 지우기
          </button>
        )}
      </div>

      {filtered.length > 0 ? (
        <div
          className={`mt-4 grid gap-5 ${
            personalized ? "lg:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {filtered.map((bill) => {
            const item = personalized?.bySlug.get(bill.slug);
            return (
              <BillCard
                key={bill.slug}
                bill={bill}
                personalHeader={item ? <RelevanceHeader item={item} /> : undefined}
                personalBody={
                  item ? <BillCardPersonalization item={item} /> : undefined
                }
              />
            );
          })}
        </div>
      ) : (
        <div className="mt-4 rounded-2xl border border-dashed border-paper-line px-6 py-16 text-center">
          <span
            aria-hidden
            className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-paper-dim text-ink-faint"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </span>
          <p className="mt-4 font-semibold text-ink">
            조건에 맞는 기록이 없습니다.
          </p>
          <p className="mx-auto mt-1.5 max-w-xs text-sm leading-ko text-ink-soft">
            검색어를 줄이거나 진행 단계를 &lsquo;전체&rsquo;로 바꿔 보세요.
          </p>
          <button type="button" onClick={reset} className="btn-secondary mt-6">
            조건 지우기
          </button>
        </div>
      )}
    </div>
  );
}
