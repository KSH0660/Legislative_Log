import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-content flex-col items-center px-5 py-28 text-center sm:px-6">
      <p aria-hidden className="num font-serif text-6xl font-bold text-ink/15">
        404
      </p>
      <h1 className="mt-5 font-serif text-heading font-bold text-ink">
        찾으시는 페이지가 없습니다
      </h1>
      <p className="mt-3.5 max-w-sm text-base leading-ko text-ink-soft">
        주소가 바뀌었거나, 아직 만들어지지 않은 기록일 수 있습니다. 아래에서
        다시 찾아보세요.
      </p>
      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <Link href="/bills" className="btn-primary">
          법안 목록에서 찾기
        </Link>
        <Link href="/" className="btn-secondary">
          첫 화면으로
        </Link>
      </div>
    </div>
  );
}
