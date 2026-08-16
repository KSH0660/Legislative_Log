import type { OutcomeCheck, PredictionEntry } from "@/types/bill";
import { OUTCOME_STATUS_LABEL } from "@/types/bill";
import SourceTag from "./SourceTag";

const STATUS_STYLE: Record<OutcomeCheck["status"], string> = {
  적중: "bg-claim-fact text-white",
  부분적중: "bg-claim-forecast text-white",
  빗나감: "bg-claim-allegation text-white",
  판단보류: "bg-ink-soft text-white",
  추적예정: "bg-paper-line text-ink-faint",
};

const HORIZONS: OutcomeCheck["horizon"][] = ["6개월", "1년", "3년"];

export default function OutcomeTracker({
  checks,
  predictions,
}: {
  checks: OutcomeCheck[];
  predictions: PredictionEntry[];
}) {
  return (
    <ol className="relative space-y-6 border-l-2 border-paper-line pl-6">
      {HORIZONS.map((horizon) => {
        const check = checks.find((c) => c.horizon === horizon);
        const related = check?.relatedPredictionIds
          ?.map((id) => predictions.find((p) => p.id === id))
          .filter((p): p is PredictionEntry => Boolean(p));

        return (
          <li key={horizon} className="relative">
            <span
              className={`absolute -left-[calc(1.5rem+5px)] top-1 h-3 w-3 rounded-full ring-4 ring-paper ${
                check && check.status !== "추적예정" ? "bg-brand" : "bg-paper-line"
              }`}
            />
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-serif text-lg font-bold text-ink">
                {horizon} 후
              </span>
              {check ? (
                <>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLE[check.status]}`}
                  >
                    {OUTCOME_STATUS_LABEL[check.status]}
                  </span>
                  <span className="text-xs text-ink-faint">{check.checkDate} 확인</span>
                </>
              ) : (
                <span className="rounded-full bg-paper-line px-2.5 py-0.5 text-xs font-semibold text-ink-faint">
                  추적 예정
                </span>
              )}
            </div>

            {check ? (
              <div className="mt-2 rounded-lg border border-paper-line bg-white p-4">
                {related && related.length > 0 && (
                  <ul className="mb-3 space-y-1 border-b border-dashed border-paper-line pb-3">
                    {related.map((p) => (
                      <li key={p.id} className="text-xs text-ink-faint">
                        예측({p.by}, {p.date}): &ldquo;{p.claim}&rdquo;
                      </li>
                    ))}
                  </ul>
                )}
                <p className="text-sm leading-relaxed text-ink">{check.findings}</p>
                {check.source && <SourceTag source={check.source} />}
              </div>
            ) : (
              <p className="mt-2 text-sm text-ink-faint">
                아직 해당 시점에 도달하지 않았거나, 검증 가능한 공개 자료가
                축적되지 않았습니다. 확인되는 대로 갱신합니다.
              </p>
            )}
          </li>
        );
      })}
    </ol>
  );
}
