export const SITE_CONFIG = {
  name: "Orivexa AI",
  tagline: "Turn Company Knowledge Into Intelligence",
  description:
    "Orivexa AI is an AI workspace that doesn't just answer questions—it builds an evolving knowledge graph of your company. Every meeting, document, design, line of code, and decision becomes connected, searchable, and actionable.",
  url: "https://orivexia.space",
  ogImage: "/og-image.png",
  contactEmail: "hello@orivexia.space",
};

export const NAV_LINKS = [
  { label: "Product", href: "#features" },
  { label: "Knowledge Graph", href: "#knowledge-graph" },
  { label: "Agents", href: "#agents" },
  { label: "Security", href: "#security" },
  { label: "Pricing", href: "#pricing" },
];

export const TRUSTED_COMPANIES = [
  "Nexora",
  "Vantix",
  "Fluxpoint",
  "Corelume",
  "Havenly",
  "Quantera",
  "Brightfield",
  "Meridian Labs",
];

export const FEATURES = [
  {
    icon: "Network",
    title: "AI Knowledge Graph",
    description:
      "Every meeting, doc, and decision is mapped into a living graph that shows how your company's knowledge actually connects.",
  },
  {
    icon: "Search",
    title: "Semantic Search",
    description:
      "Search by meaning, not keywords. Find the right answer even when you don't know the exact words to look for.",
  },
  {
    icon: "Mic",
    title: "AI Meeting Notes",
    description:
      "Every call is transcribed, summarized, and linked to the projects and people it affects—automatically.",
  },
  {
    icon: "FileStack",
    title: "Document Intelligence",
    description:
      "Orivexa reads your docs, specs, and PDFs, extracting entities and relationships so nothing gets buried again.",
  },
  {
    icon: "Code2",
    title: "Code Understanding",
    description:
      "Connect your repositories and let Orivexa map functions, owners, and dependencies into the same graph as your docs.",
  },
  {
    icon: "GitBranch",
    title: "Decision Tracking",
    description:
      "Trace any decision back to the discussion, data, and people behind it—no more archaeology in old threads.",
  },
  {
    icon: "ShieldCheck",
    title: "Enterprise Security",
    description:
      "SOC 2 Type II, SSO, granular permissions, and full audit logs. Your knowledge stays exactly as private as you need.",
  },
  {
    icon: "Bot",
    title: "AI Agents",
    description:
      "Deploy autonomous agents that monitor the graph, surface risks, and complete tasks across your tools.",
  },
  {
    icon: "Users",
    title: "Team Collaboration",
    description:
      "Shared workspaces, comments, and mentions keep every team building on the same source of truth.",
  },
  {
    icon: "BarChart3",
    title: "Analytics",
    description:
      "Understand how knowledge flows through your org—what's used, what's stale, and where the gaps are.",
  },
];

export const AI_AGENTS = [
  {
    icon: "Radar",
    name: "Research Agent",
    description: "Continuously scans new documents and meetings, connecting them to relevant projects in real time.",
  },
  {
    icon: "AlertTriangle",
    name: "Risk Agent",
    description: "Flags conflicting decisions, stale documentation, and unresolved blockers before they become problems.",
  },
  {
    icon: "Workflow",
    name: "Ops Agent",
    description: "Executes multi-step tasks across your stack—updating tickets, notifying owners, drafting summaries.",
  },
  {
    icon: "MessagesSquare",
    name: "Answer Agent",
    description: "Responds to teammates in Slack or email with grounded answers sourced directly from your graph.",
  },
];

export const INTEGRATIONS = [
  "Slack",
  "Notion",
  "GitHub",
  "Google Drive",
  "Figma",
  "Linear",
  "Zoom",
  "Confluence",
  "Jira",
  "Salesforce",
  "GitLab",
  "Microsoft Teams",
];

export const SECURITY_FEATURES = [
  {
    icon: "ShieldCheck",
    title: "SOC 2 Type II",
    description: "Independently audited controls covering security, availability, and confidentiality.",
  },
  {
    icon: "KeyRound",
    title: "SSO & SCIM",
    description: "SAML-based single sign-on with automated provisioning for every identity provider you use.",
  },
  {
    icon: "Lock",
    title: "Encryption Everywhere",
    description: "AES-256 at rest and TLS 1.3 in transit, with customer-managed keys available on Enterprise.",
  },
  {
    icon: "ScrollText",
    title: "Full Audit Logs",
    description: "Every query, export, and permission change is logged and retained for compliance review.",
  },
  {
    icon: "UserCog",
    title: "Granular Permissions",
    description: "Control access down to the document, project, or graph node—no all-or-nothing sharing.",
  },
  {
    icon: "Server",
    title: "Data Residency",
    description: "Choose where your data lives with regional hosting options across US, EU, and APAC.",
  },
];

