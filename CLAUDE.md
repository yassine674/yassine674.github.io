# Imane MOUMOUN — Portfolio · Working Guide

**Live site:** https://yassine674.github.io/imane-portfolio/
**GitHub:** https://github.com/yassine674/imane-portfolio
**Owner:** Imane MOUMOUN — AI/ML engineer, Mines Saint-Étienne → ENS Paris-Saclay

---

## Quick start

```bash
npm run dev      # http://localhost:3000
npm run build    # static export to /out → deployed to GitHub Pages
```

Push to `main` → GitHub Actions auto-deploys via `.github/workflows/deploy.yml`.

---

## Tech stack (what each library actually does here)

| Library | Why it's here |
|---|---|
| **Next.js 16** | App Router, static export (`output: "export"`), font loading, metadata |
| **TypeScript** | Strict mode. All components use typed props interfaces |
| **Tailwind CSS v4** | Utility classes (`flex`, `fixed`, `z-[99999]`, etc). Inline `style={{}}` for dynamic values |
| **Framer Motion** | All enter/scroll-reveal animations (`motion.div`, `whileInView`, `AnimatePresence`) |
| **GSAP + ScrollTrigger** | The Experience section timeline scrub animation only |
| **Resend** | Contact form email sending. Needs `RESEND_API_KEY` in `.env.local` |
| **lucide-react** | A few icons in UI components |
| **simple-icons** | Tech stack brand icons in ScrollingFeatureShowcase |

---

## File map — what each file does

### App shell (`src/app/`)

```
layout.tsx          — Root layout. Loads 5 Google Fonts as CSS variables, wraps
                      everything in <LanguageProvider> for EN/FR. Edit metadata here
                      (title, description, OG tags).

page.tsx            — The single page. Mounts Preloader, Header, ScrollProgress,
                      then all sections. Below-fold sections use next/dynamic so
                      they don't inflate the initial JS bundle.

globals.css         — Design tokens as CSS custom properties on :root and .section-light.
                      Also contains keyframe animations and the CSS reset.

icon.svg            — Favicon. Uses CSS @media (prefers-color-scheme: dark) to be
                      black in light mode and white in dark mode.

api/send/route.ts   — Contact form POST handler. Reads RESEND_API_KEY + CONTACT_EMAIL
                      from env. Returns 503 if key not set.
```

### Layout components (`src/components/layout/`)

```
Header.tsx          — Sticky nav bar. Contains: logo/name, nav links, EN/FR toggle,
                      CTA button. Uses GSAP for the initial reveal animation.

Preloader.tsx       — Full-screen word-cycling intro. Cycles through greetings in 8
                      languages (800ms first word, 380ms each after). Slides off
                      screen when done. Word list is at top of file: const words = [...].

CurveDivider.tsx    — The SVG wave shape between sections. Used between dark↔light
                      sections. Props: from="dark" to="paper" accent="oklch(...)".

ScrollProgress.tsx  — Thin horizontal progress bar at top of page tied to scroll %.

MagneticButton.tsx  — Wrapper that makes children follow the cursor magnetically.
                      Used for the hero CTA buttons.
```

### Page sections (`src/components/sections/`)

```
Hero.tsx            — The big first section. Light beige grid background. Contains
                      many floating cards assembled from sub-components:
                      • Badge — top-left name tag with profile photo
                      • RippedPaper — torn paper card with coffee/plant/pencil
                      • Flower — interactive flower that glitches on hover
                      • Ticket — "Design × Technology" card
                      • CollageAndCat — photo collage with cat that appears on hover
                      • Vinyl — spinning vinyl record
                      • Folder — Mac folder that opens on hover, reveals icons
                      • AsciiCat — animated cat GIF in a terminal-style frame
                      • Terminal — the macOS-style terminal window ("whoami", "ls interests/")
                      • CenterName — the large "Imane." heading in the center
                      All cards are absolutely positioned and animated in with CSS.

About.tsx           — Light section (cream/paper tone). Two parts:
                      1. StickyNoteSection — yellow sticky note card + two bio sentences
                      2. The stats grid (GPA, internships, projects, languages)
                      Uses the same 56px grid as Hero with background-attachment:fixed
                      so the grid lines are seamless across sections.

Experience.tsx      — Dark section. Left: large "Career & training" heading with GSAP
                      clip reveal. Right: vertical timeline. Each entry is an EntryCard.
                      The timeline data comes from buildCarriereData() which reads from
                      translations. Tags array is hardcoded next to each entry (not in translations).

Contact.tsx         — Dark section. Has two states controlled by a button click:
                      • Default: heading + stats + social card grid (GitHub, LinkedIn, email)
                      • Open: an overlay with the email form
                      The form sends to /api/send. Cards include GitHub contribution graph.
```

