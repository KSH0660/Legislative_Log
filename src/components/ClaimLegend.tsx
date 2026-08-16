import { CLAIM_TYPE_LABEL, type ClaimType } from "@/types/bill";
import ClaimBadge from "./ClaimBadge";

const DESCRIPTIONS: Record<ClaimType, string> = {
  fact: "법령·공식 통계·1차 자료로 직접 확인되는 내용",
  official_claim: "정부·정당·이해관계자가 공식적으로 밝힌 입장",
  interpretation: "확인된 사실을 바탕으로 한 분석적 해석",
  forecast: "아직 결과가 나오지 않은 시점의 전망·예측",
  allegation: "제기되었으나 아직 사실로 확인되지 않은 의혹",
};

export default function ClaimLegend({ compact = false }: { compact?: boolean }) {
  const types = Object.keys(CLAIM_TYPE_LABEL) as ClaimType[];
  return (
    <div
      className={
        compact
          ? "flex flex-wrap gap-x-6 gap-y-3"
          : "grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
      }
    >
      {types.map((type) => (
        <div key={type} className={compact ? "flex items-start gap-2" : ""}>
          <ClaimBadge type={type} />
          <p className="mt-1.5 text-xs leading-relaxed text-ink-faint">
            {DESCRIPTIONS[type]}
          </p>
        </div>
      ))}
    </div>
  );
}
