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
            <p className="border-b border-paper-line bg-paper-dim px-4 py-2.5 text-sm font-bold text-ink">
              {row.aspect}
            </p>
            <div className="space-y-3 p-4">
              <div>
                <p className="text-xs font-bold text-ink-faint">지금은</p>
                <p className="mt-1 text-sm leading-ko-tight text-ink-soft">
                  {row.before}
                </p>
              </div>
              <div className="border-t border-dashed border-paper-line pt-3">
                <p className="text-xs font-bold text-brand-strong">
                  바뀌면 이렇게
                </p>
                <p className="mt-1 text-sm leading-ko-tight text-ink">
                  {row.after}
                </p>
              </div>
              {row.note && (
                <p className="rounded-lg bg-paper-dim px-3 py-2 text-xs leading-ko-tight text-ink-faint">
                  {row.note}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>

      {/* 데스크톱: 비교표 */}
      <div className="hidden overflow-hidden rounded-xl border border-paper-line md:block">
        <table className="w-full border-collapse text-sm">
          <caption className="sr-only">
            현행 제도와 개정 후 내용을 항목별로 비교한 표
          </caption>
          <thead>
            <tr className="bg-paper-dim text-left text-xs tracking-wide text-ink-faint">
              <th scope="col" className="w-[18%] px-4 py-3 font-bold">
                항목
              </th>
              <th scope="col" className="w-[41%] px-4 py-3 font-bold">
                지금은
              </th>
              <th
                scope="col"
                className="w-[41%] px-4 py-3 font-bold text-brand-strong"
              >
                바뀌면 이렇게
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row.aspect}
                className={i % 2 === 1 ? "bg-paper-dim/40" : undefined}
              >
                <th
                  scope="row"
                  className="border-t border-paper-line px-4 py-3.5 text-left align-top font-bold text-ink"
                >
                  {row.aspect}
                </th>
                <td className="border-t border-paper-line px-4 py-3.5 align-top leading-ko-tight text-ink-soft">
                  {row.before}
                </td>
                <td className="border-t border-paper-line px-4 py-3.5 align-top leading-ko-tight text-ink">
                  <div className="flex items-start gap-2">
                    <span aria-hidden className="mt-0.5 shrink-0 text-brand">
                      →
                    </span>
                    <span>{row.after}</span>
                  </div>
                  {row.note && (
                    <p className="mt-2 border-l-2 border-paper-line pl-2.5 text-xs leading-ko-tight text-ink-faint">
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
        <p className="mt-3 text-xs leading-ko-tight text-ink-faint">{note}</p>
      )}
    </div>
  );
}