### UI components (`src/components/ui/`)

```
ScrollingFeatureShowcase.tsx  — Projects section. Scroll-linked animation where
                                project cards pin and transition. Project data
                                (title, links, tech stack) is hardcoded here.
                                Descriptions come from t[lang].projects.descriptions[].

AliceScrollStory.tsx          — The "SELECTED WORKS" horizontal text reveal between
                                Experience and Projects. wordA, wordB, eyebrow come
                                from page.tsx via trP.aliceWord*.

ContactCards.tsx              — The social cards shown in the Contact section default view:
                                GitHub contribution graph, LinkedIn card, email copy button.
                                GitHub username is hardcoded: "imanemn127".

GoogleGeminiEffect.tsx        — Five animated SVG paths in the Contact section background.
                                Driven by Framer Motion pathLength values from Contact.tsx.

Timeline.tsx                  — Reusable vertical timeline with year labels on the left.
                                Used by Experience.tsx.

YanCursor.tsx                 — Custom dot cursor that follows mouse. Hidden on mobile.

LanguageSwitcher.tsx          — EN / FR toggle button in the Header.

Starfield.tsx                 — Animated particle field for dark sections (Experience, Contact).

PopoverForm.tsx               — Animated popover/modal wrapper used by the contact form.
```

### Library (`src/lib/`)

```
asset.ts            — The most important helper in the project. See section below.

i18n.tsx            — React context for language state (en/fr). Exports:
                      • LanguageProvider — wrap the app with this
                      • useLang() — returns { lang, toggle }
                      • t — re-exported from translations.ts

translations.ts     — Every string on the site in EN and FR. Single source of truth.
                      See the full key map below.
```

---

## The two rules that apply everywhere

### Rule 1: Always use `asset()` for images

Next.js basePath (`/imane-portfolio`) is NOT automatically prepended to plain `<img>` or `url()` in CSS. Only `next/image` and `next/link` handle it. Everything else breaks on GitHub Pages without the helper.

```tsx
import { asset } from "@/lib/asset"

// ✓ Correct
<img src={asset("/about/cat-dance.gif")} />
<div style={{ backgroundImage: `url(${asset("/about/bg.svg")})` }} />

// ✗ Breaks on GitHub Pages (works locally, fails in production)
<img src="/about/cat-dance.gif" />
```

### Rule 2: All text comes from `translations.ts`

No hardcoded strings in components. Both `en` and `fr` must have the key.

```tsx
import { useLang, t } from "@/lib/i18n"

const { lang } = useLang()
const tr = t[lang].contact      // pick the section
// then: tr.formTitle, tr.sendButton, tr.errorText, etc.
```

---

## Translations — complete key map

`src/lib/translations.ts` — `t.en` and `t.fr` have identical structure:

```
t[lang].nav          { about, experience, projects, skills, contact }
t[lang].hero         { subtitle, cta1, cta2 }
t[lang].about        { label, heading1, heading2, heading3, bio, facts[],
                       languagesLabel, tagline, stickyNote,
                       bio1pre, bio1into, bio1post, bio1badge,
                       bio2badge, bio2post }
t[lang].experience   { label, heading1, heading2, labelEdu, labelExp, incoming,
                       entries: { prep, mines2024, minesCurrent, pellenc, inria, ens }
                       each entry: { title, period, location, description } }
t[lang].projects     { label, heading1, heading2, githubHeading, githubSub,
                       viewProject, viewGithub, moreWork,
                       aliceWordA, aliceWordB, aliceEyebrow,
                       descriptions[] }   ← array, same index as project cards
t[lang].skills       { label, heading1, heading2 }
t[lang].contact      { available, heading1, heading2, cta, copied, copyEmail,
                       emailCopied, tagline,
                       formTitle, namePlaceholder, messagePlaceholder,
                       sendButton, successTitle, successDesc, errorText }
t[lang].footer       { copy }
```

---

## Design system

### Section backgrounds
- **Dark sections** (Hero bg, Experience, Contact): use CSS var `--bg` = `oklch(11% 0.018 28)` — warm near-black
- **Light sections** (Hero main area, About): use class `section-light` which overrides all tokens to a warm cream palette

### CSS custom properties (tokens)
Defined in `:root` and overridden in `.section-light` in `globals.css`:

