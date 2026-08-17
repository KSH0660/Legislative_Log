import type { BillImpactData } from "@/types/impact";

// 국회법 개정(패스트트랙 심사기간 단축·필리버스터 종결요건 완화) — 개인 영향경로 없음.
//
// §15의 원칙: 의회 운영·제도에 관한 법안은 일반 시민적 관련성과 개인 경제영향을
// 분리하고, `개인화할 직접 근거 없음`을 정상 결과로 둔다.

const BILL = "national-assembly-act-reform-2026";

export const nationalAssemblyActImpact: BillImpactData = {
  review: {
    billSlug: BILL,
    reviewedAt: "2026-08-17",
    baselineVersion: "2026-07-21 발의안 / 현행 국회법 기준 (2026-08-17 본회의 계류)",
    noPersonalPathwayReason:
      "국회가 법안을 심사하고 표결하는 절차를 바꾸는 법입니다. 시민 모두에게 중요한 제도 변화이지만, 연령·경제활동·가구·소득 같은 개인 생활조건으로 누가 더 관련 있는지를 가를 조항은 없습니다. 이 법이 앞으로 어떤 법안을 더 빨리 통과시키느냐에 따라 개인 영향이 생길 수는 있지만, 그건 이 법이 아니라 그 법안들의 영향입니다.",
  },
  pathways: [],
};
