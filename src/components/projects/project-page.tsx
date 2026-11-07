"use client"

import Link from "next/link"
import { useLang } from "@/components/i18n"
import { useIntro } from "@/components/intro-context"
import { useLightbox } from "@/components/lightbox"
import BrandLogo, { hasLogo } from "@/components/brand-logo"
import { useRef } from "react"
import { ActionBtn, LineTitle, PreTitle, S1Section, S1Text, VLines, useVisAttr } from "@/components/s1/s1"
import { DETAILS } from "./project-details"
import { PROJECTS } from "./projects-data"

const L = {
  fr: { back: "Tous les projets", project: "Le projet", done: "Comment je l'ai construit", stack: "Les outils et leur rôle", shots: "Captures", result: "Résultat", github: "Voir sur GitHub", contact: "En parler", next: "Projet suivant", zoom: "Agrandir" },
  en: { back: "All projects", project: "The project", done: "How I built it", stack: "The tools and their role", shots: "Screenshots", result: "Outcome", github: "See on GitHub", contact: "Talk about it", next: "Next project", zoom: "Enlarge" },
}

export default function ProjectPage({ slug }: { slug: string }) {
  const { lang } = useLang()
  const { revealed } = useIntro()
  const open = useLightbox()
  const cover = useRef<HTMLElement>(null)
  useVisAttr(cover)
  const i = PROJECTS.findIndex((p) => p.slug === slug)
  const p = PROJECTS[i]
  const d = DETAILS[slug]
  const next = PROJECTS[(i + 1) % PROJECTS.length]
  const l = L[lang]
  if (!p || !d) return null

  return (
    <article className="prj">
      {/* cover: the picture fills the screen, the name sits in the middle */}
      <header ref={cover} className="prj__cover" data-ready={revealed}>
        <div className="prj__cover-pic" aria-hidden>
          {p.media && (
            // eslint-disable-next-line @next/next/no-img-element -- full-screen cover, zoomed by CSS
            <img src={p.media} alt="" />
          )}
        </div>
        <S1Section className="prj__cover-in" theme="dark">
          <p className="hud prj__kind">
            <span>
              {String(i + 1).padStart(2, "0")} / {p.kind[lang]}
            </span>
          </p>
          <LineTitle as="h1" className="prj__title" delay={0.2}>
            {p.title[lang]}
          </LineTitle>
          <ul className="prj__tags hud">
            {p.tags.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </S1Section>
        <Link href="/projets" className="prj__back hud">
          <i /> {l.back}
        </Link>
        <a href="#recit" className="prj__down" aria-label="↓">
          <span />
        </a>
      </header>

      <S1Section className="prj__sec" id="recit">
        <VLines />
        <div className="s1-wrap">
          <PreTitle>{l.project}</PreTitle>
          <LineTitle className="s1-h s1-h--wide prj__intro">{d.intro[lang]}</LineTitle>
          <S1Text className="prj__text">{d.context[lang]}</S1Text>
        </div>
      </S1Section>

      {/* how it was built: one numbered block per step, the number drawn big, the text rolling in */}
      <S1Section className="prj__sec">
        <VLines />
        <div className="s1-wrap">
          <PreTitle>{l.done}</PreTitle>
          <ol className="prj__build">
            {d.build.map((b, k) => (
              <BuildStep key={k} n={k + 1} title={b.title[lang]} text={b.text[lang]} />
            ))}
          </ol>
        </div>
      </S1Section>

      {/* the tools, each with what it was used for */}
      <S1Section className="prj__sec">
        <VLines />
        <div className="s1-wrap">
          <PreTitle>{l.stack}</PreTitle>
          <ul className="prj__tools">
            {d.tools.map((tool, k) => (
              <li key={tool.name} style={{ "--i": k } as React.CSSProperties}>
                <span className="prj__tool-logo">{hasLogo(tool.name) ? <BrandLogo name={tool.name} tone="dark" /> : <b>{tool.name.slice(0, 2)}</b>}</span>
                <span className="prj__tool-name">{tool.name}</span>
                <span className="prj__tool-role">{tool.role[lang]}</span>
              </li>
            ))}
          </ul>
        </div>
      </S1Section>

      <S1Section className="prj__sec">
        <VLines />
        <div className="s1-wrap">
          <PreTitle>{l.shots}</PreTitle>
          <ul className="prj__shots">
            {d.shots.map((s, k) => (
              <li key={k} style={{ "--i": k } as React.CSSProperties}>
                {s.src ? (
                  <button
                    type="button"
                    className="prj__shot"
                    aria-label={`${l.zoom} : ${s.caption[lang]}`}
                    onClick={(e) => open({ src: s.src!, title: p.title[lang], sub: s.caption[lang] }, e.currentTarget)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- thumbnail, opens the lightbox */}
                    <img src={s.src} alt="" loading="lazy" />
                    <span className="prj__zoom hud">+ {l.zoom}</span>
                  </button>
                ) : (
                  <span className="prj__shot prj__shot--empty hud">{s.caption[lang]}</span>
                )}
                <span className="prj__cap hud">{s.caption[lang]}</span>
              </li>
            ))}
          </ul>
        </div>
      </S1Section>

      <S1Section className="prj__sec prj__sec--result">
        <VLines />
        <div className="s1-wrap">
          <PreTitle>{l.result}</PreTitle>
          <LineTitle className="s1-h s1-h--wide">{d.result[lang]}</LineTitle>
          <div className="s1-contacts__btns prj__btns">
            <ActionBtn href={d.github} external>
              {l.github}
            </ActionBtn>
            <ActionBtn href="/contact">{l.contact}</ActionBtn>
          </div>
        </div>
      </S1Section>

      {/* next project: its picture, its name in the middle */}
      <Link href={`/projets/${next.slug}`} className="prj__next">
        <span className="prj__next-pic" aria-hidden>
          {next.media && (
            // eslint-disable-next-line @next/next/no-img-element -- full-width teaser
            <img src={next.media} alt="" />
          )}
        </span>
        <span className="prj__next-in">
          <span className="hud">{l.next}</span>
          <span className="prj__next-title">{next.title[lang]}</span>
        </span>
      </Link>
    </article>
  )
}

/** One step of the build: shows when it scrolls in (its own reveal), big outlined number, title, text. */
function BuildStep({ n, title, text }: { n: number; title: string; text: string }) {
  return (
    <li className="prj__step">
      <S1Section as="div" className="prj__step-in">
        <span className="prj__step-num" aria-hidden>
          {String(n).padStart(2, "0")}
        </span>
        <div>
          <LineTitle as="h3" className="prj__step-title">
            {title}
          </LineTitle>
          <S1Text>{text}</S1Text>
        </div>
      </S1Section>
    </li>
  )
}