export const PRICING_PLANS = [
  {
    name: "Starter",
    price: "$0",
    period: "forever",
    description: "For small teams getting their first knowledge graph off the ground.",
    features: [
      "Up to 10 team members",
      "5,000 indexed documents",
      "Semantic search",
      "3 integrations",
      "Community support",
    ],
    cta: "Start for free",
    highlighted: false,
  },
  {
    name: "Growth",
    price: "$49",
    period: "per seat / month",
    description: "For growing teams that need the full graph, agents, and unlimited history.",
    features: [
      "Unlimited team members",
      "Unlimited indexed documents",
      "AI Meeting Notes & Decision Tracking",
      "Unlimited integrations",
      "4 AI Agents included",
      "Priority support",
    ],
    cta: "Start free trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "billed annually",
    description: "For organizations with advanced security, compliance, and scale requirements.",
    features: [
      "Everything in Growth",
      "SSO, SCIM & custom roles",
      "Dedicated data residency",
      "Custom AI agent workflows",
      "99.9% uptime SLA",
      "Dedicated success manager",
    ],
    cta: "Contact sales",
    highlighted: false,
  },
];

export const TESTIMONIALS = [
  {
    quote:
      "Orivexa replaced four different tools we used to search for answers. Now every new hire is productive in days, not months.",
    name: "Elena Marsh",
    role: "VP Engineering, Nexora",
  },
  {
    quote:
      "We finally have a single place where decisions, code, and docs connect. The graph view alone changed how our team plans.",
    name: "Daniel Ochoa",
    role: "Head of Product, Vantix",
  },
  {
    quote:
      "The AI agents catch conflicting decisions before they ship. It feels like having a research team that never sleeps.",
    name: "Priya Nair",
    role: "COO, Fluxpoint",
  },
  {
    quote:
      "Meeting notes used to disappear into Slack. Now they're linked to the exact project and decision they belong to.",
    name: "Marcus Lin",
    role: "CTO, Corelume",
  },
  {
    quote:
      "Rolling out Orivexa across the org took a week. Security review was the fastest we've had for any AI tool.",
    name: "Sofia Reyes",
    role: "CISO, Havenly",
  },
  {
    quote:
      "Semantic search sounds like a small feature until you use it. We stopped losing knowledge to bad keyword guesses.",
    name: "Tom Whitfield",
    role: "Director of Ops, Quantera",
  },
];

export const FAQS = [
  {
    question: "What exactly does Orivexa build from our company data?",
    answer:
      "Orivexa connects to your tools—documents, meetings, code, and chats—and builds an evolving knowledge graph that maps how people, decisions, and work relate to one another. Instead of isolated search results, you get connected context.",
  },
  {
    question: "How long does it take to set up?",
    answer:
      "Most teams connect their first three integrations and see an initial graph within an hour. Full indexing of historical content typically completes within 24-48 hours depending on volume.",
  },
  {
    question: "Is our data used to train external models?",
    answer:
      "No. Your data is never used to train models outside your workspace. Orivexa is built on strict data isolation, and Enterprise customers can opt into dedicated infrastructure.",
  },
  {
    question: "Can we control who sees what inside the graph?",
    answer:
      "Yes. Permissions can be set at the workspace, project, or individual document level, and the graph respects your existing access controls from connected tools.",
  },
  {
    question: "What integrations are supported?",
    answer:
      "Orivexa connects with Slack, Notion, GitHub, Google Drive, Figma, Linear, Zoom, Confluence, Jira, Salesforce, GitLab, Microsoft Teams, and more, with new integrations shipping regularly.",
  },
  {
    question: "Do the AI agents take actions automatically?",
    answer:
      "Agents can be configured to only surface recommendations, or to take approved actions like updating tickets and notifying owners. You choose the level of autonomy per agent.",
  },
  {
    question: "Is Orivexa SOC 2 compliant?",
    answer:
      "Yes, Orivexa is SOC 2 Type II certified, and Enterprise plans support additional compliance requirements including custom data residency and audit retention.",
  },
];

export const FOOTER_LINKS = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Knowledge Graph", href: "#knowledge-graph" },
    { label: "AI Agents", href: "#agents" },
    { label: "Integrations", href: "#integrations" },
    { label: "Pricing", href: "#pricing" },
  ],
  Company: [{ label: "Contact us", href: "mailto:hello@orivexia.space" }],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Security", href: "#security" },
    { label: "Cookie Policy", href: "/privacy#cookies" },
  ],
};
