"use client";

import { useState } from "react";
import type { ProfileKey } from "@/types/impact";
import type { ProfileOption, ProfileQuestion } from "@/types/profile";
import { BASIC_QUESTIONS, getQuestion } from "@/lib/profile/questions";
import { usePersonalization } from "./PersonalizationProvider";

// 사용자 입력 화면. §6 · §14.1
//
// - 기본 질문은 네 그룹을 넘지 않는다. (§19)
// - 모든 질문에 `답하지 않음`이 있다.
// - 각 질문 바로 옆에 왜 필요한지 적는다.
// - 복수 선택은 완결형이다. `해당 없음`을 고르면 나머지가 false로 확정된다.

function Choice({
  active,
  onClick,
  children,
  tone = "default",
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  tone?: "default" | "quiet";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex min-h-[2.25rem] cursor-pointer items-center rounded-full border px-3.5 text-sm transition-[background-color,border-color,color] duration-150 ${
        active
          ? "border-ink bg-ink font-semibold text-paper"
          : tone === "quiet"
            ? "border-dashed border-paper-line bg-transparent font-medium text-ink-faint hover:border-brand/45 hover:text-ink"
            : "border-paper-line bg-surface font-medium text-ink-soft hover:border-brand/45 hover:bg-paper-dim hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

function QuestionField({
  question,
  highlight = false,
}: {
  question: ProfileQuestion;
  highlight?: boolean;
}) {
  const { profile, setAnswer } = usePersonalization();
  const answer = profile[question.field];
  const declined = Boolean(answer?.declined);
  const values = answer && !declined ? answer.values : null;

  // 보조 입력(월 실수령액)을 고른 상태인지 판별한다.
  const altCodes = new Set((question.alternative?.options ?? []).map((o) => o.code));
  const usingAlt = Boolean(values?.some((v) => altCodes.has(v)));
  const [altMode, setAltMode] = useState(usingAlt);
  const options = altMode && question.alternative ? question.alternative.options : question.options;

  const labelId = `q-${question.field}`;

  function selectSingle(option: ProfileOption) {
    if (values?.length === 1 && values[0] === option.code) {
      setAnswer(question.field, null); // 다시 누르면 선택 해제
      return;
    }
    setAnswer(question.field, { values: [option.code], range: option.range });
  }

  function toggleMulti(option: ProfileOption) {
    const current = values ?? [];
    const next = current.includes(option.code)
      ? current.filter((v) => v !== option.code)
      : [...current, option.code];
    setAnswer(question.field, { values: next });
  }

  return (
    <fieldset
      className={`rounded-xl border p-4 sm:p-5 ${
        highlight
          ? "border-brand/45 bg-brand-wash/50"
          : "border-paper-line bg-surface"
      }`}
    >
      <legend className="sr-only">{question.label}</legend>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <p id={labelId} className="font-semibold text-ink">
          {question.label}
          {question.kind === "multi" && (
            <span className="ml-1.5 text-xs font-medium text-ink-faint">
              여러 개 고를 수 있어요
            </span>
          )}
        </p>
        {question.alternative && (
          <button
            type="button"
            onClick={() => setAltMode((v) => !v)}
            className="rounded text-xs font-semibold text-brand-strong underline decoration-brand/35 underline-offset-4 hover:decoration-brand"
          >
            {altMode ? "세전 연소득으로 답하기" : question.alternative.label}
          </button>
        )}
      </div>
      <p className="mt-1 text-xs leading-ko-tight text-ink-faint">{question.why}</p>
      {altMode && question.alternative && (
        <p className="mt-2 rounded-lg bg-paper-dim px-3 py-2 text-xs leading-ko-tight text-ink-soft">
          {question.alternative.note}
        </p>
      )}

      <div
        role="group"
        aria-labelledby={labelId}
        className="mt-3.5 flex flex-wrap gap-2"
      >
        {options.map((option) => (
          <Choice
            key={option.code}
            active={Boolean(values?.includes(option.code))}
            onClick={() =>
              question.kind === "multi" ? toggleMulti(option) : selectSingle(option)
            }
          >
            {option.label}
          </Choice>
        ))}

        {question.kind === "multi" && (
          <Choice
            active={values !== null && values.length === 0}
            onClick={() => setAnswer(question.field, { values: [] })}
            tone="quiet"
          >
            {question.noneLabel ?? "해당 없음"}
          </Choice>
        )}

        <Choice
          active={declined}
          onClick={() =>
            setAnswer(
              question.field,
              declined ? null : { values: [], declined: true },
            )
          }
          tone="quiet"
        >
          답하지 않음
        </Choice>
      </div>
    </fieldset>
  );
}

export default function ProfileForm({
  pendingFields,
  onClose,
}: {
  /** 판정을 바꿀 수 있어서 추가로 물을 가치가 있는 항목 (§6.3) */
  pendingFields: ProfileKey[];
  onClose?: () => void;
}) {
  const { clear, remember, setRemember, profile } = usePersonalization();
  const answered = Object.keys(profile).length > 0;

  // 이미 답한 조건부 질문도 고칠 수 있어야 하므로 함께 보여준다.
  const conditionalFields = Array.from(
    new Set([
      ...pendingFields,
      ...(Object.keys(profile) as ProfileKey[]).filter(
        (f) => getQuestion(f).group === "conditional",
      ),
    ]),
  );

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-dashed border-paper-line bg-paper-dim/60 p-4 text-xs leading-ko text-ink-soft">
        <p className="font-bold text-ink">이 답은 이 브라우저 안에만 있습니다</p>
        <p className="mt-1.5">
          입력한 내용은 서버로 보내지 않고, 주소창이나 링크에도 담기지 않습니다.
          기본값은 브라우저 세션이 끝나면 사라지는 것입니다. 정당·지지 성향은 묻지
          않고, 판정에도 쓰지 않습니다.
        </p>
      </div>

      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink-faint">
          기본 질문
        </p>
        <div className="mt-2.5 space-y-3">
          {BASIC_QUESTIONS.map((q) => (
            <QuestionField key={q.field} question={q} />
          ))}
        </div>
      </div>

      {conditionalFields.length > 0 && (
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink-faint">
            더 알려주시면 정확해지는 것
          </p>
          <p className="mt-1.5 text-xs leading-ko text-ink-soft">
            아래 질문만 골라 물어봅니다. 어떤 답을 해도 판정이 달라지지 않는
            질문은 아예 보여주지 않습니다.
          </p>
          <div className="mt-2.5 space-y-3">
            {conditionalFields.map((field) => (
              <QuestionField key={field} question={getQuestion(field)} highlight />
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-paper-line pt-4">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-soft">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-4 w-4 cursor-pointer accent-[rgb(var(--brand))]"
          />
          이 기기에 기억하기
          <span className="text-xs text-ink-faint">(끄면 세션 종료 시 사라집니다)</span>
        </label>

        <div className="flex flex-wrap gap-2">
          {answered && (
            <button type="button" onClick={clear} className="btn-ghost">
              내 정보 지우기
            </button>
          )}
          {onClose && (
            <button type="button" onClick={onClose} className="btn-primary">
              결과 보기
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
