import SectionHeading from "./SectionHeading";
import type { BillSection } from "@/lib/sections";

export default function Section({
  section,
  children,
  tone = "default",
}: {
  section: BillSection;
  children: React.ReactNode;
  tone?: "default" | "muted";
}) {
  // lg 미만에서는 헤더(57~65px) 아래에 목차 바(45px)가 하나 더 붙으므로
  // 앵커로 이동했을 때 제목이 가리지 않도록 스크롤 여백을 그만큼 더 준다.
  return (
    <section
      id={section.id}
      aria-labelledby={`${section.id}-title`}
      className={`group scroll-mt-[7.25rem] border-b border-paper-line py-10 last:border-b-0 sm:py-14 lg:scroll-mt-24 ${
        tone === "muted" ? "bg-paper-dim/50" : ""
      }`}
    >
      <div className="px-5 sm:px-6">
        <SectionHeading
          titleId={`${section.id}-title`}
          label={section.label}
          title={section.title}
          lede={section.lede}
          anchor={section.id}
        />
        {children}
      </div>
    </section>
  );
}
