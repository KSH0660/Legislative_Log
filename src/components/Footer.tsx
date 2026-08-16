import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-paper-line bg-paper-dim">
      <div className="mx-auto max-w-content px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <p className="font-serif text-lg font-bold text-ink">입법로그</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-faint">
              누가 말했는지가 아니라,
              <br />
              무엇이 실제로 바뀌는지를 본다.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">둘러보기</p>
            <ul className="mt-3 space-y-2 text-sm text-ink-soft">
              <li>
                <Link href="/bills" className="hover:text-brand hover:underline">
                  법안·정책 추적
                </Link>
              </li>
              <li>
                <Link
                  href="/corrections"
                  className="hover:text-brand hover:underline"
                >
                  정정 기록
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand hover:underline">
                  원칙과 방법론
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">한 문장 미션</p>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              정치인의 말을 평가하는 곳이 아니라, 그 말이 실제 정책과 결과로
              어떻게 이어졌는지를 기록하는 곳.
            </p>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-paper-line pt-6 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p>말이 아니라, 결과까지.</p>
          <p>입법로그는 특정 정당·정치인의 지지 또는 반대를 목적으로 하지 않습니다.</p>
        </div>
      </div>
    </footer>
  );
}
