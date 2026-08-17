"use client";

import { getQuestion } from "@/lib/profile/questions";
import { RELEVANCE_STRENGTH } from "@/lib/impact/match";
import { cellState, DOMAIN_GROUPS } from "@/lib/impact/map";
import type { PersonalizedBill } from "@/lib/impact";
import { RELATIONSHIP_LABEL } from "@/types/impact";
import { CellChip, EvidenceTag, RelevanceBadge } from "./atoms";

// 목록 카드의 개인화 부분. §10.1
//
// 필수 요소: 관련성 상태 / 관련 이유와 관계 유형 / 생활영역별 방향 /
// 현재·미래 영향 / 진행 단계와 시제 문구 / 근거 방식과 미확인 조건.
//
// `추천`이라는 표현은 쓰지 않는다. `관련 순서`라고 부른다. (§10.1 · §14.2)

function Line({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
      <span className="shrink-0 text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">
        {label}
      </span>
      <span className="min-w-0 text-sm leading-ko-tight text-ink-soft">
        {children}
      </span>
    </div>
  );
}

export function RelevanceHeader({ item }: { item: PersonalizedBill }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <RelevanceBadge relevance={item.relevance.relevance} />
      {item.phrase.conditional && (
        <span className="chip bg-surface text-ink-faint ring-1 ring-inset ring-paper-line">
          아직 시행 전
        </span>
      )}
    </div>
  );
}

export default function BillCardPersonalization({
  item,
}: {
  item: PersonalizedBill;
}) {
  const { relevance } = item;

  // 가장 강한 일치 경로 하나를 관련 이유로 쓴다. 동점이면 데이터 순서를 따른다(결정론).
  const lead = relevance.matched.reduce<(typeof relevance.matched)[number] | null>(
    (best, e) => {
      if (!best) return e;
      const a = e.relevance ? RELEVANCE_STRENGTH[e.relevance] : -1;
      const b = best.relevance ? RELEVANCE_STRENGTH[best.relevance] : -1;
      return a > b ? e : best;
    },
    null,
  );

  const groupStates = DOMAIN_GROUPS.map((g) => ({
    group: g,
    state: cellState(relevance, g.domains),
  })).filter((g) => g.state !== "not_applicable");

  const now = relevance.matched.filter((e) => e.pathway.timeframe === "current");
  const later = relevance.matched.filter((e) => e.pathway.timeframe !== "current");

  const missing = Array.from(
    new Set([
      ...item.decisive.filter((d) => !d.answered).map((d) => d.field),
      ...item.calculationFields,
    ]),
  );

  if (relevance.relevance === "none") {
    return (
      <div className="space-y-2.5">
        <p className="text-sm leading-ko text-ink-soft">
          {relevance.review?.noPersonalPathwayReason ??
            "검토했지만 개인 생활조건과 직접 연결되는 조항을 찾지 못했습니다."}
        </p>
        {relevance.review && (
          <p className="text-[11px] text-ink-faint">
            <span className="num">{relevance.review.reviewedAt}</span> 검토 ·{" "}
            {relevance.review.baselineVersion}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {lead && (
        <Line label="왜 관련 있나">
          {lead.pathway.title}
          <span className="ml-1.5 text-ink-faint">
            ({RELATIONSHIP_LABEL[lead.pathway.relationship]} 경로)
          </span>
        </Line>
      )}

      {groupStates.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
          <span className="shrink-0 text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">
            생활영역
          </span>
          {groupStates.map(({ group, state }) => (
            <span key={group.id} className="inline-flex items-center gap-1">
              <span className="text-xs text-ink-soft">{group.short}</span>
              <CellChip state={state} showLabel={false} />
              <span className="sr-only">{group.label}</span>
            </span>
          ))}
        </div>
      )}

      {now.length > 0 && (
        <Line label="지금">
          {now.map((e) => e.pathway.title).join(" · ")}
        </Line>
      )}
      {later.length > 0 && (
        <Line label="앞으로">
          {later.map((e) => e.pathway.title).join(" · ")}
        </Line>
      )}

      {relevance.undecidable.length > 0 && (
        <Line label="판정 보류">
          아직 판정할 수 없는 경로 {relevance.undecidable.length}건
        </Line>
      )}
      {relevance.directionUnknownCount > 0 && (
        <Line label="방향 미확정">
          방향을 정하지 못한 경로 {relevance.directionUnknownCount}건
        </Line>
      )}

      {missing.length > 0 && (
        <Line label="더 알려주시면">
          {missing.map((f) => getQuestion(f).label).join(" · ")}
        </Line>
      )}

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-paper-line pt-2.5">
        {lead && <EvidenceTag method={lead.pathway.evidenceMethod} />}
        <span className="text-[11px] leading-ko-tight text-ink-faint">
          {item.phrase.text}
        </span>
      </div>
    </div>
  );
}
