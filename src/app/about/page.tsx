import type { Metadata } from "next";
import Link from "next/link";
import ClaimLegend from "@/components/ClaimLegend";
import { BILL_SECTIONS } from "@/lib/sections";

export const metadata: Metadata = {
  title: "소개 — 원칙과 방법론",
  description:
    "입법로그가 법안을 어떤 원칙과 어떤 순서로 분석하는지, 그리고 왜 예측을 기록하고 나중에 다시 채점하는지 설명합니다.",
};

const PRINCIPLES = [
  {
    n: "1",
    title: "정당이 아니라 법안을 봅니다",
    body: "어느 당이 냈는지, 어느 정부가 추진하는지는 결론에 영향을 주지 않습니다. 모든 법안에 똑같은 잣대를 적용합니다.",
  },
  {
    n: "2",
    title: "기사보다 원문을 먼저 봅니다",
    body: "정치인의 발언이나 기사 요약보다 법안 원문, 현행 법 조문, 정부 공식 통계를 먼저 확인합니다. 요약은 사람이 옮기는 과정에서 반드시 무언가를 잃습니다.",
  },
  {
    n: "3",
    title: "사실과 의견을 섞지 않습니다",
    body: "확인된 사실, 누군가의 공식 주장, 입법로그의 해석, 아직 결과가 없는 전망, 확인되지 않은 의혹을 문장 단위로 구분해 표시합니다.",
  },
  {
    n: "4",
    title: "양쪽의 가장 센 논리를 함께 싣습니다",
    body: "반박하기 좋은 약한 주장을 골라 오는 것은 토론이 아니라 연출입니다. 찬성과 반대 각각에서 가장 설득력 있는 논리를 나란히 놓습니다.",
  },
  {
    n: "5",
    title: "누가 얻고 누가 부담하는지 따집니다",
    body: "정책의 의도가 아니라 실제 구조를 봅니다. 누가 혜택을 받고, 누가 비용을 내며, 나라 살림에는 어떤 영향이 있고, 어떤 부작용이 예상되는지까지 적습니다.",
  },
  {
    n: "6",
    title: "예측에 책임을 묻습니다",
    body: "법이 만들어질 당시 나온 장담을 그대로 기록해 두고, 시간이 지난 뒤 실제 데이터로 다시 채점합니다. 정치인도 전문가도, 입법로그 자신도 예외가 아닙니다.",
  },
  {
    n: "7",
    title: "틀리면 공개적으로 고칩니다",
    body: "중요한 수정은 모두 기록으로 남깁니다. 신뢰는 틀리지 않아서 생기는 것이 아니라, 틀렸을 때 어떻게 고치는지에서 생깁니다.",
  },
];

