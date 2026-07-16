# Orivexa AI — Marketing Website

Turn company knowledge into intelligence. A production-ready, dark-mode-only
marketing site for **Orivexa AI**, built with Next.js 15, React 19,
TypeScript, Tailwind CSS, and Framer Motion.

## Tech Stack

- **Next.js 15** (App Router, React Server Components)
- **React 19**
- **TypeScript** (strict mode)
- **Tailwind CSS** with a custom design token system
- **Framer Motion** for scroll reveals, stagger animations, and micro-interactions
- **Lucide React** for icons
- Zero client-side dependencies beyond the above — no UI kit lock-in

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command         | Description                       |
| ---------------- | ---------------------------------- |
| `npm run dev`     | Start the local dev server         |
| `npm run build`   | Production build                   |
| `npm run start`   | Serve the production build         |
| `npm run lint`    | Run ESLint                         |

## Project Structure

```
app/
  layout.tsx          Root layout, fonts, SEO metadata, JSON-LD
  page.tsx             Homepage — composes all sections
  globals.css          Design tokens, base styles, glass/gradient utilities
  sitemap.ts            Dynamic sitemap.xml
  robots.ts             Dynamic robots.txt
  manifest.ts           Web app manifest
  not-found.tsx          Branded 404 page
  loading.tsx             Route loading state

components/
  layout/               Navbar, Footer
  sections/              One component per homepage section (Hero, Features,
                          PlatformShowcase, KnowledgeGraph, AIAgents,
                          Integrations, Security, Pricing, Testimonials,
                          FAQ, CTA, TrustedBy)
  ui/                     Reusable primitives — Button, GlassCard, Container,
                          SectionHeading, ScrollReveal/Stagger, GradientOrb,
                          GridBackground, Badge, KnowledgeGraphVisual
                          (the animated signature graph illustration)

hooks/
  useMousePosition.ts     Normalized mouse position for parallax
  useScrollLock.ts        Locks body scroll (mobile menu)
  useActiveSection.ts     Scroll-spy for nav highlighting

lib/
  utils.ts                cn() className merger
  constants.ts             All site copy & content (single source of truth)

public/
  favicon.svg, og-image.png
```

## Design System

Colors, spacing, and animation timings are defined once in
`tailwind.config.ts` and `app/globals.css`, then consumed through Tailwind
utility classes — no inline magic numbers scattered across components.

- **Background:** `#030712`
- **Primary:** `#7C3AED`
- **Secondary:** `#2563EB`
- **Accent:** `#22D3EE`
- **Text:** `#FFFFFF`
- **Type:** Inter (UI/display) + JetBrains Mono (labels, eyebrows, data)

Dark mode is the only mode — the `dark` class is applied at the root and
there is no light theme to maintain.

## Product Demo Dashboard

`/dashboard` is Orivexa's product workspace, gated behind real auth.

- **`/dashboard`** — Ask Orivexa. Real semantic Q&A over documents you've
  uploaded, answered by Claude (see "Real AI Search" below).
- **`/dashboard/documents`** — Upload real documents (.txt, .md, .csv,
  .pdf) and manage them. This is real, not a demo.
- **`/dashboard/graph`** — Interactive knowledge graph explorer with
  clickable nodes and a detail panel. *(Still illustrative — not yet wired
  to real documents.)*
- **`/dashboard/meetings`** — AI meeting notes with summaries and action
  items. *(Still mock data — see `lib/dashboard-data.ts`.)*
- **`/dashboard/agents`** — Agent roster and a live-looking activity feed.
  *(Still mock data.)*
- **`/dashboard/settings`** — Workspace and integration toggles. *(Client
  state only, nothing persists yet.)*

All primary marketing-site CTAs ("Get started", "Try the live demo", pricing
buttons) link into `/signup`.

## Real AI Search (Claude + your documents)

The Search page and Documents page are backed by a real pipeline: upload a
file, Orivexa extracts its text, and Claude answers questions grounded only
in what you've uploaded — with sources cited.

