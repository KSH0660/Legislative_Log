import type { ComparisonRow } from "@/types/bill";

/**
 * 좁은 화면에서 3열 표는 글자가 세로로 뭉개져 읽기 어렵다.
 * 그래서 모바일에서는 카드로, md 이상에서는 표로 같은 내용을 보여준다.
 */
export default function ComparisonTable({
  rows,
  note,
}: {
  rows: ComparisonRow[];
  note?: string;
}) {
  return (
    <div>
      {/* 모바일: 항목별 카드 */}
      <ul className="space-y-4 md:hidden">
        {rows.map((row) => (
          <li key={row.aspect} className="card overflow-hidden">
            <p className="border-b border-paper-line bg-paper-dim px-4 py-3 text-sm font-bold text-ink">
              {row.aspect}
            </p>
            <div className="p-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">
                  지금은
                </p>
                <p className="mt-1.5 text-sm leading-ko-tight text-ink-soft">
                  {row.before}
                </p>
              </div>

              {/* 변화의 방향을 화살표로 명시한다. */}
              <div
                aria-hidden
                className="my-3 flex items-center gap-2 text-brand"
              >
                <span className="h-px flex-1 bg-paper-line" />
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 5v14M6 13l6 6 6-6" />
                </svg>
                <span className="h-px flex-1 bg-paper-line" />
              </div>

              <div className="rounded-lg bg-brand-wash/60 p-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-brand-strong">
                  바뀌면 이렇게
                </p>
                <p className="mt-1.5 text-sm font-medium leading-ko-tight text-ink">
                  {row.after}
                </p>
              </div>

              {row.note && (
                <p className="mt-3 border-l-2 border-paper-line pl-3 text-xs leading-ko-tight text-ink-faint">
                  {row.note}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>

      {/* 데스크톱: 비교표 */}
      <div className="hidden overflow-hidden rounded-xl border border-paper-line bg-surface shadow-card md:block">
        <table className="w-full border-collapse text-sm">
          <caption className="sr-only">
            현행 제도와 개정 후 내용을 항목별로 비교한 표
          </caption>
          <thead>
            <tr className="bg-paper-dim text-left text-[11px] uppercase tracking-[0.1em] text-ink-faint">
              <th scope="col" className="w-[18%] px-4 py-3.5 font-bold">
                항목
              </th>
              <th scope="col" className="w-[41%] px-4 py-3.5 font-bold">
                지금은
              </th>
              <th
                scope="col"
                className="w-[41%] border-l border-paper-line px-4 py-3.5 font-bold text-brand-strong"
              >
                바뀌면 이렇게
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row.aspect}
                className={i % 2 === 1 ? "bg-paper-dim/35" : undefined}
              >
                <th
                  scope="row"
                  className="border-t border-paper-line px-4 py-4 text-left align-top font-bold text-ink"
                >
                  {row.aspect}
                </th>
                <td className="border-t border-paper-line px-4 py-4 align-top leading-ko-tight text-ink-soft">
                  {row.before}
                </td>
                {/* 바뀐 쪽에 세로 강조선을 둬서 눈이 오른쪽 열에 먼저 가게 한다. */}
                <td className="relative border-l border-t border-paper-line px-4 py-4 align-top leading-ko-tight text-ink">
                  <span
                    aria-hidden
                    className="absolute inset-y-0 left-0 w-[2px] bg-brand/45"
                  />
                  <div className="flex items-start gap-2">
                    <svg
                      aria-hidden
                      viewBox="0 0 24 24"
                      className="mt-[3px] h-3.5 w-3.5 shrink-0 text-brand"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.6}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h13M13 6l6 6-6 6" />
                    </svg>
                    <span className="font-medium">{row.after}</span>
                  </div>
                  {row.note && (
                    <p className="mt-2.5 border-l-2 border-paper-line pl-2.5 text-xs leading-ko-tight text-ink-faint">
                      {row.note}
                    </p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {note && (
        <p className="mt-3.5 text-xs leading-ko text-ink-faint">{note}</p>
      )}
    </div>
  );
}
