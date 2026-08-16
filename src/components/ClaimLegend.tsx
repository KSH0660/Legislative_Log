import {
  CLAIM_TYPE_DESCRIPTION,
  CLAIM_TYPE_LABEL,
  type ClaimType,
} from "@/types/bill";
import ClaimBadge from "./ClaimBadge";

const TYPES = Object.keys(CLAIM_TYPE_LABEL) as ClaimType[];

// 표식마다 '어디까지 믿어도 되는지'를 눈금 하나로 요약한다.
// 설명을 다 읽지 않아도 신뢰도 순서가 한눈에 잡히게 하기 위한 장치다.
const TRUST: Record<ClaimType, { level: number; note: string }> = {
  fact: { level: 4, note: "원자료로 확인됨" },
  official_claim: { level: 2, note: "말한 것은 사실, 내용은 별개" },
  interpretation: { level: 2, note: "입법로그의 분석" },
  forecast: { level: 1, note: "아직 결과 없음" },
  allegation: { level: 0, note: "사실로 읽지 말 것" },
};

function TrustMeter({ type }: { type: ClaimType }) {
  const { level, note } = TRUST[type];
  return (
    <span
      className="inline-flex items-center gap-1.5"
      title={`믿을 수 있는 정도 ${level}/4 — ${note}`}
    >
      <span aria-hidden className="flex gap-[3px]">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={`h-1 w-3 rounded-full ${
              i < level ? "bg-ink-soft" : "bg-paper-line"
            }`}
          />
        ))}
      </span>
      <span className="text-[11px] font-medium text-ink-faint">{note}</span>
    </span>
  );
}

export default function ClaimLegend({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <ul className="flex flex-wrap gap-x-3 gap-y-2">
        {TYPES.map((type) => (
          <li key={type}>
            <ClaimBadge type={type} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {TYPES.map((type) => (
        <li key={type} className="card flex flex-col p-4">
          <ClaimBadge type={type} />
          <p className="mt-3 flex-1 text-sm leading-ko-tight text-ink-soft">
            {CLAIM_TYPE_DESCRIPTION[type]}
          </p>
          <span className="mt-3.5 border-t border-paper-line-soft pt-3">
            <TrustMeter type={type} />
          </span>
        </li>
      ))}
    </ul>
  );
}
