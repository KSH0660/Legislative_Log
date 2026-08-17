// 사용자 생활조건(프로필)의 내부 표현.
// docs/personalized-bill-impact-plan.md §6 · §7.1의 구현이다.
//
// 이 값은 브라우저 밖으로 나가지 않는다. URL·분석 이벤트·외부 API에 싣지 않는다. (§13.3)

import type { NumericRange, ProfileKey } from "./impact";

/**
 * 질문 하나에 대한 답.
 *
 * - 키가 아예 없으면 = 질문을 건너뛴 상태 → 모든 조건이 `unknown` (§7.1)
 * - `declined: true` = 사용자가 `모름`/`답하지 않음`을 골랐다. 평가 결과는 건너뜀과 같지만,
 *   UI가 "다시 물어볼 필요 없음"을 알기 위해 구분해 저장한다.
 * - `values: []` (복수선택) = `해당 없음`이 **확정**된 상태. 미응답이 아니다. (§6.1 완결형 질문)
 */
export interface ProfileAnswer {
  declined?: boolean;
  values: string[];
  /** 수치성 밴드의 구간 표현. `withinRange` 비교에 쓴다. (§6.2) */
  range?: NumericRange;
}

export type UserProfile = Partial<Record<ProfileKey, ProfileAnswer>>;

export interface ProfileOption {
  code: string;
  label: string;
  hint?: string;
  /** 수치성 선택지의 구간. 단일 값도 폭이 0인 구간으로 다룬다. (§6.2) */
  range?: NumericRange;
}

export interface ProfileQuestion {
  field: ProfileKey;
  kind: "single" | "multi";
  label: string;
  /** 이 질문이 왜 필요한지. 질문 바로 옆에 표시한다. (§14.1) */
  why: string;
  /** `basic` 4개 그룹은 첫 화면에서 묻고, `conditional`은 판정을 바꿀 때만 묻는다. (§6.3) */
  group: "basic" | "conditional";
  options: ProfileOption[];
  /** 복수선택 질문의 `해당 없음` 문구. 완결형을 만들기 위해 반드시 있다. */
  noneLabel?: string;
  /** 보조 입력 경로 (예: 세전 연소득 대신 월 실수령액). 폭을 넓게 잡아 환산한다. (§6.1) */
  alternative?: {
    label: string;
    note: string;
    options: ProfileOption[];
  };
}
