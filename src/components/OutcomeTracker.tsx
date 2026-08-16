import type { OutcomeCheck, PredictionEntry } from "@/types/bill";
import {
  OUTCOME_STATUS_DESCRIPTION,
  OUTCOME_STATUS_LABEL,
} from "@/types/bill";
import SourceTag from "./SourceTag";

const STATUS_STYLE: Record<OutcomeCheck["status"], string> = {
  적중: "bg-claim-fact text-paper",
  부분적중: "bg-claim-forecast text-paper",
  빗나감: "bg-claim-allegation text-paper",
  판단보류: "bg-ink-soft text-paper",
  추적예정: "bg-paper-dim text-ink-faint ring-1 ring-inset ring-paper-line",
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
        const done = Boolean(check) && check!.status !== "추적예정";
        const related = check?.relatedPredictionIds
          ?.map((id) => predictions.find((p) => p.id === id))
          .filter((p): p is PredictionEntry => Boolean(p));

        return (
          <li key={horizon} className="relative">
            <span
              aria-hidden
              className={`absolute -left-[calc(1.5rem+5px)] top-1.5 h-3 w-3 rounded-full ring-4 ring-paper ${
                done ? "bg-brand" : "bg-paper-line"
              }`}
            />
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-serif text-lg font-bold text-ink">
                시행 {horizon} 뒤
              </span>
              {check ? (
                <>
                  <span
                    title={OUTCOME_STATUS_DESCRIPTION[check.status]}
                    className={`chip ${STATUS_STYLE[check.status]}`}
                  >
                    {OUTCOME_STATUS_LABEL[check.status]}
                  </span>
                  <span className="text-xs text-ink-faint">
                    {check.checkDate} 확인
                  </span>
                </>
              ) : (
                <span className={`chip ${STATUS_STYLE["추적예정"]}`}>
                  확인 예정
                </span>
              )}
            </div>

            {check ? (
              <div className="mt-2.5 card p-4">
                {related && related.length > 0 && (
                  <div className="mb-3 border-b border-dashed border-paper-line pb-3">
                    <p className="text-xs font-semibold text-ink-faint">
                      그때 이렇게 예측했습니다
                    </p>
                    <ul className="mt-1.5 space-y-1.5">
                      {related.map((p) => (
                        <li
                          key={p.id}
                          className="text-xs leading-ko-tight text-ink-soft"
                        >
                          <a
                            href={`#prediction-${p.id}`}
                            className="font-medium text-ink-soft underline-offset-2 hover:text-brand-strong hover:underline"
                          >
                            {p.by}
                          </a>
                          <span className="text-ink-faint"> ({p.date}) </span>
                          &ldquo;{p.claim}&rdquo;
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <p className="text-sm leading-ko text-ink">{check.findings}</p>
                {check.source && <SourceTag source={check.source} />}
              </div>
            ) : (
              <p className="mt-2 rounded-lg border border-dashed border-paper-line px-4 py-3 text-sm leading-ko text-ink-faint">
                아직 그 시점이 오지 않았거나, 확인할 수 있는 공개 자료가 쌓이지
                않았습니다. 추측으로 채우지 않고 자료가 나오는 대로
                갱신합니다.
              </p>
            )}
          </li>
        );
      })}
    </ol>
  );
}
