import { cn } from "@/lib/utils";

type StatusType = "active" | "paused" | "draft" | "completed" | "failed" | "ringing" | "in-progress";

const statusConfig: Record<StatusType, { label: string; className: string; dot: string }> = {
  active: { label: "Active", className: "bg-emerald-400/10 text-emerald-600", dot: "bg-emerald-400" },
  paused: { label: "Paused", className: "bg-accent-warm/10 text-accent-warm-dim", dot: "bg-accent-warm" },
  draft: { label: "Draft", className: "bg-surface-subtle text-text-subtle", dot: "bg-text-subtle/30" },
  completed: { label: "Completed", className: "bg-emerald-400/10 text-emerald-600", dot: "bg-emerald-400" },
  failed: { label: "Failed", className: "bg-destructive/10 text-destructive", dot: "bg-destructive" },
  ringing: { label: "Ringing", className: "bg-blue-400/10 text-blue-600", dot: "bg-blue-400" },
  "in-progress": { label: "In Progress", className: "bg-accent-warm/10 text-accent-warm-dim", dot: "bg-accent-warm" },
};

interface StatusPillProps {
  status: StatusType;
  showDot?: boolean;
  className?: string;
}

const StatusPill = ({ status, showDot = false, className }: StatusPillProps) => {
  const config = statusConfig[status] ?? statusConfig.draft;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md font-body text-[0.77rem] font-medium",
        config.className,
        className,
      )}
    >
      {showDot && <span className={cn("w-1.5 h-1.5 rounded-full", config.dot)} />}
      {config.label}
    </span>
  );
};

export type { StatusType };
export default StatusPill;
