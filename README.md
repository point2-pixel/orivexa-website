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
