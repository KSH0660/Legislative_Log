import type { EvidenceItem } from "@/types/bill";
import ClaimBadge from "./ClaimBadge";
import SourceTag from "./SourceTag";

type Certainty = EvidenceItem["certainty"];

// '확실성 높음'보다 '얼마나 믿을 수 있나'를 눈금으로 보여주는 편이 훨씬 빨리 읽힌다.
const CERTAINTY: Record<
  Certainty,
  { bars: number; color: string; track: string; help: string }
> = {
  높음: {
    bars: 3,
    color: "bg-claim-fact",
    track: "bg-claim-fact/15",
    help: "1차 자료로 직접 확인됨",
  },
  중간: {
    bars: 2,
    color: "bg-claim-forecast",
    track: "bg-claim-forecast/15",
    help: "근거는 있으나 해석 여지가 있음",
  },
  낮음: {
    bars: 1,
    color: "bg-claim-allegation",
    track: "bg-claim-allegation/15",
    help: "근거가 제한적이라 그대로 믿기 어려움",
  },
};

function CertaintyMeter({ level }: { level: Certainty }) {
  const { bars, color, track, help } = CERTAINTY[level];
  return (
    <span
      className="inline-flex items-center gap-1.5"
      title={`근거 확실성 ${level} — ${help}`}
    >
      <span aria-hidden className="flex gap-0.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`h-3 w-1.5 rounded-sm ${i < bars ? color : track}`}
          />
        ))}
      </span>
      <span className="text-xs font-semibold text-ink-soft">
        근거 확실성 {level}
      </span>
    </span>
  );
}

export default function EvidenceList({ items }: { items: EvidenceItem[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={i} className="card p-4">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <ClaimBadge type={item.claimType} />
            <CertaintyMeter level={item.certainty} />
          </div>
          <p className="mt-2.5 text-sm leading-ko text-ink">{item.text}</p>
          {item.source && <SourceTag source={item.source} />}
        </li>
      ))}
    </ul>
  );
}
