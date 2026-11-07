"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { MENU_HREFS, useLang } from "@/components/i18n"
import BigTitle from "./big-title"
import { LineTitle, S1Section, useVisAttr } from "@/components/s1/s1"
import { useIntro } from "@/components/intro-context"
import RollLink from "@/components/hero/roll-link"
import { GITHUB, LINKEDIN, PAGES } from "./content"

export const usePage = () => {
  const { lang, t } = useLang()
  return { lang, t, p: PAGES[lang] }
}

/** performance.now() when the page may start its opening (preloader gone), null before. */
export function usePageStart() {
  const { revealed } = useIntro()
  const [start, setStart] = useState<number | null>(null)
  useEffect(() => {
    if (!revealed || start != null) return
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the clock starts once the preloader is gone
    setStart(performance.now())
  }, [revealed, start])
  return start
}

/**
 * Frame of an inner page (structure of the reference site's inner pages): faint column lines, the fixed
 * bottom-left stack, and the scroll reveal — every `.rv` element gets data-in="true" when it enters the screen.
 */
export function PageShell({ children, started, className }: { children: React.ReactNode; started: boolean; className?: string }) {
  const root = useRef<HTMLDivElement>(null)
  const { p } = usePage()
  useEffect(() => {
    const el = root.current
    if (!el || !started) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            ;(e.target as HTMLElement).dataset.in = "true"
            io.unobserve(e.target)
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    )
    el.querySelectorAll(".rv").forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [started])

  return (
    <div ref={root} className={`pg ${className ?? ""}`} data-started={started}>
      <div className="pg__cols" aria-hidden />
      {children}
      <div className="pg__stack hud" aria-hidden>
        {p.common.stack.map((s) => (
          <p key={s}>{s}</p>
        ))}
      </div>
    </div>
  )
}

/** "—— LABEL" line + label, as above every block of the reference. */
export function Label({ children, delay = 0 }: { children: string; delay?: number }) {
  return (
    <p className="lbl hud rv" style={{ "--d": `${delay}s` } as React.CSSProperties}>
      <i />
      <span>{children}</span>
    </p>
  )
}

/** Block that slides up from behind its own edge when it scrolls into view. */
export function Rise({
  children,
  as: Tag = "div",
  className,
  delay = 0,
}: {
  children: React.ReactNode
  as?: "div" | "h1" | "h2" | "h3" | "p"
  className?: string
  delay?: number
}) {
  return (
    <Tag className={`rise rv ${className ?? ""}`} style={{ "--d": `${delay}s` } as React.CSSProperties}>
      <span className="rise__in">{children}</span>
    </Tag>
  )
}

/** Giant faint word behind a heading. */
export function Ghost({ children }: { children: string }) {
  return (
    <span className="ghost rv" aria-hidden>
      {children}
    </span>
  )
}

/** Number that counts up the first time it is seen. */
export function Counter({ value }: { value: number }) {
  const el = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const node = el.current
    if (!node) return
    let raf = 0
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const t0 = performance.now()
      const tick = (now: number) => {
        const k = Math.min(1, (now - t0) / 1400)
        node.textContent = String(Math.round(value * (1 - Math.pow(1 - k, 3))))
        if (k < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    })
    io.observe(node)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [value])
  return (
    <span ref={el} className="counter">
      0
    </span>
  )
}

/** Underlined text button (the reference's "LET'S DISCUSS" / "SEND A REQUEST"). */
export function LineLink({ href, children, external }: { href: string; children: string; external?: boolean }) {
  const inner = (
    <span className="roll__inner" data-label={children}>
      {children}
    </span>
  )
  return external ? (
    <a href={href} className="linelink hud roll" target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
      {inner}
    </a>
  ) : (
    <Link href={href} className="linelink hud roll">
      {inner}
    </Link>
  )
}

/**
 * Bottom of every menu page: a big band that leads to the next page of the menu (Accueil → À propos → Projets →
 * Compétences → Parcours → Contact → Accueil). The arrow runs out and back in on hover, the band fills with green.
 */
export function NextPage({ compact }: { compact?: boolean }) {
  const { t, lang } = useLang()
  // the GitHub Pages copy uses "/projets/" style addresses: compare without the final slash
  const path = usePathname().replace(/(.)\/$/, "$1")
  const i = MENU_HREFS.indexOf(path)
  const n = (i + 1) % MENU_HREFS.length
  const label = lang === "fr" ? "Page suivante" : "Next page"
  if (compact) {
    return (
      <Link href={MENU_HREFS[n]} className="nextp-mini hud" aria-label={`${label} : ${t.items[n]}`}>
        <span>{t.items[n]}</span>
        <Arrow />
      </Link>
    )
  }
  return (
    <S1Section className="nextp" label={label}>
      <Link href={MENU_HREFS[n]} className="nextp__link">
        <span className="nextp__top hud">
          <span>{label}</span>
          {/* the home page has no number: no "00 / 05" */}
          {n > 0 && (
            <span>
              {String(n).padStart(2, "0")} / {String(MENU_HREFS.length - 1).padStart(2, "0")}
            </span>
          )}
        </span>
        <span className="nextp__row">
          <LineTitle as="p" className="nextp__title">
            {t.items[n]}
          </LineTitle>
          <Arrow />
        </span>
      </Link>
    </S1Section>
  )
}

