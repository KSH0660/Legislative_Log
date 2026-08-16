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

export default function Home() {
  const bills = getAllBills();
  const counts = getBillCounts();
  const recent = bills.slice(0, 3);

  return (
    <div>
      {/* ── 첫 화면 ─────────────────────────────────────────── */}
      <section className="border-b border-paper-line bg-gradient-to-b from-paper-dim to-paper">
        <div className="mx-auto max-w-content px-5 py-16 sm:px-6 sm:py-24">
          <p className="eyebrow">입법로그 · Legislative Log</p>

          <h1 className="mt-4 max-w-3xl font-serif text-[2.1rem] font-bold leading-[1.25] text-ink sm:text-5xl sm:leading-[1.2]">
            누가 말했는지가 아니라,
            <br />
            무엇이 실제로 바뀌는지를 봅니다.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-ko text-ink-soft sm:text-lg">
            같은 법을 두고 정치권은 정반대로 설명하고, 기사마다 결론이 다릅니다.
            그래서 정작 내 삶이 어떻게 달라지는지는 알기 어렵습니다. 입법로그는
            어느 편도 들지 않고 딱 하나만 따집니다.
          </p>

          <p className="mt-5 font-serif text-2xl font-bold text-brand-strong sm:text-3xl">
            &ldquo;그래서 실제로 무엇이 바뀌는가?&rdquo;
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/bills" className="btn-primary">
              추적 중인 법안 보기
            </Link>
            <Link href="/about" className="btn-secondary">
              어떻게 분석하나요?
            </Link>
          </div>

          <dl className="mt-14 grid max-w-2xl grid-cols-3 gap-4 border-t border-paper-line pt-8 sm:gap-6">
            {[
              { label: "추적 중인 법안·정책", value: counts.total },
              { label: "이미 시행된 것", value: counts.inEffect },
              { label: "아직 국회에 있는 것", value: counts.pending },
            ].map((stat) => (
              <div key={stat.label}>
                <dd className="font-serif text-3xl font-bold tabular-nums text-ink sm:text-4xl">
                  {stat.value}
                </dd>
                <dt className="mt-1 text-xs leading-ko-tight text-ink-faint sm:text-sm">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── 최근 기록 ───────────────────────────────────────── */}
      <section className="mx-auto max-w-content px-5 py-14 sm:px-6 sm:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">최근 기록</p>
            <h2 className="mt-1.5 font-serif text-2xl font-bold text-ink sm:text-3xl">
              지금 추적하고 있는 법안
            </h2>
          </div>
          <Link
            href="/bills"
            className="rounded text-sm font-semibold text-brand-strong underline-offset-4 hover:underline"
          >
            전체 보기 →
          </Link>
        </div>

        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {recent.map((bill) => (
            <BillCard key={bill.slug} bill={bill} />
          ))}
        </div>
      </section>

      {/* ── 읽는 법 ─────────────────────────────────────────── */}
      <section className="border-y border-paper-line bg-paper-dim">
        <div className="mx-auto max-w-content px-5 py-14 sm:px-6 sm:py-16">
          <p className="eyebrow">읽는 법</p>
          <h2 className="mt-1.5 font-serif text-2xl font-bold text-ink sm:text-3xl">
            모든 문장에 &lsquo;어디까지 믿어도 되는지&rsquo; 표시가 붙습니다
          </h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-ko text-ink-soft">
            확인된 사실인지, 누군가의 주장인지, 아직 결과가 나오지 않은
            전망인지를 문장마다 표시합니다. 표식만 봐도 그 문장을 얼마나 믿어야
            할지 판단할 수 있습니다.
          </p>
          <div className="mt-8">
            <ClaimLegend />
          </div>
        </div>
      </section>

      {/* ── 10단계 구조 ─────────────────────────────────────── */}
      <section className="mx-auto max-w-content px-5 py-14 sm:px-6 sm:py-16">
        <p className="eyebrow">분석 구조</p>
        <h2 className="mt-1.5 font-serif text-2xl font-bold text-ink sm:text-3xl">
          어떤 법이든 똑같은 10단계로 뜯어봅니다
        </h2>
        <p className="mt-3 max-w-2xl text-[15px] leading-ko text-ink-soft">
          법마다 다른 방식으로 설명하면 비교가 안 됩니다. 그래서 모든 법을 같은
          순서, 같은 질문으로 정리합니다.
        </p>

        <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {BILL_SECTIONS.filter((s) => s.id !== "sources").map((s) => (
            <li key={s.id} className="card p-4">
              <span className="font-serif text-sm font-bold tracking-widest text-brand-strong">
                {s.label}
              </span>
              <p className="mt-1.5 font-semibold leading-snug text-ink">
                {s.title}
              </p>
              {s.lede && (
                <p className="mt-1 text-xs leading-ko-tight text-ink-faint">
                  {s.lede}
                </p>
              )}
            </li>
          ))}
        </ol>
      </section>

      {/* ── 원칙 ────────────────────────────────────────────── */}
      <section className="border-t border-paper-line bg-paper-dim">
        <div className="mx-auto max-w-content px-5 py-14 sm:px-6 sm:py-16">
          <p className="eyebrow">지키는 원칙</p>
          <h2 className="mt-1.5 font-serif text-2xl font-bold text-ink sm:text-3xl">
            일곱 가지 원칙
          </h2>

          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PRINCIPLES.map((p) => (
              <li key={p.n} className="card p-5">
                <span
                  aria-hidden
                  className="font-serif text-2xl font-bold text-brand/35"
                >
                  {p.n}
                </span>
                <h3 className="mt-0.5 font-semibold leading-snug text-ink">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-ko text-ink-soft">{p.body}</p>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <Link
              href="/about"
              className="rounded text-sm font-semibold text-brand-strong underline-offset-4 hover:underline"
            >
              더 자세한 원칙과 장기 계획 읽기 →
            </Link>
          </div>
        </div>
      </section>

      {/* ── 맺음말 ──────────────────────────────────────────── */}
      <section className="mx-auto max-w-content px-5 py-20 text-center sm:px-6">
        <p className="font-serif text-2xl font-bold text-ink sm:text-3xl">
          지피지기면 백전불태.
        </p>
        <p className="mx-auto mt-4 max-w-xl text-[15px] leading-ko text-ink-soft">
          좋은 민주주의는 더 많은 주장이 아니라 더 정확한 판단에서 시작됩니다.
          입법로그는 무엇이 옳은지 대신 정해 주지 않습니다. 스스로 판단할 근거를
          드립니다.
        </p>
        <p className="mt-8 font-serif text-xl font-bold text-brand-strong">
          말이 아니라, 결과까지.
        </p>
      </section>
    </div>
  );
}