### 1. Get an Anthropic API key
Go to [console.anthropic.com](https://console.anthropic.com) → **API Keys**
→ create a key. Add a payment method (usage-based billing; a few dollars
covers plenty of testing).

### 2. Set the environment variable
Add to `.env.local` (and to Vercel → Settings → Environment Variables):

```
ANTHROPIC_API_KEY=your-anthropic-api-key
```

**Never** prefix this with `NEXT_PUBLIC_` — it must stay server-only, or
your key would be exposed in the browser.

### 3. Make sure the `documents` table and Storage bucket exist
These are included in `supabase/schema.sql` (see the Supabase setup section
above) — if you ran that file already, you're done. If you ran it before
this feature was added, re-run it; every statement is safe to re-run.

### How it works
- `components/dashboard/DocumentUpload.tsx` — drag-and-drop uploader.
- `app/api/documents/upload/route.ts` — receives the file, extracts text
  (`lib/extract-text.ts`, using `pdf-parse` for PDFs and `mammoth` for
  `.docx`), stores the original
  file in Supabase Storage, and saves the extracted text in the
  `documents` table.
- `app/api/documents/list/route.ts` / `app/api/documents/[id]/route.ts` —
  list and delete a user's documents.
- `app/api/chat/route.ts` — takes a question, pulls the signed-in user's
  documents, and asks Claude (`lib/anthropic.ts`) to answer using only
  that content, citing which document(s) it used.
- `components/dashboard/SearchInterface.tsx` — calls `/api/chat` and
  renders the answer with source chips.

### Current limits (good to know)
- Each document is capped at ~120k characters and the combined context
  sent to Claude per question is capped at ~150k characters — plenty for
  early use, but once a workspace has many large documents you'll want to
  add retrieval (embeddings + a vector index) instead of sending every
  document on every question. `Voyage AI` pairs well with Claude for this
  and is a natural next step — see the project roadmap.
- Supported file types: `.txt`, `.md`, `.csv`, `.pdf`, `.docx`. Max upload size: 15 MB.

## Authentication & Backend (Supabase)

Sign up, sign in, and the dashboard are now backed by real auth via
[Supabase](https://supabase.com) (free tier is enough to start). Every new
signup automatically gets a **profile** and a **workspace** row via a
Postgres trigger — no manual setup per user.

### 1. Create a Supabase project
Go to [supabase.com](https://supabase.com) → New Project. Free tier is fine.

### 2. Run the schema
Open **SQL Editor → New query** in your Supabase project, paste the
contents of `supabase/schema.sql`, and run it. This creates the `profiles`,
`workspaces`, and `documents` tables, the `documents` Storage bucket, Row
Level Security policies, and the `handle_new_user` trigger that
auto-provisions a workspace on signup.

### 3. Get your API keys
**Project Settings → API** → copy the **Project URL** and the **anon /
public** key (sometimes labeled "publishable").

### 4. Set environment variables
Copy `.env.local.example` to `.env.local` and fill in the values:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
ANTHROPIC_API_KEY=your-anthropic-api-key
```

Add the same variables in **Vercel → Project → Settings → Environment
Variables** for production, then redeploy.

### 5. (Optional) Disable email confirmation for faster testing
By default Supabase requires users to click a confirmation link before they
can sign in. To skip this during development: **Authentication → Providers
→ Email → toggle off "Confirm email"**. Turn it back on before launch.

### How it fits together
- `middleware.ts` + `lib/supabase/middleware.ts` — refreshes the session on
  every request and redirects signed-out users away from `/dashboard`, and
  signed-in users away from `/login` / `/signup`.
- `lib/supabase/client.ts` — Supabase client for Client Components.
- `lib/supabase/server.ts` — Supabase client for Server Components/Actions.
- `lib/auth.ts` — `getCurrentUser()`, used by `app/dashboard/layout.tsx` to
  load the signed-in user's name, email, and workspace.
- `components/auth/` — `AuthShell`, `LoginForm`, `SignupForm`,
  `SignOutButton`.
- `app/auth/confirm/route.ts` — handles the email confirmation link.

The Knowledge Graph, Meetings, and Agents pages are still mock data from
`lib/dashboard-data.ts` — Search and Documents are real. Swap the rest for
real queries against your own tables as you build out the roadmap.

## Content

All copy lives in `lib/constants.ts`. Update company name, features,
pricing, testimonials, FAQs, and footer links there without touching any
component markup.

## Accessibility

- Visible focus rings on all interactive elements
- Semantic landmarks (`header`, `main`, `nav`, `footer`)
- `prefers-reduced-motion` respected globally
- Sufficient color contrast against the `#030712` background
- Accordion and mobile menu expose `aria-expanded`

## Performance & SEO

- Static generation for the homepage — no client data fetching on load
- `next/font` for self-hosted, zero-layout-shift fonts
- Dynamic `sitemap.xml`, `robots.txt`, and `manifest.json`
- Open Graph + Twitter Card metadata with a generated social image
- JSON-LD structured data (`SoftwareApplication`) in the root layout

## Deployment

This project deploys to Vercel with zero configuration:

```bash
vercel deploy
```

Or connect the repository in the Vercel dashboard and it will detect the
Next.js framework automatically. No environment variables are required for
the marketing site itself.

## License

Proprietary — © Orivexa AI. All rights reserved.
