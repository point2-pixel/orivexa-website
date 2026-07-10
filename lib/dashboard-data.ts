// Mock data powering the demo dashboard. No backend — everything here is
// static, illustrative content used to showcase the product experience.

export interface SourceDoc {
  id: string;
  title: string;
  type: "doc" | "meeting" | "code" | "design" | "decision";
  workspace: string;
  snippet: string;
  updatedAt: string;
  author: string;
}

export const SOURCE_DOCS: SourceDoc[] = [
  {
    id: "d1",
    title: "Q3 Infra Review — Decision doc",
    type: "decision",
    workspace: "Platform",
    snippet:
      "We recommend migrating off the legacy billing service by end of Q3 due to rising maintenance cost and scaling limits.",
    updatedAt: "2 weeks ago",
    author: "Elena Marsh",
  },
  {
    id: "d2",
    title: "Platform sync — Oct 14",
    type: "meeting",
    workspace: "Platform",
    snippet:
      "Team agreed to prioritize the billing-service migration ahead of the analytics revamp. Daniel to draft rollout plan.",
    updatedAt: "3 weeks ago",
    author: "Daniel Ochoa",
  },
  {
    id: "d3",
    title: "billing-service migration.md",
    type: "code",
    workspace: "Backend",
    snippet:
      "Migration runbook covering data backfill, dual-write strategy, and rollback plan for the new billing service.",
    updatedAt: "1 week ago",
    author: "Marcus Lin",
  },
  {
    id: "d4",
    title: "Billing API design spec",
    type: "design",
    workspace: "Backend",
    snippet:
      "Proposed REST + webhook interface for the new billing service, including idempotency keys and retry semantics.",
    updatedAt: "1 month ago",
    author: "Priya Nair",
  },
  {
    id: "d5",
    title: "Onboarding flow — user research notes",
    type: "doc",
    workspace: "Product",
    snippet:
      "5 of 6 interviewed users dropped off at the workspace-naming step. Recommend making it optional with a smart default.",
    updatedAt: "4 days ago",
    author: "Sofia Reyes",
  },
  {
    id: "d6",
    title: "Design sync — Nov 2",
    type: "meeting",
    workspace: "Product",
    snippet:
      "Reviewed updated onboarding flow. Consensus to skip workspace naming by default and let users rename later.",
    updatedAt: "6 days ago",
    author: "Tom Whitfield",
  },
  {
    id: "d7",
    title: "graph-indexer service",
    type: "code",
    workspace: "AI Platform",
    snippet:
      "Core service responsible for parsing ingested content into graph nodes and relationships in near real time.",
    updatedAt: "2 days ago",
    author: "Marcus Lin",
  },
  {
    id: "d8",
    title: "Security review — SOC 2 readiness",
    type: "decision",
    workspace: "Security",
    snippet:
      "All controls in place for Type II audit. Remaining gap: formalize incident response runbook by Nov 30.",
    updatedAt: "5 days ago",
    author: "Sofia Reyes",
  },
];

export interface ScriptedAnswer {
  keywords: string[];
  answer: string;
  sourceIds: string[];
}

export const SCRIPTED_ANSWERS: ScriptedAnswer[] = [
  {
    keywords: ["billing", "legacy", "migrat"],
    answer:
      "The team moved off the legacy billing service starting in Q3 because of rising maintenance cost and scaling limits. The decision was made in the Platform sync on Oct 14, and Marcus authored the migration runbook covering data backfill, dual-write, and rollback. The new API design adds idempotency keys and webhook retries that the old service lacked.",
    sourceIds: ["d1", "d2", "d3", "d4"],
  },
  {
    keywords: ["onboarding", "workspace", "naming", "drop"],
    answer:
      "User research found 5 of 6 interviewed users dropped off at the workspace-naming step during onboarding. In the Nov 2 design sync, the team agreed to make naming optional with a smart default, letting users rename their workspace later instead of blocking signup.",
    sourceIds: ["d5", "d6"],
  },
  {
    keywords: ["soc", "security", "compliance", "audit"],
    answer:
      "Security review confirms all controls are in place for the SOC 2 Type II audit. The one remaining gap is formalizing the incident response runbook, which Sofia's team is targeting to close by November 30.",
    sourceIds: ["d8"],
  },
  {
    keywords: ["graph", "indexer", "index", "node"],
    answer:
      "Content is parsed into graph nodes and relationships by the graph-indexer service, which runs near real time as new meetings, docs, and commits are ingested. This is the core system that keeps the knowledge graph continuously up to date.",
    sourceIds: ["d7"],
  },
];

