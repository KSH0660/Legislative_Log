import type { Metadata } from "next";
import Link from "next/link";
import { corrections } from "@/data/corrections";

export const metadata: Metadata = {
  title: "정정 기록",
  description:
    "입법로그는 모든 중요한 수정과 정정을 공개적으로 기록합니다. 신뢰는 틀리지 않는 것이 아니라 틀렸을 때 어떻게 고치는가에서 생깁니다.",
};

export default function CorrectionsPage() {
  return (
    <div className="mx-auto max-w-prose px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-dark">
        Corrections
      </p>
      <h1 className="mt-2 font-serif text-3xl font-bold text-ink sm:text-4xl">
        정정 기록
      </h1>
      <p className="mt-4 text-ink-soft leading-relaxed">
        핵심원칙 7. 틀렸다면 공개적으로 수정합니다. 모든 중요한 수정과
        정정은 이 페이지에 기록됩니다. 신뢰는 틀리지 않는 것에서 생기는
        것이 아니라, 틀렸을 때 어떻게 고치는가에서 생긴다고 믿기 때문입니다.
      </p>

      <div className="mt-6 rounded-lg border border-paper-line bg-paper-dim p-5 text-sm leading-relaxed text-ink-soft">
        <p className="font-semibold text-ink">무엇을 정정으로 기록하나요</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>사실 관계 오류(날짜, 수치, 법령 조문 등)를 바로잡은 경우</li>
          <li>사실·주장·해석·전망·의혹의 표식을 잘못 분류했던 경우</li>
          <li>결과 추적에서 예측의 적중 여부 판정을 수정한 경우</li>
          <li>출처가 부정확했거나 대체된 경우</li>
        </ul>
        <p className="mt-3">
          단순 오탈자 수정이나 최신 정보를 반영하는 정기 업데이트는 각 법안
          페이지의 &lsquo;최근 업데이트&rsquo; 날짜로만 표시하고, 이 페이지에는
          내용 판단에 영향을 준 정정만 남깁니다.
        </p>
      </div>

      <div className="mt-10">
        {corrections.length === 0 ? (
          <div className="rounded-xl border border-dashed border-paper-line py-16 text-center">
            <p className="text-ink-soft">아직 기록된 정정 사항이 없습니다.</p>
            <p className="mt-1 text-sm text-ink-faint">
              새로운 정정이 발생하면 가장 먼저 이곳에 기록됩니다.
            </p>
          </div>
        ) : (
          <ol className="space-y-4">
            {corrections.map((c, i) => (
              <li key={i} className="rounded-lg border border-paper-line bg-white p-5">
                <div className="flex flex-wrap items-center gap-2 text-xs text-ink-faint">
                  <span className="font-semibold text-ink">{c.date}</span>
                  <span>·</span>
                  <Link
                    href={`/bills/${c.billSlug}`}
                    className="text-brand hover:underline"
                  >
                    {c.billTitle}
                  </Link>
                </div>
                <p className="mt-2 text-sm font-semibold text-ink">
                  {c.description}
                </p>
                <p className="mt-1 text-sm text-ink-soft">사유: {c.reason}</p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
