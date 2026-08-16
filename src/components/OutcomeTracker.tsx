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

// 판정 결과는 색만으로 구분되지 않게 모양도 다르게 준다.
const STATUS_MARK: Record<OutcomeCheck["status"], string> = {
  적중: "M5 13l4 4L19 7",
  부분적중: "M5 12h14",
  빗나감: "M6 6l12 12M18 6L6 18",
  판단보류: "M5 12h14M12 5v14",
  추적예정: "M12 7v5l3 2",
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
    <ol className="relative space-y-7 border-l-2 border-paper-line pl-6 sm:pl-7">
      {HORIZONS.map((horizon) => {
        const check = checks.find((c) => c.horizon === horizon);
        const done = Boolean(check) && check!.status !== "추적예정";
        const status = check?.status ?? "추적예정";
        const related = check?.relatedPredictionIds
          ?.map((id) => predictions.find((p) => p.id === id))
          .filter((p): p is PredictionEntry => Boolean(p));

        return (
          <li key={horizon} className="relative">
            <span
              aria-hidden
              className={`absolute top-1.5 h-3.5 w-3.5 rounded-full ring-4 ring-paper ${
                done ? "bg-brand" : "bg-paper-line"
              }`}
              style={{ left: "calc(-1.5rem - 9px)" }}
            />
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
              <span className="font-serif text-lg font-bold text-ink">
                시행 {horizon} 뒤
              </span>
              <span
                title={OUTCOME_STATUS_DESCRIPTION[status]}
                className={`chip gap-1.5 ${STATUS_STYLE[status]}`}
              >
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  className="h-3 w-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {status === "추적예정" && <circle cx="12" cy="12" r="9" />}
                  <path d={STATUS_MARK[status]} />
                </svg>
                {check ? OUTCOME_STATUS_LABEL[check.status] : "확인 예정"}
              </span>
              {check && (
                <span className="text-xs text-ink-faint">
                  <span className="num">{check.checkDate}</span> 확인
                </span>
              )}
            </div>

            {check ? (
              <div className="card mt-3 p-4 sm:p-5">
                {related && related.length > 0 && (
                  <div className="mb-4 border-b border-dashed border-paper-line pb-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">
                      그때 이렇게 예측했습니다
                    </p>
                    <ul className="mt-2 space-y-2">
                      {related.map((p) => (
                        <li
                          key={p.id}
                          className="text-xs leading-ko-tight text-ink-soft"
                        >
                          <a
                            href={`#prediction-${p.id}`}
                            className="rounded font-semibold text-ink-soft underline-offset-2 transition-colors hover:text-brand-strong hover:underline"
                          >
                            {p.by}
                          </a>
                          <span className="num text-ink-faint"> ({p.date}) </span>
                          &ldquo;{p.claim}&rdquo;
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <p className="text-[15px] leading-ko text-ink">
                  {check.findings}
                </p>
                {check.source && <SourceTag source={check.source} />}
              </div>
            ) : (
              <p className="mt-3 rounded-xl border border-dashed border-paper-line px-4 py-4 text-sm leading-ko text-ink-faint">
                아직 그 시점이 오지 않았거나, 확인할 수 있는 공개 자료가 쌓이지
                않았습니다. 추측으로 채우지 않고 자료가 나오는 대로 갱신합니다.
              </p>
            )}
          </li>
        );
      })}
    </ol>
  );
}
