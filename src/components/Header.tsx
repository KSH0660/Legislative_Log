"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";

const NAV_LINKS = [
  { href: "/bills", label: "법안·정책" },
  { href: "/corrections", label: "정정 기록" },
  { href: "/about", label: "소개" },
];

/**
 * 헤더 높이는 아래에 붙는 목차 바와 섹션 스크롤 여백이 기준으로 삼는 값이다.
 * 글꼴 높이에 따라 들쭉날쭉해지지 않도록 h-14 / sm:h-16으로 고정한다.
 * (테두리 1px 포함 실제 높이: 모바일 57px, sm 이상 65px)
 * globals.css의 --header-h와 같은 값을 유지해야 한다.
 */
export default function Header() {
  const pathname = usePathname() ?? "/";
  const [scrolled, setScrolled] = useState(false);

  // 맨 위에 있을 때는 선을 지워 본문과 이어 보이게 하고,
  // 스크롤을 내리면 그때 경계를 만들어 준다.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-print-hide
      className={`glass sticky top-0 z-40 border-b transition-[border-color,box-shadow] duration-200 ease-out ${
        scrolled
          ? "border-paper-line shadow-float"
          : "border-transparent shadow-none"
      }`}
    >
      <div className="mx-auto flex h-14 max-w-content items-stretch justify-between gap-2 px-3 sm:h-16 sm:gap-3 sm:px-6">
        <Link
          href="/"
          className="group flex items-center gap-2.5 self-center rounded-lg"
          aria-label="입법로그 홈으로"
        >
          {/* 기록을 쌓는다는 뜻을 담은 표식 — 아래에서 위로 쌓이는 세 줄.
              좁은 화면에서는 메뉴가 두 줄로 접히지 않도록 표식을 감춘다. */}
          <span
            aria-hidden
            className="hidden h-7 w-7 shrink-0 items-center justify-center rounded-md bg-ink text-paper transition-transform duration-200 ease-out group-hover:-rotate-3 sm:flex"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round">
              <path d="M5 18h14M5 12.5h9M5 7h5" />
            </svg>
          </span>
          <span className="flex items-baseline gap-2">
            <span className="font-serif text-base font-bold tracking-tight text-ink sm:text-xl">
              입법로그
            </span>
            <span className="hidden font-sans text-[11px] tracking-[0.08em] text-ink-faint md:inline">
              Legislative Log
            </span>
          </span>
        </Link>

        <div className="flex items-stretch gap-1">
          <nav aria-label="주요 메뉴" className="flex items-stretch">
            {NAV_LINKS.map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative flex items-center whitespace-nowrap rounded-lg px-1.5 text-xs font-medium transition-colors duration-150 sm:px-3.5 sm:text-sm ${
                    active
                      ? "font-semibold text-ink"
                      : "text-ink-soft hover:bg-paper-dim hover:text-ink"
                  }`}
                >
                  {link.label}
                  {/* 현재 위치 표시. 색만으로 구분하지 않도록 굵기도 함께 바뀐다. */}
                  {active && (
                    <span
                      aria-hidden
                      className="absolute inset-x-1.5 bottom-1.5 h-[2px] rounded-full bg-brand sm:inset-x-3.5"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <span aria-hidden className="mx-1 my-auto hidden h-5 w-px bg-paper-line sm:block" />

          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
