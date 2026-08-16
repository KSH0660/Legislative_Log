import Link from "next/link";
import { getAllBills, getBillCounts } from "@/lib/bills";
import BillCard from "@/components/BillCard";
import ClaimLegend from "@/components/ClaimLegend";

const PRINCIPLES = [
  {
    n: "1",
    title: "정당보다 법안을 본다",
    body: "누가 제안했는지가 분석의 결론을 결정하지 않습니다. 모든 법안에 동일한 기준을 적용합니다.",
  },
  {
    n: "2",
    title: "원문부터 확인한다",
    body: "기사나 발언보다 법안 원문, 법령, 공식 통계와 자료를 우선합니다.",
  },
  {
    n: "3",
    title: "사실과 의견을 분리한다",
    body: "확인된 사실·공식 주장·해석·전망·미확인 의혹을 모든 콘텐츠에서 명확히 구분합니다.",
  },
  {
    n: "4",
    title: "가장 강한 찬성과 반대를 함께",
    body: "상대 진영의 약한 주장이 아니라, 양측의 가장 설득력 있는 논리를 함께 보여줍니다.",
  },
  {
    n: "5",
    title: "누가 얻고 누가 부담하는지 추적",
    body: "의도가 아니라 실제 구조를 봅니다. 수혜자, 비용 부담자, 재정 영향, 부작용까지.",
  },
  {
    n: "6",
    title: "예측에 책임을 묻는다",
    body: "정치인도, 전문가도, 입법로그 자신도 예외 없이 시행 당시의 주장을 기록하고 나중에 다시 평가합니다.",
  },
  {
    n: "7",
    title: "틀렸다면 공개적으로 수정한다",
    body: "신뢰는 틀리지 않는 데서 오지 않습니다. 틀렸을 때 어떻게 고치는지에서 옵니다.",
  },
];

const STRUCTURE = [
  "30초 요약",
  "현재 vs 변경 후",
  "추진 측의 주장",
  "반대 측의 주장",
  "실제 작동 구조",
  "수혜자와 비용 부담자",
  "근거와 불확실성",
  "입법로그 분석",
  "예측 기록",
  "결과 추적",
];

export default function Home() {
  const bills = getAllBills();
  const counts = getBillCounts();

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-paper-line bg-gradient-to-b from-paper-dim to-paper">
        <div className="mx-auto max-w-content px-6 py-20 sm:py-28">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-dark">
            입법로그 · Legislative Log
          </p>
          <h1 className="mt-4 max-w-3xl text-balance font-serif text-4xl font-bold leading-tight text-ink sm:text-5xl">
            누가 말했는지가 아니라,
            <br />
            무엇이 실제로 바뀌는지를 본다.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
            정치권은 같은 법안을 두고 서로 다른 설명을 내놓습니다. 입법로그는
            특정 정당이나 정치인을 지지하거나 공격하지 않습니다. 대신 하나의
            질문에 집중합니다.
          </p>
          <p className="mt-4 font-serif text-2xl font-bold text-brand-dark sm:text-3xl">
            &ldquo;그래서 실제로 무엇이 바뀌는가?&rdquo;
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/bills"
              className="rounded-lg bg-ink px-6 py-3 text-sm font-semibold text-paper transition-colors hover:bg-ink-soft"
            >
              법안·정책 추적 보기
            </Link>
            <Link
              href="/about"
              className="rounded-lg border border-ink/20 px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-paper-dim"
            >
              원칙과 방법론
            </Link>
          </div>
          <dl className="mt-14 grid max-w-xl grid-cols-3 gap-6 border-t border-paper-line pt-8">
            <div>
              <dt className="text-xs text-ink-faint">추적 중인 법안·정책</dt>
              <dd className="mt-1 font-serif text-3xl font-bold text-ink">
                {counts.total}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-ink-faint">시행 중</dt>
              <dd className="mt-1 font-serif text-3xl font-bold text-ink">
                {counts.inEffect}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-ink-faint">심사·발의 단계</dt>
              <dd className="mt-1 font-serif text-3xl font-bold text-ink">
                {counts.pending}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Recent bills */}
      <section className="mx-auto max-w-content px-6 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-dark">
              Tracking
            </p>
            <h2 className="mt-1 font-serif text-2xl font-bold text-ink">
              최근 추적 중인 법안·정책
            </h2>
          </div>
          <Link
            href="/bills"
            className="text-sm font-semibold text-brand-dark hover:underline"
          >
            전체 보기 →
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {bills.map((bill) => (
            <BillCard key={bill.slug} bill={bill} />
          ))}
        </div>
      </section>

      {/* Claim types */}
      <section className="border-y border-paper-line bg-paper-dim">
        <div className="mx-auto max-w-content px-6 py-16">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-dark">
            Method
          </p>
          <h2 className="mt-1 font-serif text-2xl font-bold text-ink">
            모든 문장은 다섯 가지 중 하나로 표시됩니다
          </h2>
          <p className="mt-3 max-w-2xl text-ink-soft">
            사실, 공식 주장, 해석, 전망, 미확인 의혹. 입법로그의 모든 콘텐츠는
            이 다섯 가지 표식으로 구분되어, 무엇이 확인된 사실이고 무엇이 아직
            검증되지 않았는지 한눈에 알 수 있습니다.
          </p>
          <div className="mt-8">
            <ClaimLegend />
          </div>
        </div>
      </section>

      {/* 10-part structure */}
      <section className="mx-auto max-w-content px-6 py-16">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-dark">
          Structure
        </p>
        <h2 className="mt-1 font-serif text-2xl font-bold text-ink">
          모든 법안은 같은 10단계 구조로 분석합니다
        </h2>
        <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {STRUCTURE.map((title, i) => (
            <li
              key={title}
              className="rounded-lg border border-paper-line bg-white p-4"
            >
              <span className="font-serif text-lg font-bold text-brand-dark">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-1 text-sm font-semibold text-ink">{title}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Principles */}
      <section className="border-t border-paper-line bg-paper-dim">
        <div className="mx-auto max-w-content px-6 py-16">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-dark">
            Principles
          </p>
          <h2 className="mt-1 font-serif text-2xl font-bold text-ink">
            핵심 원칙
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PRINCIPLES.map((p) => (
              <div
                key={p.n}
                className="rounded-xl border border-paper-line bg-white p-5"
              >
                <span className="font-serif text-2xl font-bold text-ink/20">
                  {p.n}
                </span>
                <h3 className="mt-1 font-semibold text-ink">{p.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link
              href="/about"
              className="text-sm font-semibold text-brand-dark hover:underline"
            >
              장기 비전과 전체 철학 읽기 →
            </Link>
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="mx-auto max-w-content px-6 py-20 text-center">
        <p className="font-serif text-2xl font-bold text-ink sm:text-3xl">
          지피지기면 백전불태.
        </p>
        <p className="mx-auto mt-4 max-w-xl text-ink-soft">
          좋은 민주주의는 더 많은 주장보다 더 정확한 판단에서 시작됩니다.
          입법로그는 정답을 대신 내려주지 않습니다. 판단할 수 있는 근거를
          제공합니다.
        </p>
        <p className="mt-8 font-serif text-xl font-bold text-brand-dark">
          말이 아니라, 결과까지.
        </p>
      </section>
    </div>
  );
}
