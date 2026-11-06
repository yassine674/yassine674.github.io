"use client"

import { useEffect, useRef } from "react"

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

// Giant page title that builds itself like the reference site's page headings:
// 0–450 ms the outline is drawn (with a few flickers), 300–1100 ms a hatching thickens until the letters are solid.
// `start` is the performance.now() time the build begins (null = hidden).
export default function BigTitle({ text, start, className }: { text: string; start: number | null; className?: string }) {
  const svg = useRef<SVGSVGElement>(null)
  useEffect(() => {
    const el = svg.current
    if (!el || start == null) return
    const txt = el.querySelector("text")!
    const bar = el.querySelector("pattern rect")!
    let raf = 0
    const tick = () => {
      const t = performance.now() - start
      // 0–450 ms: the outline is drawn, with a few flickers
      const draw = clamp01(t / 450)
      txt.style.strokeDashoffset = String(320 * (1 - draw))
      txt.style.opacity = t < 450 && Math.random() < 0.18 ? "0.25" : "1"
      // 300–1100 ms: the hatching thickens until the letters are solid
      const fill = clamp01((t - 300) / 800)
      bar.setAttribute("width", String(1 + 13 * fill * fill))
      txt.setAttribute("fill", fill >= 1 ? "#fff" : "url(#ph-hatch)")
      if (t < 1200) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [start])

  return (
    <div className={`bigtitle ${className ?? ""}`} data-on={start != null}>
      <h1 className="sr-only">{text}</h1>
      <svg ref={svg} viewBox="0 0 1200 200" aria-hidden>
        <defs>
          <pattern id="ph-hatch" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="1" height="14" fill="#fff" />
          </pattern>
        </defs>
        <text x="600" y="160" textAnchor="middle" style={{ fontSize: Math.min(190, 1180 / (text.length * 0.7)) }} fill="none" stroke="#fff" strokeWidth="1.5" strokeDasharray="320">
          {text}
        </text>
      </svg>
    </div>
  )
}

