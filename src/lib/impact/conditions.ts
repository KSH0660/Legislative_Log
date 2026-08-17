// 삼값 조건 평가. §7.1
//
// 모든 조건은 true / false / unknown 중 하나로 평가된다.
// `unknown`은 언제나 **더 약한 판정** 쪽으로 작동한다. (§4.6)
// 정보가 없다는 이유로 판정이 강해지는 경로는 하나도 없어야 한다.

import type { NumericRange, ProfileCondition } from "@/types/impact";
import type { UserProfile } from "@/types/profile";

export type Tri = "true" | "false" | "unknown";

/** `outer`가 `inner`를 완전히 포함하는가 (inner ⊆ outer). 양 끝을 포함하는 닫힌 구간. */
export function rangeContains(outer: NumericRange, inner: NumericRange): boolean {
  if (inner.min < outer.min) return false;
  if (outer.max === null) return true;
  if (inner.max === null) return false; // 상한 없는 구간은 상한 있는 구간에 담기지 않는다
  return inner.max <= outer.max;
}

/** 두 구간이 한 점도 겹치지 않는가 (A ∩ B = ∅). */
export function rangesDisjoint(a: NumericRange, b: NumericRange): boolean {
  if (a.max !== null && a.max < b.min) return true;
  if (b.max !== null && b.max < a.min) return true;
  return false;
}

function asList(value: string | string[] | NumericRange): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value;
  return [];
}

/**
 * 조건 하나를 사용자 프로필과 대조한다.
 *
 * 범주형: 응답했고 만족 → true / 응답했고 불만족 → false / 미응답·모름 → unknown
 * 구간형: U ⊆ C → true / U ∩ C = ∅ → false / **경계를 걸치면 → unknown**
 *
 * 걸침이 `unknown`이 되는 것이 이 설계의 핵심이다. 경계 인근 사용자에게
 * 조용히 true나 false를 내놓지 않는다.
 */
export function evaluateCondition(
  condition: ProfileCondition,
  profile: UserProfile,
): Tri {
  const answer = profile[condition.field];
  // 질문을 건너뛰었거나 `모름`/`답하지 않음`을 골랐다 → unknown
  if (!answer || answer.declined) return "unknown";

  switch (condition.operator) {
    case "equals": {
      const target = typeof condition.value === "string" ? condition.value : "";
      return answer.values.length === 1 && answer.values[0] === target
        ? "true"
        : "false";
    }
    case "oneOf": {
      const candidates = asList(condition.value);
      return answer.values.length === 1 && candidates.includes(answer.values[0])
        ? "true"
        : "false";
    }
    case "includes": {
      // 완결형 질문 전제(§6.1): 선택하지 않은 항목은 false로 확정된다.
      // 후보가 여러 개면 '하나라도 포함'을 만족으로 본다.
      const candidates = asList(condition.value);
      return answer.values.some((v) => candidates.includes(v)) ? "true" : "false";
    }
    case "withinRange": {
      const target = condition.value;
      if (typeof target === "string" || Array.isArray(target)) return "unknown";
      const user = answer.range;
      if (!user) return "unknown"; // 구간 정보가 없는 답은 구간 비교를 할 수 없다
      if (rangeContains(target, user)) return "true";
      if (rangesDisjoint(user, target)) return "false";
      return "unknown"; // 경계를 걸침
    }
  }
}
