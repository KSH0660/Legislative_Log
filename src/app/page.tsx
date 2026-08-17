import Link from "next/link";
import { getAllBills, getBillCounts } from "@/lib/bills";
import { BILL_SECTIONS } from "@/lib/sections";
import BillCard from "@/components/BillCard";
import ClaimLegend from "@/components/ClaimLegend";

const PRINCIPLES = [
  {
    n: "1",
    title: "정당이 아니라 법안을 봅니다",
    body: "누가 냈는지는 결론에 영향을 주지 않습니다. 어느 당이 발의했든 똑같은 잣대를 씁니다.",
  },
  {
    n: "2",
    title: "기사보다 원문을 먼저 봅니다",
    body: "정치인의 말이나 기사 요약이 아니라 법안 원문, 법 조문, 정부 통계를 먼저 확인합니다.",
  },
  {
    n: "3",
    title: "사실과 의견을 섞지 않습니다",
    body: "모든 문장에 사실·주장·해석·전망·의혹 중 하나를 표시해서, 무엇이 확인된 내용인지 바로 알 수 있게 합니다.",
  },
  {
    n: "4",
    title: "양쪽의 가장 센 논리를 함께 싣습니다",
    body: "반박하기 쉬운 약한 주장을 골라 오지 않습니다. 찬성과 반대 각각에서 가장 설득력 있는 이야기를 나란히 둡니다.",
  },
  {
    n: "5",
    title: "누가 얻고 누가 부담하는지 따집니다",
    body: "좋은 의도만 보지 않습니다. 돈과 위험이 실제로 어디로 흘러가는지, 부작용은 무엇인지까지 봅니다.",
  },
  {
    n: "6",
    title: "예측에 책임을 묻습니다",
    body: "정치인도, 전문가도, 입법로그 자신도 예외가 아닙니다. 그때 한 말을 기록해 두고 나중에 다시 채점합니다.",
  },
  {
    n: "7",
    title: "틀리면 공개적으로 고칩니다",
    body: "신뢰는 틀리지 않아서 생기는 게 아니라, 틀렸을 때 어떻게 고치는지에서 생긴다고 봅니다.",
  },
];

/** 페이지 전체에서 반복되는 구역 머리말 */
function SectionIntro({
  eyebrow,
  title,
  body,
  action,
}: {
  eyebrow: string;
  title: string;
  body?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
      <div className="max-w-2xl">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-3 font-serif text-title font-bold text-ink">
          {title}
        </h2>
        {body && <p className="mt-3 prose-ko">{body}</p>}
      </div>
      {action}
    </div>
  );
}

