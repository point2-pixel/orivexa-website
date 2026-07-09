"use client";

import { Quote } from "lucide-react";
import { TESTIMONIALS } from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StaggerGroup, StaggerItem } from "@/components/ui/ScrollReveal";

export function Testimonials() {
  return (
    <section className="section-padding relative">
      <Container>
        <SectionHeading
          eyebrow="Customer stories"
          title="Teams that stopped losing knowledge"
          description="Hear from the operators, engineers, and founders who run their company on Orivexa."
        />

        <StaggerGroup className="mt-16 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
          {TESTIMONIALS.map((t) => (
            <StaggerItem key={t.name} className="break-inside-avoid">
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-7 transition-colors duration-300 hover:border-white/15">
                <Quote className="h-6 w-6 text-primary/50" strokeWidth={1.5} />
                <p className="mt-4 text-[15px] leading-relaxed text-white/85">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent font-mono text-xs font-semibold text-white">
                    {t.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{t.name}</div>
                    <div className="text-xs text-muted-2">{t.role}</div>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Container>
    </section>
  );
}
