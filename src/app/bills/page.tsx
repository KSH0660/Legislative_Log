import type { Metadata } from "next";
import { getAllBills } from "@/lib/bills";
import { impactData } from "@/data/impact";
import BillsExplorer from "@/components/personalize/BillsExplorer";

export const metadata: Metadata = {
  title: "법안·정책 추적",
  description:
    "입법로그가 원문과 데이터, 그리고 시행 뒤 실제 결과까지 추적하고 있는 법안과 정책 목록입니다.",
};

export default function BillsPage() {
  const bills = getAllBills();
  const impact = Object.fromEntries(
    impactData.map((d) => [d.review.billSlug, d]),
  );

  return (
    <div>
      <div className="border-b border-paper-line bg-paper-dim">
        <div className="mx-auto max-w-content px-5 py-12 sm:px-6 sm:py-16">
          <p className="eyebrow">추적 중인 기록</p>
          <h1 className="mt-3 font-serif text-title font-bold text-ink">
            법안·정책 추적
          </h1>
          <p className="mt-4 max-w-2xl prose-ko">
            발의부터 시행까지, 그리고 시행 뒤 실제로 무슨 일이 벌어졌는지까지
            기록합니다. 어느 단계에 있든 모든 법안을 똑같은 10단계 구조로
            정리하기 때문에, 서로 다른 법안도 같은 기준으로 비교해 볼 수
            있습니다.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-content px-5 py-10 sm:px-6 sm:py-12">
        <BillsExplorer bills={bills} impact={impact} />
      </div>
    </div>
  );
}
