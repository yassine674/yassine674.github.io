"use client"

import Link from "next/link"
import { createContext, useContext, useEffect, useId, useLayoutEffect, useRef, useState } from "react"
import { useIntro } from "@/components/intro-context"

// Building blocks of the reference site's "inner sections" (site 1, common.js), with its timings:
//   show            → pre-title label rolls down (0.4 s), dots run left and draw the pre-title line (0.65 s)
//   0.25 s × line   → each title line rolls down from behind its mask (0.75 s)
//   0.55 s + 0.2 s × n → each text block drops 40 px and fades in (0.4 s)
// A section shows once, when its top is 150 px inside the screen.

const Shown = createContext(false)
export const useShown = () => useContext(Shown)

export function S1Section({
  children,
  className,
  theme = "dark",
  id,
  as: Tag = "section",
  label,
}: {
  children: React.ReactNode
  className?: string
  theme?: "light" | "dark"
  id?: string
  as?: "section" | "div" | "footer"
  label?: string
}) {
  const ref = useRef<HTMLElement>(null)
  const { revealed } = useIntro()
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || !revealed || shown) return
    const io = new IntersectionObserver(
      ([e]) => {
        // also show a section that is already above the screen (scrolled past before the preloader ended)
        if (e.isIntersecting || e.boundingClientRect.bottom < 0) {
          setShown(true)
          io.disconnect()
        }
      },
      { rootMargin: "0px 0px -150px 0px" },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [revealed, shown])
  return (
    <Tag
      ref={ref as React.RefObject<HTMLElement & HTMLDivElement>}
      id={id}
      className={`s1 ${className ?? ""}`}
      data-theme={theme}
      data-shown={shown}
      aria-label={label}
    >
      <Shown.Provider value={shown}>{children}</Shown.Provider>
    </Tag>
  )
}

/** Faint vertical lines of the reference (v-lines): 4 columns of 160 px each side of the 960 px wrap. */
export function VLines() {
  return <div className="s1-vlines" aria-hidden />
}

/** "—— LABEL" with the three dots that run along the line. */
export function PreTitle({ children, keepDots }: { children: string; keepDots?: boolean }) {
  return (
    <div className={`s1-pt ${keepDots ? "s1-pt--keep" : ""}`}>
      <i className="s1-pt__line" />
      <span className="s1-dots" aria-hidden>
        <i />
        <i />
        <i />
      </span>
      <p className="s1-pt__label hud">
        <span>{children}</span>
      </p>
    </div>
  )
}

/** Title cut into lines (js-line-wrap): every line rolls down from behind its own mask, 0.25 s apart. */
export function LineTitle({
  children,
  as: Tag = "h2",
  className,
  delay = 0,
}: {
  children: string
  as?: "h1" | "h2" | "h3" | "p"
  className?: string
  delay?: number
}) {
  const box = useRef<HTMLDivElement>(null)
  const measure = useRef<HTMLSpanElement>(null)
  const [lines, setLines] = useState<string[]>([children])

  useLayoutEffect(() => {
    const el = box.current
    const m = measure.current
    if (!el || !m) return
    const split = () => {
      const words = Array.from(m.children) as HTMLElement[]
      const out: string[] = []
      let top = -1
      for (const w of words) {
        if (w.offsetTop !== top) {
          out.push(w.textContent ?? "")
          top = w.offsetTop
        } else out[out.length - 1] += " " + w.textContent
      }
      setLines((prev) => (prev.join("\n") === out.join("\n") ? prev : out))
    }
    split()
    const ro = new ResizeObserver(split)
    ro.observe(el)
    return () => ro.disconnect()
  }, [children])

  return (
    <div ref={box} className={`s1-title ${className ?? ""}`}>
      <span ref={measure} className="s1-title__measure" aria-hidden>
        {children.split(" ").map((w, i) => (
          <span key={i}>{w} </span>
        ))}
      </span>
      <Tag aria-label={children}>
        {lines.map((l, t) => (
          <span key={t} className="rb" aria-hidden>
            <span className="rb__c" style={{ "--t": t, "--d0": `${delay}s` } as React.CSSProperties}>
              {l}
            </span>
          </span>
        ))}
      </Tag>
    </div>
  )
}

/** Text block: drops from -40 px and fades in, after the title. */
export function S1Text({
  children,
  n = 0,
  className,
  as: Tag = "p",
}: {
  children: React.ReactNode
  n?: number
  className?: string
  as?: "p" | "div"
}) {
  return (
    <Tag className={`s1-text ${className ?? ""}`} style={{ "--n": n } as React.CSSProperties}>
      {children}
    </Tag>
  )
}

/**
 * Giant faint word behind a title (the reference's SVG "glitch" title): when the section shows, it builds itself
 * out of horizontal slices that jump sideways and flicker, then settles. `again` re-glitches it later (seconds).
 */
