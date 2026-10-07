# Imane MOUMOUN — Portfolio

Personal portfolio of Imane MOUMOUN, AI/ML engineering student at Mines Saint-Étienne → ENS Paris-Saclay.

**Live:** https://yassine674.github.io/imane-portfolio/

---

## Stack

- **Next.js 16** — App Router, static export (`output: "export"`)
- **TypeScript** — strict mode
- **Tailwind CSS v4** — utility classes + OKLCH design tokens
- **Framer Motion** — scroll-triggered animations
- **GSAP** — timeline scrub animations (Experience section)
- **Resend** — contact form email delivery

## Setup

```bash
npm install
npm run dev      # http://localhost:3000
```

For the contact form, create `.env.local`:
```
RESEND_API_KEY=re_your_key_here
CONTACT_EMAIL=your@email.com
```

## Build & Deploy

```bash
npm run build    # generates static site in /out
```

Deployed automatically to GitHub Pages on every push to `main`.

## Structure

```
src/
  app/           — layout, page entry, global CSS, favicon, API route
  components/    — layout/, sections/, ui/
  lib/           — asset helper, i18n context, translations (EN + FR)
public/
  about/         — hero collage images
  project/       — project card images
```

All page copy is in `src/lib/translations.ts` — edit there to update any text in either language.

> For Claude Code: see `CLAUDE.md` for full architecture, patterns, and task guides.
