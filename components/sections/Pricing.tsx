"use client";

import { Check } from "lucide-react";
import { PRICING_PLANS } from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StaggerGroup, StaggerItem } from "@/components/ui/ScrollReveal";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function Pricing() {
  return (
    <section id="pricing" className="section-padding relative">
      <Container>
        <SectionHeading
          eyebrow="Pricing"
          title="Simple pricing that scales with your graph"
          description="Start free, upgrade when your team needs more depth. No hidden fees, cancel anytime."
        />

        <StaggerGroup className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-3">
          {PRICING_PLANS.map((plan) => (
            <StaggerItem key={plan.name}>
              <div
                className={cn(
                  "relative flex h-full flex-col rounded-3xl border p-8 transition-all duration-300",
                  plan.highlighted
                    ? "border-primary/40 bg-gradient-to-b from-primary/[0.08] to-transparent shadow-glow"
                    : "border-white/[0.08] bg-white/[0.02] hover:border-white/20"
                )}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-accent px-4 py-1 font-mono text-[11px] font-medium uppercase tracking-wider text-white shadow-glow-sm">
                    Most popular
                  </span>
                )}

                <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                <p className="mt-2 text-sm text-muted">{plan.description}</p>

                <div className="mt-6 flex items-baseline gap-2">
                  <span className="text-4xl font-semibold tracking-tight text-white">{plan.price}</span>
                  <span className="text-sm text-muted-2">{plan.period}</span>
                </div>

                <Button
                  variant={plan.highlighted ? "primary" : "secondary"}
                  size="md"
                  className="mt-7 w-full"
                >
                  {plan.cta}
                </Button>

                <ul className="mt-8 flex-1 space-y-3.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-muted">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={2} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Container>
    </section>
  );
}
