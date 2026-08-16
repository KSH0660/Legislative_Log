import SectionHeading from "./SectionHeading";

export default function Section({
  number,
  title,
  description,
  children,
  tone = "default",
}: {
  number: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  tone?: "default" | "muted";
}) {
  return (
    <section
      id={`section-${number}`}
      className={`scroll-mt-24 border-b border-paper-line py-12 first:pt-0 last:border-b-0 ${
        tone === "muted" ? "bg-paper-dim/50" : ""
      }`}
    >
      <div className="mx-auto max-w-content px-6">
        <SectionHeading number={number} title={title} description={description} />
        {children}
      </div>
    </section>
  );
}
