"use client";

import Link from "next/link";
import type { Bill } from "@/types/bill";
import type { BillImpactData } from "@/types/impact";
import { getQuestion } from "@/lib/profile/questions";
import { summarizeBillRelevance } from "@/lib/impact/match";
import { bucketOf, BUCKET_LABEL } from "@/lib/impact/map";
import { calculationGaps, whatWouldChange } from "@/lib/impact/explain";
import { statusPhrase } from "@/lib/impact/status";
import { usePersonalization } from "./PersonalizationProvider";
import PathwayDetail from "./PathwayDetail";
import { PersonalizationDisclosure, RelevanceBadge } from "./atoms";

// 법안 상세의 개인화 블록. §10.3
//
// 목차 구조를 건드리지 않는다. BILL_SECTIONS는 고정 배열이고 TableOfContents와
// ReadingProgress가 그 길이·인덱스로 진행률을 계산하기 때문에, 개인화 on/off에 따라
// 존재 여부가 달라지는 블록을 독립 섹션으로 추가하면 진행률이 사용자 상태에 따라 흔들린다.
// 그래서 06 섹션(이득과 부담) 안의 첫 번째 서브블록으로 들어간다.

function PathwayGroupTitle({
  title,
  hint,
}: {
  title: string;
  hint: string;
}) {
  return (
    <div className="mb-2.5">
      <p className="text-sm font-bold text-ink">{title}</p>
      <p className="mt-0.5 text-xs leading-ko-tight text-ink-faint">{hint}</p>
    </div>
  );
}

