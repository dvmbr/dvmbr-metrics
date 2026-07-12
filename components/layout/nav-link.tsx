"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils/cn";
import type { NavItem } from "@/components/layout/nav-items";

interface NavLinkProps extends NavItem {
  isActive: boolean;
}

export const NavLink = React.forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ href, label, icon: Icon, isActive }, ref) => {
    return (
      <Link
        ref={ref}
        href={href}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "relative flex items-center gap-3 overflow-hidden rounded-md px-3 py-2 text-sm font-medium",
          "transition-[color,background-color] duration-(--duration-fast) ease-standard",
          // Phase Pulse — same reference pattern as Button, so a nav item's
          // hover feels like the same product family, not a plain color fade.
          "hover:animate-[spatial-phase_var(--duration-spatial-phase)_var(--ease-spring)] focus-visible:animate-[spatial-phase_var(--duration-spatial-phase)_var(--ease-spring)]",
          "before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:w-1/3 before:-translate-x-full before:content-['']",
          "before:bg-linear-to-r before:from-transparent before:via-primary/25 before:to-transparent",
          "hover:before:animate-[energy-pulse_var(--duration-spatial-phase)_var(--ease-spring)] focus-visible:before:animate-[energy-pulse_var(--duration-spatial-phase)_var(--ease-spring)]",
          isActive
            ? "bg-(--overlay-hover) text-foreground"
            : "text-foreground-secondary hover:bg-(--overlay-hover) hover:text-foreground",
        )}
      >
        <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
        {label}
      </Link>
    );
  },
);
NavLink.displayName = "NavLink";
