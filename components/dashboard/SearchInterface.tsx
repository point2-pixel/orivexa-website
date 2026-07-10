"use client";

import { useState, useRef, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Sparkles, ArrowRight, RotateCcw } from "lucide-react";
import {
  SOURCE_DOCS,
  SCRIPTED_ANSWERS,
  EXAMPLE_QUERIES,
  type SourceDoc,
} from "@/lib/dashboard-data";
import { SourceCard } from "@/components/dashboard/SourceCard";

type Status = "idle" | "thinking" | "answered";

const FALLBACK_ANSWER =
  "Orivexa found related context across your workspace, but this demo only scripts a few sample questions. Try one of the example queries below to see a full grounded answer with citations.";

function findAnswer(query: string) {
  const lower = query.toLowerCase();
  const match = SCRIPTED_ANSWERS.find((entry) =>
    entry.keywords.some((k) => lower.includes(k))
  );
  if (!match) {
    return { answer: FALLBACK_ANSWER, sources: SOURCE_DOCS.slice(0, 3) };
  }
  const sources = match.sourceIds
    .map((id) => SOURCE_DOCS.find((d) => d.id === id))
    .filter(Boolean) as SourceDoc[];
  return { answer: match.answer, sources };
}

export function SearchInterface() {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<{ answer: string; sources: SourceDoc[] } | null>(null);
  const thinkingTimeout = useRef<number | null>(null);

  const runSearch = (q: string) => {
    if (!q.trim()) return;
    setSubmittedQuery(q);
    setStatus("thinking");
    setResult(null);

    if (thinkingTimeout.current) window.clearTimeout(thinkingTimeout.current);
    thinkingTimeout.current = window.setTimeout(() => {
      setResult(findAnswer(q));
      setStatus("answered");
    }, 1100);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    runSearch(query);
  };

  const reset = () => {
    setStatus("idle");
    setResult(null);
    setQuery("");
    setSubmittedQuery("");
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-col px-4 py-10 md:px-8 md:py-16">
      <AnimatePresence mode="wait">
        {status === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-accent">
              Ask Orivexa
            </span>
            <h1 className="mt-6 text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Ask anything about your company
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-muted">
              Semantic search reads intent, not keywords, and grounds every
              answer in a source you can open.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="mt-8">
        <div className="glass flex items-center gap-3 rounded-2xl px-5 py-4 focus-within:border-primary/40">
          <Search className="h-5 w-5 shrink-0 text-muted-2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question about meetings, docs, code, or decisions…"
            className="w-full bg-transparent text-sm text-white placeholder:text-muted-2 focus:outline-none md:text-base"
          />
          <button
            type="submit"
            disabled={!query.trim()}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-primary to-secondary text-white transition-opacity disabled:opacity-30"
            aria-label="Search"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>

      {status === "idle" && (
        <div className="mt-6 flex flex-wrap justify-center gap-2.5">
          {EXAMPLE_QUERIES.map((q) => (
            <button
              key={q}
              onClick={() => {
                setQuery(q);
                runSearch(q);
              }}
              className="rounded-full border border-white/10 bg-white/[0.02] px-4 py-2 text-xs text-muted transition-colors hover:border-accent/30 hover:text-white"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {status !== "idle" && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mt-10"
          >
            <div className="flex items-start justify-between gap-4">
              <p className="text-lg font-medium text-white">{submittedQuery}</p>
              <button
                onClick={reset}
                className="flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-muted transition-colors hover:text-white"
              >
                <RotateCcw className="h-3 w-3" />
                New search
              </button>
            </div>

            <div className="mt-5 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
              {status === "thinking" && (
                <div className="flex items-center gap-3 text-sm text-muted">
                  <Sparkles className="h-4 w-4 animate-pulse text-accent" />
                  <span className="flex items-center gap-1">
                    Reading the graph
                    <span className="inline-flex gap-0.5">
                      <span className="h-1 w-1 animate-pulse-glow rounded-full bg-accent [animation-delay:0s]" />
                      <span className="h-1 w-1 animate-pulse-glow rounded-full bg-accent [animation-delay:0.15s]" />
                      <span className="h-1 w-1 animate-pulse-glow rounded-full bg-accent [animation-delay:0.3s]" />
                    </span>
                  </span>
                </div>
              )}

              {status === "answered" && result && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="text-[15px] leading-relaxed text-white/90"
                >
                  {result.answer}
                </motion.p>
              )}
            </div>

            {status === "answered" && result && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="mt-8"
              >
                <h3 className="text-xs font-medium uppercase tracking-wider text-muted-2">
                  Sources ({result.sources.length})
                </h3>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {result.sources.map((doc) => (
                    <SourceCard key={doc.id} doc={doc} />
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
