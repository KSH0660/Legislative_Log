import { BILL_STATUS_LABEL, type BillStatus } from "@/types/bill";

const DOT_STYLES: Record<BillStatus, string> = {
  발의: "bg-status-proposed",
  심사중: "bg-status-review",
  본회의_계류: "bg-status-pending",
  통과: "bg-status-passed",
  공포: "bg-status-promulgated",
  시행: "bg-status-effective",
  폐기: "bg-status-discarded",
};

const TEXT_STYLES: Record<BillStatus, string> = {
  발의: "text-status-proposed",
  심사중: "text-status-review",
  본회의_계류: "text-status-pending",
  통과: "text-status-passed",
  공포: "text-status-promulgated",
  시행: "text-status-effective",
  폐기: "text-status-discarded",
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
      className={`inline-flex items-center gap-1.5 rounded-full border border-current/20 px-2.5 py-0.5 text-xs font-semibold ${TEXT_STYLES[status]} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${DOT_STYLES[status]}`} />
      {BILL_STATUS_LABEL[status]}
    </span>
  );
}
