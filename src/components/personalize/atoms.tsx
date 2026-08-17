import ClaimBadge from "@/components/ClaimBadge";
import {
  EVIDENCE_METHOD_CLAIM_TYPE,
  EVIDENCE_METHOD_LABEL,
  RELATIONSHIP_LABEL,
  type EvidenceMethod,
  type ImpactRelationship,
} from "@/types/impact";
import {
  CELL_DESCRIPTION,
  CELL_LABEL,
  CELL_SYMBOL,
  type CellState,
} from "@/lib/impact/map";
import {
  RELEVANCE_DESCRIPTION,
  RELEVANCE_LABEL,
  type Relevance,
} from "@/lib/impact/match";

// 개인화 화면의 작은 표시 요소들.
//
// 공통 규칙: 색은 보조 수단이다. 모든 상태는 기호나 글자로도 구분된다. (§5.2 · §17.3)

const RELEVANCE_STYLE: Record<Relevance, string> = {
  direct: "bg-ink text-paper ring-ink",
  conditional: "bg-brand-wash text-brand-strong ring-brand/35",
  indirect: "bg-surface text-ink-soft ring-paper-line",
  undecidable: "bg-surface text-ink-faint ring-ink-faint/40",
  none: "bg-paper-dim text-ink-faint ring-paper-line",
};

export function RelevanceBadge({
  relevance,
  className = "",
}: {
  relevance: Relevance;
  className?: string;
}) {
  return (
    <span
      title={RELEVANCE_DESCRIPTION[relevance]}
      className={`chip gap-1.5 ring-1 ring-inset ${RELEVANCE_STYLE[relevance]} ${className}`}
    >
      <span className="sr-only">관련성: </span>
      {RELEVANCE_LABEL[relevance]}
    </span>
  );
}

const CELL_STYLE: Record<CellState, string> = {
  benefit: "bg-claim-fact-bg text-claim-fact ring-claim-fact/30",
  burden: "bg-claim-forecast-bg text-claim-forecast ring-claim-forecast/30",
  mixed:
    "bg-claim-interpretation-bg text-claim-interpretation ring-claim-interpretation/30",
  no_change: "bg-surface text-ink-soft ring-paper-line",
  insufficient: "bg-surface text-ink-faint ring-ink-faint/35",
  not_applicable: "bg-transparent text-ink-faint/70 ring-paper-line-soft",
};

/** 기호와 텍스트 레이블을 언제나 함께 노출한다. 기호만 쓰지 않는다. */
export function CellChip({
  state,
  showLabel = true,
  className = "",
}: {
  state: CellState;
  showLabel?: boolean;
  className?: string;
}) {
  return (
    <span
      title={CELL_DESCRIPTION[state]}
      className={`chip gap-1.5 ring-1 ring-inset ${CELL_STYLE[state]} ${className}`}
    >
      <span aria-hidden className="num text-sm font-bold leading-none">
        {CELL_SYMBOL[state]}
      </span>
      {showLabel ? (
        CELL_LABEL[state]
      ) : (
        <span className="sr-only">{CELL_LABEL[state]}</span>
      )}
    </span>
  );
}

/** 본인/가구/고용주/소비자/공공 — 직접과 간접을 눈으로 구분하는 핵심 표시 */
export function RelationshipTag({
  relationship,
}: {
  relationship: ImpactRelationship;
}) {
  const direct = relationship === "self" || relationship === "household";
  return (
    <span
      title={
        direct
          ? "나 또는 우리 가구에 법이 직접 적용되는 경로입니다."
          : "다른 주체에게 적용된 결과가 나에게 옮겨올 수 있는 경로입니다. 얼마나 옮겨오는지는 별개 문제입니다."
      }
      className={`chip gap-1 ring-1 ring-inset ${
        direct
          ? "bg-brand-wash text-brand-strong ring-brand/30"
          : "bg-paper-dim text-ink-faint ring-paper-line"
      }`}
    >
      <span className="sr-only">관계 유형: </span>
      {RELATIONSHIP_LABEL[relationship]} 경로
    </span>
  );
}

/**
 * 근거 방식 표시. 확신 눈금을 새로 만들지 않고 기존 ClaimBadge로 통일한다. (§5.4)
 * `EvidenceItem.certainty`(높음/중간/낮음)는 개인화 레이어로 확장하지 않는다.
 */
export function EvidenceTag({ method }: { method: EvidenceMethod }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <ClaimBadge type={EVIDENCE_METHOD_CLAIM_TYPE[method]} short />
      <span className="text-[11px] text-ink-faint">
        {EVIDENCE_METHOD_LABEL[method]}
      </span>
    </span>
  );
}

/** §14.3 — 개인화 화면에 상시 노출하는 고지 */
export function PersonalizationDisclosure({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-dashed border-paper-line bg-paper-dim/60 p-4 text-xs leading-ko text-ink-soft ${className}`}
    >
      <p className="font-bold text-ink">읽기 전에 알아두실 것</p>
      <ul className="mt-2 space-y-1.5">
        <li className="flex gap-2">
          <span aria-hidden className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-ink-faint" />
          <span>
            이 결과는 법률·세무·노무·재무 상담을 대체하지 않습니다.
          </span>
        </li>
        <li className="flex gap-2">
          <span aria-hidden className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-ink-faint" />
          <span>
            판정은 공개된 법안 문안과 검토일을 기준으로 합니다. 시행령이
            정해지거나 법안이 수정되면 달라질 수 있습니다.
          </span>
        </li>
        <li className="flex gap-2">
          <span aria-hidden className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-ink-faint" />
          <span>
            실제 자격 판정은 국민연금공단·국세청 등 관계 기관의 기준을 따릅니다.
          </span>
        </li>
      </ul>
    </div>
  );
}
