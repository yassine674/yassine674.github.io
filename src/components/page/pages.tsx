"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { Counter, ImageBand, LineLink, Marquee, PageFooter, PageHero, PageShell, usePage, usePageStart } from "./blocks"
import BrandLogo, { hasLogo } from "@/components/brand-logo"
import CertCards from "@/components/cert-cards"
import { GlitchWord, LineTitle, PreTitle, S1Section, S1Text } from "@/components/s1/s1"

// Inner pages, laid out like the reference site's About / Services / Contacts pages:
// a "—— LABEL" line, a big heading that rises into view, a giant faint word behind it, small body text,
// all aligned on faint 160px columns.


// Openings of the menu pages: number, lead sentence, picture, and the words of the band that slides under it.
const HERO = {
  fr: {
    about: { num: "01", lead: "Étudiant ingénieur en cybersécurité, tourné vers la défense.", media: "/img/laptop-dark.webp", words: ["Blue team", "SOC", "Défense", "Cloud", "Automatisation"] },
    skills: { num: "03", lead: "Ce que je sais faire, outil par outil.", media: "/img/code-screen.webp", words: ["SIEM", "SOAR", "Active Directory", "Cloud", "Python", "IA"] },
    path: { num: "04", lead: "Des classes prépa au SOC, étape par étape.", media: "/img/library.webp", words: ["Prépa MP", "INSA", "LAMIH", "Forage", "Hackviser"] },
    contact: { num: "05", lead: "Un stage SOC ou cloud security ? Écrivons-nous.", media: "/img/together.webp", words: ["Stage", "Mars 2028", "6 mois", "SOC", "Cloud security"] },
  },
  en: {
    about: { num: "01", lead: "Cybersecurity engineering student, focused on defense.", media: "/img/laptop-dark.webp", words: ["Blue team", "SOC", "Defense", "Cloud", "Automation"] },
    skills: { num: "03", lead: "What I can do, tool by tool.", media: "/img/code-screen.webp", words: ["SIEM", "SOAR", "Active Directory", "Cloud", "Python", "AI"] },
    path: { num: "04", lead: "From prep school to the SOC, step by step.", media: "/img/library.webp", words: ["Prep school", "INSA", "LAMIH", "Forage", "Hackviser"] },
    contact: { num: "05", lead: "A SOC or cloud security internship? Let's talk.", media: "/img/together.webp", words: ["Internship", "March 2028", "6 months", "SOC", "Cloud security"] },
  },
}

// pictures that follow the cursor over the skills rows (same order as the rows)
// one picture per skill row (SIEM, incident response, Active Directory, cloud, networks, code)
const ROW_PICS = ["/img/supervision-wall.webp", "/img/operations-center.webp", "/img/server-room.webp", "/img/sky-cloud.webp", "/img/switch.webp", "/img/python-code.webp"]

