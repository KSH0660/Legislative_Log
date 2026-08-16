import Link from "next/link";

const NAV = [
  { href: "/bills", label: "법안·정책 추적", desc: "지금 추적 중인 법과 정책" },
  { href: "/corrections", label: "정정 기록", desc: "틀린 내용을 고친 기록" },
  { href: "/about", label: "소개", desc: "원칙과 분석 방법" },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-paper-line bg-paper-dim">
      <div className="mx-auto max-w-content px-5 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-3 sm:gap-8">
          <div>
            <div className="flex items-center gap-2.5">
              <span
                aria-hidden
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-ink text-paper"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round">
                  <path d="M5 18h14M5 12.5h9M5 7h5" />
                </svg>
              </span>
              <p className="font-serif text-lg font-bold text-ink">입법로그</p>
            </div>
            <p className="mt-3 text-sm leading-ko text-ink-soft">
              누가 말했는지가 아니라,
              <br />
              무엇이 실제로 바뀌는지를 봅니다.
            </p>
          </div>

          <nav aria-label="사이트 메뉴">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink-faint">
              둘러보기
            </p>
            <ul className="mt-3.5 space-y-1">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group -mx-2 flex min-h-[2.5rem] flex-col justify-center rounded-lg px-2 transition-colors duration-150 hover:bg-paper-line/40"
                  >
                    <span className="text-sm font-medium text-ink-soft transition-colors group-hover:text-brand-strong">
                      {item.label}
                    </span>
                    <span className="text-xs text-ink-faint">{item.desc}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink-faint">
              한 문장으로 말하면
            </p>
            <p className="mt-3.5 text-sm leading-ko text-ink-soft">
              정치인의 말을 채점하는 곳이 아니라, 그 말이 실제 정책과 결과로
              어떻게 이어졌는지 남겨 두는 곳입니다.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-paper-line pt-6 text-xs leading-ko-tight text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p className="font-serif text-sm font-bold text-ink-soft">
            말이 아니라, 결과까지.
          </p>
          <p className="max-w-md sm:text-right">
            입법로그는 특정 정당이나 정치인을 지지하거나 반대하기 위해 만들어진
            곳이 아닙니다.
          </p>
        </div>
      </div>
    </footer>
  );
}
