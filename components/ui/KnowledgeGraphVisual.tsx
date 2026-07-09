"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

interface NodeDef {
  id: string;
  x: number;
  y: number;
  r: number;
  label?: string;
  tier: 0 | 1 | 2;
}

const CENTER: NodeDef = { id: "core", x: 300, y: 260, r: 15, label: "Orivexa", tier: 0 };

const TIER1: NodeDef[] = [
  { id: "meetings", x: 130, y: 140, r: 9, label: "Meetings", tier: 1 },
  { id: "docs", x: 460, y: 130, r: 9, label: "Docs", tier: 1 },
  { id: "code", x: 500, y: 320, r: 9, label: "Code", tier: 1 },
  { id: "decisions", x: 300, y: 420, r: 9, label: "Decisions", tier: 1 },
  { id: "design", x: 100, y: 340, r: 9, label: "Design", tier: 1 },
];

const TIER2: NodeDef[] = [
  { id: "m1", x: 60, y: 90, r: 4, tier: 2 },
  { id: "m2", x: 170, y: 55, r: 4, tier: 2 },
  { id: "d1", x: 420, y: 55, r: 4, tier: 2 },
  { id: "d2", x: 545, y: 90, r: 4, tier: 2 },
  { id: "c1", x: 575, y: 260, r: 4, tier: 2 },
  { id: "c2", x: 560, y: 385, r: 4, tier: 2 },
  { id: "de1", x: 380, y: 470, r: 4, tier: 2 },
  { id: "de2", x: 220, y: 480, r: 4, tier: 2 },
  { id: "s1", x: 40, y: 400, r: 4, tier: 2 },
  { id: "s2", x: 30, y: 270, r: 4, tier: 2 },
];

const TIER2_LINKS: [string, string][] = [
  ["meetings", "m1"],
  ["meetings", "m2"],
  ["docs", "d1"],
  ["docs", "d2"],
  ["code", "c1"],
  ["code", "c2"],
  ["decisions", "de1"],
  ["decisions", "de2"],
  ["design", "s1"],
  ["design", "s2"],
];

const CROSS_LINKS: [string, string][] = [
  ["meetings", "decisions"],
  ["docs", "code"],
  ["design", "docs"],
  ["decisions", "code"],
];

const ALL_NODES = [CENTER, ...TIER1, ...TIER2];

function getNode(id: string) {
  return ALL_NODES.find((n) => n.id === id)!;
}

export function KnowledgeGraphVisual({ className }: { className?: string }) {
  const tier1Links = useMemo(() => TIER1.map((n) => [CENTER.id, n.id] as [string, string]), []);

  return (
    <svg
      viewBox="0 0 600 520"
      className={className}
      role="img"
      aria-label="Animated diagram of Orivexa's knowledge graph connecting meetings, documents, code, decisions, and design"
    >
      <defs>
        <linearGradient id="edgeGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#22D3EE" />
        </linearGradient>
        <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
        </radialGradient>
        <filter id="softGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Tier-2 fine links */}
      {TIER2_LINKS.map(([a, b], i) => {
        const from = getNode(a);
        const to = getNode(b);
        return (
          <motion.line
            key={`t2-${a}-${b}`}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke="rgba(148,163,184,0.25)"
            strokeWidth={1}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 + i * 0.05, ease: "easeOut" }}
          />
        );
      })}

      {/* Cross links between tier-1 nodes */}
      {CROSS_LINKS.map(([a, b], i) => {
        const from = getNode(a);
        const to = getNode(b);
        return (
          <motion.line
            key={`cross-${a}-${b}`}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke="rgba(124,58,237,0.35)"
            strokeWidth={1.2}
            strokeDasharray="4 5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.2, delay: 1 + i * 0.1, ease: "easeOut" }}
          />
        );
      })}

      {/* Core-to-tier1 links */}
      {tier1Links.map(([a, b], i) => {
        const from = getNode(a);
        const to = getNode(b);
        return (
          <motion.line
            key={`t1-${b}`}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke="url(#edgeGradient)"
            strokeWidth={1.8}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.3 + i * 0.1, ease: "easeOut" }}
          />
        );
      })}

      {/* Core glow */}
      <circle cx={CENTER.x} cy={CENTER.y} r={60} fill="url(#coreGlow)" opacity={0.5} />

      {/* Tier-2 nodes */}
      {TIER2.map((n, i) => (
        <motion.circle
          key={n.id}
          cx={n.x}
          cy={n.y}
          r={n.r}
          fill="#0B1120"
          stroke="#67E8F9"
          strokeWidth={1.2}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 + i * 0.05, ease: "backOut" }}
        />
      ))}

      {/* Tier-1 nodes */}
      {TIER1.map((n, i) => (
        <g key={n.id}>
          <motion.circle
            cx={n.x}
            cy={n.y}
            r={n.r}
            fill="#0B1120"
            stroke="url(#edgeGradient)"
            strokeWidth={2}
            filter="url(#softGlow)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.15, 1], opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 + i * 0.1, ease: "easeOut" }}
          />
          <motion.text
            x={n.x}
            y={n.y - n.r - 10}
            textAnchor="middle"
            className="fill-white/70"
            fontSize="12"
            fontFamily="var(--font-mono)"
            initial={{ opacity: 0, y: n.y - n.r - 2 }}
            animate={{ opacity: 1, y: n.y - n.r - 10 }}
            transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
          >
            {n.label}
          </motion.text>
        </g>
      ))}

      {/* Core node */}
      <motion.circle
        cx={CENTER.x}
        cy={CENTER.y}
        r={CENTER.r}
        fill="#030712"
        stroke="url(#edgeGradient)"
        strokeWidth={2.5}
        filter="url(#softGlow)"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, ease: "backOut" }}
      />
      <motion.circle
        cx={CENTER.x}
        cy={CENTER.y}
        r={5}
        fill="#22D3EE"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.4, 1], opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      />
    </svg>
  );
}
