"use client";

import { useState } from "react";
import Link from "next/link";
import { Activity, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { navItems } from "@/components/layout/nav-items";
import { NavLink } from "@/components/layout/nav-link";

export function MobileDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open navigation menu" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent side="left" className="flex flex-col gap-0 p-0">
        <DialogTitle className="sr-only">Navigation</DialogTitle>
        <div className="flex h-16 items-center gap-2 border-b border-border px-5">
          <Link href="/overview" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
              <Activity className="h-4 w-4 text-primary-foreground" aria-hidden="true" />
            </span>
            <span className="text-sm font-semibold tracking-tight text-foreground">
              dvmbr-metrics
            </span>
          </Link>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3 py-2" onClick={() => setOpen(false)}>
          {navItems.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </nav>
      </DialogContent>
    </Dialog>
  );
}
