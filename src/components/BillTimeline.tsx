import type { Bill } from "@/types/bill";

const STEPS = [
  { key: "proposedDate", label: "발의", hint: "국회에 제출" },
  { key: "passedDate", label: "국회 통과", hint: "본회의 표결 통과" },
  { key: "promulgatedDate", label: "공포", hint: "정부가 공식 확정" },
  { key: "effectiveDate", label: "시행", hint: "실제 효력 발생" },
] as const;

/** 발의부터 시행까지 어디까지 왔는지 한눈에 보여준다. */
export default function BillTimeline({ bill }: { bill: Bill }) {
  const discarded = bill.status === "폐기";
  const steps = STEPS.map((s) => ({ ...s, date: bill[s.key] }));
  // 날짜가 기록된 마지막 단계. 그 앞 단계는 날짜가 비어 있어도 이미 지나온 것으로 본다.
  const lastDated = steps.reduce((acc, s, i) => (s.date ? i : acc), -1);

  return (
    <div>
      <h2 className="sr-only">입법 진행 경과</h2>
      <ol className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4">
        {steps.map((step, i) => {
          const reached = !discarded && i <= lastDated;
          const current = !discarded && i === lastDated;

          // 이미 지나온 단계인데 날짜만 없는 경우와, 아직 오지 않은 단계를 구분한다.
          const fallback = discarded
            ? "해당 없음"
            : reached
              ? "날짜 기록 없음"
              : "아직";

          return (
            <li key={step.key} className="relative">
              {/* 단계 사이를 잇는 선 (마지막 칸 제외) */}
              {i < steps.length - 1 && (
                <span
                  aria-hidden
                  className={`absolute left-[calc(50%+1rem)] right-[calc(-50%+1rem)] top-[7px] hidden h-px sm:block ${
                    i < lastDated && !discarded ? "bg-brand/60" : "bg-paper-line"
                  }`}
                />
              )}

              <div className="flex items-center gap-2.5 sm:flex-col sm:items-start">
                <span
                  aria-hidden
                  className={`h-[15px] w-[15px] shrink-0 rounded-full border-[3px] ${
                    reached
                      ? current
                        ? "border-brand bg-paper ring-4 ring-brand/20"
                        : "border-brand bg-brand"
                      : "border-paper-line bg-paper"
                  }`}
                />
                <p
                  className={`text-sm font-bold sm:mt-3 ${
                    reached ? "text-ink" : "text-ink-faint"
                  }`}
                >
                  {step.label}
                  {current && (
                    <span className="ml-1.5 align-middle text-[11px] font-bold uppercase tracking-wider text-brand-strong">
                      현재
                    </span>
                  )}
                </p>
              </div>

              <p className="mt-1 pl-[26px] text-sm text-ink-soft sm:pl-0">
                {step.date ? (
                  <span className="num">{step.date}</span>
                ) : (
                  <span className="text-ink-faint">{fallback}</span>
                )}
              </p>
              <p className="mt-0.5 pl-[26px] text-xs text-ink-faint sm:pl-0">
                {step.hint}
              </p>
            </li>
          );
        })}
      </ol>

      {discarded && (
        <p className="mt-5 flex items-start gap-2.5 rounded-lg border border-status-discarded/30 bg-claim-allegation-bg/60 px-3.5 py-3 text-sm leading-ko text-ink-soft">
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className="mt-0.5 h-4 w-4 shrink-0 text-status-discarded"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.2}
            strokeLinecap="round"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M15 9l-6 6M9 9l6 6" />
          </svg>
          <span>
            이 법안은 폐기되어 더 진행되지 않습니다. 기록 목적으로 남겨 둡니다.
          </span>
        </p>
      )}
    </div>
  );
}
