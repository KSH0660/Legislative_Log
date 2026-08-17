// 법안 진행 단계별 문구 규칙. §5.5
//
// 이 표가 없으면 `공포` 상태처럼 "통과했지만 아직 효력 없음"인 법안이
// 현재형으로 서술되는 사고가 난다.
//
// `효력 발생 여부`는 별도 데이터 필드로 두지 않고 status와 effectiveDate에서 파생한다.
// UI·문구·정렬이 모두 이 파일의 함수만 쓴다.

import type { Bill, BillStatus } from "@/types/bill";
import type { ImpactPathway } from "@/types/impact";

export type Tense =
  | "conditional_future" // 통과·시행되면 …
  | "conditional_pre_effect" // 통과·공포됐지만 시행 전
  | "present" // 현재 적용 중
  | "past"; // 폐기

/** 지금 실제로 효력이 있는가. status와 effectiveDate에서만 파생한다. */
export function isInEffect(bill: Bill, asOf: string): boolean {
  if (bill.status !== "시행") return false;
  if (bill.effectiveDate && bill.effectiveDate > asOf) return false;
  return true;
}

const TENSE_BY_STATUS: Record<BillStatus, Tense> = {
  발의: "conditional_future",
  심사중: "conditional_future",
  본회의_계류: "conditional_future",
  통과: "conditional_pre_effect",
  공포: "conditional_pre_effect",
  시행: "present",
  폐기: "past",
};

export interface StatusPhrase {
  tense: Tense;
  /** 개인화 문구에 반드시 함께 붙는 시제 안내 */
  text: string;
  /** 아직 효력이 없는 법안이면 true. 카드·상세의 조건부 표시에 쓴다. */
  conditional: boolean;
}

/**
 * 법안 상태에 맞는 필수 문구를 돌려준다. §5.5의 표를 그대로 옮긴 것이다.
 * `시행` 상태라도 단계적으로 적용되는 조항은 현재형을 그대로 쓰지 않는다.
 */
export function statusPhrase(bill: Bill, asOf: string): StatusPhrase {
  const tense = TENSE_BY_STATUS[bill.status];

  switch (tense) {
    case "conditional_future":
      return {
        tense,
        conditional: true,
        text: "현재 문안대로 통과·시행되면 아래와 같이 적용됩니다. 심사 과정에서 내용이 바뀔 수 있습니다.",
      };
    case "conditional_pre_effect":
      return {
        tense,
        conditional: true,
        text:
          bill.status === "공포"
            ? `공포됐지만 시행일(${bill.effectiveDate ?? "미정"}) 전까지는 적용되지 않습니다.`
            : "국회는 통과했지만 시행일 전이라 아직 적용되지 않습니다.",
      };
    case "past":
      return {
        tense,
        conditional: true,
        text: "폐기되어 적용되지 않습니다. 기록으로만 남깁니다.",
      };
    case "present": {
      // status가 `시행`이어도 시행일이 아직 오지 않았다면 현재형을 쓰지 않는다.
      if (!isInEffect(bill, asOf)) {
        return {
          tense: "conditional_pre_effect",
          conditional: true,
          text: `시행일(${bill.effectiveDate ?? "미정"}) 전까지는 적용되지 않습니다.`,
        };
      }
      return { tense, conditional: false, text: "현재 적용되고 있습니다." };
    }
  }
}

/**
 * 경로 단위의 적용 시점 문구. 단계적으로 적용되는 조항에 쓴다. §5.5
 * 국민연금 보험료율처럼 "2026년부터 적용, 2033년까지 단계 인상"인 경우가 여기 해당한다.
 */
export function pathwayTiming(
  pathway: ImpactPathway,
  asOf: string,
): string | null {
  if (!pathway.appliesFrom) return null;
  if (pathway.appliesFrom > asOf) {
    return `${pathway.appliesFrom}부터 적용됩니다.`;
  }
  return `${pathway.appliesFrom}부터 적용되고 있습니다.`;
}

/**
 * 현재 효력·시행 임박성. §7.5 정렬 3번 키. 값이 클수록 앞에 온다.
 * 시행 중 > 시행 임박(통과·공포) > 심사 중 > 폐기
 */
export function effectRank(bill: Bill, asOf: string): number {
  if (bill.status === "폐기") return 0;
  if (isInEffect(bill, asOf)) return 3;
  if (bill.status === "통과" || bill.status === "공포" || bill.status === "시행") {
    return 2;
  }
  return 1;
}
