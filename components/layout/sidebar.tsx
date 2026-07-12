"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity } from "lucide-react";

import { navItems, isNavItemActive } from "@/components/layout/nav-items";
import { NavLink } from "@/components/layout/nav-link";

export function Sidebar() {
  const pathname = usePathname();
  const activeIndex = navItems.findIndex((item) => isNavItemActive(pathname, item.href));

  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const [indicator, setIndicator] = useState<{ top: number; height: number } | null>(null);

  // useLayoutEffect (not useEffect) so the indicator is measured and placed
  // before paint — no flash at the wrong position on first mount.
  useLayoutEffect(() => {
    const el = itemRefs.current[activeIndex];
    if (el) {
      setIndicator({ top: el.offsetTop, height: el.offsetHeight });
    }
  }, [activeIndex]);

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-surface md:flex">
      <div className="flex h-16 items-center gap-2 px-5">
        <Link href="/overview" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
            <Activity className="h-4 w-4 text-primary-foreground" aria-hidden="true" />
          </span>
          <span className="text-sm font-semibold tracking-tight text-foreground">
            dvmbr-metrics
          </span>
        </Link>
      </div>
      <nav className="relative flex flex-1 flex-col gap-1 px-3 py-2">
        {/* Single indicator, repositioned via measured top/height — not
            recreated per item — so it visibly slides between nav items
            instead of fading in/out at a new spot. */}
        {indicator && (
          <span
            aria-hidden="true"
            className="absolute left-0 w-0.5 rounded-full bg-primary transition-[top,height] duration-(--duration-normal) ease-standard"
            style={{ top: indicator.top, height: indicator.height }}
          />
        )}
        {navItems.map((item, index) => (
          <NavLink
            key={item.href}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            isActive={index === activeIndex}
            {...item}
          />
        ))}
      </nav>
    </aside>
  );
}
