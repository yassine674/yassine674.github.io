"use client"

import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from "react"
import { useLang } from "./i18n"

// A window that grows out of the element you clicked (certificate, screenshot) and shrinks back into it.
// Images are shown whole; a PDF is shown in a frame, with a link to open it in a tab.

type Item = { src: string; title: string; sub?: string }
type State = { item: Item; from: DOMRect } | null

const Ctx = createContext<(item: Item, from: Element) => void>(() => {})
export const useLightbox = () => useContext(Ctx)

export function LightboxProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>(null)
  const open = useCallback((item: Item, from: Element) => setState({ item, from: from.getBoundingClientRect() }), [])
  return (
    <Ctx.Provider value={open}>
      {children}
      {state && <Lightbox key={state.item.src + state.from.x} state={state} onClosed={() => setState(null)} />}
    </Ctx.Provider>
  )
}

function Lightbox({ state, onClosed }: { state: NonNullable<State>; onClosed: () => void }) {
  const { lang } = useLang()
  const fig = useRef<HTMLElement>(null)
  const [phase, setPhase] = useState<"in" | "open" | "out">("in")
  const isPdf = /\.pdf($|\?)/i.test(state.item.src)

  // FLIP: start drawn over the clicked element, then grow to the centre
  const toOrigin = useCallback(() => {
    const el = fig.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const f = state.from
    const sx = f.width / r.width
    const sy = f.height / r.height
    el.style.transform = `translate(${f.left - r.left}px, ${f.top - r.top}px) scale(${sx}, ${sy})`
  }, [state.from])

  useLayoutEffect(() => {
    const el = fig.current
    if (!el) return
    el.style.transition = "none"
    toOrigin()
    el.getBoundingClientRect() // commit the start position
    el.style.transition = ""
    const id = requestAnimationFrame(() => {
      el.style.transform = ""
      setPhase("open")
    })
    return () => cancelAnimationFrame(id)
  }, [toOrigin])

  const close = useCallback(() => {
    setPhase("out")
    toOrigin()
    setTimeout(onClosed, 600)
  }, [onClosed, toOrigin])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close()
    window.addEventListener("keydown", onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = prev
    }
  }, [close])

  return (
    <div className="lbx" data-phase={phase} role="dialog" aria-modal="true" aria-label={state.item.title} onClick={close}>
      <figure ref={fig} className={`lbx__fig ${isPdf ? "lbx__fig--pdf" : ""}`} onClick={(e) => e.stopPropagation()}>
        {isPdf ? (
          <iframe src={state.item.src} title={state.item.title} />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element -- any size, shown whole
          <img src={state.item.src} alt={state.item.title} />
        )}
      </figure>
      <div className="lbx__bar hud" onClick={(e) => e.stopPropagation()}>
        <span>
          {state.item.title}
          {state.item.sub && <em> — {state.item.sub}</em>}
        </span>
        <a href={state.item.src} target="_blank" rel="noopener noreferrer">
          {lang === "fr" ? "Ouvrir" : "Open"}
        </a>
        <button type="button" onClick={close}>
          {lang === "fr" ? "Fermer" : "Close"} ✕
        </button>
      </div>
    </div>
  )
}
