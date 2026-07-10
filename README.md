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

`/dashboard` is a fully static, frontend-only demo of the Orivexa product —
no backend, database, or auth. It's meant for showing investors and early
users what the workspace feels like, powered entirely by mock data in
`lib/dashboard-data.ts`.

- **`/dashboard`** — Semantic search. Type a question or click an example
  query; a few are scripted with realistic grounded answers and citations
  (`lib/dashboard-data.ts` → `SCRIPTED_ANSWERS`), everything else falls back
  to a generic response so the flow never breaks.
- **`/dashboard/graph`** — Interactive knowledge graph explorer with
  clickable nodes and a detail panel.
- **`/dashboard/documents`** — Filterable list of indexed sources.
- **`/dashboard/meetings`** — AI meeting notes with summaries and action
  items.
- **`/dashboard/agents`** — Agent roster and a live-looking activity feed.
- **`/dashboard/settings`** — Workspace and integration toggles (client
  state only, nothing persists).

All primary marketing-site CTAs ("Get started", "Try the live demo", pricing
buttons) link into `/dashboard`. When you're ready to make this real, swap
`lib/dashboard-data.ts` for actual API calls and wire up auth — the UI layer
won't need to change.

## Authentication & Backend (Supabase)

Sign up, sign in, and the dashboard are now backed by real auth via
[Supabase](https://supabase.com) (free tier is enough to start). Every new
signup automatically gets a **profile** and a **workspace** row via a
Postgres trigger — no manual setup per user.

### 1. Create a Supabase project
Go to [supabase.com](https://supabase.com) → New Project. Free tier is fine.

### 2. Run the schema
Open **SQL Editor → New query** in your Supabase project, paste the
contents of `supabase/schema.sql`, and run it. This creates the `profiles`
and `workspaces` tables, Row Level Security policies, and the
`handle_new_user` trigger that auto-provisions a workspace on signup.

### 3. Get your API keys
**Project Settings → API** → copy the **Project URL** and the **anon /
public** key (sometimes labeled "publishable").

### 4. Set environment variables
Copy `.env.local.example` to `.env.local` and fill in the two values:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

Add the same two variables in **Vercel → Project → Settings → Environment
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

The dashboard's actual content (search results, documents, meetings,
agents) is still mock data from `lib/dashboard-data.ts` — auth is real, the
product data isn't yet. Swap that file for real queries against your own
tables when you're ready.

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
