"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { createGlitch } from "@/lib/glitch"
import { MENU_HREFS, useLang, type Lang } from "./i18n"
import { useIntro } from "./intro-context"
import RollLink from "./hero/roll-link"

const LANGS: Lang[] = ["fr", "en"]

// Label that rolls up on hover (same effect as RollLink, but a button).
function RollButton({ children, onClick, current }: { children: string; onClick?: () => void; current?: boolean }) {
  const inner = (
    <span className="roll__inner" data-label={children}>
      {children}
    </span>
  )
  return current ? (
    <span className="roll roll--current" aria-current="true">
      {inner}
    </span>
  ) : (
    <button type="button" className="roll" onClick={onClick} lang={children.toLowerCase()}>
      {inner}
    </button>
  )
}

export default function SiteChrome() {
  const { revealed } = useIntro()
  const { lang, setLang, t } = useLang()
  const [open, setOpen] = useState(false)
  const titleRef = useRef<HTMLDivElement>(null)
  const glitchRef = useRef<ReturnType<typeof createGlitch> | null>(null)

  useEffect(() => {
    const el = titleRef.current
    if (!el) return
    const g = createGlitch(el)
    glitchRef.current = g
    const onMove = (e: MouseEvent) => g.at(e.clientX)
    el.addEventListener("mousemove", onMove)
    return () => {
      el.removeEventListener("mousemove", onMove)
      g.destroy()
      glitchRef.current = null
    }
  }, [])

  // Like the reference site: closing the menu makes the hero title glitch a second later.
  const wasOpen = useRef(false)
  useEffect(() => {
    if (open) {
      wasOpen.current = true
      return
    }
    if (!wasOpen.current) return
    wasOpen.current = false
    const id = setTimeout(() => window.dispatchEvent(new Event("title-glitch")), 1000)
    return () => clearTimeout(id)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    // the big title re-materialises once the wipe has uncovered it
    const glitch = setTimeout(() => glitchRef.current?.all(), 1100)
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
      clearTimeout(glitch)
    }
  }, [open])

  // like the reference's "invertable" HUD: dark logo / menu while a white panel is under them
  const [invert, setInvert] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const check = () => {
      setScrolled(window.scrollY > 40)
      const y = 50
      const light = Array.from(document.querySelectorAll<HTMLElement>('.home-white, [data-theme="light"]')).some((el) => {
        const r = el.getBoundingClientRect()
        return r.top <= y && r.bottom >= y
      })
      setInvert(light)
    }
    // at most one check per frame, after the scroll has been applied (reading positions never forces an extra layout)
    let raf = 0
    const onScroll = () => {
      if (!raf)
        raf = requestAnimationFrame(() => {
          raf = 0
          check()
        })
    }
    check()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    const id = setInterval(check, 1000) // page changes without a scroll event
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      clearInterval(id)
      cancelAnimationFrame(raf)
    }
  }, [])

  const count = t.items.length

  return (
    <>
      <div className="menu" data-open={open} inert={!open}>
        <div className="menu__wrap">
          <div className="menu__inner">
            <div className="menu__vlines" aria-hidden>
              {[0, 1, 2, 3].map((i) => (
                <i key={i} style={{ left: i * 320 }} />
              ))}
            </div>
            <div ref={titleRef} className="menu__title" aria-hidden>
              <span className="menu__word">{t.menu}</span>
            </div>
            <ul className="menu__list">
              {t.items.map((label, i) => (
                <li key={label} className="menu__item">
                  <div className="menu__row" style={{ "--n": count - 1 - i } as React.CSSProperties}>
                    <span className="menu__num hud">{String(i).padStart(2, "0")}</span>
                    <span className="menu__rule" aria-hidden />
                    <Link href={MENU_HREFS[i]} className="menu__label" onClick={() => setOpen(false)}>
                      {label}
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
            <p className="menu__tagline" aria-hidden>
              {t.tagline.map((l) => (
                <span key={l}>{l}</span>
              ))}
              <span>/</span>
            </p>
            <div className="menu__social hud">
              <RollLink href="https://github.com/yassine674" external>
                GitHub
              </RollLink>
              <RollLink href="https://www.linkedin.com/in/yassine-moumoun" external>
                LinkedIn
              </RollLink>
            </div>
          </div>
        </div>
        <div className="menu__line" aria-hidden />
      </div>

      <div className="chrome" data-ready={revealed} data-open={open} data-invert={invert && !open} data-scrolled={scrolled && !open}>
        <Link href="/" className="chrome__logo" aria-label={t.home} onClick={() => setOpen(false)}>
          <span>Y</span>
          <i>/</i>
          <span>M</span>
        </Link>

        <span className="chrome__label hud" aria-hidden>
          <span className="mask">
            <span style={{ "--i": 0 } as React.CSSProperties}>{t.menu}</span>
          </span>
        </span>

        <button
          type="button"
          className="chrome__btn"
          aria-label={t.menu}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {[0, 1, 2].map((i) => (
            <span key={i} className="ln" style={{ "--i": i } as React.CSSProperties}>
              <i />
              <i />
            </span>
          ))}
        </button>

        <div className="chrome__langs hud">
          {LANGS.map((l, i) => (
            <p key={l} className="mask">
              <span style={{ "--i": i + 1 } as React.CSSProperties}>
                <RollButton current={l === lang} onClick={() => setLang(l)}>
                  {l.toUpperCase()}
                </RollButton>
              </span>
            </p>
          ))}
        </div>
      </div>
    </>
  )
}
