"use client";

import { motion } from "framer-motion";
import {
  MessageSquare,
  FileText,
  Github,
  HardDrive,
  Figma,
  GitBranch,
  Video,
  BookOpen,
  Trello,
  Building2,
  GitCommitHorizontal,
  Users2,
  type LucideIcon,
} from "lucide-react";
import { INTEGRATIONS } from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StaggerGroup, StaggerItem } from "@/components/ui/ScrollReveal";

const ICON_MAP: Record<string, LucideIcon> = {
  Slack: MessageSquare,
  Notion: FileText,
  GitHub: Github,
  "Google Drive": HardDrive,
  Figma: Figma,
  Linear: GitBranch,
  Zoom: Video,
  Confluence: BookOpen,
  Jira: Trello,
  Salesforce: Building2,
  GitLab: GitCommitHorizontal,
  "Microsoft Teams": Users2,
};

export function Integrations() {
  return (
    <section id="integrations" className="section-padding relative">
      <Container>
        <SectionHeading
          eyebrow="Integrations"
          title="Plugs into the tools you already trust"
          description="Orivexa connects in minutes and starts building the graph from your existing workflow—no migrations required."
        />

        <StaggerGroup className="mx-auto mt-16 grid max-w-4xl grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
          {INTEGRATIONS.map((name) => {
            const Icon = ICON_MAP[name] ?? FileText;
            return (
              <StaggerItem key={name}>
                <motion.div
                  whileHover={{ y: -4, scale: 1.03 }}
                  transition={{ duration: 0.25 }}
                  className="group flex flex-col items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.02] px-4 py-6 text-center transition-colors duration-300 hover:border-accent/30 hover:bg-white/[0.04]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.04] ring-1 ring-white/10 transition-colors group-hover:ring-accent/30">
                    <Icon className="h-5 w-5 text-white/70 transition-colors group-hover:text-accent" strokeWidth={1.6} />
                  </div>
                  <span className="text-xs text-muted">{name}</span>
                </motion.div>
              </StaggerItem>
            );
          })}
        </StaggerGroup>

        <p className="mt-10 text-center text-sm text-muted-2">
          Plus a growing library of API and webhook connections for anything custom.
        </p>
      </Container>
    </section>
  );
}
