"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  as?: "div" | "article";
}

export function GlassCard({ children, className, hover = true }: GlassCardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -6, transition: { duration: 0.3, ease: "easeOut" } } : undefined}
      className={cn(
        "group relative rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 backdrop-blur-sm transition-colors duration-300",
        hover && "hover:border-primary/30 hover:bg-white/[0.04]",
        className
      )}
    >
      {hover && (
        <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-br from-primary/[0.08] via-transparent to-accent/[0.06]" />
      )}
      <div className="relative">{children}</div>
    </motion.div>
  );
}
