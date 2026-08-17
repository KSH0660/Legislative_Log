"use client";

import SourceTag from "@/components/SourceTag";
import type { Bill } from "@/types/bill";
import {
  IMPACT_DOMAIN_LABEL,
  TIMEFRAME_LABEL,
  type ImpactDirection,
} from "@/types/impact";
import type { UserProfile } from "@/types/profile";
import type { PathwayEvaluation } from "@/lib/impact/match";
import type { CellState } from "@/lib/impact/map";
import { pathwayTiming, statusPhrase } from "@/lib/impact/status";
import {
  formatAmountRange,
  runCalculator,
  type CalculationOutcome,
} from "@/lib/impact/calculators";
import { CellChip, EvidenceTag, RelationshipTag } from "./atoms";

const DIRECTION_STATE: Record<ImpactDirection, CellState> = {
  benefit: "benefit",
  burden: "burden",
  mixed: "mixed",
  no_direct_change: "no_change",
  unknown: "insufficient",
};

function Facts({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">
        {title}
      </p>
      <ul className="mt-1.5 space-y-1.5 text-sm leading-ko text-ink-soft">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2">
            <span aria-hidden className="mt-[10px] h-1 w-1 shrink-0 rounded-full bg-ink-faint" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Calculation({ outcome }: { outcome: CalculationOutcome }) {
  if (!outcome.ok) {
    return (
      <div className="rounded-lg border border-dashed border-paper-line bg-paper-dim/60 p-3.5">
        <p className="text-sm font-semibold text-ink">
          금액은 아직 계산하지 않습니다
        </p>
        <p className="mt-1 text-xs leading-ko text-ink-soft">{outcome.reason}</p>
        {outcome.needs.length > 0 && (
          <p className="mt-2 text-xs text-ink-faint">
            필요한 항목 · {outcome.needs.join(" · ")}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-paper-line bg-surface p-3.5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-sm font-semibold text-ink">{outcome.title}</p>
        <p className="text-[11px] text-ink-faint">
          {outcome.appliedYear}년 적용 · {outcome.basis} 기준 · 월 단위
        </p>
      </div>
      <p className="mt-1 text-xs leading-ko-tight text-ink-faint">
        {outcome.formula}
      </p>

      <dl className="mt-3 space-y-1.5 text-sm">
        <div className="flex flex-wrap justify-between gap-x-3">
          <dt className="text-ink-soft">개정 전 산식</dt>
          <dd className="num text-ink">{formatAmountRange(outcome.baseline)}</dd>
        </div>
        <div className="flex flex-wrap justify-between gap-x-3">
          <dt className="text-ink-soft">개정 후 (2026년)</dt>
          <dd className="num text-ink">{formatAmountRange(outcome.revised)}</dd>
        </div>
      </dl>

      <ul className="mt-3 space-y-2 border-t border-paper-line pt-3">
        {outcome.steps.map((step) => (
          <li key={step.label}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <span className="text-sm text-ink-soft">{step.label}</span>
              <span className="num text-sm font-semibold text-ink">
                +{formatAmountRange(step.delta)}
              </span>
            </div>
            {step.note && (
              <p className="mt-0.5 text-[11px] leading-ko-tight text-ink-faint">
                {step.note}
              </p>
            )}
          </li>
        ))}
      </ul>

      <details className="group mt-3 border-t border-paper-line pt-3">
        <summary className="cursor-pointer list-none text-xs font-semibold text-brand-strong">
          이 계산에서 빠진 것 {outcome.excluded.length}가지
          <span aria-hidden className="ml-1 inline-block transition-transform group-open:rotate-90">
            ›
          </span>
        </summary>
        <ul className="mt-2 space-y-1.5 text-xs leading-ko text-ink-soft">
          {outcome.excluded.map((e, i) => (
            <li key={i} className="flex gap-2">
              <span aria-hidden className="mt-[8px] h-1 w-1 shrink-0 rounded-full bg-ink-faint" />
              <span>{e}</span>
            </li>
          ))}
        </ul>
        <ul className="mt-2 space-y-1.5 text-xs leading-ko text-ink-faint">
          {outcome.assumptions.map((a, i) => (
            <li key={i}>가정 · {a}</li>
          ))}
        </ul>
        {outcome.sources.map((s, i) => (
          <SourceTag key={i} source={s} />
        ))}
      </details>
    </div>
  );
}

export default function PathwayDetail({
  evaluation,
  bill,
  profile,
  asOf,
}: {
  evaluation: PathwayEvaluation;
  bill: Bill;
  profile: UserProfile;
  asOf: string;
}) {
  const p = evaluation.pathway;
  const phrase = statusPhrase(bill, asOf);
  const timing = pathwayTiming(p, asOf);
  const outcome =
    p.magnitude?.kind === "statutory_calculation" && p.magnitude.calculatorId
      ? runCalculator(p.magnitude.calculatorId, profile)
      : null;

  return (
    <article className="card p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h4 className="font-semibold leading-ko-tight text-ink">{p.title}</h4>
        <CellChip state={DIRECTION_STATE[p.direction]} />
      </div>

      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
        <RelationshipTag relationship={p.relationship} />
        <span className="chip bg-paper-dim text-ink-faint ring-1 ring-inset ring-paper-line">
          {IMPACT_DOMAIN_LABEL[p.domain]}
        </span>
        <span className="chip bg-paper-dim text-ink-faint ring-1 ring-inset ring-paper-line">
          {TIMEFRAME_LABEL[p.timeframe]}
        </span>
        <EvidenceTag method={p.evidenceMethod} />
      </div>

      {/* §5.5 — 진행 단계에 맞는 시제 문구를 반드시 붙인다 */}
      <p className="mt-3 rounded-lg bg-paper-dim px-3 py-2 text-xs leading-ko text-ink-soft">
        {phrase.text}
        {timing && <span className="block mt-0.5 text-ink-faint">{timing}</span>}
      </p>

      <p className="mt-3 text-sm leading-ko text-ink-soft">{p.mechanism}</p>

      {p.undecidable && (
        <p className="mt-3 rounded-lg border border-dashed border-ink-faint/40 px-3 py-2 text-xs leading-ko text-ink-soft">
          아직 판정할 수 없는 이유 · {p.undecidable.reason}
        </p>
      )}

      {(evaluation.satisfied.length > 0 || evaluation.pending.length > 0) && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {evaluation.satisfied.length > 0 && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">
                맞은 조건
              </p>
              <ul className="mt-1.5 space-y-1 text-xs leading-ko text-ink-soft">
                {evaluation.satisfied.map((c, i) => (
                  <li key={i} className="flex gap-1.5">
                    <span aria-hidden className="font-bold text-claim-fact">✓</span>
                    <span>{c.explanation}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {evaluation.pending.length > 0 && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">
                아직 확인이 필요한 조건
              </p>
              <ul className="mt-1.5 space-y-1 text-xs leading-ko text-ink-soft">
                {evaluation.pending.map((c, i) => (
                  <li key={i} className="flex gap-1.5">
                    <span aria-hidden className="font-bold text-ink-faint">?</span>
                    <span>{c.explanation}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {outcome && (
        <div className="mt-4">
          <Calculation outcome={outcome} />
        </div>
      )}

      {p.magnitude?.eligibilityChange && (
        <p className="mt-3 rounded-lg border border-paper-line bg-surface px-3 py-2 text-sm leading-ko text-ink-soft">
          <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">
            자격·권리 변화{" "}
          </span>
          {p.magnitude.eligibilityChange}
        </p>
      )}

      <div className="mt-4 space-y-3 border-t border-paper-line pt-3.5">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">
            비교 기준선
          </p>
          <p className="mt-1 text-sm leading-ko text-ink-soft">{p.baseline}</p>
          <p className="mt-1 text-[11px] text-ink-faint">
            기준선 버전 · {p.baselineVersion}
          </p>
        </div>
        <Facts title="이 판정이 놓은 가정" items={p.assumptions} />
        <Facts title="아직 모르는 것" items={p.uncertainties} />
      </div>

      <div className="mt-3 border-t border-paper-line pt-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">
          근거
        </p>
        {p.legalBasis.map((s, i) => (
          <SourceTag key={i} source={s} />
        ))}
        <p className="mt-2.5 text-[11px] text-ink-faint">
          <span className="num">{p.reviewedAt}</span> 검토
        </p>
      </div>
    </article>
  );
}
