import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllBills, getBillBySlug } from "@/lib/bills";
import StatusBadge from "@/components/StatusBadge";
import Section from "@/components/Section";
import ComparisonTable from "@/components/ComparisonTable";
import ArgumentList from "@/components/ArgumentList";
import StakeholderGrid from "@/components/StakeholderGrid";
import EvidenceList from "@/components/EvidenceList";
import PredictionList from "@/components/PredictionList";
import OutcomeTracker from "@/components/OutcomeTracker";
import SourceList from "@/components/SourceList";

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
    description: bill.summary30s,
  };
}

type DateFieldKey =
  | "proposedDate"
  | "passedDate"
  | "promulgatedDate"
  | "effectiveDate";

const META_ROWS: { label: string; key: DateFieldKey }[] = [
  { label: "발의", key: "proposedDate" },
  { label: "국회 통과", key: "passedDate" },
  { label: "공포", key: "promulgatedDate" },
  { label: "시행", key: "effectiveDate" },
];

export default async function BillDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const bill = getBillBySlug(slug);
  if (!bill) notFound();

  return (
    <div className="pb-20">
      {/* Hero */}
      <div className="border-b border-paper-line bg-paper-dim">
        <div className="mx-auto max-w-content px-6 py-10">
          <Link
            href="/bills"
            className="text-sm text-ink-faint hover:text-brand hover:underline"
          >
            ← 법안·정책 목록
          </Link>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-brand-dark">
              {bill.category}
            </span>
            <StatusBadge status={bill.status} />
          </div>
          <h1 className="mt-3 font-serif text-3xl font-bold leading-tight text-ink sm:text-4xl">
            {bill.title}
          </h1>
          <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {META_ROWS.filter(({ key }) => bill[key]).map(({ label, key }) => (
              <div key={key}>
                <dt className="text-xs text-ink-faint">{label}</dt>
                <dd className="mt-0.5 text-sm font-semibold text-ink">
                  {bill[key]}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {bill.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white px-2 py-0.5 text-xs text-ink-faint"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ① 30초 요약 */}
      <Section number="①" title="30초 요약" tone="muted">
        <p className="text-lg leading-relaxed text-ink">{bill.summary30s}</p>
      </Section>

      {/* ② 현재 vs 변경 후 */}
      <Section number="②" title="현재 vs 변경 후">
        <ComparisonTable rows={bill.comparison} note={bill.comparisonNote} />
      </Section>

      {/* ③④ 추진/반대 측 주장 */}
      <Section
        number="③④"
        title="추진 측 주장 vs 반대 측 주장"
        description="양측이 제시할 수 있는 가장 설득력 있는 논리를 함께 보여줍니다."
        tone="muted"
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <ArgumentList
            title="추진 측 주장"
            accent="proponent"
            points={bill.proponentArguments}
          />
          <ArgumentList
            title="반대 측 주장"
            accent="opponent"
            points={bill.opponentArguments}
          />
        </div>
      </Section>

      {/* ⑤ 실제 작동 구조 */}
      <Section number="⑤" title="실제 작동 구조">
        <p className="text-ink-soft leading-relaxed">{bill.mechanismSummary}</p>
        <ol className="mt-6 space-y-4">
          {bill.mechanismSteps.map((step, i) => (
            <li key={i} className="flex gap-4 rounded-lg border border-paper-line bg-white p-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-paper-dim text-sm font-bold text-ink-soft">
                {i + 1}
              </span>
              <div>
                <p className="font-semibold text-ink">{step.step}</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                  {step.detail}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* ⑥ 수혜자와 비용 부담자 */}
      <Section number="⑥" title="수혜자와 비용 부담자" tone="muted">
        <StakeholderGrid
          beneficiaries={bill.beneficiaries}
          costBearers={bill.costBearers}
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-paper-line bg-white p-4">
            <p className="text-sm font-semibold text-ink">정부 재정 영향</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">
              {bill.fiscalImpact}
            </p>
          </div>
          <div className="rounded-lg border border-paper-line bg-white p-4">
            <p className="text-sm font-semibold text-ink">예상되는 부작용</p>
            <ul className="mt-1 list-inside list-disc space-y-1 text-sm leading-relaxed text-ink-soft">
              {bill.sideEffectRisks.map((risk, i) => (
                <li key={i}>{risk}</li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* ⑦ 근거와 불확실성 */}
      <Section number="⑦" title="근거와 불확실성">
        <EvidenceList items={bill.evidence} />
        <div className="mt-6 rounded-lg border border-dashed border-ink-faint/40 bg-paper-dim/60 p-4">
          <p className="text-sm font-semibold text-ink">아직 확인되지 않은 부분</p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm leading-relaxed text-ink-soft">
            {bill.uncertainties.map((u, i) => (
              <li key={i}>{u}</li>
            ))}
          </ul>
        </div>
      </Section>

      {/* ⑧ 입법로그 분석 */}
      <Section
        number="⑧"
        title="입법로그 분석"
        description="사실과 가치판단을 분리해 제시합니다."
        tone="muted"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="mb-3 font-serif text-lg font-bold text-ink">확인된 사실</h3>
            <ul className="space-y-2">
              {bill.analysisFacts.map((f, i) => (
                <li
                  key={i}
                  className="rounded-lg border border-claim-fact/30 bg-claim-fact-bg/40 p-3 text-sm leading-relaxed text-ink"
                >
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-3 font-serif text-lg font-bold text-ink">
              입법로그의 가치판단{" "}
              <span className="text-xs font-normal text-ink-faint">
                (의견입니다)
              </span>
            </h3>
            <ul className="space-y-2">
              {bill.analysisJudgment.map((j, i) => (
                <li
                  key={i}
                  className="rounded-lg border border-claim-interpretation/30 bg-claim-interpretation-bg/40 p-3 text-sm leading-relaxed text-ink"
                >
                  {j}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* ⑨ 예측 기록 */}
      <Section
        number="⑨"
        title="예측 기록"
        description="정책 시행 당시 제시된 전망을 시점·주체와 함께 그대로 기록합니다."
      >
        <PredictionList predictions={bill.predictions} />
      </Section>

      {/* ⑩ 결과 추적 */}
      <Section
        number="⑩"
        title="결과 추적"
        description="6개월·1년·3년 후 실제 데이터를 확인해 예측과 비교합니다."
        tone="muted"
      >
        <OutcomeTracker checks={bill.outcomeTracking} predictions={bill.predictions} />
      </Section>

      {/* 출처 */}
      <Section number="✓" title="출처">
        <SourceList sources={bill.sources} />
        <p className="mt-6 text-xs text-ink-faint">
          최근 업데이트: {bill.lastUpdated}. 오류나 갱신할 내용을 발견하셨다면{" "}
          <Link href="/corrections" className="text-brand hover:underline">
            정정 기록
          </Link>{" "}
          페이지의 원칙에 따라 검토 후 반영합니다.
        </p>
      </Section>
    </div>
  );
}
