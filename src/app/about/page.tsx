import type { Metadata } from "next";
import ClaimLegend from "@/components/ClaimLegend";

export const metadata: Metadata = {
  title: "소개 — 원칙과 방법론",
  description:
    "입법로그는 대한민국의 주요 법안과 정책을 원문, 데이터, 논리, 실제 결과를 기준으로 추적하는 독립적인 정책 검증 플랫폼입니다.",
};

const PRINCIPLES = [
  {
    n: "1",
    title: "정당보다 법안을 본다",
    body: "민주당, 국민의힘 또는 어느 정부가 제안했는지가 분석의 결론을 결정하지 않습니다. 모든 법안과 정책에 동일한 평가 기준을 적용합니다.",
  },
  {
    n: "2",
    title: "원문부터 확인한다",
    body: "기사나 정치인의 발언보다 법안 원문, 법령, 공식 통계와 자료를 우선합니다.",
  },
  {
    n: "3",
    title: "사실과 의견을 분리한다",
    body: "모든 콘텐츠에서 확인된 사실, 공식 주장, 해석, 전망, 확인되지 않은 의혹을 명확하게 구분합니다.",
  },
  {
    n: "4",
    title: "가장 강한 찬성과 반대를 함께 보여준다",
    body: "상대 진영의 약한 주장을 가져와 반박하는 방식이 아니라, 양측이 제시할 수 있는 가장 설득력 있는 논리를 함께 제공합니다.",
  },
  {
    n: "5",
    title: "누가 얻고 누가 부담하는지를 추적한다",
    body: "정책의 의도뿐 아니라 실제 구조를 분석합니다 — 누가 혜택을 받는가, 누가 비용을 부담하는가, 정부 재정에는 어떤 영향을 주는가, 예상되는 부작용은 무엇인가.",
  },
  {
    n: "6",
    title: "예측에 책임을 묻는다",
    body: "법안과 정책 발표 당시의 주장을 기록하고 실제 결과가 나온 뒤 다시 평가합니다. 정치인의 주장도, 전문가의 주장도, 입법로그 자신의 분석도 예외가 아닙니다.",
  },
  {
    n: "7",
    title: "틀렸다면 공개적으로 수정한다",
    body: "모든 중요한 수정과 정정은 기록으로 남깁니다. 신뢰는 틀리지 않는 것에서 생기는 것이 아니라, 틀렸을 때 어떻게 고치는가에서 생깁니다.",
  },
];

