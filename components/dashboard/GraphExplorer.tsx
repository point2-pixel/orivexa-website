"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Network, FileText, Mic, Code2, GitBranch, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

interface GraphNode {
  id: string;
  x: number;
  y: number;
  r: number;
  label: string;
  tier: 0 | 1;
  description: string;
  count: number;
  icon: typeof Network;
}

const CENTER: GraphNode = {
  id: "core",
  x: 300,
  y: 260,
  r: 17,
  label: "Orivexa Graph",
  tier: 0,
  description: "The root of your workspace's knowledge graph, connecting every category of company knowledge.",
  count: 18204,
  icon: Network,
};

const NODES: GraphNode[] = [
  {
    id: "meetings",
    x: 130,
    y: 140,
    r: 11,
    label: "Meetings",
    tier: 1,
    description: "Transcribed and summarized calls, linked to the decisions and projects they influenced.",
    count: 1204,
    icon: Mic,
  },
  {
    id: "docs",
    x: 460,
    y: 130,
    r: 11,
    label: "Docs",
    tier: 1,
    description: "Specs, wikis, and PDFs parsed into entities and cross-referenced across your workspace.",
    count: 6820,
    icon: FileText,
  },
  {
    id: "code",
    x: 500,
    y: 320,
    r: 11,
    label: "Code",
    tier: 1,
    description: "Repositories mapped into functions, owners, and dependencies alongside your docs and decisions.",
    count: 9130,
    icon: Code2,
  },
  {
    id: "decisions",
    x: 300,
    y: 420,
    r: 11,
    label: "Decisions",
    tier: 1,
    description: "Every tracked decision, with a direct line back to the discussion and data behind it.",
    count: 342,
    icon: GitBranch,
  },
  {
    id: "design",
    x: 100,
    y: 340,
    r: 11,
    label: "Design",
    tier: 1,
    description: "Figma files and design docs connected to the product decisions and code they shaped.",
    count: 708,
    icon: Palette,
  },
];

const ALL_NODES = [CENTER, ...NODES];
const LINKS = NODES.map((n) => [CENTER.id, n.id] as [string, string]);
const CROSS_LINKS: [string, string][] = [
  ["meetings", "decisions"],
  ["docs", "code"],
  ["design", "docs"],
  ["decisions", "code"],
];

function getNode(id: string) {
  return ALL_NODES.find((n) => n.id === id)!;
}

export function GraphExplorer() {
  const [selectedId, setSelectedId] = useState<string>("core");
  const selected = getNode(selectedId);
  const SelectedIcon = selected.icon;

  return (
    <div className="grid h-full grid-cols-1 lg:grid-cols-[1fr_340px]">
      <div className="flex flex-col px-4 py-8 md:px-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">Knowledge Graph</h1>
          <p className="mt-1 text-sm text-muted">
            Explore how meetings, docs, code, decisions, and design connect. Click a node for details.
          </p>
        </div>

        <div className="mt-6 flex-1 rounded-2xl border border-white/[0.08] bg-white/[0.015] p-4">
          <svg viewBox="0 0 600 520" className="h-full w-full" role="img" aria-label="Interactive knowledge graph">
            <defs>
              <linearGradient id="explorerEdge" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#7C3AED" />
                <stop offset="100%" stopColor="#22D3EE" />
              </linearGradient>
              <radialGradient id="explorerGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
              </radialGradient>
            </defs>

            {CROSS_LINKS.map(([a, b]) => {
              const from = getNode(a);
              const to = getNode(b);
              return (
                <line
                  key={`cross-${a}-${b}`}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke="rgba(124,58,237,0.3)"
                  strokeWidth={1.2}
                  strokeDasharray="4 5"
                />
              );
            })}

            {LINKS.map(([a, b]) => {
              const from = getNode(a);
              const to = getNode(b);
              const isHighlighted = selectedId === a || selectedId === b;
              return (
                <line
                  key={`link-${b}`}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={isHighlighted ? "url(#explorerEdge)" : "rgba(148,163,184,0.25)"}
                  strokeWidth={isHighlighted ? 2 : 1.4}
                />
              );
            })}

            <circle cx={CENTER.x} cy={CENTER.y} r={70} fill="url(#explorerGlow)" opacity={0.4} />

            {ALL_NODES.map((node) => {
              const isSelected = selectedId === node.id;
              return (
                <g
                  key={node.id}
                  onClick={() => setSelectedId(node.id)}
                  className="cursor-pointer"
                  role="button"
                  tabIndex={0}
                  aria-label={`View ${node.label} node details`}
                  onKeyDown={(e) => e.key === "Enter" && setSelectedId(node.id)}
                >
                  <motion.circle
                    cx={node.x}
                    cy={node.y}
                    r={node.r}
                    fill={isSelected ? "#0B1120" : "#030712"}
                    stroke={isSelected ? "#22D3EE" : "url(#explorerEdge)"}
                    strokeWidth={isSelected ? 3 : 2}
                    animate={{ scale: isSelected ? 1.15 : 1 }}
                    transition={{ duration: 0.25 }}
                  />
                  <text
                    x={node.x}
                    y={node.tier === 0 ? node.y + node.r + 20 : node.y - node.r - 10}
                    textAnchor="middle"
                    className={cn("select-none", isSelected ? "fill-white" : "fill-white/60")}
                    fontSize="12"
                    fontFamily="var(--font-mono)"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      <div className="border-t border-white/[0.07] px-4 py-8 md:px-8 lg:border-l lg:border-t-0">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-accent">
          Node details
        </span>

        <div className="mt-5 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/25 to-accent/10 ring-1 ring-white/10">
            <SelectedIcon className="h-5 w-5 text-accent" strokeWidth={1.75} />
          </span>
          <h2 className="text-lg font-semibold text-white">{selected.label}</h2>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-muted">{selected.description}</p>

        <div className="mt-6 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
          <div className="text-2xl font-semibold text-white">{selected.count.toLocaleString()}</div>
          <div className="mt-1 text-xs text-muted-2">Connected items in this node</div>
        </div>

        {selected.tier === 0 && (
          <p className="mt-6 text-xs leading-relaxed text-muted-2">
            Select any category node on the left to see how it connects to the
            rest of your company&apos;s knowledge.
          </p>
        )}
      </div>
    </div>
  );
}