export default function BillImpactBlock({
  bill,
  data,
}: {
  bill: Bill;
  data: BillImpactData | null;
}) {
  const { ready, enabled, profile, asOf } = usePersonalization();
  const active = ready && enabled;

  // 비개인화 상태에서도 자리를 미리 확보해 레이아웃 점프를 줄인다. (§13.2 규칙 4)
  if (!active) {
    return (
      <div className="mb-10 min-h-[5.5rem] rounded-xl border border-dashed border-paper-line bg-paper-dim/50 p-4 sm:p-5">
        <p className="text-sm font-bold text-ink">내 조건으로 보기</p>
        <p className="mt-1.5 text-sm leading-ko text-ink-soft">
          연령대·경제활동·가구·소득 구간을 고르면, 이 법안이 나와 어떤 경로로
          연결되는지 조건과 근거로 설명해 드립니다.{" "}
          <Link href="/bills" className="link-quiet">
            법안 목록에서 조건 입력하기
          </Link>
        </p>
      </div>
    );
  }

  const relevance = summarizeBillRelevance(bill.slug, data ?? undefined, profile);
  const bucket = bucketOf(relevance);
  const phrase = statusPhrase(bill, asOf);
  const decisive = whatWouldChange(bill.slug, data ?? undefined, profile);
  const missing = decisive.filter((d) => !d.answered);
  const answeredDecisive = decisive.filter((d) => d.answered);
  // 판정은 그대로지만 금액 계산을 열어 주는 항목 (§7.2 informative)
  const calcGaps = calculationGaps(bill.slug, data ?? undefined, profile);

  const direct = relevance.matched.filter(
    (e) =>
      e.pathway.relationship === "self" || e.pathway.relationship === "household",
  );
  const indirect = relevance.matched.filter(
    (e) =>
      e.pathway.relationship !== "self" && e.pathway.relationship !== "household",
  );

  const usedConditions = Array.from(
    new Map(
      relevance.matched
        .flatMap((e) => e.satisfied)
        .map((c) => [`${c.field}:${c.explanation}`, c]),
    ).values(),
  );

  return (
    <div className="mb-10 rounded-xl border border-brand/35 bg-brand-wash/40 p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-brand-strong">
          내 조건 기준
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <RelevanceBadge relevance={relevance.relevance} />
          <span className="chip bg-surface text-ink-soft ring-1 ring-inset ring-paper-line">
            {BUCKET_LABEL[bucket]}
          </span>
        </div>
      </div>

      {/* §5.5 — 진행 단계에 맞는 시제 문구 */}
      <p className="mt-3 rounded-lg bg-surface px-3 py-2 text-sm leading-ko text-ink-soft">
        {phrase.text}
      </p>

      {relevance.relevance === "none" ? (
        <div className="mt-4 space-y-2">
          <p className="text-sm leading-ko text-ink-soft">
            {relevance.review?.noPersonalPathwayReason ??
              "검토했지만 개인 생활조건과 직접 연결되는 조항을 찾지 못했습니다."}
          </p>
          {relevance.review && (
            <p className="text-[11px] text-ink-faint">
              <span className="num">{relevance.review.reviewedAt}</span> 검토 ·
              기준선 {relevance.review.baselineVersion}
            </p>
          )}
        </div>
      ) : (
        <>
          {usedConditions.length > 0 && (
            <div className="mt-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">
                일치한 조건
              </p>
              <ul className="mt-1.5 flex flex-wrap gap-1.5">
                {usedConditions.map((c, i) => (
                  <li
                    key={i}
                    className="chip bg-surface text-ink-soft ring-1 ring-inset ring-paper-line"
                  >
                    {c.explanation}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {direct.length > 0 && (
            <div className="mt-5">
              <PathwayGroupTitle
                title="직접 경로"
                hint="나 또는 우리 가구에 법이 직접 적용되는 경로입니다."
              />
              <div className="space-y-3">
                {direct.map((e) => (
                  <PathwayDetail
                    key={e.pathway.id}
                    evaluation={e}
                    bill={bill}
                    profile={profile}
                    asOf={asOf}
                  />
                ))}
              </div>
            </div>
          )}

          {indirect.length > 0 && (
            <div className="mt-5">
              <PathwayGroupTitle
                title="간접 경로"
                hint="다른 주체에게 적용된 결과가 나에게 옮겨올 수 있는 경로입니다. 조건이 모두 맞아도 '간접 영향 가능'을 넘지 않습니다."
              />
              <div className="space-y-3">
                {indirect.map((e) => (
                  <PathwayDetail
                    key={e.pathway.id}
                    evaluation={e}
                    bill={bill}
                    profile={profile}
                    asOf={asOf}
                  />
                ))}
              </div>
            </div>
          )}

          {relevance.undecidable.length > 0 && (
            <div className="mt-5">
              <PathwayGroupTitle
                title={`아직 판정할 수 없는 경로 ${relevance.undecidable.length}건`}
                hint="법안 문안이나 시행령이 정해지지 않아 경로 자체를 판정할 수 없습니다."
              />
              <ul className="space-y-1.5 text-sm leading-ko text-ink-soft">
                {relevance.undecidable.map((e) => (
                  <li key={e.pathway.id} className="card p-3">
                    <span className="font-medium text-ink">{e.pathway.title}</span>
                    <span className="mt-1 block text-xs text-ink-faint">
                      {e.pathway.undecidable?.reason}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      {calcGaps.length > 0 && (
        <p className="mt-4 rounded-lg border border-dashed border-paper-line bg-surface px-3.5 py-2.5 text-xs leading-ko text-ink-soft">
          <span className="font-bold text-ink">금액을 계산하려면</span>{" "}
          {calcGaps.map((f) => getQuestion(f).label).join(" · ")}이(가)
          필요합니다. 판정 자체는 이 항목 없이도 달라지지 않습니다.{" "}
          <Link href="/bills" className="link-quiet">
            조건 추가하기
          </Link>
        </p>
      )}

      {(missing.length > 0 || answeredDecisive.length > 0) && (
        <div className="mt-5 rounded-lg border border-paper-line bg-surface p-3.5">
          <p className="text-sm font-bold text-ink">
            다른 답을 선택했을 때 달라지는 조건
          </p>
          <ul className="mt-2 space-y-1.5 text-xs leading-ko text-ink-soft">
            {decisive.map((d) => (
              <li key={d.field} className="flex flex-wrap gap-x-2">
                <span className="font-semibold text-ink">
                  {getQuestion(d.field).label}
                </span>
                <span>
                  {d.answered ? "답하신 상태" : "아직 답하지 않음"} · 조건이
                  맞으면 {BUCKET_LABEL[d.ifTrue.bucket]}, 아니면{" "}
                  {BUCKET_LABEL[d.ifFalse.bucket]}
                </span>
              </li>
            ))}
          </ul>
          {missing.length > 0 && (
            <p className="mt-2.5 text-xs text-ink-faint">
              위 항목에 답하면 판정이 더 정확해집니다.{" "}
              <Link href="/bills" className="link-quiet">
                조건 수정하기
              </Link>
            </p>
          )}
        </div>
      )}

      <PersonalizationDisclosure className="mt-5 bg-surface/70" />
    </div>
  );
}