/** End of every inner page: the way to the next page, then the social links. */
export function PageFooter() {
  const { p } = usePage()
  return (
    <footer className="pfoot">
      <NextPage />
      <nav className="pfoot__social hud" aria-label={p.common.socials}>
        <RollLink href={GITHUB} external>
          GitHub
        </RollLink>
        <RollLink href={LINKEDIN} external>
          LinkedIn
        </RollLink>
        <RollLink href="/contact">{p.common.contactMe}</RollLink>
      </nav>
    </footer>
  )
}

/** Arrow: the shaft and the head are one block, so the head always sits exactly at the end of the shaft. */
export function Arrow() {
  return (
    <span className="arw" aria-hidden>
      <i className="arw__shaft" />
      <svg className="arw__head" viewBox="0 0 14 24">
        <path d="M1 1 L13 12 L1 23" />
      </svg>
    </span>
  )
}

/**
 * Opening of every menu page (full screen): the picture opens from the middle and slowly zooms, a HUD frame draws
 * its corners, a green scan line sweeps down, the big title builds itself (outline → hatching → solid) and the
 * lead sentence rolls in under it.
 */
export function PageHero({ num, title, lead, media, start }: { num: string; title: string; lead: string; media: string; start: number | null }) {
  const on = start != null
  const ref = useRef<HTMLElement>(null)
  useVisAttr(ref)
  return (
    <header ref={ref} className="phero" data-on={on}>
      <div className="phero__pic" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element -- full-screen background, animated by CSS */}
        <img src={media} alt="" />
      </div>
      <i className="phero__scan" aria-hidden />
      <span className="phero__frame" aria-hidden>
        <i />
        <i />
        <i />
        <i />
      </span>
      <p className="phero__num hud">
        <span>{num} / 05</span>
      </p>
      <div className="phero__mid">
        <BigTitle text={title} start={start} className="phero__title" />
        <S1Section className="phero__lead">
          <LineTitle as="p" delay={1.6}>
            {lead}
          </LineTitle>
        </S1Section>
      </div>
      <a href="#contenu" className="phero__down hud" aria-label="↓">
        <span>{num === "05" ? "↓" : "scroll"}</span>
        <i />
      </a>
    </header>
  )
}

/** Giant outlined words that slide sideways forever (two copies, so the loop never shows a gap). */
export function Marquee({ words }: { words: string[] }) {
  const line = words.join("  ·  ") + "  ·  "
  const ref = useRef<HTMLDivElement>(null)
  useVisAttr(ref)
  return (
    <div ref={ref} className="mq" aria-hidden>
      <div className="mq__track">
        <span>{line}</span>
        <span>{line}</span>
      </div>
    </div>
  )
}

/** Full-width picture that opens when it scrolls in and moves slower than the page (parallax). */
export function ImageBand({ src, caption }: { src: string; caption?: string }) {
  const img = useRef<HTMLImageElement>(null)
  useEffect(() => {
    const el = img.current
    if (!el) return
    let raf = 0
    const on = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const r = el.parentElement!.getBoundingClientRect()
        const k = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight
        el.style.transform = `translate3d(0, ${k * -14}%, 0) scale(1.25)`
      })
    }
    on()
    window.addEventListener("scroll", on, { passive: true })
    return () => {
      window.removeEventListener("scroll", on)
      cancelAnimationFrame(raf)
    }
  }, [])
  return (
    <S1Section className="iband">
      <div className="iband__pic">
        {/* eslint-disable-next-line @next/next/no-img-element -- parallax picture */}
        <img ref={img} src={src} alt="" />
      </div>
      {caption && <p className="iband__cap hud">{caption}</p>}
    </S1Section>
  )
}

const COLLAB = {
  fr: {
    title: "Travaillons ensemble",
    text: "Je crois que la sécurité se construit en équipe : à plusieurs, on détecte mieux et on répond plus vite. Si vous cherchez un stagiaire SOC curieux et motivé, parlons-en.",
    see: "Voir",
  },
  en: {
    title: "Let's work together",
    text: "I believe security is built as a team: together we detect better and respond faster. If you're looking for a curious, motivated SOC intern, let's talk.",
    see: "See",
  },
}

/**
 * "Let's work together": a full-screen photo of a team, darkened, with a huge title, a sentence and one link
 * (end of the home page and the contact page).
 */
export function Collab({ href, label }: { href: string; label: { fr: string; en: string } }) {
  const { lang } = useLang()
  const c = COLLAB[lang]
  return (
    <S1Section className="collab" theme="dark">
      <div className="collab__pic" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element -- full-screen background, animated by CSS */}
        <img src="/img/glass-facade.webp" alt="" loading="lazy" />
      </div>
      <div className="collab__in">
        <div className="collab__head">
          <LineTitle as="h2" className="collab__title">
            {c.title}
          </LineTitle>
          <svg className="collab__icon" viewBox="0 0 24 24" aria-hidden>
            <path d="M5 19 L19 5 M8 5 H19 V16" />
          </svg>
        </div>
        <p className="collab__text">{c.text}</p>
        <p className="collab__see">
          {c.see}{" "}
          <Link href={href} className="collab__link">
            {label[lang]}
          </Link>
        </p>
      </div>
    </S1Section>
  )
}
