"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";
import { DASHBOARD_NAV } from "@/lib/dashboard-nav";
import { WORKSPACE_STATS } from "@/lib/dashboard-data";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
  workspaceName: string;
  userName: string;
  userEmail: string;
}

export function DashboardSidebar({ workspaceName, userName, userEmail }: DashboardSidebarProps) {
  const pathname = usePathname();
  const initials = userName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-white/[0.07] bg-surface/60 backdrop-blur-xl lg:flex">
      <Link href="/" className="flex items-center gap-2.5 px-6 py-6">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent shadow-glow-sm">
          <Sparkles className="h-4 w-4 text-white" strokeWidth={2.5} />
        </span>
        <span className="text-base font-semibold tracking-tight text-white">
          Orivexa AI
        </span>
      </Link>

      <div className="px-4">
        <div className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2.5">
          <span className="truncate text-left text-sm font-medium text-white">{workspaceName}</span>
        </div>
      </div>

      <nav className="mt-6 flex-1 space-y-1 px-4" aria-label="Dashboard">
        {DASHBOARD_NAV.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors duration-200",
                isActive
                  ? "bg-primary/[0.12] text-white ring-1 ring-primary/30"
                  : "text-muted hover:bg-white/[0.04] hover:text-white"
              )}
            >
              <Icon className={cn("h-4 w-4", isActive ? "text-accent" : "text-muted-2")} strokeWidth={1.75} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mx-4 mb-4 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
        <div className="grid grid-cols-2 gap-3">
          {WORKSPACE_STATS.map((stat) => (
            <div key={stat.label}>
              <div className="text-sm font-semibold text-white">{stat.value}</div>
              <div className="mt-0.5 text-[11px] leading-tight text-muted-2">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-white/[0.07] px-6 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent font-mono text-xs font-semibold text-white">
            {initials || "U"}
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm text-white">{userName}</div>
            <div className="truncate text-xs text-muted-2">{userEmail}</div>
          </div>
        </div>
        <SignOutButton className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-2 transition-colors hover:bg-white/[0.06] hover:text-white" />
      </div>
    </aside>
  );
}
