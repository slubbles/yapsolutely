import { type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
}

const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
}: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-14 text-center">
    <div className="w-10 h-10 rounded-xl bg-foreground/[0.04] flex items-center justify-center mb-4">
      <Icon className="w-5 h-5 text-text-subtle" />
    </div>
    <h3 className="font-display text-[1.02rem] font-semibold text-text-strong tracking-[-0.01em] mb-1">
      {title}
    </h3>
    <p className="font-body text-[0.87rem] text-text-subtle leading-relaxed max-w-[300px] mb-5">
      {description}
    </p>
    <div className="flex items-center gap-2.5">
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="bg-foreground text-primary-foreground hover:bg-foreground/90 font-display font-medium tracking-[-0.01em] text-[0.87rem] h-8 rounded-lg px-4 gap-1.5"
        >
          {actionLabel}
        </Button>
      )}
      {secondaryLabel && onSecondary && (
        <button
          onClick={onSecondary}
          className="font-body text-[0.84rem] text-text-subtle hover:text-text-body transition-colors"
        >
          {secondaryLabel}
        </button>
      )}
    </div>
  </div>
);

export default EmptyState;