| Token | Dark value | Light value |
|---|---|---|
| `--bg` | near-black `oklch(11%)` | warm cream `oklch(96%)` |
| `--text` | warm off-white `oklch(95%)` | espresso brown `oklch(38%)` |
| `--accent` | warm coral `oklch(73% 0.17 33)` | coral-rose `oklch(60% 0.17 28)` |
| `--font-display` | Bricolage Grotesque | same |
| `--font-serif` | Cormorant Garamond | same |
| `--font-mono` | Red Hat Mono | same |
| `--font-handwriting` | Caveat | same |
| `--font-script` | Dancing Script | same |

### Fonts (loaded in `layout.tsx`)
- **Bricolage Grotesque** → `--font-display`, `--font-body` — primary UI font
- **Cormorant Garamond** → `--font-serif` — decorative headings
- **Red Hat Mono** → `--font-mono` — code, labels, captions
- **Caveat** → `--font-handwriting` — the sticky note text in About
- **Dancing Script** → `--font-script` — rarely used decorative

---

## How to update content

### Change any text / bio / copy
Open `src/lib/translations.ts`, find the key, update both `en` and `fr` blocks.

### Update the sticky note (About section)
```
t.en.about.stickyNote = "..."
t.fr.about.stickyNote = "..."
```

### Update stats (GPA, internships, etc.)
```
t.en.about.facts = [
  { value: "3.93", label: "GPA", sub: "/ 4.10 · Mines Saint-Étienne" },
  ...
]
```

### Update terminal window output (Hero)
In `src/components/sections/Hero.tsx`, find:
```tsx
const TERMINAL_LINES = [
  { prompt: "$ whoami",       output: "AI & ML Engineer · ENS Paris-Saclay" },
  { prompt: "$ ls interests/", output: "AI/maths/chess/languages/travel" },
]
```

### Add a new experience entry
**Step 1** — add to both language blocks in `translations.ts`:
```ts
t.en.experience.entries.newJob = {
  title: "Role · Company",
  period: "Jan. – Jun. 2027",
  location: "Paris, France",
  description: "What was done.",
}
// same for t.fr
```

**Step 2** — add to the timeline in `Experience.tsx` inside `buildCarriereData()`:
```tsx
{
  title: "2027",
  content: (
    <EntryCard
      label={tr.labelExp}
      title={e.newJob.title}
      period={e.newJob.period}
      location={e.newJob.location}
      description={e.newJob.description}
      tags={["Python", "PyTorch"]}   // hardcoded tags here
    />
  ),
},
```
Also update the TypeScript interface `ExperienceTr.entries` to include the new key.

### Add a project card
**Step 1** — add description strings (order matters — index must match):
```ts
t.en.projects.descriptions.push("New project description...")
t.fr.projects.descriptions.push("Description du nouveau projet...")
```

**Step 2** — add card data in `ScrollingFeatureShowcase.tsx` (find the projects array):
```ts
{
  title: "Project Title",
  subtitle: "One-line hook",
  link: "https://github.com/...",
  image: asset("/project/06-newproject.jpg"),
  tech: ["Python", "PyTorch"],
}
```

**Step 3** — add image to `public/project/` (recommended: ~800×500 JPG).

### Change the profile photo
The portfolio uses the GitHub avatar `https://github.com/imanemn127.png`. To change:
- Replace `imanemn127` in `Hero.tsx` (the badge card, around line 72)
- Replace in `Contact.tsx` (appears 4 times — LinkedIn card, GitHub card, form header, form avatar)

### Change contact email destination
Update `.env.local`:
```
CONTACT_EMAIL=new@email.com
```

### Update preloader greetings
In `Preloader.tsx`, top of file:
```ts
const words = ["Hello", "Bonjour", "السلام عليكم", "Olà", "やあ", "Hallå", "Guten tag", "হ্যালো"]
```

---

## Animation reference

### Framer Motion patterns used
```tsx
// Scroll reveal (most common)
<motion.div
  initial={{ opacity: 0, y: 24 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
  viewport={{ once: true }}
/>

// AnimatePresence for mount/unmount (Contact form overlay)
<AnimatePresence mode="wait">
  {isOpen && <motion.div key="form" initial={...} animate={...} exit={...} />}
</AnimatePresence>
```

### GSAP (Experience section only)
GSAP runs inside `useEffect` with a `gsap.context()` cleanup. Pattern:
```ts
const ctx = gsap.context(() => {
  gsap.from(".target", {
    scrollTrigger: { trigger: ".target", start: "top 85%", once: true },
    yPercent: 108, duration: 1, ease: "power4.out",
  });
}, ref)
return () => ctx.revert()
```
Always check `prefers-reduced-motion` before running GSAP:
```ts
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
```

