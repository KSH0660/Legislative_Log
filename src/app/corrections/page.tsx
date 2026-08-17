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
      <h1 className="mt-3 font-serif text-title font-bold text-ink">
        정정 기록
      </h1>
      <p className="mt-5 prose-ko">
        틀렸다면 조용히 고치지 않고 공개적으로 고칩니다. 중요한 수정은 모두 이
        페이지에 남습니다. 신뢰는 틀리지 않아서 생기는 것이 아니라, 틀렸을 때
        어떻게 고치는지에서 생긴다고 보기 때문입니다.
      </p>

      <div className="panel mt-8">
        <p className="font-semibold text-ink">무엇을 정정으로 남기나요</p>
        <ul className="mt-3.5 space-y-2.5">
          {WHAT_COUNTS.map((item) => (
            <li
              key={item}
              className="flex gap-3 text-sm leading-ko text-ink-soft"
            >
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="mt-[5px] h-3.5 w-3.5 shrink-0 text-brand"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.6}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 border-t border-paper-line pt-4 text-sm leading-ko text-ink-faint">
          오탈자를 고치거나 최신 정보를 반영하는 정기 업데이트는 각 법안
          페이지의 &lsquo;업데이트&rsquo; 날짜로만 표시합니다. 여기에는 읽는
          사람의 판단을 바꿀 수 있었던 정정만 남깁니다.
        </p>
      </div>

      <div className="mt-12">
        <h2 className="sr-only">정정 목록</h2>
        {corrections.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-paper-line px-6 py-16 text-center">
            <span
              aria-hidden
              className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-paper-dim text-ink-faint"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 7h16M4 12h10M4 17h7" />
              </svg>
            </span>
            <p className="mt-4 font-serif text-lg font-bold text-ink">
              아직 정정한 내용이 없습니다
            </p>
            <p className="mx-auto mt-2.5 max-w-sm text-sm leading-ko text-ink-soft">
              이 칸이 비어 있다는 건 아직 큰 오류가 발견되지 않았다는 뜻일
              뿐입니다. 오류를 발견하시면 언제든 알려 주세요. 확인되는 대로
              고치고 그 내용을 여기에 남깁니다.
            </p>
            <Link href="/bills" className="btn-secondary mt-7">
              법안 기록 둘러보기
            </Link>
          </div>
        ) : (
          /* 시간순 기록이라는 성격이 드러나도록 세로선으로 이어 준다. */
          <ol className="relative space-y-4 border-l-2 border-paper-line pl-6">
            {corrections.map((c, i) => (
              <li key={i} className="relative">
                <span
                  aria-hidden
                  className="absolute top-5 h-2.5 w-2.5 rounded-full bg-brand ring-4 ring-paper"
                  style={{ left: "calc(-1.5rem - 6px)" }}
                />
                <div className="card p-5">
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs">
                    <time className="num font-semibold text-ink">{c.date}</time>
                    <span aria-hidden className="h-3 w-px bg-paper-line" />
                    <Link
                      href={`/bills/${c.billSlug}`}
                      className="rounded font-medium text-brand-strong underline-offset-4 hover:underline"
                    >
                      {c.billTitle}
                    </Link>
                  </div>
                  <p className="mt-3 font-semibold leading-ko-tight text-ink">
                    {c.description}
                  </p>
                  <p className="mt-3 rounded-lg bg-paper-dim px-3.5 py-3 text-sm leading-ko text-ink-soft ring-1 ring-inset ring-paper-line-soft">
                    <span className="font-semibold text-ink">고친 이유 </span>
                    {c.reason}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
