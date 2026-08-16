"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
 */
export default function Header() {
  const pathname = usePathname() ?? "/";

  return (
    <header
      data-print-hide
      className="sticky top-0 z-40 border-b border-paper-line bg-paper/95 backdrop-blur-md"
    >
      <div className="mx-auto flex h-14 max-w-content items-stretch justify-between gap-3 px-4 sm:h-16 sm:px-6">
        <Link
          href="/"
          className="flex items-baseline gap-2 self-center rounded"
          aria-label="입법로그 홈으로"
        >
          <span className="font-serif text-lg font-bold tracking-tight text-ink sm:text-xl">
            입법로그
          </span>
          <span className="hidden font-sans text-[11px] tracking-wide text-ink-faint sm:inline">
            Legislative Log
          </span>
        </Link>

        <div className="flex items-stretch">
          <nav aria-label="주요 메뉴" className="flex items-stretch">
            {NAV_LINKS.map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative flex items-center rounded-lg px-2.5 text-[13px] font-medium transition-colors sm:px-3 sm:text-sm ${
                    active
                      ? "font-semibold text-ink"
                      : "text-ink-soft hover:bg-paper-dim hover:text-ink"
                  }`}
                >
                  {link.label}
                  {active && (
                    <span
                      aria-hidden
                      className="absolute inset-x-2.5 bottom-0 h-0.5 rounded-full bg-brand sm:inset-x-3"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <span aria-hidden className="mx-2 my-auto h-5 w-px bg-paper-line" />

          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
