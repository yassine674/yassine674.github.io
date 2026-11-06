"use client"

import BrandLogo from "./brand-logo"
import { CERTS, CERT_ORDER } from "./certs"
import { useLang } from "./i18n"
import { useLightbox } from "./lightbox"

// The certifications, apart from everything else: one big card each (logo, name, issuer, date, status).
// Clicking a card opens the certificate, growing out of it. Rises into view with its section ([data-shown]).
export default function CertCards({ tone = "light" }: { tone?: "light" | "dark" }) {
  const { lang } = useLang()
  const open = useLightbox()
  return (
    <ul className="certs" data-tone={tone}>
      {CERT_ORDER.map((id, i) => {
        const c = CERTS[id]
        return (
          <li key={id} className="cert" style={{ "--i": i } as React.CSSProperties}>
            <button
              type="button"
              className="cert__btn"
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect()
                e.currentTarget.style.setProperty("--ry", `${((e.clientX - r.left) / r.width - 0.5) * 10}deg`)
                e.currentTarget.style.setProperty("--rx", `${-((e.clientY - r.top) / r.height - 0.5) * 10}deg`)
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.setProperty("--rx", "0deg")
                e.currentTarget.style.setProperty("--ry", "0deg")
              }}
              aria-label={`${lang === "fr" ? "Voir le certificat" : "See the certificate"} ${c.code}`}
              onClick={(e) => open({ src: c.file, title: `${c.code} — ${c.title}`, sub: c.issuer }, e.currentTarget)}
            >
              <span className="cert__tile" style={{ background: c.tile }}>
                <BrandLogo name={c.logo} tone={c.tone} />
              </span>
              <span className="cert__body">
                <span className="cert__status hud" data-done={c.done}>
                  <i />
                  {c.done ? (lang === "fr" ? "Obtenue" : "Earned") : lang === "fr" ? "En cours" : "In progress"}
                </span>
                <span className="cert__code">{c.code}</span>
                <span className="cert__title">{c.title}</span>
                <span className="cert__meta hud">
                  {c.issuer} · {c.date[lang]}
                </span>
                <span className="cert__see hud">
                  {lang === "fr" ? "Voir le certificat" : "See the certificate"} <i />
                </span>
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
