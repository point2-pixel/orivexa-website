import type { LucideIcon } from "lucide-react";
import { Search, Network, FileText, Mic, Bot, Settings } from "lucide-react";

export interface DashboardNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const DASHBOARD_NAV: DashboardNavItem[] = [
  { label: "Search", href: "/dashboard", icon: Search },
  { label: "Knowledge Graph", href: "/dashboard/graph", icon: Network },
  { label: "Documents", href: "/dashboard/documents", icon: FileText },
  { label: "Meetings", href: "/dashboard/meetings", icon: Mic },
  { label: "Agents", href: "/dashboard/agents", icon: Bot },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];
