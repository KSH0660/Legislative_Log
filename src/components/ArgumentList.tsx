import type { ArgumentPoint } from "@/types/bill";
import ClaimBadge from "./ClaimBadge";
import SourceTag from "./SourceTag";

/**
 * 찬반을 초록/빨강으로 칠하면 '찬성=좋음, 반대=나쁨'처럼 읽힌다.
 * 입법로그는 어느 쪽도 편들지 않으므로, 가치가 실리지 않은 두 색을 쓴다.
 */
const TONE = {
  proponent: {
    frame: "border-stance-pro/25 bg-stance-pro-bg/50",
    accent: "text-stance-pro",
    marker: "bg-stance-pro/15 text-stance-pro",
    divider: "border-stance-pro/15",
  },
  opponent: {
    frame: "border-stance-con/25 bg-stance-con-bg/50",
    accent: "text-stance-con",
    marker: "bg-stance-con/15 text-stance-con",
    divider: "border-stance-con/15",
  },
} as const;

export default function ArgumentList({
  title,
  subtitle,
  accent,
  points,
}: {
  title: string;
  subtitle?: string;
  accent: "proponent" | "opponent";
  points: ArgumentPoint[];
}) {
  const tone = TONE[accent];

  return (
    <div className={`rounded-xl border p-5 ${tone.frame}`}>
      <h3 className={`font-serif text-lg font-bold ${tone.accent}`}>{title}</h3>
      {subtitle && (
        <p className="mt-1 text-xs leading-ko-tight text-ink-faint">
          {subtitle}
        </p>
      )}

      <ol className="mt-4 space-y-5">
        {points.map((p, i) => (
          <li
            key={i}
            className={`border-t pt-4 first:border-t-0 first:pt-0 ${tone.divider}`}
          >
            <div className="flex items-start gap-3">
              <span
                aria-hidden
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${tone.marker}`}
              >
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold leading-ko-tight text-ink">
                  {p.point}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="text-xs font-semibold text-ink-faint">
                    누가 하는 말인가: {p.attribution}
                  </span>
                  <ClaimBadge type={p.claimType} short />
                </div>
                <p className="mt-2 text-sm leading-ko text-ink-soft">
                  {p.detail}
                </p>
                {p.source && <SourceTag source={p.source} />}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
