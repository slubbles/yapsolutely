import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-body text-body-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-foreground text-primary-foreground hover:bg-foreground/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-border-soft bg-surface-panel text-text-body hover:bg-surface-subtle hover:text-text-strong",
        secondary: "bg-surface-subtle text-text-body hover:bg-surface-subtle/80 hover:text-text-strong",
        ghost: "text-text-subtle hover:bg-surface-subtle hover:text-text-strong",
        link: "text-text-body underline-offset-4 hover:underline",
        hero: "bg-foreground text-primary-foreground hover:bg-foreground/90 rounded-full font-display font-medium tracking-[-0.01em]",
        "hero-outline": "border border-border-soft bg-transparent text-text-body hover:bg-surface-subtle rounded-full font-display font-medium tracking-[-0.01em]",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-[0.75rem]",
        lg: "h-11 rounded-full px-8 text-body-md",
        xl: "h-12 rounded-full px-10 text-body-md",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