---

## Deployment pipeline

1. Push to `main`
2. GitHub Actions runs `.github/workflows/deploy.yml`
3. Runs `npm ci` + `npm run build` (static export → `/out`)
4. Uploads `/out` to GitHub Pages
5. Live in ~2 minutes

**basePath:** `/imane-portfolio` — set in `next.config.ts`. If the GitHub repo is renamed, update `basePath` in `next.config.ts` AND update GitHub Pages settings.

**Contact form caveat:** `/api/send` is a Next.js Route Handler. Static export (`output: "export"`) does not bundle API routes — the form POST will 404 on GitHub Pages. To make the form work in production, deploy the project to Vercel/Netlify instead, or replace with a third-party form service (Formspree, Web3Forms, etc.).

---

## Environment variables

File: `.env.local` (never commit — already in `.gitignore`)

```bash
RESEND_API_KEY=re_xxxx    # from resend.com → API Keys → Create API Key
CONTACT_EMAIL=you@email.com    # where contact messages are delivered
```

---

## Common bugs and fixes

### Encoding corruption (most common issue)
Characters like `·`, `–`, `É`, `✦` sometimes get double-encoded if text is pasted from Word, macOS Pages, or some editors. Symptoms: weird chars like `Â·`, `â€"`, `Ã‰`, `âœ¦` appear on the page.

**Fix with Python:**
```python
with open("src/components/sections/Experience.tsx", "rb") as f:
    content = f.read()
replacements = [
    (b"\xc3\x82\xc2\xb7", b"\xc2\xb7"),                          # Â·  → ·
    (b"\xc3\xa2\xe2\x82\xac\xe2\x80\x9c", b"\xe2\x80\x93"),      # â€" → –
    (b"\xc3\x83\xe2\x80\xb0", b"\xc3\x89"),                       # Ã‰  → É
    (b"\xc3\xa2\xc5\x93\xc2\xa6", b"\xe2\x9c\xa6"),               # âœ¦  → ✦
    (b"\xe2\x80\x98", b"'"), (b"\xe2\x80\x99", b"'"),             # curly quotes → straight
]
for bad, good in replacements:
    content = content.replace(bad, good)
with open("src/components/sections/Experience.tsx", "wb") as f:
    f.write(content)
```

Also: curly/smart quotes (`'` `'`) in TSX break JSX parsing with "Expected '</', got 'ident'" error. Always use straight `'`.

### "String to replace not found" in Edit tool
Usually means the file has tabs where you expected spaces, or smart quotes instead of straight quotes. Read the file first, copy the exact bytes, then edit.

### Images not loading on GitHub Pages
You forgot `asset()`. Wrap the path: `asset("/about/filename.png")`.

### Page resizes when preloader closes
Fixed: `scrollbar-gutter: stable` in `globals.css` reserves scrollbar gutter width. Safari uses overlay scrollbars so this isn't needed there. Chrome/Firefox on Windows: gutter is always reserved.

### Grid lines doubled at section boundary (Hero → About)
Fixed: both sections use `backgroundAttachment: "fixed"` so the 56px grid is pinned to the viewport coordinate system — they share one seamless grid instead of each having their own.

### Preloader exit shows curvy artifact
Fixed: SVG inside preloader is `calc(100vh + 300px)` tall. Slide distance must be `-(viewportHeight + 320px)` not just `-100vh`. Implemented in `Preloader.tsx` using the stored `dimension.height`.

---

## Performance notes

- **cat-dance.gif in Hero is 2.9MB** — it's above the fold so can't be lazy-loaded. Converting to WebM video would cut it ~90%.
- **Below-fold sections** are lazy-loaded with `next/dynamic` in `page.tsx` — keep this pattern for any new section.
- **Hover-only images** (`flower-hover.png`, `cat.png`, `ipad-notebook.svg`, etc.) have `loading="lazy"` to skip the eager preload.

---

## Config files (all required, all must stay at project root)

| File | What it does |
|---|---|
| `next.config.ts` | basePath `/imane-portfolio`, `output: "export"`, image config |
| `postcss.config.mjs` | Wires up Tailwind CSS v4 PostCSS plugin — without this, no Tailwind |
| `tsconfig.json` | TypeScript strict config + `@/*` → `src/*` path alias |
| `package.json` | Dependencies and `dev`/`build`/`start` scripts |
| `.github/workflows/deploy.yml` | CI/CD — build + GitHub Pages deploy on push to main |
| `.env.local` | Resend key + contact email. Never commit. Already gitignored |