export function AboutPage() {
  const start = usePageStart()
  const { p, lang, t } = usePage()
  const a = p.about
  const h = HERO[lang].about
  return (
    <PageShell started={start != null} className="pg--about">
      <PageHero num={h.num} title={t.items[1]} lead={h.lead} media={h.media} start={start} />
      <Marquee words={h.words} />

      <div id="contenu">
        <S1Section className="blk">
          <PreTitle>{a.begin.label}</PreTitle>
          <div className="blk__main">
            <GlitchWord text={a.begin.ghost} />
            <LineTitle as="h2" className="h2">
              {a.begin.heading}
            </LineTitle>
            <S1Text className="txt" n={1}>
              {a.begin.body}
            </S1Text>
          </div>
        </S1Section>

        <S1Section className="blk">
          <PreTitle>{a.steps.label}</PreTitle>
          <div className="blk__main">
            <LineTitle as="h2" className="h2">
              {a.steps.heading}
            </LineTitle>
            <ol className="steps">
              {a.steps.items.map((s, i) => (
                <li key={s.year} className="rv" style={{ "--d": `${0.1 + i * 0.12}s` } as React.CSSProperties}>
                  <span className="steps__year hud">{s.year}</span>
                  <p className="txt">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </S1Section>

        <ImageBand src="/img/network-cables.webp" caption={lang === "fr" ? "Superviser, corréler, répondre" : "Monitor, correlate, respond"} />

        <S1Section className="blk">
          <PreTitle>{a.now.label}</PreTitle>
          <div className="blk__main">
            <GlitchWord text={a.now.ghost} />
            <LineTitle as="h2" className="h2">
              {a.now.heading}
            </LineTitle>
            <S1Text className="txt" n={1}>
              {a.now.body}
            </S1Text>
          </div>
        </S1Section>

        <S1Section className="blk blk--certs">
          <PreTitle>Certifications</PreTitle>
          <CertCards tone="dark" />
        </S1Section>

        <S1Section className="blk">
          <PreTitle>{a.numbers.label}</PreTitle>
          <div className="blk__main">
            <LineTitle as="h2" className="h2">
              {a.numbers.heading}
            </LineTitle>
            <ul className="nums">
              {a.numbers.items.map((n, i) => (
                <li key={i} className="rv" style={{ "--d": `${0.1 + i * 0.12}s` } as React.CSSProperties}>
                  <Counter value={n.value} />
                  <p className="txt">{n.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </S1Section>

        <S1Section className="blk">
          <PreTitle>{a.also.label}</PreTitle>
          <div className="blk__main">
            <GlitchWord text={a.also.ghost} />
            <LineTitle as="h2" className="h2">
              {a.also.heading}
            </LineTitle>
            <S1Text className="txt" n={1}>
              {a.also.body}
            </S1Text>
          </div>
        </S1Section>

        <S1Section className="blk blk--cta">
          <PreTitle>{a.cta.label}</PreTitle>
          <div className="blk__main blk__main--split">
            <div>
              <LineTitle as="h2" className="h2">
              {a.cta.heading}
            </LineTitle>
              <S1Text className="txt" n={1}>
                {a.cta.body}
              </S1Text>
            </div>
            <LineLink href="/contact">{p.common.contactMe}</LineLink>
          </div>
        </S1Section>

        <PageFooter />
      </div>
    </PageShell>
  )
}

export function SkillsPage() {
  const start = usePageStart()
  const { p, lang, t } = usePage()
  const s = p.skills
  const h = HERO[lang].skills
  const preview = useRef<HTMLDivElement>(null)
  const [hover, setHover] = useState(-1)
  const follow = (e: React.MouseEvent) => {
    const el = preview.current
    if (!el) return
    const r = el.parentElement!.getBoundingClientRect()
    el.style.transform = `translate3d(${e.clientX - r.left}px, ${e.clientY - r.top}px, 0)`
  }
  return (
    <PageShell started={start != null}>
      <PageHero num={h.num} title={t.items[3]} lead={h.lead} media={h.media} start={start} />
      <Marquee words={h.words} />
      <S1Section className="blk blk--intro" id="contenu">
        <PreTitle>{s.label}</PreTitle>
        <div className="blk__main">
          <GlitchWord text={s.ghost} />
          <LineTitle as="h1" className="h1">
              {s.heading}
            </LineTitle>
          <S1Text className="txt" n={1}>
            {s.body}
          </S1Text>
        </div>
      </S1Section>

      <section className="rows" aria-label={s.label} onMouseMove={follow} onMouseLeave={() => setHover(-1)}>
        {/* the picture of the row under the cursor follows it */}
        <div ref={preview} className="rows__preview" data-on={hover >= 0} aria-hidden>
          {ROW_PICS.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element -- small preview, swapped by CSS
            <img key={src + i} src={src} alt="" data-on={hover === i} />
          ))}
        </div>
        {s.rows.map((r, i) => (
          <article key={r.title} onMouseEnter={() => setHover(i)} className="row rv" style={{ "--d": `${0.08 * (i % 3)}s` } as React.CSSProperties}>
            <div>
              {/* phones have no hover preview: the picture sits in the row instead */}
              {/* eslint-disable-next-line @next/next/no-img-element -- decorative strip, touch screens only */}
              <img className="row__pic" src={ROW_PICS[i % ROW_PICS.length]} alt="" loading="lazy" aria-hidden />
              <h2 className="row__title">{r.title}</h2>
              <p className="txt">{r.text}</p>
            </div>
            <div className="row__side">
              <span className="row__logos">
                {r.tools
                  .split(" · ")
                  .filter(hasLogo)
                  .map((tool) => (
                    <BrandLogo key={tool} name={tool} tone="dark" />
                  ))}
              </span>
              <p className="row__tools">{r.tools}</p>
            </div>
          </article>
        ))}
        <div className="rows__more">
          <LineLink href="/projets">{s.more}</LineLink>
        </div>
      </section>

      <S1Section className="blk blk--light" theme="light">
        <S1Text className="txt" n={0}>
          {s.soft.body}
        </S1Text>
        <Link href="/contact" className="boxbtn hud rv">
          {s.soft.button}
        </Link>
        <S1Text className="txt txt--dim" n={1}>
          {s.soft.foot}
        </S1Text>
      </S1Section>

      <PageFooter />
    </PageShell>
  )
}

export function PathPage() {
  const start = usePageStart()
  const { p, lang, t } = usePage()
  const s = p.path
  const h = HERO[lang].path
  return (
    <PageShell started={start != null}>
      <PageHero num={h.num} title={t.items[4]} lead={h.lead} media={h.media} start={start} />
      <Marquee words={h.words} />
      <S1Section className="blk blk--intro" id="contenu">
        <PreTitle>{s.label}</PreTitle>
        <div className="blk__main">
          <GlitchWord text={s.ghost} />
          <LineTitle as="h1" className="h1">
              {s.heading}
            </LineTitle>
        </div>
      </S1Section>

      {s.groups.map((g, gi) =>
        gi === s.groups.length - 1 ? (
          <S1Section key={g.name} className="blk blk--list blk--certs">
            <PreTitle>{g.name}</PreTitle>
            <CertCards tone="dark" />
          </S1Section>
        ) : (
        <S1Section key={g.name} className="blk blk--list">
          <PreTitle>{g.name}</PreTitle>
          <TimelineLine />
          <ol className="tl">
            {g.items.map((it, i) => (
              <li key={it.title} className="tl__item rv" style={{ "--d": `${0.08 * i}s` } as React.CSSProperties}>
                <span className="tl__date hud">{it.date}</span>
                <div>
                  <h2 className="row__title">{it.title}</h2>
                  <p className="txt">{it.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </S1Section>
        ),
      )}

      <PageFooter />
    </PageShell>
  )
}

export function ContactPage() {
  const start = usePageStart()
  const { p, lang, t } = usePage()
  const c = p.contact
  const h = HERO[lang].contact
  return (
    <PageShell started={start != null} className="pg--contact">
      <PageHero num={h.num} title={t.items[5]} lead={h.lead} media={h.media} start={start} />
      <Marquee words={h.words} />
      <S1Section className="blk blk--intro" id="contenu">
        <PreTitle>{c.label}</PreTitle>
        <div className="blk__main">
          <LineTitle as="h1" className="h1">
              {c.heading}
            </LineTitle>
          <div className="contact__btns rv">
            <LineLink href={c.cols[0].href} external>
              {c.write}
            </LineLink>
            <LineLink href={c.cols[1].href} external>
              {c.linkedin}
            </LineLink>
          </div>
          <ul className="contact__cols">
            {c.cols.map((col, i) => (
              <li key={col.label} className="rv" style={{ "--d": `${0.1 + i * 0.1}s` } as React.CSSProperties}>
                <span className="hud">{col.label}</span>
                <a href={col.href} target={col.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                  {col.value}
                </a>
              </li>
            ))}
          </ul>
          <S1Text className="txt txt--dim" n={2}>
            {c.place}
          </S1Text>
        </div>
      </S1Section>
      <PageFooter />
    </PageShell>
  )
}

/** Vertical line of the timeline: it fills as the list scrolls through the screen. */
function TimelineLine() {
  const el = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const line = el.current
    const list = line?.nextElementSibling as HTMLElement | null
    if (!line || !list) return
    let raf = 0
    const update = () => {
      raf = 0
      const r = list.getBoundingClientRect()
      const k = Math.min(1, Math.max(0, (window.innerHeight * 0.75 - r.top) / r.height))
      line.style.setProperty("--k", String(k))
    }
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", on, { passive: true })
    return () => {
      window.removeEventListener("scroll", on)
      cancelAnimationFrame(raf)
    }
  }, [])
  return <span ref={el} className="tl__line" aria-hidden />
}
