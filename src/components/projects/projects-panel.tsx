"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { useLang } from "@/components/i18n"
import { useIntro } from "@/components/intro-context"
import BigTitle from "@/components/page/big-title"
import { NextPage } from "@/components/page/blocks"
import { PROJECTS, type Project } from "./projects-data"

// The opening and the slider follow the portfolio page of the reference site (site 1):
//   0 s     the big title builds itself: outline drawn, then hatched, then solid
//   1 s     HUD (counter, bottom-left stack) comes in
//   1.5 s   the cards open one after the other from the left (0.25 s apart, 1 s each) and slide over the title
//   2.5 s   the arrows open
// then the wheel, the arrows, the keyboard and a swipe move the strip one card at a time, in a loop.
const T_HUD = 1000
const T_CARDS = 1500
const CARD_STAGGER = 250
const CARD_GROW = 1000
const T_ARROWS = 2500
const SLIDE_MS = 1500
const GAP = 40

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2) // Power2.easeInOut
const backOut = (t: number, s = 1.7) => 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2) // Back.easeOut(1.7)
const mod = (a: number, n: number) => ((a % n) + n) % n

function Poster({ p, i, lang }: { p: Project; i: number; lang: "fr" | "en" }) {
  if (p.media) {
    return (
      <>
        {/\.(mp4|webm)$/.test(p.media) ? (
          <video className="pcard__pic" src={p.media} autoPlay muted loop playsInline />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element -- the card animates its own size, a plain img is simpler
          <img className="pcard__pic" src={p.media} alt="" />
        )}
        {/* the project's name in the middle of its picture */}
        <span className="pcard__over" aria-hidden>
          <span className="pcard__idx hud">
            {String(i + 1).padStart(2, "0")} / {p.kind[lang]}
          </span>
          <span className="pcard__name">{p.title[lang]}</span>
          <span className="pcard__more hud">{lang === "fr" ? "Voir le projet" : "See the project"}</span>
        </span>
      </>
    )
  }
  return (
    <div className="pcard__poster" aria-hidden>
      <span className="pcard__idx hud">{String(i + 1).padStart(2, "0")} / {p.kind[lang]}</span>
      <span className="pcard__name">{p.title[lang]}</span>
      <span className="pcard__tags">
        {p.tags.map((t) => (
          <i key={t}>{t}</i>
        ))}
      </span>
    </div>
  )
}

