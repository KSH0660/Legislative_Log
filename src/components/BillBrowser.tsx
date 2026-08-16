"use client";

import { useMemo, useState } from "react";
import type { Bill, BillStatus } from "@/types/bill";
import BillCard from "./BillCard";

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

export default function BillBrowser({ bills }: { bills: Bill[] }) {
  const [group, setGroup] = useState<GroupId>("all");
  const [category, setCategory] = useState<string>("전체");
  const [query, setQuery] = useState("");

  const categories = useMemo(
    () => ["전체", ...Array.from(new Set(bills.map((b) => b.category)))],
    [bills],
  );

  const counts = useMemo(() => {
    const map = new Map<GroupId, number>([["all", bills.length]]);
    (Object.keys(GROUP_STATUSES) as Exclude<GroupId, "all">[]).forEach((id) => {
      map.set(id, bills.filter((b) => GROUP_STATUSES[id].includes(b.status)).length);
    });
    return map;
  }, [bills]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bills.filter((bill) => {
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
  }, [bills, group, category, query]);

  const filtering = group !== "all" || category !== "전체" || query.trim() !== "";

  function reset() {
    setGroup("all");
    setCategory("전체");
    setQuery("");
  }

  return (
    <div>
      {/* 검색 */}
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
          className="w-full rounded-xl border border-paper-line bg-surface py-3 pl-11 pr-4 text-sm text-ink placeholder:text-ink-faint focus:border-brand/50"
        />
      </div>

      {/* 진행 단계 */}
      <div className="mt-4">
        <p className="mb-2 text-xs font-bold tracking-wide text-ink-faint">
          진행 단계
        </p>
        <div className="flex flex-wrap gap-2">
          {GROUPS.map((g) => {
            const active = group === g.id;
            const count = counts.get(g.id) ?? 0;
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => setGroup(g.id)}
                aria-pressed={active}
                title={"hint" in g ? g.hint : undefined}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? "border-ink bg-ink text-paper"
                    : "border-paper-line bg-surface text-ink-soft hover:border-brand/45 hover:text-ink"
                }`}
              >
                {g.label}
                <span
                  className={`text-xs tabular-nums ${
                    active ? "text-paper/70" : "text-ink-faint"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 분야 */}
      {categories.length > 2 && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-bold tracking-wide text-ink-faint">
            분야
          </p>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => {
              const active = category === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  aria-pressed={active}
                  className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                    active
                      ? "border-brand bg-brand/10 text-brand-strong"
                      : "border-paper-line bg-surface text-ink-soft hover:border-brand/45 hover:text-ink"
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 결과 */}
      <div className="mt-8 flex items-center justify-between gap-4 border-t border-paper-line pt-5">
        <p aria-live="polite" className="text-sm text-ink-soft">
          <strong className="font-bold text-ink">{filtered.length}건</strong>
          {filtering && (
            <span className="text-ink-faint"> / 전체 {bills.length}건</span>
          )}
        </p>
        {filtering && (
          <button
            type="button"
            onClick={reset}
            className="rounded text-sm font-medium text-brand-strong underline-offset-4 hover:underline"
          >
            조건 지우기
          </button>
        )}
      </div>

      {filtered.length > 0 ? (
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((bill) => (
            <BillCard key={bill.slug} bill={bill} />
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-xl border border-dashed border-paper-line py-16 text-center">
          <p className="font-semibold text-ink">조건에 맞는 기록이 없습니다.</p>
          <p className="mt-1.5 text-sm text-ink-soft">
            검색어를 줄이거나 진행 단계를 &lsquo;전체&rsquo;로 바꿔 보세요.
          </p>
          <button
            type="button"
            onClick={reset}
            className="btn-secondary mt-5 py-2 text-sm"
          >
            조건 지우기
          </button>
        </div>
      )}
    </div>
  );
}
