import { ArrowUpRight } from "lucide-react";
import type { SourceDoc } from "@/lib/dashboard-data";
import { DOC_TYPE_META } from "@/lib/doc-type-meta";

export function SourceCard({ doc }: { doc: SourceDoc }) {
  const meta = DOC_TYPE_META[doc.type];
  const Icon = meta.icon;

  return (
    <button className="group flex w-full flex-col gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-5 text-left transition-all duration-300 hover:border-white/20 hover:bg-white/[0.04]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className={`flex h-8 w-8 items-center justify-center rounded-lg border ${meta.className}`}>
            <Icon className="h-4 w-4" strokeWidth={1.75} />
          </span>
          <div>
            <div className="text-sm font-medium text-white">{doc.title}</div>
            <div className="text-xs text-muted-2">{doc.workspace} · {doc.updatedAt}</div>
          </div>
        </div>
        <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      </div>
      <p className="text-sm leading-relaxed text-muted">{doc.snippet}</p>
      <div className="text-xs text-muted-2">by {doc.author}</div>
    </button>
  );
}
