import {
  BILL_STATUS_DESCRIPTION,
  BILL_STATUS_LABEL,
  type BillStatus,
} from "@/types/bill";

// 점 색과 글자 색을 따로 두면 Tailwind가 클래스를 안전하게 추출한다.
const DOT: Record<BillStatus, string> = {
  발의: "bg-status-proposed",
  심사중: "bg-status-review",
  본회의_계류: "bg-status-pending",
  통과: "bg-status-passed",
  공포: "bg-status-promulgated",
  시행: "bg-status-effective",
  폐기: "bg-status-discarded",
};

const TEXT: Record<BillStatus, string> = {
  발의: "text-status-proposed ring-status-proposed/30",
  심사중: "text-status-review ring-status-review/30",
  본회의_계류: "text-status-pending ring-status-pending/30",
  통과: "text-status-passed ring-status-passed/30",
  공포: "text-status-promulgated ring-status-promulgated/30",
  시행: "text-status-effective ring-status-effective/30",
  폐기: "text-status-discarded ring-status-discarded/30",
};

export default function StatusBadge({
  status,
  className = "",
}: {
  status: BillStatus;
  className?: string;
}) {
  return (
    <span
      title={BILL_STATUS_DESCRIPTION[status]}
      className={`chip gap-1.5 ring-1 ring-inset ${TEXT[status]} ${className}`}
    >
      <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${DOT[status]}`} />
      <span className="sr-only">진행 상태: </span>
      {BILL_STATUS_LABEL[status]}
    </span>
  );
}
