import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-content flex-col items-center px-6 py-32 text-center">
      <p className="font-serif text-6xl font-bold text-ink/15">404</p>
      <h1 className="mt-4 font-serif text-2xl font-bold text-ink">
        페이지를 찾을 수 없습니다
      </h1>
      <p className="mt-2 text-ink-soft">
        요청하신 법안·정책 기록이 존재하지 않거나 주소가 변경되었습니다.
      </p>
      <Link
        href="/bills"
        className="mt-8 rounded-lg bg-ink px-6 py-3 text-sm font-semibold text-paper transition-colors hover:bg-ink-soft"
      >
        법안·정책 목록으로
      </Link>
    </div>
  );
}
