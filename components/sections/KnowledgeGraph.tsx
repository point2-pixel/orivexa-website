"use client";

import { Network, Link2, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { KnowledgeGraphVisual } from "@/components/ui/KnowledgeGraphVisual";
import { GradientOrb } from "@/components/ui/GradientOrb";

const STATS = [
  { icon: Network, label: "Connected nodes per workspace", value: "1.2M+" },
  { icon: Link2, label: "Relationships mapped automatically", value: "40+ types" },
  { icon: Sparkles, label: "Faster to first correct answer", value: "6.4x" },
];

export function KnowledgeGraph() {
  return (
    <section id="knowledge-graph" className="section-padding relative overflow-hidden">
      <GradientOrb color="secondary" size={600} className="left-1/2 top-0 -translate-x-1/2 opacity-30" />
      <Container className="relative grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <ScrollReveal direction="right" className="order-2 lg:order-1">
          <div className="glow-border relative rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-xl">
            <KnowledgeGraphVisual className="h-auto w-full" />
          </div>
        </ScrollReveal>

        <div className="order-1 lg:order-2">
          <ScrollReveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-accent">
              The Knowledge Graph
            </span>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 className="mt-5 text-display-md font-semibold tracking-tight text-white">
              Knowledge that gets smarter every day
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.18}>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              Most tools store information. Orivexa understands it. Every
              meeting, doc, design, and commit is parsed into entities and
              relationships, then woven into a graph that reflects how your
              company actually works—not just where files happen to live.
            </p>
          </ScrollReveal>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {STATS.map((stat, i) => (
              <ScrollReveal key={stat.label} delay={0.1 + i * 0.08}>
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                  <stat.icon className="h-5 w-5 text-accent" strokeWidth={1.75} />
                  <div className="mt-4 text-2xl font-semibold text-white">{stat.value}</div>
                  <div className="mt-1 text-xs leading-snug text-muted-2">{stat.label}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
