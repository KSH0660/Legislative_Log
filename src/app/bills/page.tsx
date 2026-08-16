import type { Metadata } from "next";
import { getAllBills } from "@/lib/bills";
import BillBrowser from "@/components/BillBrowser";

export const metadata: Metadata = {
  title: "법안·정책 추적",
  description:
    "입법로그가 원문과 데이터, 그리고 시행 뒤 실제 결과까지 추적하고 있는 법안과 정책 목록입니다.",
};

export default function BillsPage() {
  const bills = getAllBills();

  return (
    <div className="mx-auto max-w-content px-5 py-12 sm:px-6 sm:py-14">
      <p className="eyebrow">추적 중인 기록</p>
      <h1 className="mt-2 font-serif text-3xl font-bold leading-tight text-ink sm:text-4xl">
        법안·정책 추적
      </h1>
      <p className="mt-3 max-w-prose text-[15px] leading-ko text-ink-soft">
        발의부터 시행까지, 그리고 시행 뒤 실제로 무슨 일이 벌어졌는지까지
        기록합니다. 어느 단계에 있든 모든 법안을 똑같은 10단계 구조로 정리하기
        때문에, 서로 다른 법안도 같은 기준으로 비교해 볼 수 있습니다.
      </p>

      <div className="mt-9">
        <BillBrowser bills={bills} />
      </div>
    </div>
  );
}
