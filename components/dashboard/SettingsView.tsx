"use client";

import { useState } from "react";
import { INTEGRATIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function SettingsView() {
  const [connected, setConnected] = useState<Set<string>>(
    new Set(["Slack", "GitHub", "Notion", "Google Drive"])
  );

  const toggle = (name: string) => {
    setConnected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-8">
      <h1 className="text-2xl font-semibold text-white">Settings</h1>
      <p className="mt-1 text-sm text-muted">Manage your workspace and connected sources.</p>

      <section className="mt-8 rounded-xl border border-white/[0.07] bg-white/[0.02] p-6">
        <h2 className="text-sm font-semibold text-white">Workspace</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label className="text-xs text-muted-2" htmlFor="workspace-name">
              Workspace name
            </label>
            <input
              id="workspace-name"
              defaultValue="Acme Inc."
              className="mt-1.5 w-full rounded-lg border border-white/10 bg-white/[0.02] px-3.5 py-2.5 text-sm text-white focus:border-primary/40 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-muted-2" htmlFor="workspace-domain">
              Primary domain
            </label>
            <input
              id="workspace-domain"
              defaultValue="orivexia.space"
              className="mt-1.5 w-full rounded-lg border border-white/10 bg-white/[0.02] px-3.5 py-2.5 text-sm text-white focus:border-primary/40 focus:outline-none"
            />
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-white/[0.07] bg-white/[0.02] p-6">
        <h2 className="text-sm font-semibold text-white">Connected sources</h2>
        <p className="mt-1 text-xs text-muted-2">
          Toggle which tools Orivexa indexes into your knowledge graph.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {INTEGRATIONS.map((name) => {
            const isOn = connected.has(name);
            return (
              <button
                key={name}
                onClick={() => toggle(name)}
                className={cn(
                  "flex items-center justify-between rounded-lg border px-3.5 py-2.5 text-left text-xs transition-colors",
                  isOn
                    ? "border-accent/30 bg-accent/[0.06] text-white"
                    : "border-white/10 bg-white/[0.01] text-muted-2"
                )}
              >
                {name}
                <span
                  className={cn(
                    "ml-2 flex h-4 w-7 shrink-0 items-center rounded-full transition-colors",
                    isOn ? "justify-end bg-accent" : "justify-start bg-white/15"
                  )}
                >
                  <span className="m-0.5 h-3 w-3 rounded-full bg-background" />
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-white/[0.07] bg-white/[0.02] p-6">
        <h2 className="text-sm font-semibold text-white">Plan</h2>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <div className="text-sm text-white">Growth plan</div>
            <div className="text-xs text-muted-2">$49 per seat / month · billed monthly</div>
          </div>
          <button className="rounded-lg border border-white/15 px-4 py-2 text-xs text-white transition-colors hover:border-accent/40">
            Manage billing
          </button>
        </div>
      </section>
    </div>
  );
}