export default function ProjectsPanel() {
  const { revealed } = useIntro()
  const { lang, t } = useLang()
  const n = PROJECTS.length
  const [start, setStart] = useState<number | null>(null)
  const [phase, setPhase] = useState(0) // 0 nothing, 1 HUD, 2 arrows
  const [current, setCurrent] = useState(0)
  const strip = useRef<HTMLDivElement>(null)
  const slots = n + 4
  // which project each slot of the strip shows (changes when the strip loops)
  const [assign, setAssign] = useState<number[]>(() => Array.from({ length: slots }, (_, s) => s % n))
  const go = useRef<(dir: number) => void>(() => {})
  const swiped = useRef(false) // a swipe must not open the card it started on

  useEffect(() => {
    if (!revealed || start != null) return
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the clock starts once the preloader is gone
    setStart(performance.now())
  }, [revealed, start])

  useEffect(() => {
    if (start == null) return
    const a = setTimeout(() => setPhase(1), T_HUD)
    const b = setTimeout(() => setPhase(2), T_ARROWS)
    return () => {
      clearTimeout(a)
      clearTimeout(b)
    }
  }, [start])

  // The strip: card sizes and positions are written straight to the DOM every frame.
  useEffect(() => {
    const box = strip.current
    if (!box || start == null) return
    const cards = Array.from(box.querySelectorAll<HTMLElement>(".pcard"))
    const slots = cards.length // virtual slots, each shows PROJECTS[(index) mod n]
    let shownAssign = Array.from({ length: slots }, (_, s) => s % n).join()
    let W = 540
    let H = 340
    let onScreen = 3
    let left0 = 0 // where the first card starts
    let x = 0 // strip offset (px)
    let from = 0
    let to = 0
    let tweenAt = -1e9
    let index = 0
    let shown = false
    let raf = 0

    const resize = () => {
      const vw = window.innerWidth
      // phone: one big card with the next one peeking in; otherwise the reference's 540x340
      W = vw < 768 ? vw * 0.8 : Math.min(540, Math.max(300, vw * 0.375))
      left0 = vw < 768 ? 20 : 0
      // phone: a tall card that fills the screen instead of a small landscape strip
      H = vw < 768 ? Math.min(W * 1.2, window.innerHeight * 0.5) : (W * 340) / 540
      onScreen = Math.ceil(window.innerWidth / (W + GAP))
      box.style.setProperty("--cw", `${W}px`)
      box.style.setProperty("--ch", `${H}px`)
      x = to = from = -index * (W + GAP)
    }
    resize()

    go.current = (dir: number) => {
      if (!shown) return
      index += dir
      from = x
      to = -index * (W + GAP)
      tweenAt = performance.now()
      setCurrent(mod(index, n))
      wake()
    }
    // the loop only runs while something moves; a still strip costs nothing
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(frame)
    }

    const frame = (now: number) => {
      const since = now - start - T_CARDS
      if (!shown && since > CARD_STAGGER * onScreen + CARD_GROW) shown = true
      const k = clamp01((now - tweenAt) / SLIDE_MS)
      x = from + (to - from) * backOut(k)
      const step = W + GAP
      const first = Math.floor(-x / step) - 1 // leftmost visible slot
      let prevRight = 0
      const nextAssign: number[] = []
      for (let s = 0; s < slots; s++) {
        const el = cards[s]
        if (!shown) {
          // opening: cards 0..onScreen grow one after the other; each sits right after the previous one,
          // its gap growing with the previous card (like the reference's _alignItems)
          const g = easeInOut(clamp01((since - s * CARD_STAGGER) / CARD_GROW))
          const w = s <= onScreen ? W * g : 0
          const left = s === 0 ? left0 : prevRight
          el.style.width = `${w}px`
          el.style.transform = `translate3d(${left}px,0,0)`
          prevRight = left + w + Math.min(w / (0.1 * W), 1) * GAP
          continue
        }
        // looping strip: each slot keeps the same card while it is on screen (slot = card index mod slots),
        // so only the slot that wraps round, off screen, ever changes its content
        const v = first + mod(s - first, slots)
        el.style.width = `${W}px`
        el.style.transform = `translate3d(${left0 + v * step + x}px,0,0)`
        nextAssign.push(mod(v, n))
      }
      if (shown && nextAssign.join() !== shownAssign) {
        shownAssign = nextAssign.join()
        setAssign(nextAssign)
      }
      if (shown && k >= 1) {
        raf = 0 // settled: sleep until the next move
        return
      }
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    const onResize = () => {
      resize()
      wake()
    }
    window.addEventListener("resize", onResize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", onResize)
    }
  }, [start, n])

  // wheel (one card per gesture), keyboard, swipe
  useEffect(() => {
    let last = 0
    const onWheel = (e: WheelEvent) => {
      // a sideways swipe on a touchpad would otherwise make the browser go back to the previous page
      if (Math.abs(e.deltaX) > 0) e.preventDefault()
      const d = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX
      const now = performance.now()
      if (now - last > 220 && Math.abs(d) > 2) go.current(d > 0 ? 1 : -1)
      last = now
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") go.current(1)
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") go.current(-1)
    }
    let sx: number | null = null
    const onDown = (e: PointerEvent) => {
      swiped.current = false
      if (e.pointerType !== "mouse") sx = e.clientX
    }
    const onUp = (e: PointerEvent) => {
      if (sx == null) return
      const dx = e.clientX - sx
      if (Math.abs(dx) > 40) {
        swiped.current = true
        go.current(dx < 0 ? 1 : -1)
      }
      sx = null
    }
    window.addEventListener("wheel", onWheel, { passive: false })
    window.addEventListener("keydown", onKey)
    window.addEventListener("pointerdown", onDown)
    window.addEventListener("pointerup", onUp)
    return () => {
      window.removeEventListener("wheel", onWheel)
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("pointerdown", onDown)
      window.removeEventListener("pointerup", onUp)
    }
  }, [])

  // hover: the coloured light inside the card turns towards the cursor
  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const card = e.currentTarget
    const r = card.getBoundingClientRect()
    const a = (Math.atan2(e.clientY - r.top - r.height / 2, e.clientX - r.left - r.width / 2) * 180) / Math.PI + 180
    card.style.setProperty("--ga", `${a}deg`)
  }

  return (
    <section className="pp" data-phase={phase} aria-label={t.items[2]}>
      <div className="pp__vlines" aria-hidden>
        <i />
        <i />
      </div>

      <BigTitle text={t.items[2]} start={start} className="pp__heading" />

      <div ref={strip} className="pp__strip">
        {assign.map((pi, s) => {
          const p = PROJECTS[pi]
          return (
            <article key={s} className="pcard" onMouseMove={onMove}>
              <Link
                href={`/projets/${p.slug}`}
                className="pcard__preview"
                aria-label={p.title[lang]}
                draggable={false}
                onClick={(e) => swiped.current && e.preventDefault()}
              >
                <div className="pcard__light" />
                <Poster p={p} i={pi} lang={lang} />
              </Link>
              <p className="pcard__title hud">
                <span className="roll__inner">{p.title[lang]}</span>
              </p>
            </article>
          )
        })}
      </div>

      <div className="pp__arrows hud">
        <button type="button" className="pp__arrow pp__arrow--left" aria-label="←" onClick={() => go.current(-1)}>
          <span className="line" />
        </button>
        <span className="pp__count">
          {String(current + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
        </span>
        <button type="button" className="pp__arrow pp__arrow--right" aria-label="→" onClick={() => go.current(1)}>
          <span className="line" />
        </button>
      </div>

      <div className="pp__next">
        <NextPage compact />
      </div>

      <div className="pp__stack hud" aria-hidden>
        {t.stack.map((label) => (
          <p key={label}>{label}</p>
        ))}
      </div>
    </section>
  )
}