export default function Home() {
  const bills = getAllBills();
  const counts = getBillCounts();
  const recent = bills.slice(0, 3);

  return (
    <div>
      {/* ── 첫 화면 ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-paper-line bg-gradient-to-b from-paper-dim to-paper">
        {/* 기록물 성격을 드러내는 옅은 격자. 글자 대비는 건드리지 않을 만큼만 넣는다. */}
        <span
          aria-hidden
          className="bg-grid mask-fade-b pointer-events-none absolute inset-0"
        />

        <div className="relative mx-auto max-w-content px-5 py-16 sm:px-6 sm:py-24 lg:py-28">
          <p className="eyebrow">입법로그 · Legislative Log</p>

          <h1 className="mt-5 max-w-4xl font-serif text-display font-bold text-ink">
            누가 말했는지가 아니라,
            <br />
            무엇이 실제로 바뀌는지를 봅니다.
          </h1>

          <p className="mt-7 max-w-2xl text-[17px] leading-ko text-ink-soft sm:text-lg">
            같은 법을 두고 정치권은 정반대로 설명하고, 기사마다 결론이 다릅니다.
            그래서 정작 내 삶이 어떻게 달라지는지는 알기 어렵습니다. 입법로그는
            어느 편도 들지 않고 딱 하나만 따집니다.
          </p>

          {/* 사이트 전체를 관통하는 질문. 본문에서 확실히 떼어 놓는다. */}
          <p className="mt-7 border-l-[3px] border-brand pl-5 font-serif text-2xl font-bold leading-snug text-brand-strong sm:text-3xl">
            &ldquo;그래서 실제로 무엇이 바뀌는가?&rdquo;
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/bills" className="btn-primary">
              추적 중인 법안 보기
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.4}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h13M13 6l6 6-6 6" />
              </svg>
            </Link>
            <Link href="/about" className="btn-secondary">
              어떻게 분석하나요?
            </Link>
          </div>

          <dl className="mt-16 grid max-w-3xl grid-cols-3 gap-px overflow-hidden rounded-xl border border-paper-line bg-paper-line">
            {[
              { label: "추적 중인 법안·정책", value: counts.total },
              { label: "이미 시행된 것", value: counts.inEffect },
              { label: "아직 국회에 있는 것", value: counts.pending },
            ].map((stat) => (
              <div key={stat.label} className="bg-surface px-4 py-5 sm:px-6 sm:py-6">
                <dd className="num font-serif text-3xl font-bold text-ink sm:text-4xl">
                  {stat.value}
                </dd>
                <dt className="mt-1.5 text-xs leading-ko-tight text-ink-faint sm:text-sm">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── 최근 기록 ───────────────────────────────────────── */}
      <section className="mx-auto max-w-content px-5 py-16 sm:px-6 sm:py-20">
        <SectionIntro
          eyebrow="최근 기록"
          title="지금 추적하고 있는 법안"
          action={
            <Link
              href="/bills"
              className="inline-flex min-h-[2.5rem] items-center gap-1.5 rounded-lg text-sm font-semibold text-brand-strong underline-offset-4 hover:underline"
            >
              전체 보기
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.4}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h13M13 6l6 6-6 6" />
              </svg>
            </Link>
          }
        />

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {recent.map((bill) => (
            <BillCard key={bill.slug} bill={bill} />
          ))}
        </div>
      </section>

      {/* ── 읽는 법 ─────────────────────────────────────────── */}
      <section className="border-y border-paper-line bg-paper-dim">
        <div className="mx-auto max-w-content px-5 py-16 sm:px-6 sm:py-20">
          <SectionIntro
            eyebrow="읽는 법"
            title="모든 문장에 '어디까지 믿어도 되는지' 표시가 붙습니다"
            body="확인된 사실인지, 누군가의 주장인지, 아직 결과가 나오지 않은 전망인지를 문장마다 표시합니다. 표식만 봐도 그 문장을 얼마나 믿어야 할지 판단할 수 있습니다."
          />
          <div className="mt-9">
            <ClaimLegend />
          </div>
        </div>
      </section>

      {/* ── 10단계 구조 ─────────────────────────────────────── */}
      <section className="mx-auto max-w-content px-5 py-16 sm:px-6 sm:py-20">
        <SectionIntro
          eyebrow="분석 구조"
          title="어떤 법이든 똑같은 10단계로 뜯어봅니다"
          body="법마다 다른 방식으로 설명하면 비교가 안 됩니다. 그래서 모든 법을 같은 순서, 같은 질문으로 정리합니다."
        />

        <ol className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {BILL_SECTIONS.filter((s) => s.id !== "sources").map((s) => (
            <li key={s.id} className="card p-5">
              <span className="num text-sm font-bold tracking-[0.18em] text-brand-strong">
                {s.label}
              </span>
              <p className="mt-2 font-semibold leading-snug text-ink">
                {s.title}
              </p>
              {s.lede && (
                <p className="mt-1.5 text-xs leading-ko-tight text-ink-faint">
                  {s.lede}
                </p>
              )}
            </li>
          ))}
        </ol>
      </section>

      {/* ── 원칙 ────────────────────────────────────────────── */}
      <section className="border-t border-paper-line bg-paper-dim">
        <div className="mx-auto max-w-content px-5 py-16 sm:px-6 sm:py-20">
          <SectionIntro eyebrow="지키는 원칙" title="일곱 가지 원칙" />

          <ul className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PRINCIPLES.map((p) => (
              <li key={p.n} className="card p-5 sm:p-6">
                <span
                  aria-hidden
                  className="num font-serif text-2xl font-bold text-brand/40"
                >
                  {p.n}
                </span>
                <h3 className="mt-1 font-semibold leading-snug text-ink">
                  {p.title}
                </h3>
                <p className="mt-2.5 text-sm leading-ko text-ink-soft">
                  {p.body}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-9">
            <Link
              href="/about"
              className="inline-flex min-h-[2.5rem] items-center gap-1.5 rounded-lg text-sm font-semibold text-brand-strong underline-offset-4 hover:underline"
            >
              더 자세한 원칙과 장기 계획 읽기
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.4}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h13M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 맺음말 ──────────────────────────────────────────── */}
      <section className="border-t border-paper-line">
        <div className="mx-auto max-w-content px-5 py-20 text-center sm:px-6 sm:py-24">
          <p className="font-serif text-title font-bold text-ink">
            지피지기면 백전불태.
          </p>
          <p className="mx-auto mt-5 max-w-xl text-base leading-ko text-ink-soft">
            좋은 민주주의는 더 많은 주장이 아니라 더 정확한 판단에서 시작됩니다.
            입법로그는 무엇이 옳은지 대신 정해 주지 않습니다. 스스로 판단할
            근거를 드립니다.
          </p>
          <span
            aria-hidden
            className="mx-auto mt-10 block h-px w-16 bg-paper-line"
          />
          <p className="mt-8 font-serif text-xl font-bold text-brand-strong sm:text-2xl">
            말이 아니라, 결과까지.
          </p>
        </div>
      </section>
    </div>
  );
}
