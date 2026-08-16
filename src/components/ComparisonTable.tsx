import type { ComparisonRow } from "@/types/bill";

export default function ComparisonTable({
  rows,
  note,
}: {
  rows: ComparisonRow[];
  note?: string;
}) {
  return (
    <div>
      <div className="overflow-hidden rounded-lg border border-paper-line">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-paper-dim text-left text-xs uppercase tracking-wide text-ink-faint">
              <th className="w-1/5 px-4 py-3 font-semibold">항목</th>
              <th className="w-2/5 px-4 py-3 font-semibold">현재</th>
              <th className="w-2/5 px-4 py-3 font-semibold">변경 후</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row.aspect}
                className={i % 2 === 1 ? "bg-paper-dim/40" : undefined}
              >
                <td className="border-t border-paper-line px-4 py-3 align-top font-semibold text-ink">
                  {row.aspect}
                </td>
                <td className="border-t border-paper-line px-4 py-3 align-top text-ink-soft">
                  {row.before}
                </td>
                <td className="border-t border-paper-line px-4 py-3 align-top text-ink">
                  <div className="flex items-start gap-2">
                    <span aria-hidden className="text-brand">
                      →
                    </span>
                    <span>{row.after}</span>
                  </div>
                  {row.note && (
                    <p className="mt-1 text-xs text-ink-faint">{row.note}</p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {note && <p className="mt-3 text-xs leading-relaxed text-ink-faint">{note}</p>}
    </div>
  );
}
