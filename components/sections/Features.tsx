"use client";

import {
  Network,
  Search,
  Mic,
  FileStack,
  Code2,
  GitBranch,
  ShieldCheck,
  Bot,
  Users,
  BarChart3,
  type LucideIcon,
} from "lucide-react";
import { FEATURES } from "@/lib/constants";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Container } from "@/components/ui/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import { StaggerGroup, StaggerItem } from "@/components/ui/ScrollReveal";

const ICONS: Record<string, LucideIcon> = {
  Network,
  Search,
  Mic,
  FileStack,
  Code2,
  GitBranch,
  ShieldCheck,
  Bot,
  Users,
  BarChart3,
};

export function Features() {
  return (
    <section id="features" className="section-padding relative">
      <Container>
        <SectionHeading
          eyebrow="Platform"
          title="One workspace, every source of truth"
          description="Orivexa unifies the tools your team already uses into a single, continuously updating layer of company intelligence."
        />

        <StaggerGroup className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = ICONS[feature.icon];
            return (
              <StaggerItem key={feature.title}>
                <GlassCard className="h-full">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 ring-1 ring-white/10">
                    <Icon className="h-5 w-5 text-accent" strokeWidth={1.75} />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-muted">
                    {feature.description}
                  </p>
                </GlassCard>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </Container>
    </section>
  );
}
