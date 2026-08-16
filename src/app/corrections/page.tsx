import type { Metadata } from "next";
import Link from "next/link";
import { corrections } from "@/data/corrections";

export const metadata: Metadata = {
  title: "정정 기록",
  description:
    "입법로그는 틀린 내용을 고칠 때마다 무엇을 왜 고쳤는지 공개합니다. 신뢰는 틀리지 않아서가 아니라, 틀렸을 때 어떻게 고치는지에서 생깁니다.",
};

const WHAT_COUNTS = [
  "날짜·수치·법 조문처럼 사실 관계가 틀렸던 것을 바로잡은 경우",
  "사실·주장·해석·전망·의혹 표식을 잘못 붙였던 경우",
  "결과 추적에서 예측이 맞았는지에 대한 판정을 바꾼 경우",
  "출처가 정확하지 않았거나 다른 자료로 교체된 경우",
];

export default function CorrectionsPage() {
  return (
    <div className="mx-auto max-w-prose px-5 py-12 sm:px-6 sm:py-16">
      <p className="eyebrow">일곱 번째 원칙</p>
      <h1 className="mt-2 font-serif text-3xl font-bold leading-tight text-ink sm:text-4xl">
        정정 기록
      </h1>
      <p className="mt-4 prose-ko">
        틀렸다면 조용히 고치지 않고 공개적으로 고칩니다. 중요한 수정은 모두 이
        페이지에 남습니다. 신뢰는 틀리지 않아서 생기는 것이 아니라, 틀렸을 때
        어떻게 고치는지에서 생긴다고 보기 때문입니다.
      </p>

      <div className="mt-7 rounded-xl border border-paper-line bg-paper-dim p-5">
        <p className="font-semibold text-ink">무엇을 정정으로 남기나요</p>
        <ul className="mt-3 space-y-2">
          {WHAT_COUNTS.map((item) => (
            <li
              key={item}
              className="flex gap-2.5 text-sm leading-ko text-ink-soft"
            >
              <span aria-hidden className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 border-t border-paper-line pt-3 text-sm leading-ko text-ink-faint">
          오탈자를 고치거나 최신 정보를 반영하는 정기 업데이트는 각 법안
          페이지의 &lsquo;업데이트&rsquo; 날짜로만 표시합니다. 여기에는 읽는
          사람의 판단을 바꿀 수 있었던 정정만 남깁니다.
        </p>
      </div>

      <div className="mt-10">
        <h2 className="sr-only">정정 목록</h2>
        {corrections.length === 0 ? (
          <div className="rounded-xl border border-dashed border-paper-line px-6 py-14 text-center">
            <p className="font-serif text-lg font-bold text-ink">
              아직 정정한 내용이 없습니다
            </p>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-ko text-ink-soft">
              이 칸이 비어 있다는 건 아직 큰 오류가 발견되지 않았다는 뜻일
              뿐입니다. 오류를 발견하시면 언제든 알려 주세요. 확인되는 대로
              고치고 그 내용을 여기에 남깁니다.
            </p>
            <Link href="/bills" className="btn-secondary mt-6 py-2 text-sm">
              법안 기록 둘러보기
            </Link>
          </div>
        ) : (
          <ol className="space-y-4">
            {corrections.map((c, i) => (
              <li key={i} className="card p-5">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                  <time className="font-semibold tabular-nums text-ink">
                    {c.date}
                  </time>
                  <span aria-hidden className="text-ink-faint">
                    ·
                  </span>
                  <Link
                    href={`/bills/${c.billSlug}`}
                    className="font-medium text-brand-strong underline-offset-4 hover:underline"
                  >
                    {c.billTitle}
                  </Link>
                </div>
                <p className="mt-2.5 font-semibold leading-ko-tight text-ink">
                  {c.description}
                </p>
                <p className="mt-2 rounded-lg bg-paper-dim px-3 py-2 text-sm leading-ko text-ink-soft">
                  <span className="font-semibold text-ink">고친 이유 </span>
                  {c.reason}
                </p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
