"use client";

import {
  ShieldCheck,
  KeyRound,
  Lock,
  ScrollText,
  UserCog,
  Server,
  type LucideIcon,
} from "lucide-react";
import { SECURITY_FEATURES } from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { ScrollReveal, StaggerGroup, StaggerItem } from "@/components/ui/ScrollReveal";
import { GradientOrb } from "@/components/ui/GradientOrb";
import { Badge } from "@/components/ui/Badge";

const ICONS: Record<string, LucideIcon> = {
  ShieldCheck,
  KeyRound,
  Lock,
  ScrollText,
  UserCog,
  Server,
};

export function Security() {
  return (
    <section id="security" className="section-padding relative overflow-hidden">
      <GradientOrb color="primary" size={550} className="left-0 top-0 opacity-20" />
      <Container>
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <ScrollReveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-accent">
                Security & Trust
              </span>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <h2 className="mt-5 text-display-md font-semibold tracking-tight text-white">
                Your knowledge stays yours
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.18}>
              <p className="mt-5 text-lg leading-relaxed text-muted">
                Orivexa is built for organizations that can&apos;t compromise on
                data protection. Every layer of the platform is designed with
                enterprise security teams in mind, from day one.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.26}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Badge>SOC 2 Type II</Badge>
                <Badge>GDPR ready</Badge>
                <Badge>ISO 27001 aligned</Badge>
                <Badge>HIPAA available</Badge>
              </div>
            </ScrollReveal>
          </div>

          <StaggerGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {SECURITY_FEATURES.map((item) => {
              const Icon = ICONS[item.icon];
              return (
                <StaggerItem key={item.title}>
                  <div className="h-full rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 transition-colors duration-300 hover:border-white/15">
                    <Icon className="h-5 w-5 text-accent" strokeWidth={1.75} />
                    <h3 className="mt-4 text-base font-semibold text-white">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerGroup>
        </div>
      </Container>
    </section>
  );
}
