"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  // 서버 렌더 시점에는 사용자의 테마를 알 수 없으므로, 마운트 후에만 실제 상태를 그린다.
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // 저장이 막혀 있어도 현재 세션 전환은 그대로 동작한다.
    }
  }

  const label = isDark ? "밝은 화면으로 보기" : "어두운 화면으로 보기";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      data-print-hide
      className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-soft transition-colors hover:bg-paper-dim hover:text-ink"
    >
      {/* 마운트 전에는 아이콘을 비워 두어 서버/클라이언트 불일치를 피한다. */}
      {mounted ? (
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className="h-[18px] w-[18px]"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {isDark ? (
            <>
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
            </>
          ) : (
            <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
          )}
        </svg>
      ) : (
        <span className="h-[18px] w-[18px]" />
      )}
    </button>
  );
}
