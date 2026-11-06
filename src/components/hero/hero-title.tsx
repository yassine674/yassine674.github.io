"use client"

import { useEffect, useRef } from "react"
import { createGlitch } from "@/lib/glitch"

// Choreography taken from the opening of the reference site (30fps, played at 0.75x):
//   0.00-0.44s  a short line drops from the screen centre, stretching, then shrinks to a dot
//   0.44-0.93s  it becomes a hairline that grows to the left
//   0.71-1.11s  a tick rises from it
//   1.11-1.56s  the tick widens into a bar (to the right)
//   0.00-2.00s  letters of the middle row flicker in, in random order
//   1.33-2.00s  the top row slides up out of the bar line
// then the reference's block glitch (src/lib/glitch.ts) plays once, again every 10-25s, and on hover.
// One unit `u` = 1/100 of the font size, matching the reference's 600x300 composition.

const TOP = "Yassine"
const MID = "Moumoun"
const EASE = "cubic-bezier(0.333, 0, 0.667, 1)"

// Letters appear in a scattered but deterministic order (SSR-safe).
const letterDelay = (i: number) => (((i * 5) % 7) / 7) * 1.5 + 0.1

export default function HeroTitle({ revealed, caption }: { revealed: boolean; caption: string }) {
  const rootRef = useRef<HTMLDivElement>(null)

  // Place the title on the left.
  useEffect(() => {
    const root = rootRef.current
    const main = root?.parentElement
    if (!root || !main) return
    const place = () => {
      const hx = window.innerWidth < 1000 ? 24 : Math.max(24, Math.min(window.innerWidth * 0.09, 150))
      if (window.innerWidth < 1000) main.style.removeProperty("--hx")
      else main.style.setProperty("--hx", `${hx}px`)
    }
    place()
    window.addEventListener("resize", place)
    document.fonts?.ready.then(place)
    return () => window.removeEventListener("resize", place)
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root || !revealed) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const q = <T extends HTMLElement>(sel: string) => root.querySelector<T>(sel)!
    const row = q(".ht__row--mid")
    const u = row.offsetHeight / 104
    const drop = q(".ht__drop")
    const hline = q(".ht__hline")
    const bar = q(".ht__bar")
    const slide = q(".ht__slide")
    const anims: Animation[] = []
    const run = (el: HTMLElement, keyframes: Keyframe[], options: KeyframeAnimationOptions) =>
      anims.push(el.animate(keyframes, { fill: "both", ...options }))

    run(
      drop,
      [
        { opacity: 1, transform: "translateY(0) scaleY(1)", easing: EASE },
        { opacity: 1, transform: `translateY(${55 * u}px) scaleY(5)`, offset: 0.5, easing: EASE },
        { opacity: 1, transform: `translateY(${110 * u}px) scaleY(0.2)`, offset: 0.97 },
        { opacity: 0, transform: `translateY(${110 * u}px) scaleY(0.2)` },
      ],
      { duration: 440 },
    )
    run(
      hline,
      [
        // starts as a 10-unit dash under the drop line, then grows to 90 while sliding 81 units left
        { opacity: 1, transform: `translateX(${81 * u}px) scaleX(0.111)` },
        { opacity: 1, transform: "translateX(0) scaleX(1)" },
      ],
      { duration: 490, delay: 440, easing: EASE },
    )
    run(
      bar,
      [
        { opacity: 1, transform: `translateY(${110 * u}px) scale(0.014, 0.3)`, easing: "cubic-bezier(0.187, 0, 0.573, 1)" },
        { opacity: 1, transform: "translateY(0) scale(0.014, 1)", offset: 0.47, easing: "cubic-bezier(0.338, 0, 0.704, 1)" },
        { opacity: 1, transform: "translateY(0) scale(1, 1)" },
      ],
      { duration: 850, delay: 710 },
    )
    run(
      slide,
      [{ transform: "translateY(105%)" }, { transform: "translateY(0)" }],
      { duration: 670, delay: 1330, easing: EASE },
    )

    // Glitch: once the title is built, then every 10-25s, and on hover.
    const glitch = createGlitch(root)
    let timer: ReturnType<typeof setTimeout>
    const loop = () => {
      glitch.all()
      timer = setTimeout(loop, 10000 + Math.random() * 15000)
    }
    const onMove = (e: MouseEvent) => glitch.at(e.clientX)
    const onTitleGlitch = () => glitch.all()
    root.addEventListener("mousemove", onMove)
    window.addEventListener("title-glitch", onTitleGlitch)
    const first = setTimeout(loop, 2100)

    return () => {
      anims.forEach((a) => a.cancel())
      root.removeEventListener("mousemove", onMove)
      window.removeEventListener("title-glitch", onTitleGlitch)
      clearTimeout(first)
      clearTimeout(timer)
      glitch.destroy()
    }
  }, [revealed])

  return (
    <div ref={rootRef} className="ht" data-ready={revealed}>
      <h1 className="ht__title" aria-label="Yassine Moumoun">
        <span className="ht__row ht__row--top" aria-hidden>
          <span className="ht__slide">{TOP}</span>
        </span>
        <span className="ht__midwrap">
          <span className="ht__row ht__row--mid" aria-hidden>
            {[...MID].map((ch, i) => (
              <span key={i} className="ht__letter" style={{ "--d": `${letterDelay(i)}s` } as React.CSSProperties}>
                {ch}
              </span>
            ))}
          </span>
          <i className="ht__bar" />
          <i className="ht__drop" />
          <i className="ht__hline" />
          <span className="ht__caption hud">
            <span className="mask">
              <span>{caption}</span>
            </span>
          </span>
        </span>
      </h1>
    </div>
  )
}