const STRUCTURE = [
  { n: "①", title: "30초 요약", body: "무엇이 어떻게 바뀌는가." },
  { n: "②", title: "현재 vs 변경 후", body: "현행 제도와 개정안의 차이를 비교합니다." },
  { n: "③", title: "추진 측의 주장", body: "이 정책을 추진하는 이유와 기대 효과는 무엇인가." },
  { n: "④", title: "반대 측의 주장", body: "가장 강한 반론과 우려는 무엇인가." },
  { n: "⑤", title: "실제 작동 구조", body: "정책이 어떤 과정을 통해 효과를 만들어내는지 분석합니다." },
  { n: "⑥", title: "수혜자와 비용 부담자", body: "누가 이익을 얻고 누가 비용과 위험을 부담하는지 보여줍니다." },
  { n: "⑦", title: "근거와 불확실성", body: "어떤 근거가 있으며 어디까지 확인할 수 있는지 표시합니다." },
  { n: "⑧", title: "입법로그 분석", body: "사실과 가치판단을 분리해 종합적으로 분석합니다." },
  { n: "⑨", title: "예측 기록", body: "정책 시행 후 어떤 결과가 발생할 것으로 예상되는지 기록합니다." },
  { n: "⑩", title: "결과 추적", body: "6개월·1년·3년 후 실제 데이터를 확인하고 최초 예상과 비교합니다." },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-prose px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-dark">
        About
      </p>
      <h1 className="mt-2 font-serif text-3xl font-bold leading-tight text-ink sm:text-4xl">
        누가 말했는지가 아니라,
        <br />
        무엇이 실제로 바뀌는지를 본다.
      </h1>

      <div className="mt-10 space-y-5 text-[15px] leading-relaxed text-ink-soft">
        <h2 className="!mt-0 font-serif text-xl font-bold text-ink">프로젝트 개요</h2>
        <p>
          입법로그는 대한민국의 주요 법안과 정책을 원문, 데이터, 논리, 실제
          결과를 기준으로 추적하는 독립적인 정책 검증 플랫폼입니다.
        </p>
        <p>
          정치권은 같은 법안과 정책을 두고 서로 다른 설명을 내놓습니다. 언론
          보도와 온라인 여론까지 더해지면 국민이 실제 내용을 직접 파악하기는
          더욱 어려워집니다.
        </p>
        <p>
          입법로그는 특정 정당이나 정치인을 지지하거나 공격하는 것을 목적으로
          하지 않습니다. 대신 하나의 질문에 집중합니다.
        </p>
        <p className="border-l-4 border-brand pl-4 font-serif text-xl font-semibold text-ink">
          &ldquo;그래서 실제로 무엇이 바뀌는가?&rdquo;
        </p>
        <p>
          각 법안과 정책에 대해 현행 제도와 변경 내용을 비교하고, 찬성과
          반대 측의 주장을 동일한 기준으로 정리하며, 실제 영향을 받는
          사람과 비용을 부담하는 주체를 분석합니다.
        </p>
        <p>
          모든 분석에서는 사실, 정치권의 주장, 해석, 전망, 확인되지 않은
          의혹을 명확하게 구분하고, 가능한 한 법안 원문·법령·공식 통계·연구
          자료 등 1차 자료를 근거로 제시합니다.
        </p>
        <p>
          입법로그가 기존 정치 콘텐츠와 가장 크게 다른 점은 정책이 발표되는
          순간에서 분석을 끝내지 않는다는 것입니다. 정책 시행 당시 정부,
          정치권, 전문가 그리고 입법로그가 제시했던 전망을 기록하고, 6개월·1년·
          3년 후 실제 결과를 다시 확인합니다. 예측이 맞았는지, 틀렸는지,
          예상하지 못한 부작용이 발생했는지까지 추적합니다.
        </p>
        <p>
          즉, 입법로그는 단순한 뉴스 사이트가 아니라 대한민국 정책의
          의사결정 과정과 결과가 시간순으로 축적되는 기록 시스템을 지향합니다.
        </p>
      </div>

      <div className="mt-14 rounded-xl border border-paper-line bg-paper-dim p-6">
        <h2 className="font-serif text-xl font-bold text-ink">핵심 철학</h2>
        <p className="mt-3 font-serif text-lg font-semibold text-brand-dark">
          지피지기면 백전불태.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          좋은 민주주의는 더 많은 주장보다 더 정확한 판단에서 시작됩니다.
          국민이 자신의 나라에서 어떤 법이 만들어지고 있으며, 그 법이 실제
          생활과 경제와 사회에 어떤 영향을 미치는지를 제대로 이해한다면
          정치권 역시 더 책임 있는 정책을 만들 수밖에 없습니다.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          입법로그는 국민에게 정답을 대신 내려주는 플랫폼이 아닙니다. 판단할
          수 있는 근거를 제공하는 플랫폼입니다.
        </p>
      </div>

      <h2 className="mt-14 font-serif text-2xl font-bold text-ink">핵심 원칙</h2>
      <div className="mt-6 space-y-5">
        {PRINCIPLES.map((p) => (
          <div key={p.n} className="flex gap-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink font-serif text-sm font-bold text-paper">
              {p.n}
            </span>
            <div>
              <h3 className="font-semibold text-ink">{p.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                {p.body}
              </p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-14 font-serif text-2xl font-bold text-ink">
        사실과 의견의 다섯 가지 표식
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-ink-soft">
        핵심원칙 3(사실과 의견 분리)을 실제로 구현하기 위해, 입법로그의 모든
        주장과 근거에는 다음 다섯 가지 표식 중 하나가 붙습니다.
      </p>
      <div className="mt-6">
        <ClaimLegend />
      </div>

      <h2 className="mt-14 font-serif text-2xl font-bold text-ink">
        법안 분석 기본 구조
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-ink-soft">
        각 법안과 정책은 동일한 구조로 분석합니다.
      </p>
      <ol className="mt-6 space-y-4">
        {STRUCTURE.map((s) => (
          <li
            key={s.n}
            className="flex gap-4 rounded-lg border border-paper-line bg-white p-4"
          >
            <span className="font-serif text-lg font-bold text-brand-dark">
              {s.n}
            </span>
            <div>
              <p className="font-semibold text-ink">{s.title}</p>
              <p className="mt-0.5 text-sm text-ink-soft">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-14 rounded-xl border border-paper-line bg-paper-dim p-6">
        <h2 className="font-serif text-xl font-bold text-ink">장기 비전</h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          입법로그의 목표는 또 하나의 정치 유튜브 채널을 만드는 것이
          아닙니다. 장기적으로는 대한민국에서 어떤 정책이 왜 만들어졌고,
          누가 어떤 주장을 했으며, 실제로 어떤 결과가 발생했는지를 누구나
          추적할 수 있는{" "}
          <strong className="text-ink">공공 정책 기록 인프라</strong>가
          되는 것입니다.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          수백 개, 수천 개의 정책 분석이 축적되면 국민은 특정 정치인이나
          언론의 해석에 의존하지 않고 직접 정책의 역사와 결과를 확인할 수
          있습니다. 그리고 정치인 역시 과거 자신의 주장과 정책 결과를
          피하기 어려워집니다.
        </p>
      </div>

      <div className="mt-14 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-dark">
          한 문장 미션
        </p>
        <p className="mx-auto mt-3 max-w-md font-serif text-xl font-bold leading-snug text-ink">
          입법로그는 정치인의 말을 평가하는 곳이 아니라, 그 말이 실제
          정책과 결과로 어떻게 이어졌는지를 기록하는 곳입니다.
        </p>
        <p className="mt-6 font-serif text-2xl font-bold text-brand-dark">
          말이 아니라, 결과까지.
        </p>
      </div>
    </div>
  );
}
