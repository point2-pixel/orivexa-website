"use client";

import {
  Radar,
  AlertTriangle,
  Workflow,
  MessagesSquare,
  type LucideIcon,
} from "lucide-react";
import { AGENT_ACTIVITY, type AgentActivity } from "@/lib/dashboard-data";
import { AI_AGENTS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const AGENT_ICONS: Record<AgentActivity["agent"], LucideIcon> = {
  "Research Agent": Radar,
  "Risk Agent": AlertTriangle,
  "Ops Agent": Workflow,
  "Answer Agent": MessagesSquare,
};

const STATUS_STYLES: Record<AgentActivity["status"], string> = {
  done: "text-accent bg-accent/10 border-accent/20",
  "in-progress": "text-secondary-light bg-secondary/10 border-secondary/20",
  flagged: "text-amber-300 bg-amber-500/10 border-amber-500/20",
};

const STATUS_LABEL: Record<AgentActivity["status"], string> = {
  done: "Done",
  "in-progress": "In progress",
  flagged: "Flagged",
};

export function AgentsView() {
  return (
    <div className="px-4 py-8 md:px-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-white">AI Agents</h1>
        <p className="text-sm text-muted">
          Autonomous agents working continuously on your knowledge graph.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {AI_AGENTS.map((agent) => {
          const Icon = AGENT_ICONS[agent.name as AgentActivity["agent"]];
          return (
            <div key={agent.name} className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-accent ring-1 ring-primary/20">
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-glow" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-white">{agent.name}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-2">{agent.description}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <h2 className="text-xs font-medium uppercase tracking-wider text-muted-2">Live activity</h2>
        <div className="mt-4 space-y-2.5">
          {AGENT_ACTIVITY.map((item) => {
            const Icon = AGENT_ICONS[item.agent];
            return (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.06] bg-white/[0.015] px-5 py-4"
              >
                <div className="flex min-w-0 items-center gap-3.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-muted ring-1 ring-white/10">
                    <Icon className="h-4 w-4" strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-sm text-white">
                      <span className="font-medium">{item.agent}</span>
                    </div>
                    <p className="truncate text-xs text-muted-2">{item.action}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className={cn("rounded-full border px-2.5 py-1 text-[11px] font-medium", STATUS_STYLES[item.status])}>
                    {STATUS_LABEL[item.status]}
                  </span>
                  <span className="hidden text-xs text-muted-2 sm:inline">{item.timestamp}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