export const EXAMPLE_QUERIES = [
  "Why did we move off the legacy billing service?",
  "What did we learn from onboarding user research?",
  "Are we ready for the SOC 2 audit?",
  "How does the graph stay up to date?",
];

export interface MeetingRecord {
  id: string;
  title: string;
  date: string;
  duration: string;
  attendees: string[];
  summary: string;
  actionItems: string[];
}

export const MEETINGS: MeetingRecord[] = [
  {
    id: "m1",
    title: "Platform sync",
    date: "Oct 14, 2026",
    duration: "32 min",
    attendees: ["Elena Marsh", "Daniel Ochoa", "Marcus Lin"],
    summary:
      "Team agreed to prioritize the billing-service migration ahead of the analytics revamp. Reviewed rollback risk and staffing.",
    actionItems: [
      "Daniel to draft rollout plan by Oct 21",
      "Marcus to spike on dual-write strategy",
    ],
  },
  {
    id: "m2",
    title: "Design sync",
    date: "Nov 2, 2026",
    duration: "28 min",
    attendees: ["Sofia Reyes", "Tom Whitfield", "Priya Nair"],
    summary:
      "Reviewed updated onboarding flow based on user research. Consensus to skip workspace naming by default.",
    actionItems: [
      "Priya to update onboarding Figma flow",
      "Tom to re-run usability test on new flow",
    ],
  },
  {
    id: "m3",
    title: "Security review",
    date: "Nov 5, 2026",
    duration: "45 min",
    attendees: ["Sofia Reyes", "Elena Marsh"],
    summary:
      "Walked through SOC 2 Type II control checklist. One open item: incident response runbook.",
    actionItems: ["Sofia to draft incident response runbook by Nov 30"],
  },
  {
    id: "m4",
    title: "AI Platform standup",
    date: "Nov 8, 2026",
    duration: "15 min",
    attendees: ["Marcus Lin", "Daniel Ochoa"],
    summary:
      "graph-indexer now processes new content in under 4 seconds on average, down from 40 seconds last sprint.",
    actionItems: ["Marcus to write up performance improvements for the blog"],
  },
];

export interface AgentActivity {
  id: string;
  agent: "Research Agent" | "Risk Agent" | "Ops Agent" | "Answer Agent";
  action: string;
  timestamp: string;
  status: "done" | "in-progress" | "flagged";
}

export const AGENT_ACTIVITY: AgentActivity[] = [
  { id: "a1", agent: "Research Agent", action: "Indexed 14 new documents from Google Drive", timestamp: "2 min ago", status: "done" },
  { id: "a2", agent: "Risk Agent", action: "Flagged conflicting decisions in billing-service migration.md and Q3 Infra Review", timestamp: "18 min ago", status: "flagged" },
  { id: "a3", agent: "Ops Agent", action: "Updated 3 Linear tickets after Platform sync meeting", timestamp: "1 hr ago", status: "done" },
  { id: "a4", agent: "Answer Agent", action: "Responded to a question in #platform-eng on Slack", timestamp: "2 hr ago", status: "done" },
  { id: "a5", agent: "Research Agent", action: "Linking new commits in graph-indexer to related design docs", timestamp: "Just now", status: "in-progress" },
  { id: "a6", agent: "Risk Agent", action: "Reviewing SOC 2 incident response runbook for completeness", timestamp: "5 hr ago", status: "in-progress" },
];

export const WORKSPACE_STATS = [
  { label: "Indexed documents", value: "18,204" },
  { label: "Graph nodes", value: "1.2M" },
  { label: "Connected sources", value: "9" },
  { label: "Active agents", value: "4" },
];
