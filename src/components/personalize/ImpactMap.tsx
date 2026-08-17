"use client";

import { useState } from "react";
import Link from "next/link";
import type { Bill } from "@/types/bill";
import { IMPACT_DOMAIN_LABEL, type ImpactDomain } from "@/types/impact";
import type { UserProfile } from "@/types/profile";
import type { PersonalizationResult, PersonalizedBill } from "@/lib/impact";
import {
  BUCKET_LABEL,
  BUCKET_ORDER,
  CELL_LABEL,
  CELL_SYMBOL,
  cellDetail,
  DOMAIN_GROUPS,
  type CellState,
} from "@/lib/impact/map";
import { getQuestion } from "@/lib/profile/questions";
import { CellChip, PersonalizationDisclosure } from "./atoms";
import PathwayDetail from "./PathwayDetail";

// 내 조건 기준 영향 지도. §9 · §10.2
//
// 이 화면은 사용자의 선택조건과 연결된 법안 경로를 집계하는 것이며,
// 실제 유사집단 모집단을 추정하는 화면이 아니다. 그래서 이름도
// `나와 비슷한 사람`이 아니라 `내 조건 기준 영향 지도`다. (§9.1)

interface Column {
  id: string;
  label: string;
  short: string;
  domains: ImpactDomain[];
}

const GROUPED_COLUMNS: Column[] = DOMAIN_GROUPS.map((g) => ({
  id: g.id,
  label: g.label,
  short: g.short,
  domains: g.domains,
}));

const ALL_COLUMNS: Column[] = DOMAIN_GROUPS.flatMap((g) =>
  g.domains.map((d) => ({
    id: d,
    label: IMPACT_DOMAIN_LABEL[d],
    short: IMPACT_DOMAIN_LABEL[d],
    domains: [d],
  })),
);

const CELL_BUTTON_STYLE: Record<CellState, string> = {
  benefit: "text-claim-fact hover:bg-claim-fact-bg",
  burden: "text-claim-forecast hover:bg-claim-forecast-bg",
  mixed: "text-claim-interpretation hover:bg-claim-interpretation-bg",
  no_change: "text-ink-soft hover:bg-paper-dim",
  insufficient: "text-ink-faint hover:bg-paper-dim",
  not_applicable: "text-ink-faint/60 hover:bg-paper-dim",
};

