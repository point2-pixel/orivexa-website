"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Network, Bot, FileText, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { cn } from "@/lib/utils";

const TABS = [
  {
    id: "search",
    label: "Ask Orivexa",
    icon: Search,
    heading: "Ask anything about your company",
    body: "Semantic search reads intent, not keywords, and grounds every answer in a source you can open.",
  },
  {
    id: "graph",
    label: "Graph view",
    icon: Network,
    heading: "See how knowledge connects",
    body: "Explore the live graph linking meetings, docs, code, and decisions across your entire org.",
  },
  {
    id: "agents",
    label: "Agent activity",
    icon: Bot,
    heading: "Agents working in the background",
    body: "Watch agents monitor the graph, flag risks, and complete tasks without leaving your workflow.",
  },
];

export function PlatformShowcase() {
  const [active, setActive] = useState(TABS[0].id);
  const activeTab = TABS.find((t) => t.id === active)!;

  return (
    <section className="section-padding relative overflow-hidden">
      <Container>
        <SectionHeading
          eyebrow="Inside Orivexa"
          title="A workspace that thinks in context"
          description="Switch between the three ways teams use Orivexa every day—asking questions, exploring the graph, and letting agents handle the busywork."
        />

        <div className="mt-16 grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]">
          <ScrollReveal direction="right" className="flex flex-row gap-3 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = tab.id === active;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActive(tab.id)}
                  className={cn(
                    "flex shrink-0 items-center gap-3 rounded-xl border px-5 py-4 text-left transition-all duration-300 lg:w-full",
                    isActive
                      ? "border-primary/40 bg-primary/[0.08] shadow-glow-sm"
                      : "border-white/[0.06] bg-white/[0.01] hover:border-white/15 hover:bg-white/[0.03]"
                  )}
                >
                  <Icon
                    className={cn("h-5 w-5 shrink-0", isActive ? "text-accent" : "text-muted-2")}
                    strokeWidth={1.75}
                  />
                  <span className={cn("whitespace-nowrap text-sm font-medium", isActive ? "text-white" : "text-muted")}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </ScrollReveal>

          <div className="glass relative min-h-[420px] overflow-hidden rounded-2xl p-2">
            <div className="flex items-center gap-1.5 border-b border-white/[0.06] px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
              <span className="ml-4 font-mono text-xs text-muted-2">app.orivexa.ai</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="p-6 md:p-10"
              >
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
                  {activeTab.label}
                </span>
                <h3 className="mt-3 text-2xl font-semibold text-white md:text-3xl">
                  {activeTab.heading}
                </h3>
                <p className="mt-3 max-w-lg text-muted">{activeTab.body}</p>

                <div className="mt-8 space-y-3">
                  {active === "search" && <SearchMock />}
                  {active === "graph" && <GraphMock />}
                  {active === "agents" && <AgentsMock />}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </section>
  );
}

function SearchMock() {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-black/20 p-5">
      <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3">
        <Search className="h-4 w-4 text-muted-2" />
        <span className="font-mono text-sm text-white">
          Why did we move off the legacy billing service?
        </span>
      </div>
      <div className="mt-4 space-y-2.5">
        {[
          { icon: FileText, label: "Q3 Infra Review — Decision doc", tag: "Doc" },
          { icon: FileText, label: "Platform sync — Oct 14", tag: "Meeting" },
          { icon: FileText, label: "billing-service migration.md", tag: "Code" },
        ].map((r) => (
          <div
            key={r.label}
            className="flex items-center justify-between rounded-lg border border-white/[0.05] bg-white/[0.02] px-4 py-3 text-sm"
          >
            <div className="flex items-center gap-3 text-muted">
              <r.icon className="h-4 w-4 text-accent" />
              {r.label}
            </div>
            <span className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[10px] text-muted-2">
              {r.tag}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function GraphMock() {
  const nodes = [
    { x: 20, y: 30 },
    { x: 55, y: 15 },
    { x: 80, y: 40 },
    { x: 40, y: 65 },
    { x: 70, y: 78 },
    { x: 12, y: 70 },
  ];
  return (
    <div className="relative h-64 rounded-xl border border-white/[0.08] bg-black/20">
      <svg viewBox="0 0 100 100" className="h-full w-full" preserveAspectRatio="none">
        <line x1="20" y1="30" x2="55" y2="15" stroke="rgba(124,58,237,0.4)" strokeWidth="0.4" />
        <line x1="55" y1="15" x2="80" y2="40" stroke="rgba(37,99,235,0.4)" strokeWidth="0.4" />
        <line x1="55" y1="15" x2="40" y2="65" stroke="rgba(34,211,238,0.4)" strokeWidth="0.4" />
        <line x1="40" y1="65" x2="70" y2="78" stroke="rgba(124,58,237,0.4)" strokeWidth="0.4" />
        <line x1="40" y1="65" x2="12" y2="70" stroke="rgba(37,99,235,0.4)" strokeWidth="0.4" />
        {nodes.map((n, i) => (
          <circle key={i} cx={n.x} cy={n.y} r={2.2} fill="#22D3EE" opacity={0.9} />
        ))}
      </svg>
    </div>
  );
}

function AgentsMock() {
  const rows = [
    { name: "Risk Agent", status: "Flagged 2 conflicting decisions", live: true },
    { name: "Research Agent", status: "Indexed 14 new documents", live: true },
    { name: "Ops Agent", status: "Updated 3 Linear tickets", live: false },
  ];
  return (
    <div className="space-y-2.5">
      {rows.map((r) => (
        <div
          key={r.name}
          className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3.5 text-sm"
        >
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                r.live ? "bg-accent animate-pulse-glow" : "bg-muted-2"
              )}
            />
            <span className="text-white">{r.name}</span>
          </div>
          <span className="flex items-center gap-1 text-muted-2">
            {r.status}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      ))}
    </div>
  );
}
