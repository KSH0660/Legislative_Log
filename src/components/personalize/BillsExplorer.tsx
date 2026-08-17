"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Bill } from "@/types/bill";
import type { BillImpactData } from "@/types/impact";
import { personalize } from "@/lib/impact";
import { getQuestion } from "@/lib/profile/questions";
import BillBrowser from "@/components/BillBrowser";
import { usePersonalization } from "./PersonalizationProvider";
import ProfileForm from "./ProfileForm";
import ImpactMap from "./ImpactMap";
import { PersonalizationDisclosure } from "./atoms";

// 법안 목록 화면의 개인화 껍데기. §10.1 · §10.2 · §13.2
//
// 첫 페인트는 언제나 비개인화 상태다. 저장된 프로필 복원은 useEffect에서만 하고,
// 순서가 바뀌면 aria-live로 알린다.

type Tab = "list" | "map";

export default function BillsExplorer({
  bills,
  impact,
}: {
  bills: Bill[];
  /** 서버에서 직렬화해 넘긴 개인화 데이터 (slug → 경로) */
  impact: Record<string, BillImpactData>;
}) {
  const { ready, enabled, setEnabled, profile, asOf, clear, announce } =
    usePersonalization();
  const [tab, setTab] = useState<Tab>("list");
  const [editing, setEditing] = useState(false);

  const impactMap = useMemo(
    () => new Map(Object.entries(impact)),
    [impact],
  );

  const active = ready && enabled;

  const result = useMemo(
    () => (active ? personalize(bills, impactMap, profile, asOf) : null),
    [active, bills, impactMap, profile, asOf],
  );

  // §13.2 규칙 3 — 순서가 바뀐 사실이 스크린리더 사용자에게 침묵으로 지나가지 않게 한다.
  const wasActive = useRef(false);
  useEffect(() => {
    if (active && !wasActive.current) {
      announce(`내 조건에 맞춰 ${bills.length}건을 다시 정렬했습니다.`);
    } else if (!active && wasActive.current) {
      announce("개인화를 껐습니다. 갱신일 순서로 되돌렸습니다.");
    }
    wasActive.current = active;
  }, [active, bills.length, announce]);

  const answeredCount = Object.keys(profile).filter(
    (f) => !profile[f as keyof typeof profile]?.declined,
  ).length;

  const summaryText =
    answeredCount === 0
      ? "아직 답한 조건이 없습니다."
      : (Object.keys(profile) as (keyof typeof profile)[])
          .filter((f) => profile[f] && !profile[f]!.declined)
          .map((f) => getQuestion(f).label)
          .join(" · ");

  return (
    <div>
      {/* ── 개인화 패널 ─────────────────────────────────────── */}
      {/* 비개인화 상태에서도 자리를 확보해 레이아웃 점프를 줄인다. (§13.2 규칙 4) */}
      <section
        aria-labelledby="personalize-title"
        className="min-h-[7.5rem] rounded-2xl border border-paper-line bg-surface p-4 sm:p-5"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h2
              id="personalize-title"
              className="font-serif text-lg font-bold text-ink"
            >
              내 조건에 맞춰 보기
            </h2>
            <p className="mt-1 text-sm leading-ko text-ink-soft">
              {active
                ? summaryText
                : "연령대·경제활동·가구·소득 구간을 고르면, 어떤 법안이 왜 나와 연결되는지 조건과 근거로 설명해 드립니다."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setEditing((v) => !v)}
              className={active ? "btn-secondary" : "btn-primary"}
            >
              {editing ? "질문 접기" : active ? "조건 수정" : "내 조건 입력하기"}
            </button>
            {active && (
              <button
                type="button"
                onClick={() => setEnabled(false)}
                className="btn-ghost"
              >
                개인화 끄기
              </button>
            )}
            {!active && ready && answeredCount > 0 && (
              <button
                type="button"
                onClick={() => setEnabled(true)}
                className="btn-secondary"
              >
                개인화 켜기
              </button>
            )}
          </div>
        </div>

        {editing && ready && (
          <div className="mt-4 border-t border-paper-line pt-4">
            <ProfileForm
              pendingFields={result?.pendingFields ?? []}
              onClose={() => setEditing(false)}
            />
          </div>
        )}

        {active && !editing && (
          <p className="mt-3 text-xs leading-ko text-ink-faint">
            정당·지지 성향은 묻지도, 계산에 쓰지도 않습니다.{" "}
            <button
              type="button"
              onClick={clear}
              className="rounded font-semibold text-brand-strong underline decoration-brand/35 underline-offset-4 hover:decoration-brand"
            >
              내 정보 지우기
            </button>
          </p>
        )}
      </section>

      {/* ── 탭 ──────────────────────────────────────────────── */}
      {active && result && (
        <div
          role="tablist"
          aria-label="보기 방식"
          className="mt-6 flex gap-1 border-b border-paper-line"
        >
          {(
            [
              { id: "list" as const, label: "법안 목록" },
              { id: "map" as const, label: "내 조건 기준 영향 지도" },
            ]
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={tab === t.id}
              aria-controls={`panel-${t.id}`}
              onClick={() => setTab(t.id)}
              className={`-mb-px min-h-[2.75rem] cursor-pointer border-b-2 px-3.5 text-sm transition-colors duration-150 ${
                tab === t.id
                  ? "border-brand font-bold text-ink"
                  : "border-transparent font-medium text-ink-faint hover:text-ink"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {active && result && tab === "map" ? (
        <div
          role="tabpanel"
          id="panel-map"
          aria-labelledby="tab-map"
          className="mt-6"
        >
          <ImpactMap result={result} profile={profile} asOf={asOf} />
        </div>
      ) : (
        <div
          role={active ? "tabpanel" : undefined}
          id={active ? "panel-list" : undefined}
          aria-labelledby={active ? "tab-list" : undefined}
          className="mt-6"
        >
          {result && <EmptyStateFraming result={result} />}
          <BillBrowser bills={bills} personalized={result} />
          {active && <PersonalizationDisclosure className="mt-8" />}
        </div>
      )}
    </div>
  );
}

/**
 * §15.1 B안 — `연결 없음`이 다수인 화면을 실패가 아니라 정보로 읽히게 만든다.
 * 분모와 이유를 앞세운다.
 */
function EmptyStateFraming({
  result,
}: {
  result: ReturnType<typeof personalize>;
}) {
  const linked = result.items.filter(
    (i) => i.relevance.relevance !== "none",
  ).length;
  const unrelated = result.total - linked;
  if (unrelated === 0) return null;

  return (
    <div className="mb-5 rounded-xl border border-paper-line bg-paper-dim/60 p-4 text-sm leading-ko text-ink-soft sm:p-5">
      <p>
        지금 추적 중인{" "}
        <strong className="font-bold text-ink">{result.total}건</strong> 중 당신의
        생활조건과 연결되는 건{" "}
        <strong className="font-bold text-ink">{linked}건</strong>입니다. 나머지{" "}
        {unrelated}건은 제도 전반에 관한 법안이라 개인 조건으로 우선순위를 정할
        근거가 없습니다.
      </p>
      <p className="mt-2 text-xs text-ink-faint">
        연결이 없다는 것은 그 법안이 덜 중요하다는 뜻이 아닙니다. 왜 연결이 없는지도
        카드마다 적어 두었습니다.
      </p>
    </div>
  );
}
