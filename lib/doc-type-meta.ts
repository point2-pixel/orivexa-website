import { FileText, Video, Code2, Palette, GitBranch, type LucideIcon } from "lucide-react";
import type { SourceDoc } from "@/lib/dashboard-data";

interface TypeMeta {
  icon: LucideIcon;
  label: string;
  className: string;
}

export const DOC_TYPE_META: Record<SourceDoc["type"], TypeMeta> = {
  doc: { icon: FileText, label: "Doc", className: "text-secondary bg-secondary/10 border-secondary/20" },
  meeting: { icon: Video, label: "Meeting", className: "text-accent bg-accent/10 border-accent/20" },
  code: { icon: Code2, label: "Code", className: "text-primary-light bg-primary/10 border-primary/20" },
  design: { icon: Palette, label: "Design", className: "text-pink-300 bg-pink-500/10 border-pink-500/20" },
  decision: { icon: GitBranch, label: "Decision", className: "text-amber-300 bg-amber-500/10 border-amber-500/20" },
};
