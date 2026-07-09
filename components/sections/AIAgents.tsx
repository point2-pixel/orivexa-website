"use client";

import { Radar, AlertTriangle, Workflow, MessagesSquare, type LucideIcon } from "lucide-react";
import { AI_AGENTS } from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StaggerGroup, StaggerItem } from "@/components/ui/ScrollReveal";
import { GradientOrb } from "@/components/ui/GradientOrb";

const ICONS: Record<string, LucideIcon> = {
  Radar,
  AlertTriangle,
  Workflow,
  MessagesSquare,
};

export function AIAgents() {
  return (
    <section id="agents" className="section-padding relative overflow-hidden">
      <GradientOrb color="accent" size={500} className="right-0 top-1/4 opacity-20" />
      <Container>
        <SectionHeading
          eyebrow="Autonomous"
          title="Agents that act on your knowledge graph"
          description="Orivexa's agents don't wait to be asked. They watch the graph continuously and step in exactly when they're useful."
        />

        <StaggerGroup className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-2">
          {AI_AGENTS.map((agent, i) => {
            const Icon = ICONS[agent.icon];
            return (
              <StaggerItem key={agent.name}>
                <div className="group relative flex gap-5 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-7 transition-all duration-300 hover:border-primary/30 hover:bg-white/[0.04]">
                  <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl transition-opacity duration-500 group-hover:opacity-100 opacity-0" />
                  <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/25 to-accent/10 ring-1 ring-white/10">
                    <Icon className="h-6 w-6 text-accent" strokeWidth={1.75} />
                  </div>
                  <div className="relative">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-white">{agent.name}</h3>
                      <span className="rounded-full bg-accent/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent">
                        Live
                      </span>
                    </div>
                    <p className="mt-2 text-[15px] leading-relaxed text-muted">
                      {agent.description}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </Container>
    </section>
  );
}