const TOC = [
  { href: "#intro", label: "무엇을 하는 곳인가" },
  { href: "#philosophy", label: "왜 만들었나" },
  { href: "#principles", label: "일곱 가지 원칙" },
  { href: "#claim-types", label: "문장 표식 다섯 가지" },
  { href: "#structure", label: "10단계 분석 구조" },
  { href: "#vision", label: "앞으로의 계획" },
];

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="scroll-mt-28 font-serif text-heading font-bold text-ink"
    >
      {children}
      <span aria-hidden className="mt-3 block h-px w-12 bg-brand/60" />
    </h2>
  );
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-prose px-5 py-12 sm:px-6 sm:py-16">
      <p className="eyebrow">소개</p>
      <h1 className="mt-3 font-serif text-title font-bold text-ink">
        누가 말했는지가 아니라,
        <br />
        무엇이 실제로 바뀌는지를 봅니다.
      </h1>

      {/* 페이지 안 목차 */}
      <nav
        aria-label="이 페이지 목차"
        data-print-hide
        className="mt-9 rounded-xl border border-paper-line bg-paper-dim p-4 sm:p-5"
      >
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink-faint">
          이 페이지에서 다루는 것
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {TOC.map((item, i) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="inline-flex min-h-[2.25rem] items-center gap-2 rounded-full border border-paper-line bg-surface px-3.5 text-sm font-medium text-ink-soft transition-colors duration-150 hover:border-brand/45 hover:text-ink"
              >
                <span className="num text-[11px] text-ink-faint">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* 무엇을 하는 곳인가 */}
      <section className="mt-12">
        <H2 id="intro">무엇을 하는 곳인가</H2>
        <div className="mt-4 space-y-4 prose-ko">
          <p>
            입법로그는 대한민국의 주요 법안과 정책을 원문과 데이터, 그리고 시행
            뒤의 실제 결과로 검증해 기록하는 곳입니다. 어느 단체나 정당에도
            속해 있지 않습니다.
          </p>
          <p>
            같은 법을 두고 정치권은 정반대로 설명합니다. 여기에 기사와 온라인
            여론이 겹치면, 정작 그 법이 내 삶을 어떻게 바꾸는지는 더 알기
            어려워집니다.
          </p>
          <p>
            입법로그는 특정 정당이나 정치인을 지지하거나 공격하지 않습니다.
            대신 하나의 질문만 붙듭니다.
          </p>
          <p className="border-l-[3px] border-brand pl-5 font-serif text-xl font-bold text-brand-strong sm:text-2xl">
            &ldquo;그래서 실제로 무엇이 바뀌는가?&rdquo;
          </p>
          <p>
            법안마다 지금 제도와 바뀐 뒤를 나란히 비교하고, 찬성과 반대 논리를
            같은 무게로 정리하며, 누가 이득을 보고 누가 부담을 지는지 따져
            봅니다.
          </p>
          <p>
            <strong className="font-semibold text-ink">
              다른 정치 콘텐츠와 가장 크게 다른 점은, 법이 통과되는 순간에서
              멈추지 않는다는 것입니다.
            </strong>{" "}
            시행 당시 정부와 정치권, 전문가, 그리고 입법로그가 내놓은 예측을
            그대로 기록해 두고 6개월·1년·3년 뒤에 실제로 어떻게 됐는지 다시
            확인합니다. 맞았는지, 틀렸는지, 아무도 예상 못 한 부작용이
            생겼는지까지 남깁니다.
          </p>
          <p>
            그래서 입법로그는 뉴스 사이트라기보다, 정책의 결정 과정과 결과가
            시간순으로 쌓이는 기록 시스템에 가깝습니다.
          </p>
        </div>
      </section>

      {/* 왜 만들었나 */}
      <section className="mt-14">
        <H2 id="philosophy">왜 만들었나</H2>
        <div className="panel mt-5">
          <p className="font-serif text-lg font-bold text-brand-strong">
            지피지기면 백전불태.
          </p>
          <div className="mt-3 space-y-3 text-sm leading-ko text-ink-soft">
            <p>
              좋은 민주주의는 더 많은 주장이 아니라 더 정확한 판단에서
              시작됩니다. 지금 어떤 법이 만들어지고 있고 그 법이 내 생활과
              경제와 사회를 어떻게 바꾸는지 국민이 제대로 알게 되면, 정치권도
              더 책임 있는 정책을 낼 수밖에 없습니다.
            </p>
            <p className="font-medium text-ink">
              입법로그는 정답을 대신 정해 주는 곳이 아닙니다. 스스로 판단할
              근거를 드리는 곳입니다.
            </p>
          </div>
        </div>
      </section>

      {/* 원칙 */}
      <section className="mt-14">
        <H2 id="principles">일곱 가지 원칙</H2>
        <ol className="mt-7 space-y-3">
          {PRINCIPLES.map((p) => (
            <li key={p.n} className="card flex gap-4 p-4 sm:p-5">
              <span
                aria-hidden
                className="num flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-bold text-paper"
              >
                {p.n}
              </span>
              <div className="min-w-0">
                <h3 className="font-semibold leading-snug text-ink">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-ko text-ink-soft">
                  {p.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* 문장 표식 */}
      <section className="mt-14">
        <H2 id="claim-types">문장 표식 다섯 가지</H2>
        <p className="mt-3 prose-ko">
          세 번째 원칙(사실과 의견을 섞지 않는다)을 말로만 두지 않기 위해,
          입법로그의 모든 주장과 근거에는 다음 다섯 가지 중 하나가 붙습니다.
          표식만 봐도 그 문장을 어디까지 믿어야 할지 알 수 있습니다.
        </p>
        <div className="mt-6">
          <ClaimLegend />
        </div>
      </section>

      {/* 10단계 구조 */}
      <section className="mt-14">
        <H2 id="structure">10단계 분석 구조</H2>
        <p className="mt-3 prose-ko">
          법마다 설명 방식이 다르면 서로 비교할 수 없습니다. 그래서 모든 법안을
          아래 순서 그대로 정리합니다.
        </p>
        <ol className="mt-7 space-y-2.5">
          {BILL_SECTIONS.filter((s) => s.id !== "sources").map((s) => (
            <li key={s.id} className="card flex gap-4 p-4">
              <span className="num shrink-0 text-sm font-bold tracking-[0.18em] text-brand-strong">
                {s.label}
              </span>
              <div className="min-w-0">
                <p className="font-semibold leading-snug text-ink">{s.title}</p>
                {s.lede && (
                  <p className="mt-1 text-sm leading-ko-tight text-ink-soft">
                    {s.lede}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-sm leading-ko text-ink-faint">
          여기에 더해 모든 글 끝에는 사용한 자료의 출처를 전부 밝힙니다. 직접
          원문을 확인하고 다른 결론을 내리셔도 됩니다.
        </p>
      </section>

      {/* 장기 계획 */}
      <section className="mt-14">
        <H2 id="vision">앞으로의 계획</H2>
        <div className="panel mt-5">
          <div className="space-y-3 text-sm leading-ko text-ink-soft">
            <p>
              목표는 또 하나의 정치 채널을 만드는 것이 아닙니다. 어떤 정책이 왜
              만들어졌고, 누가 무슨 말을 했으며, 실제로 어떤 결과가 났는지를
              누구나 찾아볼 수 있는{" "}
              <strong className="font-semibold text-ink">
                공공 정책 기록 인프라
              </strong>
              가 되는 것입니다.
            </p>
            <p>
              분석이 수백, 수천 건 쌓이면 특정 정치인이나 언론의 해석을 거치지
              않고도 정책의 역사와 결과를 직접 확인할 수 있게 됩니다. 그렇게
              되면 정치인도 과거의 자기 말과 그 결과를 피해 가기 어려워집니다.
            </p>
          </div>
        </div>
      </section>

      {/* 맺음 */}
      <div className="mt-20 border-t border-paper-line pt-12 text-center">
        <p className="eyebrow">한 문장으로 말하면</p>
        <p className="mx-auto mt-4 max-w-md font-serif text-xl font-bold leading-snug text-ink">
          정치인의 말을 채점하는 곳이 아니라, 그 말이 실제 정책과 결과로 어떻게
          이어졌는지 남겨 두는 곳입니다.
        </p>
        <span aria-hidden className="mx-auto mt-9 block h-px w-16 bg-paper-line" />
        <p className="mt-8 font-serif text-2xl font-bold text-brand-strong">
          말이 아니라, 결과까지.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/bills" className="btn-primary">
            추적 중인 법안 보기
          </Link>
          <Link href="/corrections" className="btn-secondary">
            정정 기록 보기
          </Link>
        </div>
      </div>
    </div>
  );
}
