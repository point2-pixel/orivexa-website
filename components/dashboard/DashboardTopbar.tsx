"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Sparkles } from "lucide-react";
import { DASHBOARD_NAV } from "@/lib/dashboard-nav";
import { cn } from "@/lib/utils";
import { useScrollLock } from "@/hooks/useScrollLock";

export function DashboardTopbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useScrollLock(open);

  const current = DASHBOARD_NAV.find((item) =>
    item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href)
  );

  return (
    <>
      <header className="flex h-16 items-center justify-between border-b border-white/[0.07] bg-surface/60 px-4 backdrop-blur-xl lg:px-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-white lg:hidden"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-sm font-medium text-white">{current?.label ?? "Dashboard"}</h1>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-accent/30 bg-accent/[0.08] px-3 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-glow" />
          <span className="font-mono text-[11px] uppercase tracking-wider text-accent">
            Product demo · sample data
          </span>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="glass-strong relative flex h-full w-72 flex-col">
            <div className="flex items-center justify-between px-5 py-5">
              <Link href="/" className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                  <Sparkles className="h-4 w-4 text-white" strokeWidth={2.5} />
                </span>
                <span className="text-base font-semibold text-white">Orivexa AI</span>
              </Link>
              <button onClick={() => setOpen(false)} aria-label="Close navigation" className="text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 space-y-1 px-4">
              {DASHBOARD_NAV.map((item) => {
                const isActive =
                  item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm",
                      isActive ? "bg-primary/[0.12] text-white" : "text-muted hover:text-white"
                    )}
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.75} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
