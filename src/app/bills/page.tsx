import type { Metadata } from "next";
import { getAllBills } from "@/lib/bills";
import BillCard from "@/components/BillCard";

export const metadata: Metadata = {
  title: "법안·정책 추적",
  description: "입법로그가 원문·데이터·논리·실제 결과를 기준으로 추적하는 법안과 정책 목록입니다.",
};

export default function BillsPage() {
  const bills = getAllBills();

  return (
    <div className="mx-auto max-w-content px-6 py-14">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-dark">
        Tracking
      </p>
      <h1 className="mt-2 font-serif text-3xl font-bold text-ink sm:text-4xl">
        법안·정책 추적
      </h1>
      <p className="mt-3 max-w-prose text-ink-soft">
        발의부터 시행, 그리고 시행 이후까지. 입법로그가 원문과 데이터를 기준으로
        추적하고 있는 법안과 정책입니다. 상태와 관계없이 같은 10단계 구조로
        기록합니다.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {bills.map((bill) => (
          <BillCard key={bill.slug} bill={bill} />
        ))}
      </div>
    </div>
  );
}
