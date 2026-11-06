"use client"

import { useLang } from "@/components/i18n"
import { useIntro } from "@/components/intro-context"
import HeroTitle from "./hero-title"
import MeshCanvas from "./mesh-canvas"
import RollLink from "./roll-link"

export default function Hero() {
  const { revealed } = useIntro()
  const { t } = useLang()
  return (
    <section className="hero" data-ready={revealed} aria-label={t.home}>
      <MeshCanvas className="hero__mesh" />

      <div className="hero__main">
        <HeroTitle revealed={revealed} caption={t.caption} />
      </div>

      <div className="hero__stack hud" aria-hidden>
        {t.stack.map((label, i) => (
          <p key={label} className="mask">
            <span style={{ "--i": i } as React.CSSProperties}>{label}</span>
          </p>
        ))}
      </div>

      <nav className="hero__corner hud" aria-label={t.sections}>
        <RollLink href="/projets">{t.corner}</RollLink>
      </nav>

      <a href="#suite" className="hero__scroll" aria-label={t.scroll}>
        <span />
      </a>
    </section>
  )
}
