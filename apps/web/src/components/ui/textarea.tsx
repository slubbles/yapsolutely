import * as React from "react";

import { cn } from "@/lib/utils";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-lg border border-border-soft bg-surface-panel px-3 py-2.5 font-body text-body-md text-text-strong ring-offset-background placeholder:text-text-subtle/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-text-strong/10 focus-visible:border-text-subtle/30 disabled:cursor-not-allowed disabled:opacity-50 transition-shadow",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
