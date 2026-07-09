"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function CTA() {
  return (
    <section className="relative py-24 md:py-32">
      <Container>
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/[0.08] bg-gradient-to-br from-primary/15 via-surface to-accent/10 px-8 py-20 text-center sm:px-16">
            <motion.div
              aria-hidden
              className="absolute -top-1/2 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full opacity-30 blur-[120px]"
              style={{
                background: "conic-gradient(from 180deg, #7C3AED, #2563EB, #22D3EE, #7C3AED)",
              }}
              animate={{ rotate: -360 }}
              transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            />

            <div className="relative">
              <h2 className="mx-auto max-w-2xl text-display-md font-semibold tracking-tight text-white">
                Give your company a memory that never forgets
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-lg text-muted">
                Connect your first tool and watch your knowledge graph come to
                life in minutes. No credit card required.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" className="group">
                  Start building for free
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
                <Button variant="outline" size="lg">
                  Talk to sales
                </Button>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
