import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllBills, getBillBySlug } from "@/lib/bills";
import { getImpactData } from "@/data/impact";
import { BILL_STATUS_DESCRIPTION } from "@/types/bill";
import { getSection } from "@/lib/sections";
import StatusBadge from "@/components/StatusBadge";
import Section from "@/components/Section";
import ComparisonTable from "@/components/ComparisonTable";
import ArgumentList from "@/components/ArgumentList";
import StakeholderGrid from "@/components/StakeholderGrid";
import EvidenceList from "@/components/EvidenceList";
import PredictionList from "@/components/PredictionList";
import OutcomeTracker from "@/components/OutcomeTracker";
import SourceList from "@/components/SourceList";
import BillTimeline from "@/components/BillTimeline";
import {
  SectionNavDesktop,
  SectionNavMobile,
} from "@/components/TableOfContents";
import ReadingProgress from "@/components/ReadingProgress";
import ClaimLegend from "@/components/ClaimLegend";
import BillImpactBlock from "@/components/personalize/BillImpactBlock";

export function generateStaticParams() {
  return getAllBills().map((bill) => ({ slug: bill.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const bill = getBillBySlug(slug);
  if (!bill) return {};
  return {
    title: bill.shortTitle,
    description: bill.summary30s.slice(0, 155),
    openGraph: { title: bill.shortTitle, description: bill.summary30s.slice(0, 155) },
  };
}

export default async function BillDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const bill = getBillBySlug(slug);
  if (!bill) notFound();
  const impact = getImpactData(slug) ?? null;

  return (
    <>
      <ReadingProgress />

      {/* ── 머리말 ─────────────────────────────────────────────── */}
      <div className="relative overflow-hidden border-b border-paper-line bg-paper-dim">
        <span
          aria-hidden
          className="bg-grid mask-fade-b pointer-events-none absolute inset-0"
        />

        <div className="relative mx-auto max-w-content px-5 py-8 sm:px-6 sm:py-12">
          <Link
            href="/bills"
            data-print-hide
            className="-ml-2 inline-flex min-h-[2.25rem] items-center gap-1.5 rounded-lg px-2 text-sm text-ink-faint transition-colors duration-150 hover:bg-paper-line/40 hover:text-brand-strong"
          >
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H6M11 18l-6-6 6-6" />
            </svg>
            법안·정책 목록으로
          </Link>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="chip bg-surface text-brand-strong ring-1 ring-inset ring-paper-line">
              {bill.category}
            </span>
            <StatusBadge status={bill.status} />
            <span className="text-xs text-ink-faint">
              <span className="num">{bill.lastUpdated}</span> 갱신
            </span>
          </div>

          <h1 className="mt-4 max-w-4xl font-serif text-title font-bold text-ink">
            {bill.shortTitle}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-ko-tight text-ink-faint">
            정식 명칭 · {bill.title}
          </p>

          {/* 지금 어느 단계인지를 본문보다 먼저 알려 준다. */}
          <div className="mt-6 flex max-w-2xl gap-3 rounded-xl border border-paper-line bg-surface p-4 shadow-card">
            <span
              aria-hidden
              className="mt-0.5 h-4 w-1 shrink-0 rounded-full bg-brand"
            />
            <p className="text-sm leading-ko text-ink-soft">
              <span className="font-semibold text-ink">
                지금 상태 ·{" "}
                {bill.status === "본회의_계류" ? "본회의 계류" : bill.status}
              </span>
              <br />
              {BILL_STATUS_DESCRIPTION[bill.status]}
            </p>
          </div>

          <div className="mt-9 border-t border-paper-line pt-8">
            <BillTimeline bill={bill} />
          </div>

          <ul className="mt-8 flex flex-wrap gap-1.5">
            {bill.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full bg-surface px-2.5 py-1 text-xs text-ink-faint ring-1 ring-inset ring-paper-line"
              >
                #{tag}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── 본문 + 목차 ────────────────────────────────────────── */}
      {/* 모바일에서는 좌우 여백을 각 Section이 직접 갖는다. 배경 톤이 화면 끝까지 닿게 하기 위해서다. */}
      <div className="mx-auto max-w-content lg:px-6">
        <div className="lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-10">
          {/* sticky는 부모 높이를 벗어날 수 없어, 본문만큼 키가 큰 이 컨테이너의 직계 자식으로 둔다. */}
          <SectionNavMobile />

          <aside className="hidden lg:block lg:py-14">
            <SectionNavDesktop />
          </aside>

          <div>
            {/* 01 · 30초 요약 */}
            <Section section={getSection("summary")} tone="muted">
              <p className="max-w-prose border-l-[3px] border-brand/60 pl-5 font-serif text-lg leading-ko text-ink sm:text-xl">
                {bill.summary30s}
              </p>
            </Section>

            {/* 02 · 무엇이 달라지나 */}
            <Section section={getSection("compare")}>
              <ComparisonTable
                rows={bill.comparison}
                note={bill.comparisonNote}
              />
            </Section>

            {/* 03 · 04 찬반 논리 */}
            <Section section={getSection("arguments")} tone="muted">
              <div className="grid gap-5 lg:grid-cols-2">
                <ArgumentList
                  title="03 · 추진하는 쪽은 이렇게 말합니다"
                  subtitle="왜 이 법이 필요하다고 보는가"
                  accent="proponent"
                  points={bill.proponentArguments}
                />
                <ArgumentList
                  title="04 · 반대하는 쪽은 이렇게 말합니다"
                  subtitle="무엇을 걱정하는가"
                  accent="opponent"
                  points={bill.opponentArguments}
                />
              </div>
              <p className="mt-4 text-xs leading-ko-tight text-ink-faint">
                양쪽 색깔은 구분을 위한 것일 뿐, 어느 쪽이 옳다는 표시가
                아닙니다.
              </p>
            </Section>

            {/* 05 · 작동 방식 */}
            <Section section={getSection("mechanism")}>
              <p className="max-w-prose prose-ko">{bill.mechanismSummary}</p>

              {/* 순서가 있는 흐름이므로 단계를 세로선으로 이어 준다. */}
              <ol className="relative mt-7 space-y-3 before:absolute before:bottom-6 before:left-[15px] before:top-6 before:w-px before:bg-paper-line">
                {bill.mechanismSteps.map((step, i) => (
                  <li key={i} className="card relative flex gap-4 p-4">
                    <span
                      aria-hidden
                      className="num flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-paper-dim text-sm font-bold text-ink-soft ring-1 ring-inset ring-paper-line"
                    >
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold leading-ko-tight text-ink">
                        {step.step}
                      </p>
                      <p className="mt-1.5 text-sm leading-ko text-ink-soft">
                        {step.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </Section>

            {/* 06 · 이득과 부담 */}
            <Section section={getSection("stakeholders")} tone="muted">
              {/* 개인화 블록은 이 섹션의 첫 번째 서브블록으로 들어간다.
                  독립 섹션으로 만들면 목차 항목 수와 읽기 진행률이 사용자 상태에
                  따라 흔들리기 때문이다. (§10.3) */}
              <BillImpactBlock bill={bill} data={impact} />
              <StakeholderGrid
                beneficiaries={bill.beneficiaries}
                costBearers={bill.costBearers}
              />
              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                <div className="card p-5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">
                    나라 살림에 미치는 영향
                  </p>
                  <p className="mt-2.5 text-sm leading-ko text-ink-soft">
                    {bill.fiscalImpact}
                  </p>
                </div>
                <div className="card p-5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">
                    이런 부작용이 생길 수 있습니다
                  </p>
                  <ul className="mt-2.5 space-y-2 text-sm leading-ko text-ink-soft">
                    {bill.sideEffectRisks.map((risk, i) => (
                      <li key={i} className="flex gap-2.5">
                        <span
                          aria-hidden
                          className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-claim-forecast"
                        />
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Section>

            {/* 07 · 근거와 한계 */}
            <Section section={getSection("evidence")}>
              <EvidenceList items={bill.evidence} />
              <div className="mt-7 rounded-xl border border-dashed border-ink-faint/40 bg-paper-dim/60 p-5 sm:p-6">
                <div className="flex items-center gap-2.5">
                  <svg
                    aria-hidden
                    viewBox="0 0 24 24"
                    className="h-4 w-4 shrink-0 text-ink-faint"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M9.5 9.5a2.5 2.5 0 1 1 3.3 2.4c-.6.2-.8.8-.8 1.4v.2m0 3h.01" />
                  </svg>
                  <p className="text-sm font-bold text-ink">
                    아직 알 수 없는 것들
                  </p>
                </div>
                <p className="mt-1.5 text-xs leading-ko-tight text-ink-faint">
                  모르는 부분을 아는 척하지 않기 위해 따로 적어 둡니다.
                </p>
                <ul className="mt-4 space-y-2.5 text-sm leading-ko text-ink-soft">
                  {bill.uncertainties.map((u, i) => (
                    <li key={i} className="flex gap-2.5">
                      <span
                        aria-hidden
                        className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-ink-faint"
                      />
                      <span>{u}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Section>

            {/* 08 · 입법로그 판단 */}
            <Section section={getSection("analysis")} tone="muted">
              {/* 사실과 의견을 섞지 않는다는 원칙이 눈으로도 보이도록 두 칸을 확실히 나눈다. */}
              <div className="grid gap-6 md:grid-cols-2 md:gap-8">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span
                      aria-hidden
                      className="h-5 w-1 shrink-0 rounded-full bg-claim-fact"
                    />
                    <h3 className="font-serif text-lg font-bold text-ink">
                      확인된 사실
                    </h3>
                  </div>
                  <p className="mt-2 text-xs leading-ko-tight text-ink-faint">
                    자료로 뒷받침되는 내용입니다.
                  </p>
                  <ul className="mt-4 space-y-2.5">
                    {bill.analysisFacts.map((f, i) => (
                      <li
                        key={i}
                        className="rounded-lg border border-claim-fact/25 bg-claim-fact-bg/50 p-4 text-sm leading-ko text-ink"
                      >
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <span
                      aria-hidden
                      className="h-5 w-1 shrink-0 rounded-full bg-claim-interpretation"
                    />
                    <h3 className="font-serif text-lg font-bold text-ink">
                      입법로그의 의견
                    </h3>
                  </div>
                  <p className="mt-2 text-xs leading-ko-tight text-ink-faint">
                    사실이 아니라 판단입니다. 다르게 볼 수 있습니다.
                  </p>
                  <ul className="mt-4 space-y-2.5">
                    {bill.analysisJudgment.map((j, i) => (
                      <li
                        key={i}
                        className="rounded-lg border border-claim-interpretation/25 bg-claim-interpretation-bg/50 p-4 text-sm leading-ko text-ink"
                      >
                        {j}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Section>

            {/* 09 · 예측 기록 */}
            <Section section={getSection("predictions")}>
              <PredictionList predictions={bill.predictions} />
            </Section>

            {/* 10 · 결과 추적 */}
            <Section section={getSection("outcomes")} tone="muted">
              <OutcomeTracker
                checks={bill.outcomeTracking}
                predictions={bill.predictions}
              />
            </Section>

            {/* 출처 */}
            <Section section={getSection("sources")}>
              <SourceList sources={bill.sources} />

              <div className="panel mt-9">
                <p className="text-sm font-bold text-ink">
                  문장 옆 표식은 이런 뜻입니다
                </p>
                <div className="mt-3.5">
                  <ClaimLegend compact />
                </div>
                <p className="mt-4 text-xs leading-ko text-ink-faint">
                  표식에 마우스를 올리면 자세한 설명이 나옵니다. 전체 설명은{" "}
                  <Link href="/about#claim-types" className="link-quiet">
                    소개 페이지
                  </Link>
                  에 있습니다.
                </p>
              </div>

              <p className="mt-7 border-t border-paper-line pt-6 text-xs leading-ko text-ink-faint">
                이 문서는{" "}
                <span className="num text-ink-soft">{bill.lastUpdated}</span>에
                마지막으로 손봤습니다. 사실이 틀렸거나 새로 확인된 자료가 있다면{" "}
                <Link href="/corrections" className="link-quiet">
                  정정 기록
                </Link>{" "}
                페이지의 기준에 따라 검토한 뒤 고치고, 무엇을 왜 고쳤는지
                남깁니다.
              </p>
            </Section>
          </div>
        </div>
      </div>
    </>
  );
}
