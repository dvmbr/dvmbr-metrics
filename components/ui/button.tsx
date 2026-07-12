import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  [
    "relative inline-flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-md text-sm font-medium",
    // Shift: background/color/border/shadow settle on their own quick transition,
    // timed (duration-fast = 150ms) to land within the Pulse's window below.
    "transition-[color,background-color,border-color,box-shadow,scale] duration-(--duration-fast) ease-standard",
    // Press: the only scale-based feedback — firm, precise compress. Independent
    // of the Spatial Phase sequence below (different CSS property — see note).
    "active:scale-[0.98]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-40",
    // Spatial Phase: Phase (opacity/blur dip) -> Shift (the transition above,
    // running concurrently) -> Afterimage (residual skew) -> Settle, one
    // shared timeline on the button itself. Uses `transform` specifically —
    // not `scale` (press) or `translate` (the Pulse band below) — so all
    // three can run at once without fighting each other.
    "hover:animate-[spatial-phase_var(--duration-spatial-phase)_var(--ease-spring)] focus-visible:animate-[spatial-phase_var(--duration-spatial-phase)_var(--ease-spring)]",
    // Pulse: the traveling energy band, on a `before:` pseudo-element synced
    // to the same --duration-spatial-phase timeline. Base state keeps it
    // off-screen via -translate-x-full; the animation only exists while
    // hover/focus-visible match, so it plays once per engagement, never loops.
    "before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:w-1/3 before:-translate-x-full before:content-['']",
    "hover:before:animate-[energy-pulse_var(--duration-spatial-phase)_var(--ease-spring)] focus-visible:before:animate-[energy-pulse_var(--duration-spatial-phase)_var(--ease-spring)]",
  ],
  {
    variants: {
      variant: {
        // Filled variants already show the brand color as their fill, so the
        // sweep is a plain light highlight (like light passing over polished
        // metal), not another dose of the same hue.
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 data-[state=open]:bg-primary/90 before:bg-linear-to-r before:from-transparent before:via-white/25 before:to-transparent",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/90 data-[state=open]:bg-secondary/90 before:bg-linear-to-r before:from-transparent before:via-white/25 before:to-transparent",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 data-[state=open]:bg-destructive/90 before:bg-linear-to-r before:from-transparent before:via-white/25 before:to-transparent",
        // Outline/ghost have no brand color at rest, so this is where the sweep
        // actually "briefly reveals" the neon accent rather than just shining.
        outline:
          "border border-border bg-transparent text-foreground hover:bg-(--overlay-hover) data-[state=open]:bg-(--overlay-hover) before:bg-linear-to-r before:from-transparent before:via-primary/25 before:to-transparent",
        ghost:
          "text-foreground hover:bg-(--overlay-hover) data-[state=open]:bg-(--overlay-hover) before:bg-linear-to-r before:from-transparent before:via-primary/25 before:to-transparent",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
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
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
