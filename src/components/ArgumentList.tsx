import type { ArgumentPoint } from "@/types/bill";
import ClaimBadge from "./ClaimBadge";
import SourceTag from "./SourceTag";

/**
 * 찬반을 초록/빨강으로 칠하면 '찬성=좋음, 반대=나쁨'처럼 읽힌다.
 * 입법로그는 어느 쪽도 편들지 않으므로, 가치가 실리지 않은 두 색을 쓴다.
 */
const TONE = {
  proponent: {
    frame: "border-stance-pro/25 bg-stance-pro-bg/45",
    accent: "text-stance-pro",
    marker: "bg-stance-pro/15 text-stance-pro",
    rule: "bg-stance-pro/60",
    divider: "border-stance-pro/15",
  },
  opponent: {
    frame: "border-stance-con/25 bg-stance-con-bg/45",
    accent: "text-stance-con",
    marker: "bg-stance-con/15 text-stance-con",
    rule: "bg-stance-con/60",
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
    <div className={`rounded-xl border p-5 sm:p-6 ${tone.frame}`}>
      <div className="flex items-start gap-3">
        {/* 색만으로 구분되지 않도록 제목 왼쪽에 세로 표시선을 함께 둔다. */}
        <span
          aria-hidden
          className={`mt-1 h-8 w-1 shrink-0 rounded-full ${tone.rule}`}
        />
        <div className="min-w-0">
          <h3 className={`font-serif text-lg font-bold ${tone.accent}`}>
            {title}
          </h3>
          {subtitle && (
            <p className="mt-1 text-xs leading-ko-tight text-ink-faint">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <ol className="mt-5 space-y-5">
        {points.map((p, i) => (
          <li
            key={i}
            className={`border-t pt-5 first:border-t-0 first:pt-0 ${tone.divider}`}
          >
            <div className="flex items-start gap-3">
              <span
                aria-hidden
                className={`num mt-px flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${tone.marker}`}
              >
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold leading-ko-tight text-ink">
                  {p.point}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1.5">
                  <span className="text-xs text-ink-faint">
                    <span className="font-semibold">누가 하는 말인가</span>{" "}
                    {p.attribution}
                  </span>
                  <ClaimBadge type={p.claimType} short />
                </div>
                <p className="mt-2.5 text-sm leading-ko text-ink-soft">
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
