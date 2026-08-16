"use client";

import { useEffect, useState } from "react";
import { BILL_SECTIONS } from "@/lib/sections";

/**
 * 법안 상세는 한 페이지가 매우 길어서, 지금 어디를 읽고 있는지 알기 어렵다.
 * 데스크톱에서는 옆에 붙는 고정 목차를, 모바일에서는 상단에 붙는 목차를 쓴다.
 *
 * position: sticky는 부모 요소 높이를 벗어나 붙어 있을 수 없다.
 * 그래서 모바일 목차와 데스크톱 목차를 나눠 두고, 각각 본문만큼 키가 큰
 * 부모 안에 배치할 수 있게 별도 컴포넌트로 내보낸다.
 */
function useActiveSection() {
  const [activeId, setActiveId] = useState<string>(BILL_SECTIONS[0].id);

  useEffect(() => {
    const targets = BILL_SECTIONS.map((s) =>
      document.getElementById(s.id),
    ).filter((el): el is HTMLElement => Boolean(el));

    if (targets.length === 0) return;

    // 화면 위쪽 일부를 기준선으로 삼아, 그 선에 걸린 첫 섹션을 활성으로 본다.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return activeId;
}

function SectionList({
  activeId,
  onNavigate,
}: {
  activeId: string;
  onNavigate?: () => void;
}) {
  return (
    <ol className="space-y-0.5">
      {BILL_SECTIONS.map((s) => {
        const active = s.id === activeId;
        return (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              onClick={onNavigate}
              aria-current={active ? "true" : undefined}
              className={`flex items-baseline gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors ${
                active
                  ? "bg-paper-dim font-semibold text-ink"
                  : "text-ink-soft hover:bg-paper-dim/60 hover:text-ink"
              }`}
            >
              <span
                className={`shrink-0 font-serif text-[11px] tabular-nums ${
                  active ? "text-brand-strong" : "text-ink-faint"
                }`}
              >
                {s.label}
              </span>
              <span className="leading-snug">{s.nav}</span>
            </a>
          </li>
        );
      })}
    </ol>
  );
}

/**
 * 모바일 전용. 본문 전체를 감싸는 요소의 직계 자식으로 두어야 계속 붙어 있는다.
 * top 값은 Header의 고정 높이(모바일 57px, sm 이상 65px)와 맞춰 둔 것이다.
 */
export function SectionNavMobile() {
  const activeId = useActiveSection();
  const [open, setOpen] = useState(false);

  const index = BILL_SECTIONS.findIndex((s) => s.id === activeId);
  const current = BILL_SECTIONS[index] ?? BILL_SECTIONS[0];

  return (
    <div
      data-print-hide
      className="sticky top-[57px] z-30 border-b border-paper-line bg-paper/95 px-5 backdrop-blur-md sm:top-[65px] sm:px-6 lg:hidden"
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex h-11 w-full items-center gap-2 text-left"
      >
        <span className="font-serif text-[11px] font-bold text-brand-strong">
          {current.label}
        </span>
        <span className="flex-1 truncate text-sm font-semibold text-ink">
          {current.nav}
        </span>
        <span className="text-xs tabular-nums text-ink-faint">
          {index + 1}/{BILL_SECTIONS.length}
        </span>
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className={`h-4 w-4 text-ink-faint transition-transform ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
        <span className="sr-only">목차 {open ? "접기" : "펼치기"}</span>
      </button>

      {open && (
        <nav aria-label="이 페이지 목차" className="pb-3">
          <SectionList activeId={activeId} onNavigate={() => setOpen(false)} />
        </nav>
      )}
    </div>
  );
}

/** 데스크톱 전용 사이드 목차. */
export function SectionNavDesktop() {
  const activeId = useActiveSection();

  return (
    <nav
      aria-label="이 페이지 목차"
      data-print-hide
      className="sticky top-24 hidden max-h-[calc(100vh-8rem)] overflow-y-auto lg:block"
    >
      <p className="mb-2 px-2.5 text-xs font-bold tracking-[0.14em] text-ink-faint">
        이 페이지 목차
      </p>
      <SectionList activeId={activeId} />
    </nav>
  );
}