function SummaryRow({ result }: { result: PersonalizationResult }) {
  return (
    <div className="rounded-xl border border-paper-line bg-surface p-4 sm:p-5">
      <p className="text-sm text-ink-soft">
        추적 중인 <strong className="font-bold text-ink">전체 {result.total}건</strong>{" "}
        중
      </p>
      <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {BUCKET_ORDER.map((bucket) => (
          <li
            key={bucket}
            className="rounded-lg border border-paper-line bg-paper-dim/50 px-3 py-2.5"
          >
            <p className="text-xs leading-ko-tight text-ink-soft">
              {BUCKET_LABEL[bucket]}
            </p>
            <p className="num mt-1 text-lg font-bold text-ink">
              {result.counts[bucket]}
              <span className="ml-0.5 text-xs font-medium text-ink-faint">건</span>
            </p>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs leading-ko text-ink-faint">
        여섯 범주는 서로 겹치지 않고 전체를 나눕니다. 합은 언제나 {result.total}건입니다.
        자료가 부족한 법안을 분모에서 빼지 않습니다. `판단자료 부족`은 영향이 없다는
        뜻이 아니라 아직 판정할 근거가 없다는 뜻입니다.
      </p>
    </div>
  );
}

function ConditionSummary({
  result,
  profile,
}: {
  result: PersonalizationResult;
  profile: UserProfile;
}) {
  const used = (Object.keys(profile) as (keyof UserProfile)[]).filter(
    (f) => profile[f] && !profile[f]!.declined,
  );
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="rounded-xl border border-paper-line bg-surface px-4 py-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">
          사용한 조건
        </p>
        <p className="mt-1.5 text-sm leading-ko text-ink-soft">
          {used.length > 0
            ? used.map((f) => getQuestion(f).label).join(" · ")
            : "아직 답한 조건이 없습니다."}
        </p>
      </div>
      <div className="rounded-xl border border-dashed border-paper-line bg-paper-dim/50 px-4 py-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">
          빠진 조건
        </p>
        <p className="mt-1.5 text-sm leading-ko text-ink-soft">
          {result.pendingFields.length > 0
            ? result.pendingFields.map((f) => getQuestion(f).label).join(" · ")
            : "판정을 바꿀 수 있는 미확인 조건이 없습니다."}
        </p>
      </div>
    </div>
  );
}

function CellDetailPanel({
  item,
  column,
  profile,
  asOf,
  onClose,
}: {
  item: PersonalizedBill;
  column: Column;
  profile: UserProfile;
  asOf: string;
  onClose: () => void;
}) {
  const detail = cellDetail(item.relevance, column.domains);

  return (
    <div className="mt-4 rounded-xl border border-brand/40 bg-brand-wash/40 p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-serif text-lg font-bold text-ink">
            {item.bill.shortTitle} · {column.label}
          </p>
          <div className="mt-1.5">
            <CellChip state={detail.state} />
          </div>
        </div>
        <button type="button" onClick={onClose} className="btn-ghost">
          닫기
        </button>
      </div>

      {detail.paths.length === 0 ? (
        <p className="mt-3 text-sm leading-ko text-ink-soft">
          이 법안에는 {column.label} 영역에 해당하는 경로 자체가 없습니다. 검토
          범위 밖이라는 뜻이며, 영향이 없다고 확인했다는 뜻은 아닙니다.
        </p>
      ) : (
        <>
          {detail.directionUnknownCount > 0 && (
            <p className="mt-3 rounded-lg border border-dashed border-paper-line bg-surface px-3 py-2 text-xs leading-ko text-ink-soft">
              이 칸에는 방향을 아직 정하지 못한 경로가{" "}
              <strong className="font-bold text-ink">
                {detail.directionUnknownCount}건
              </strong>{" "}
              있습니다. 방향이 확인된 경로가 있으면 기호는 그쪽을 따르고, 미확정
              경로는 여기에 따로 적습니다.
            </p>
          )}
          <div className="mt-3 space-y-3">
            {detail.paths.map((e) => (
              <PathwayDetail
                key={e.pathway.id}
                evaluation={e}
                bill={item.bill}
                profile={profile}
                asOf={asOf}
              />
            ))}
          </div>
        </>
      )}

      <Link
        href={`/bills/${item.bill.slug}#stakeholders`}
        className="link-quiet mt-4 inline-block text-sm"
      >
        {item.bill.shortTitle} 상세로 이동
      </Link>
    </div>
  );
}

export default function ImpactMap({
  result,
  profile,
  asOf,
}: {
  result: PersonalizationResult;
  profile: UserProfile;
  asOf: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [open, setOpen] = useState<{ slug: string; column: string } | null>(null);

  const columns = expanded ? ALL_COLUMNS : GROUPED_COLUMNS;
  const openItem = open ? result.bySlug.get(open.slug) : undefined;
  const openColumn = open ? columns.find((c) => c.id === open.column) : undefined;

  function toggleCell(bill: Bill, column: Column) {
    setOpen((prev) =>
      prev && prev.slug === bill.slug && prev.column === column.id
        ? null
        : { slug: bill.slug, column: column.id },
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-serif text-heading font-bold text-ink">
          내 조건 기준 영향 지도
        </h2>
        <p className="mt-2 max-w-prose text-sm leading-ko text-ink-soft">
          내가 고른 생활조건과 연결되는 법안 경로를 모아 놓은 표입니다. 비슷한
          사람들의 통계가 아니라, <strong className="font-semibold text-ink">내가 답한 조건</strong>으로
          법안 문안을 대조한 결과입니다.
        </p>
      </div>

      <ConditionSummary result={result} profile={profile} />
      <SummaryRow result={result} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-soft">
          기호를 선택하면 영향경로·출처·가정·불확실성을 볼 수 있습니다.
        </p>
        <button
          type="button"
          onClick={() => {
            setExpanded((v) => !v);
            setOpen(null);
          }}
          aria-pressed={expanded}
          className="btn-secondary"
        >
          {expanded ? "5개 묶음으로 보기" : "생활영역 9개 전체 펼치기"}
        </button>
      </div>

      {/* 데스크톱 — 매트릭스 */}
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full border-collapse text-sm">
          <caption className="sr-only">
            법안별·생활영역별 영향 방향. 각 칸은 기호와 상태 이름을 함께 제공합니다.
          </caption>
          <thead>
            <tr>
              <th
                scope="col"
                className="border-b border-paper-line px-3 py-2.5 text-left text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint"
              >
                법안
              </th>
              {columns.map((c) => (
                <th
                  key={c.id}
                  scope="col"
                  className="border-b border-paper-line px-2 py-2.5 text-center text-[11px] font-bold text-ink-faint"
                >
                  {c.short}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.items.map((item) => (
              <tr key={item.bill.slug} className="border-b border-paper-line-soft">
                <th
                  scope="row"
                  className="px-3 py-2.5 text-left align-middle font-medium text-ink"
                >
                  <Link
                    href={`/bills/${item.bill.slug}`}
                    className="rounded underline-offset-4 hover:text-brand-strong hover:underline"
                  >
                    {item.bill.shortTitle}
                  </Link>
                </th>
                {columns.map((c) => {
                  const state = cellDetail(item.relevance, c.domains).state;
                  const active =
                    open?.slug === item.bill.slug && open.column === c.id;
                  return (
                    <td key={c.id} className="px-1 py-1.5 text-center">
                      <button
                        type="button"
                        onClick={() => toggleCell(item.bill, c)}
                        aria-expanded={active}
                        aria-label={`${item.bill.shortTitle} · ${c.label}: ${CELL_LABEL[state]}`}
                        className={`num inline-flex h-9 w-full min-w-[2.5rem] items-center justify-center rounded-lg text-base font-bold transition-colors duration-150 ${
                          CELL_BUTTON_STYLE[state]
                        } ${active ? "ring-2 ring-inset ring-brand" : ""}`}
                      >
                        <span aria-hidden>{CELL_SYMBOL[state]}</span>
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 모바일 — 같은 정보를 카드로 재배치한다. 정보 손실 없음 (§17.3) */}
      <div className="space-y-3 lg:hidden">
        {result.items.map((item) => (
          <div key={item.bill.slug} className="card p-4">
            <Link
              href={`/bills/${item.bill.slug}`}
              className="rounded font-semibold text-ink underline-offset-4 hover:text-brand-strong hover:underline"
            >
              {item.bill.shortTitle}
            </Link>
            <ul className="mt-3 space-y-1.5">
              {columns.map((c) => {
                const state = cellDetail(item.relevance, c.domains).state;
                const active =
                  open?.slug === item.bill.slug && open.column === c.id;
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => toggleCell(item.bill, c)}
                      aria-expanded={active}
                      className={`flex w-full items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-left transition-colors duration-150 hover:bg-paper-dim ${
                        active ? "ring-2 ring-inset ring-brand" : ""
                      }`}
                    >
                      <span className="text-sm text-ink-soft">{c.label}</span>
                      <CellChip state={state} />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {openItem && openColumn && (
        <CellDetailPanel
          item={openItem}
          column={openColumn}
          profile={profile}
          asOf={asOf}
          onClose={() => setOpen(null)}
        />
      )}

      <PersonalizationDisclosure />

      <p className="text-xs leading-ko text-ink-faint">
        이 표는 대표 가구 미시자료를 쓰지 않습니다. 그래서 &lsquo;나와 비슷한
        사람들 중 몇 %가 이득&rsquo; 같은 숫자는 제공하지 않습니다. 대표자료와
        조사 가중치가 확보되면 집단 정의·표본수·범위·불확실성을 모두 공개한 뒤에만
        집단 통계를 내겠습니다.
      </p>
    </div>
  );
}
