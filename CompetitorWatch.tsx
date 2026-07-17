"use client";

import { useState } from "react";
import { Search, Loader2, Swords, Lightbulb } from "lucide-react";

interface WatchResult {
  findings: string;
  options: string[];
}

export function CompetitorWatch() {
  const [companyName, setCompanyName] = useState("");
  const [competitorName, setCompetitorName] = useState("");
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<WatchResult | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!companyName.trim() || !competitorName.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/competitor-watch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: companyName.trim(),
          competitorName: competitorName.trim(),
          question: question.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Competitor Watch</h1>
        <p className="mt-1 text-sm text-slate-400">
          See what a competitor has been doing lately, and get response ideas.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className="mb-1.5 block text-xs font-medium text-slate-400">
              Your company
            </label>
            <input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Orivexa"
              className="w-full rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-teal-500/60 focus:ring-1 focus:ring-teal-500/60"
            />
          </div>

          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-slate-800 bg-slate-900 text-[11px] font-semibold tracking-wide text-slate-500 mt-5">
            VS
          </div>

          <div className="flex-1">
            <label className="mb-1.5 block text-xs font-medium text-slate-400">
              Competitor
            </label>
            <input
              value={competitorName}
              onChange={(e) => setCompetitorName(e.target.value)}
              placeholder="e.g. Rival Inc"
              className="w-full rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-teal-500/60 focus:ring-1 focus:ring-teal-500/60"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-400">
            Anything specific to ask? (optional)
          </label>
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. Any new promotions this month?"
            className="w-full rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-teal-500/60 focus:ring-1 focus:ring-teal-500/60"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !companyName.trim() || !competitorName.trim()}
          className="inline-flex items-center gap-2 rounded-lg bg-teal-500 px-4 py-2.5 text-sm font-medium text-slate-950 transition hover:bg-teal-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Searching…
            </>
          ) : (
            <>
              <Search className="h-4 w-4" />
              Check competitor
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="mt-6 rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-8 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
            <div className="mb-2.5 flex items-center gap-2 text-sm font-medium text-slate-300">
              <Swords className="h-4 w-4 text-teal-400" />
              What {competitorName} has been up to
            </div>
            <p className="text-sm leading-relaxed text-slate-400">{result.findings}</p>
          </div>

          {result.options.length > 0 && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-300">
                <Lightbulb className="h-4 w-4 text-teal-400" />
                Ideas to consider
              </div>
              <ul className="space-y-2.5">
                {result.options.map((opt, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed text-slate-400">
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-teal-500/10 text-[11px] font-medium text-teal-400">
                      {i + 1}
                    </span>
                    {opt}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-slate-600">
                Suggestions based on public info — not a guaranteed strategy. Weigh these against your own budget and brand.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
