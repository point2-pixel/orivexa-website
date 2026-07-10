"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { GridBackground } from "@/components/ui/GridBackground";
import { KnowledgeGraphVisual } from "@/components/ui/KnowledgeGraphVisual";
import { useMousePosition } from "@/hooks/useMousePosition";

export function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const mouse = useMousePosition(sectionRef);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen items-center overflow-hidden pt-32 pb-20"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-20 bg-background" />
      <motion.div
        aria-hidden
        className="absolute -top-1/3 left-1/2 -z-10 h-[900px] w-[1200px] -translate-x-1/2 rounded-full opacity-40 blur-[140px]"
        style={{
          background:
            "conic-gradient(from 90deg, #7C3AED, #2563EB, #22D3EE, #7C3AED)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-background/60 to-background" />
      <GridBackground />

      {/* Floating parallax orbs */}
      <motion.div
        aria-hidden
        className="absolute left-[8%] top-[22%] -z-10 h-64 w-64 rounded-full bg-primary/25 blur-[100px]"
        style={{ x: mouse.x * -30, y: mouse.y * -30 }}
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute right-[10%] top-[15%] -z-10 h-72 w-72 rounded-full bg-accent/15 blur-[110px]"
        style={{ x: mouse.x * 24, y: mouse.y * 24 }}
        animate={{ y: [0, 24, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <Container className="relative grid grid-cols-1 items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 backdrop-blur-sm"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-glow-cyan animate-pulse-glow" />
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
              Now indexing knowledge in real time
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-8 text-display-xl font-semibold tracking-tight text-white"
          >
            Turn company{" "}
            <span className="text-gradient-static">knowledge</span> into
            intelligence
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-7 max-w-xl text-lg leading-relaxed text-muted"
          >
            Orivexa AI doesn&apos;t just answer questions—it builds an evolving
            knowledge graph of your company. Every meeting, document, design,
            line of code, and decision becomes connected, searchable, and
            actionable.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <ButtonLink href="/dashboard" size="lg" className="group">
              Try the live demo
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </ButtonLink>
            <Button variant="secondary" size="lg" className="group">
              <PlayCircle className="h-4 w-4 text-accent" />
              Watch demo
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-muted-2"
          >
            <span>No credit card required</span>
            <span className="h-1 w-1 rounded-full bg-white/20" />
            <span>SOC 2 Type II certified</span>
            <span className="h-1 w-1 rounded-full bg-white/20" />
            <span>Deploy in under an hour</span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ x: mouse.x * -12, y: mouse.y * -12 }}
          className="relative mx-auto w-full max-w-xl"
        >
          <div className="glow-border relative rounded-3xl border border-white/[0.08] bg-white/[0.02] p-4 backdrop-blur-xl">
            <KnowledgeGraphVisual className="h-auto w-full" />
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
