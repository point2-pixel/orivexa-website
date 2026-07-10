"use client";

import { useState } from "react";
import { SOURCE_DOCS, type SourceDoc } from "@/lib/dashboard-data";
import { SourceCard } from "@/components/dashboard/SourceCard";
import { cn } from "@/lib/utils";

const FILTERS: { label: string; value: SourceDoc["type"] | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Docs", value: "doc" },
  { label: "Meetings", value: "meeting" },
  { label: "Code", value: "code" },
  { label: "Design", value: "design" },
  { label: "Decisions", value: "decision" },
];

export function DocumentsView() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["value"]>("all");

  const filtered = filter === "all" ? SOURCE_DOCS : SOURCE_DOCS.filter((d) => d.type === filter);

  return (
    <div className="px-4 py-8 md:px-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-white">Documents</h1>
        <p className="text-sm text-muted">
          Everything Orivexa has indexed across your connected tools.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const isActive = filter === f.value;
          const count = f.value === "all" ? SOURCE_DOCS.length : SOURCE_DOCS.filter((d) => d.type === f.value).length;
          return (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                "flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs transition-colors",
                isActive
                  ? "border-primary/40 bg-primary/[0.1] text-white"
                  : "border-white/10 bg-white/[0.02] text-muted hover:text-white"
              )}
            >
              {f.label}
              <span className="text-muted-2">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((doc) => (
          <SourceCard key={doc.id} doc={doc} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-10 text-center text-sm text-muted-2">No documents in this category yet.</p>
      )}
    </div>
  );
}
