"use client"

import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"
import { useLang } from "@/components/i18n"
import RollLink from "@/components/hero/roll-link"
import { GITHUB, LINKEDIN } from "@/components/page/content"
import { PROJECTS } from "@/components/projects/projects-data"
import { ActionBtn, Columns, Count, GlitchWord, LineTitle, PreTitle, S1Section, S1Text, VLines } from "@/components/s1/s1"
import { HOME } from "./home-content"
import BrandLogo, { hasLogo } from "@/components/brand-logo"
import CertCards from "@/components/cert-cards"

// Everything below the hero, in the order of the reference site's home page:
// white panel (business → awards → fans of web) rising over the hero, the dark two-halves screen,
// the white clients grid, then the dark contacts screen and its footer.

export default function HomeSections() {
  const { lang, t } = useLang()
  const h = HOME[lang]
  return (
    <div className="home-panel" id="suite">
      <Features h={h} />
      <div className="home-white" id="suite-white">
        <VLines />
        <Business h={h} />
        <Projects h={h} lang={lang} />
        <Certs h={h} />
        <Awards h={h} />
        <Fans h={h} />
      </div>

      <TwoWays h={h} />

      <S1Section theme="light" className="s1-clients">
        <VLines />
        <div className="s1-wrap">
          <PreTitle>{h.tools.label}</PreTitle>
          <ul className="s1-grid">
            {h.tools.items.map((name, i) => (
              <li key={name} className="s1-grid__i" style={{ "--i": i } as React.CSSProperties}>
                <span className="s1-grid__ico" data-logo={hasLogo(name)}>
                  <BrandLogo name={name} />
                  <span>{name}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </S1Section>

      <S1Section theme="light" className="s1-path">
        <VLines />
        <div className="s1-wrap">
          <PreTitle keepDots>{h.path.label}</PreTitle>
          <LineTitle className="s1-h">{h.path.title}</LineTitle>
          <Columns items={h.path.cols} />
          <div className="s1-more">
            <RollLink href="/parcours">{h.path.more}</RollLink>
          </div>
        </div>
      </S1Section>

      <S1Section theme="dark" className="s1-contacts" label={t.items[5]}>
        <VLines />
        <div className="s1-wrap">
          <PreTitle>{h.contact.label}</PreTitle>
          <LineTitle className="s1-h">{h.contact.title}</LineTitle>
          <div className="s1-contacts__btns">
            <ActionBtn href={h.contact.cols[0].href} external>
              {h.contact.write}
            </ActionBtn>
            <ActionBtn href="/parcours">{h.contact.cv}</ActionBtn>
          </div>
          <ul className="s1-contacts__cols">
            {h.contact.cols.map((c, i) => (
              <li key={c.label}>
                <S1Text n={i + 1} as="div">
                  <span className="hud">{c.label}</span>
                  <a className="s1-contacts__val" href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                    {c.value}
                  </a>
                  <span className="s1-contacts__sub">{c.sub}</span>
                </S1Text>
              </li>
            ))}
          </ul>
        </div>
        <nav className="s1-foot hud" aria-label="footer">
          <RollLink href={GITHUB} external>
            GitHub
          </RollLink>
          <RollLink href={LINKEDIN} external>
            LinkedIn
          </RollLink>
          <RollLink href="/projets">{t.items[2]}</RollLink>
        </nav>
      </S1Section>
    </div>
  )
}

type H = (typeof HOME)["fr"]

function Business({ h }: { h: H }) {
  const [again, setAgain] = useState<number | undefined>(undefined)
  const done = useCallback(() => setAgain(0), [])
  return (
    <S1Section theme="light" className="s1-business">
      <div className="s1-wrap">
        <PreTitle keepDots>{h.skills.label}</PreTitle>
        <div className="s1-head">
          <GlitchWord text={h.skills.ghost} again={again} />
          <LineTitle className="s1-h">{h.skills.title}</LineTitle>
        </div>
        <Columns items={h.skills.cols} onDone={done} />
        <div className="s1-more">
          <RollLink href="/competences">{h.skills.more}</RollLink>
        </div>
      </div>
    </S1Section>
  )
}

function Projects({ h, lang }: { h: H; lang: "fr" | "en" }) {
  return (
    <S1Section theme="light" className="s1-projects">
      <div className="s1-wrap">
        <PreTitle keepDots>{h.projects.label}</PreTitle>
        <div className="s1-head">
          <GlitchWord text={h.projects.ghost} />
          <LineTitle className="s1-h">{h.projects.title}</LineTitle>
        </div>
        <Columns
          items={PROJECTS.map((p, i) => ({
            num: String(i + 1).padStart(2, "0"),
            title: p.title[lang],
            text: p.kind[lang],
            tags: p.tags.slice(0, 3).join(" · "),
            href: `/projets/${p.slug}`,
            media: p.media,
          }))}
        />
        <div className="s1-more">
          <RollLink href="/projets">{h.projects.more}</RollLink>
        </div>
      </div>
    </S1Section>
  )
}

function Certs({ h }: { h: H }) {
  return (
    <S1Section theme="light" className="s1-certs">
      <div className="s1-wrap">
        <PreTitle>{h.certs.label}</PreTitle>
        <LineTitle className="s1-h s1-h--wide">{h.certs.title}</LineTitle>
        <CertCards />
      </div>
    </S1Section>
  )
}

function Awards({ h }: { h: H }) {
  return (
    <S1Section theme="light" className="s1-awards">
      <div className="s1-wrap">
        <PreTitle>{h.awards.label}</PreTitle>
        <ul className="s1-awards__list">
          {h.awards.items.map((a, i) => (
            <li key={a.ico} className="s1-awards__i" style={{ "--i": i } as React.CSSProperties}>
              <div className="s1-awards__ico">
                <span className="hud" data-logo={a.logos.length > 0}>
                  {a.logos.length > 0 ? (
                    <span className="s1-awards__logos">
                      {a.logos.map((l) => (
                        <BrandLogo key={l} name={l} />
                      ))}
                    </span>
                  ) : (
                    a.ico
                  )}
                </span>
              </div>
              <div className="s1-awards__desc">
                <Count value={a.value} delay={0.4 + i * 0.1} />
                {a.lines.map((l) => (
                  <span key={l} className="hud">
                    {l}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </S1Section>
  )
}

function Fans({ h }: { h: H }) {
  return (
    <S1Section theme="light" className="s1-fans">
      <div className="s1-wrap">
        <PreTitle>{h.fans.label}</PreTitle>
        <div className="s1-head">
          <GlitchWord text={h.fans.ghost} />
          <LineTitle className="s1-h s1-h--wide">{h.fans.title}</LineTitle>
        </div>
        <S1Text className="s1-fans__text">
          {h.fans.text} <b className="s1-fans__perfect">{h.fans.perfect}</b>.
        </S1Text>
      </div>
    </S1Section>
  )
}

/** The reference's dark "two ways" screen: two halves, the one under the cursor opens wider. */
function TwoWays({ h }: { h: H }) {
  return (
    <S1Section theme="dark" className="s1-ways">
      {h.ways.map((w, i) => (
        <Link key={w.href} href={w.href} className={`s1-ways__half s1-ways__half--${i ? "right" : "left"}`}>
          <span className="s1-ways__bg" aria-hidden>
            {w.media ? (
              // eslint-disable-next-line @next/next/no-img-element -- full-bleed cover image, sized by CSS
              <img src={w.media} alt="" />
            ) : (
              <span className="s1-ways__grid" />
            )}
          </span>
          <span className="s1-ways__in">
            <span className="hud s1-ways__label">{w.label}</span>
            <span className="s1-ways__title">{w.title}</span>
            <span className="s1-ways__btn hud">
              <i />
              {w.btn}
            </span>
          </span>
        </Link>
      ))}
    </S1Section>
  )
}

/**
 * The reference's second screen ("features"): three statements, one per scroll step, each with its picture.
 * The screen stays pinned while you scroll through it; the pagination on the right fills as you go.
 */
function Features({ h }: { h: H }) {
  const box = useRef<HTMLElement>(null)
  const [idx, setIdx] = useState(-1)
  const bar = useRef<HTMLElement>(null)
  const n = h.features.slides.length
  useEffect(() => {
    const el = box.current
    if (!el) return
    const update = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const span = r.height - window.innerHeight
      const k = Math.min(1, Math.max(0, -r.top / span))
      if (bar.current) bar.current.style.transform = `scaleY(${k})`
      // the first statement comes in as soon as the screen covers most of the hero
      setIdx(r.top > window.innerHeight * 0.45 ? -1 : Math.min(n - 1, Math.floor(k * n)))
    }
    let raf = 0
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", on, { passive: true })
    window.addEventListener("resize", on)
    return () => {
      window.removeEventListener("scroll", on)
      window.removeEventListener("resize", on)
      cancelAnimationFrame(raf)
    }
  }, [n])

  return (
    <section ref={box} className="s1-feat" style={{ height: `${n * 100}svh` }} aria-label={h.skills.label}>
      <div className="s1-feat__stage">
        <VLines />
        {h.features.slides.map((sl, i) => (
          <figure key={sl.media} className="s1-feat__pic" data-on={i === idx} data-past={i < idx}>
            {/* eslint-disable-next-line @next/next/no-img-element -- full-bleed picture, animated by CSS */}
            <img src={sl.media} alt="" />
          </figure>
        ))}
        <div className="s1-wrap s1-feat__wrap">
          {h.features.slides.map((sl, i) => (
            <div key={i} className="s1-feat__slide" data-shown={i === idx} aria-hidden={i !== idx}>
              <span className="hud s1-feat__num">
                <span>{String(i + 1).padStart(2, "0")}</span>
              </span>
              <LineTitle className="s1-h s1-feat__title">{sl.title}</LineTitle>
            </div>
          ))}
        </div>
        <div className="s1-feat__pager hud" aria-hidden>
          {h.features.slides.map((_, i) => (
            <span key={i} data-on={i === idx}>
              {String(i + 1).padStart(2, "0")}
            </span>
          ))}
          <i ref={bar} style={{ transform: "scaleY(0)" }} />
        </div>
        <a href="#suite-white" className="s1-feat__skip hud">
          {h.features.skip}
        </a>
      </div>
    </section>
  )
}