export function GlitchWord({ text, again, className }: { text: string; again?: number; className?: string }) {
  const shown = useShown()
  const svg = useRef<SVGSVGElement>(null)
  const SLICES = 6
  useEffect(() => {
    const el = svg.current
    if (!el || !shown) return
    const parts = Array.from(el.querySelectorAll<SVGGElement>(".s1-glitch__s"))
    let raf = 0
    const timers: number[] = []
    const run = (ms: number, strength: number) => {
      cancelAnimationFrame(raf)
      const t0 = performance.now()
      let last = 0
      const tick = (now: number) => {
        const k = (now - t0) / ms
        if (k >= 1) {
          parts.forEach((p) => {
            p.style.transform = ""
            p.style.opacity = "1"
          })
          el.style.opacity = "1"
          return
        }
        if (now - last > 45) {
          last = now
          parts.forEach((p) => {
            const on = Math.random() > 0.35 * (1 - k)
            p.style.opacity = on ? "1" : "0"
            p.style.transform = `translateX(${(Math.random() - 0.5) * 160 * strength * (1 - k)}px)`
          })
          el.style.opacity = "1"
        }
        raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }
    timers.push(window.setTimeout(() => run(900, 1), 150))
    if (again != null) timers.push(window.setTimeout(() => run(450, 0.5), again * 1000))
    return () => {
      cancelAnimationFrame(raf)
      timers.forEach(clearTimeout)
    }
  }, [shown, again])

  const id = "g" + useId().replace(/[^a-zA-Z0-9]/g, "")
  return (
    <svg ref={svg} className={`s1-glitch ${className ?? ""}`} viewBox="0 0 1000 170" preserveAspectRatio="xMinYMid meet" aria-hidden>
      <defs>
        {Array.from({ length: SLICES }, (_, i) => (
          <clipPath key={i} id={`${id}-${i}`}>
            <rect x="-200" width="1400" y={(170 / SLICES) * i} height={170 / SLICES + 0.5} />
          </clipPath>
        ))}
      </defs>
      {Array.from({ length: SLICES }, (_, i) => (
        <g key={i} className="s1-glitch__s" clipPath={`url(#${id}-${i})`}>
          <text x="0" y="140" textLength={Math.min(1000, text.length * 120)} lengthAdjust="spacingAndGlyphs">
            {text}
          </text>
        </g>
      ))}
    </svg>
  )
}

/**
 * The reference's "business tasks" columns: once the pre-title is drawn, its three dots fall down to the column row,
 * then a dash slides out of them to each column, and each column fades in from the left when its dash lands.
 * Must be placed right after a <PreTitle keepDots /> in the same section.
 */
export function Columns({
  items,
  onDone,
}: {
  items: { num: string; title?: string; text: string; href?: string; tags?: string; media?: string }[]
  onDone?: () => void
}) {
  const ul = useRef<HTMLUListElement>(null)
  const shown = useShown()

  // distances measured from the layout: how far the dots fall, how far each dash travels
  useLayoutEffect(() => {
    const list = ul.current
    if (!list) return
    const section = list.closest(".s1") as HTMLElement | null
    const pt = section?.querySelector<HTMLElement>(".s1-pt")
    const dots = section?.querySelector<HTMLElement>(".s1-dots")
    if (!section || !pt || !dots) return
    const place = () => {
      const p = pt.getBoundingClientRect()
      const dashes = Array.from(list.querySelectorAll<HTMLElement>(".s1-col__dash"))
      if (!dashes.length) return
      const d0 = dashes[0].getBoundingClientRect()
      dots.style.setProperty("--fall", `${d0.top + 0.5 - (p.top + p.height / 2)}px`)
      dashes.forEach((d) => {
        const li = d.closest("li") as HTMLElement
        d.style.setProperty("--sx", `${-80 - li.offsetLeft}px`)
      })
    }
    place()
    const ro = new ResizeObserver(place)
    ro.observe(list)
    return () => ro.disconnect()
  }, [items.length])

  useEffect(() => {
    if (!shown || !onDone) return
    const last = items.length - 1
    const id = setTimeout(onDone, (1.65 + 0.15 * last + 0.75 + 0.25 * last) * 1000)
    return () => clearTimeout(id)
  }, [shown, onDone, items.length])

  return (
    <ul ref={ul} className="s1-cols">
      {items.map((it, i) => {
        const inner = (
          <>
            {it.media && (
              <span className="s1-col__pic">
                {/* eslint-disable-next-line @next/next/no-img-element -- revealed and zoomed by CSS */}
                <img src={it.media} alt="" loading="lazy" />
                {it.title && <span className="s1-col__over">{it.title}</span>}
              </span>
            )}
            <span className="s1-col__num hud">{it.num}</span>
            <i className="s1-col__dash" />
            {it.title && <span className="s1-col__title">{it.title}</span>}
            <span className="s1-col__text">{it.text}</span>
            {it.tags && <span className="s1-col__tags hud">{it.tags}</span>}
          </>
        )
        return (
          <li key={i} className="s1-col" style={{ "--i": i % 3, "--row": Math.floor(i / 3) } as React.CSSProperties}>
            {it.href ? (
              <Link href={it.href} className="s1-col__in s1-col__link">
                {inner}
              </Link>
            ) : (
              <div className="s1-col__in">{inner}</div>
            )}
          </li>
        )
      })}
    </ul>
  )
}

/** Number that counts up when its section shows. */
export function Count({ value, delay = 0 }: { value: number; delay?: number }) {
  const shown = useShown()
  const el = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const node = el.current
    if (!node || !shown) return
    let raf = 0
    const t0 = performance.now() + delay * 1000
    const tick = (now: number) => {
      const k = Math.max(0, Math.min(1, (now - t0) / 1400))
      node.textContent = String(Math.round(value * (1 - Math.pow(1 - k, 3))))
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [shown, value, delay])
  return (
    <span ref={el} className="s1-count">
      0
    </span>
  )
}

/** Big underlined button of the reference ("SEND A REQUEST"): the line runs out and back in on hover. */
export function ActionBtn({ href, children, external }: { href: string; children: string; external?: boolean }) {
  const inner = (
    <>
      <span className="roll s1-act__label">
        <span className="roll__inner" data-label={children}>
          {children}
        </span>
      </span>
      <i className="s1-act__line" />
    </>
  )
  return external ? (
    <a href={href} className="s1-act hud" target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
      {inner}
    </a>
  ) : (
    <Link href={href} className="s1-act hud">
      {inner}
    </Link>
  )
}
