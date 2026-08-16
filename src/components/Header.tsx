import Link from "next/link";

const NAV_LINKS = [
  { href: "/bills", label: "법안·정책" },
  { href: "/corrections", label: "정정 기록" },
  { href: "/about", label: "소개" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-paper-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-content items-center justify-between px-6 py-4">
        <Link href="/" className="group flex items-baseline gap-2">
          <span className="font-serif text-xl font-bold tracking-tight text-ink">
            입법로그
          </span>
          <span className="hidden font-sans text-xs text-ink-faint sm:inline">
            Legislative Log
          </span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-paper-dim hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
