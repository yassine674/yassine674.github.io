"use client";
import React, { useState, useEffect, useRef } from "react";
import { asset } from "@/lib/asset";
import { useLang, t } from "@/lib/i18n";
import {
  siSplunk, siElastic, siKalilinux, siLinux, siUbuntu,
  siTryhackme, siPython, siOpenjdk, siC, siPostgresql,
  siGnubash, siGit, siTensorflow, siPytorch, siOpencv, siYolo,
} from "simple-icons/icons";
import type { SimpleIcon } from "simple-icons";

/* ── Skills data for the marquee ── */
type Tool = { name: string; icon: SimpleIcon | null; hex: string };

const TOOLS_ROW1: Tool[] = [
  { name: "Wazuh",            icon: null,          hex: "#3595F9" },
  { name: "Splunk",           icon: siSplunk,      hex: "#000000" },
  { name: "IBM QRadar",       icon: null,          hex: "#0F62FE" },
  { name: "TheHive",          icon: null,          hex: "#F3D02F" },
  { name: "Elastic",          icon: siElastic,     hex: "#005571" },
  { name: "Active Directory", icon: null,          hex: "#0078D4" },
  { name: "Kali Linux",       icon: siKalilinux,   hex: "#557C94" },
  { name: "Linux",            icon: siLinux,       hex: "#FCC624" },
  { name: "Ubuntu",           icon: siUbuntu,      hex: "#E95420" },
  { name: "TryHackMe",        icon: siTryhackme,   hex: "#212C42" },
];
const TOOLS_ROW2: Tool[] = [
  { name: "Python",       icon: siPython,      hex: "#3776AB" },
  { name: "Java",         icon: siOpenjdk,     hex: "#437291" },
  { name: "C",            icon: siC,           hex: "#A8B9CC" },
  { name: "SQL",          icon: siPostgresql,  hex: "#4169E1" },
  { name: "Bash",         icon: siGnubash,     hex: "#4EAA25" },
  { name: "Git",          icon: siGit,         hex: "#F03C2E" },
  { name: "TensorFlow",   icon: siTensorflow,  hex: "#FF6F00" },
  { name: "PyTorch",      icon: siPytorch,     hex: "#EE4C2C" },
  { name: "OpenCV",       icon: siOpencv,      hex: "#5C3EE8" },
  { name: "YOLO",         icon: siYolo,        hex: "#111F68" },
];

/* TODO: images are placeholders from the previous portfolio — replace
   with screenshots of each lab in public/project/. */
const SLIDES = [
  {
    id: "wazuh-siem",
    index: "01",
    title: "Home Lab SIEM — Wazuh",
    description:
      "Full SIEM/XDR deployment: Wazuh Manager on Ubuntu, Windows agent onboarding, custom detection rules, File Integrity Monitoring and real-time security dashboards.",
    tags: ["Wazuh", "SIEM / XDR", "FIM", "Ubuntu"],
    year: "2026",
    github: "https://github.com/yassine674",
    image: "/project/01-rag.jpg",
  },
  {
    id: "ad-splunk",
    index: "02",
    title: "Active Directory Lab — Splunk",
    description:
      "AD environment (Windows Server, Kali Linux, Ubuntu) integrated with Splunk: Kerberos authentication logs, Windows security events and behavioural anomaly detection.",
    tags: ["Active Directory", "Splunk", "Kerberos", "Kali Linux"],
    year: "2026",
    github: "https://github.com/yassine674",
    image: "/project/02-carepath.jpg",
  },
  {
    id: "siem-pathway",
    index: "03",
    title: "SIEM Engineer — QRadar & Splunk",
    description:
      "Installation and onboarding of critical log sources (firewall, AD, servers), detection use cases, custom dashboards and advanced searches for incident investigation.",
    tags: ["IBM QRadar", "Splunk", "Use Cases", "Dashboards"],
    year: "2026",
    github: "https://github.com/yassine674",
    image: "/project/03-maintenance.jpg",
  },
  {
    id: "soar-thehive",
    index: "04",
    title: "SOC Automation — SOAR with TheHive",
    description:
      "Incident-response orchestration workflows and automated playbooks that cut alert handling time in a simulated SOC.",
    tags: ["TheHive", "SOAR", "Playbooks", "Automation"],
    year: "2026",
    github: "https://github.com/yassine674",
    image: "/project/04-ecg.jpg",
  },
  {
    id: "letsdefend",
    index: "05",
    title: "SOC Monitoring — LetsDefend",
    description:
      "Three months in a realistic SOC: alert triage and investigation (phishing, malware, intrusions), multi-source analysis, ticketing and threat hunting.",
    tags: ["Triage", "Threat Hunting", "Phishing", "Threat Intel"],
    year: "2025",
    github: "https://github.com/yassine674",
    image: "/project/05-iot.jpg",
  },
  {
    id: "mediconnect",
    index: "06",
    title: "MediConnect — Secure Web Platform",
    description:
      "Web application handling sensitive health data: authentication, data protection and GDPR-compliant design.",
    tags: ["Web Security", "Auth", "GDPR", "Java EE"],
    year: "2025",
    github: "https://github.com/yassine674",
    image: "/project/01-rag.jpg",
  },
];

export function ScrollingFeatureShowcase() {
  const { lang } = useLang();
  const trP = t[lang].projects;
  const trS = t[lang].skills;
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const scrolledInto = -rect.top;
      const scrollable = section.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const progress = Math.max(0, Math.min(1, scrolledInto / scrollable));
      const next = Math.min(SLIDES.length - 1, Math.floor(progress * SLIDES.length));
      setActiveIndex(next);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDotClick = (index: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const scrollable = section.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: sectionTop + (index / SLIDES.length) * scrollable,
      behavior: "smooth",
    });
  };

  const current = SLIDES[activeIndex];

  return (
    <>
    <div
      ref={sectionRef}
      id="projects"
      className="section-light"
      style={{ height: `${SLIDES.length * 100}vh` }}
    >
      {/* Sticky editorial panel */}
      <div
        className="sticky top-0 h-screen w-full overflow-hidden"
        style={{ background: "var(--bg)" }}
      >
        {/* ── Decorative thin SVG arc (like Obsidian Assembly) ── */}
        <svg
          aria-hidden="true"
          viewBox="0 0 1440 600"
          preserveAspectRatio="none"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 1,
          }}
        >
          <path
            d="M -40 480 Q 380 -60 1480 260"
            fill="none"
            stroke="var(--border)"
            strokeWidth="0.8"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M 1460 520 Q 900 180 -40 320"
            fill="none"
            stroke="var(--border)"
            strokeWidth="0.5"
            opacity="0.5"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* ── Ghost index number ── */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            right: "-0.05em",
            bottom: "-0.15em",
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontSize: "clamp(14rem, 28vw, 26rem)",
            lineHeight: 1,
            color: "var(--border)",
            userSelect: "none",
            pointerEvents: "none",
            zIndex: 1,
            transition: "color 0.6s ease",
          }}
        >
          {current.index}
        </div>

        {/* ── Main content grid ── */}
        <div
          className="relative z-10 h-full grid grid-cols-1 md:grid-cols-[1fr_auto]"
          style={{ maxWidth: "1440px", margin: "0 auto", padding: "0 clamp(1.5rem, 5vw, 4rem)" }}
        >
          {/* ── LEFT — text ── */}
          <div
            className="flex flex-col justify-center"
            style={{ paddingRight: "clamp(0rem, 6vw, 6rem)", paddingTop: "clamp(3rem, 5vw, 5rem)", paddingBottom: "clamp(3rem, 5vw, 5rem)" }}
          >
            {/* Top bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "2rem",
                marginBottom: "clamp(3rem, 6vh, 5rem)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.6rem",
                  letterSpacing: "0.3em",
                  color: "var(--accent)",
                  textTransform: "uppercase",
                }}
              >
                {trP.label}
              </span>

              <div style={{ display: "flex", gap: "5px", alignItems: "center", marginLeft: "auto" }}>
                {SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handleDotClick(i)}
                    aria-label={`Go to project ${i + 1}`}
                    style={{
                      height: "1.5px",
                      width: i === activeIndex ? "2.8rem" : "0.9rem",
                      background: i === activeIndex ? "var(--text)" : "var(--border)",
                      border: "none",
                      borderRadius: "9999px",
                      cursor: "pointer",
                      padding: 0,
                      transition: "width 0.5s var(--f-cubic), background 0.4s ease",
                    }}
                  />
                ))}
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.55rem",
                    letterSpacing: "0.16em",
                    color: "var(--text-3)",
                    marginLeft: "0.5rem",
                  }}
                >
                  {current.index} / {String(SLIDES.length).padStart(2, "0")}
                </span>
              </div>
            </div>

            {/* Sliding title block */}
            <div style={{ position: "relative", height: "clamp(26rem, 52vh, 34rem)", overflow: "hidden" }}>
              {SLIDES.map((slide, i) => (
                <div
                  key={slide.id}
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    opacity: i === activeIndex ? 1 : 0,
                    transform: i === activeIndex ? "translateY(0)" : "translateY(1.5rem)",
                    transition:
                      "opacity 0.7s var(--f-cubic), transform 0.7s var(--f-cubic)",
                    pointerEvents: i === activeIndex ? "auto" : "none",
                  }}
                >
                  {/* Large italic serif title */}
                  <h2
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontStyle: "italic",
                      fontWeight: 400,
                      fontSize: "clamp(2rem, 7.5vw, 7.5rem)",
                      lineHeight: 0.92,
                      letterSpacing: "-0.02em",
                      color: "var(--text)",
                      marginBottom: "clamp(1.5rem, 3vh, 2.5rem)",
                    }}
                  >
                    {slide.title}
                  </h2>

                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "clamp(0.84rem, 1.1vw, 0.94rem)",
                      lineHeight: 1.85,
                      color: "var(--text-2)",
                      maxWidth: "44ch",
                      marginBottom: "1.6rem",
                    }}
                  >
                    {trP.descriptions[i]}
                  </p>

                  {/* Tags */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                    {slide.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.55rem",
                          letterSpacing: "0.1em",
                          padding: "0.22rem 0.65rem",
                          border: "1px solid var(--border)",
                          borderRadius: "2px",
                          color: "var(--text-3)",
                          textTransform: "uppercase",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA — editorial text link */}
            <div style={{ display: "flex", alignItems: "center", gap: "2rem", marginTop: "auto" }}>
              <a
                href={current.github}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  fontFamily: "var(--font-body)",
                  fontWeight: 600,
                  fontSize: "0.7rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--text)",
                  textDecoration: "none",
                  transition: "gap 0.3s ease, color 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.gap = "1rem";
                  el.style.color = "var(--accent)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.gap = "0.6rem";
                  el.style.color = "var(--text)";
                }}
              >
                {trP.viewGithub}
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path
                    d="M2 10L10 2M10 2H4M10 2v6"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>

              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.56rem",
                  letterSpacing: "0.12em",
                  color: "var(--text-3)",
                }}
              >
                {current.year}
              </span>
            </div>
          </div>

          {/* ── RIGHT — tall image card ── */}
          <div
            className="hidden md:flex items-center justify-center"
            style={{ width: "clamp(260px, 28vw, 380px)", paddingTop: "3rem", paddingBottom: "3rem" }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                maxHeight: "82vh",
                borderRadius: "0.75rem",
                overflow: "hidden",
                boxShadow: "0 24px 72px oklch(38% 0.055 48 / 0.14), 0 0 0 1px var(--border)",
              }}
            >
              {/* Image strip */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: `${SLIDES.length * 100}%`,
                  transform: `translateY(-${activeIndex * (100 / SLIDES.length)}%)`,
                  transition: "transform 0.85s var(--f-cubic)",
                }}
              >
                {SLIDES.map((slide) => (
                  <div
                    key={slide.id}
                    style={{ width: "100%", height: `${100 / SLIDES.length}%`, position: "relative" }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={asset(slide.image)}
                      alt={slide.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      onError={(e) => {
                        const t = e.currentTarget;
                        t.onerror = null;
                        t.src = `https://placehold.co/800x1400/e8dfd4/7a6c60?text=${encodeURIComponent(slide.title)}`;
                      }}
                    />
                    {/* Subtle bottom vignette */}
                    <div
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: "35%",
                        background: "linear-gradient(to top, oklch(14% 0.025 50 / 0.45) 0%, transparent 100%)",
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Bottom label */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  bottom: "1rem",
                  left: "1rem",
                  right: "1rem",
                  zIndex: 4,
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.54rem",
                  letterSpacing: "0.14em",
                  color: "rgba(255,255,255,0.7)",
                  textTransform: "uppercase",
                  textAlign: "center",
                }}
              >
                {current.index} — {current.year}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* ── "More work" pill button — centred between projects and skills ── */}
    <div
      className="section-light"
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "clamp(3rem,6vw,5rem) 0 0",
      }}
    >
      <a
        href="https://github.com/yassine674"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "3rem",
          padding: "1rem 1.5rem 1rem 2rem",
          border: "1px solid var(--text)",
          borderRadius: "9999px",
          fontFamily: "var(--font-body)",
          fontWeight: 500,
          fontSize: "clamp(0.9rem,1.2vw,1rem)",
          letterSpacing: "0.02em",
          color: "var(--text)",
          textDecoration: "none",
          transition: "background 0.25s ease, color 0.25s ease",
          position: "relative",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLAnchorElement;
          el.style.background = "var(--text)";
          el.style.color = "var(--bg)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLAnchorElement;
          el.style.background = "transparent";
          el.style.color = "var(--text)";
        }}
      >
        {trP.moreWork}
        {/* Arrow icon in a small circle, top-right of button */}
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "2rem",
          height: "2rem",
          borderRadius: "50%",
          border: "1px solid currentColor",
        }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
            <path d="M1.5 8.5L8.5 1.5M8.5 1.5H3M8.5 1.5V7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </a>
    </div>

    {/* ── Skills marquee — flows directly from the projects section ── */}
    <div
      id="skills"
      className="section-light"
      style={{
        padding: "clamp(4rem,8vw,7rem) 0 clamp(5rem,10vw,9rem)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Centred section label + heading (like image-1 integration layout) */}
      <div style={{
        textAlign: "center",
        padding: "0 clamp(1.5rem,5vw,4rem)",
        marginBottom: "clamp(3rem,6vw,5rem)",
      }}>
        {/* Small pill label */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.45rem",
          fontFamily: "var(--font-mono)",
          fontSize: "0.58rem",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "var(--text-2)",
          border: "1px solid var(--border)",
          borderRadius: "9999px",
          padding: "0.3rem 0.85rem",
          marginBottom: "1.6rem",
        }}>
          <span aria-hidden style={{ color: "var(--accent)", fontSize: "0.7rem" }}>✦</span>
          {trS.label}
        </div>

        <h2 style={{
          fontFamily: "var(--font-serif)",
          fontWeight: 400,
          fontSize: "clamp(2.8rem,7vw,7rem)",
          lineHeight: 0.94,
          letterSpacing: "-0.02em",
          color: "var(--text)",
          margin: "0 auto",
          maxWidth: "16ch",
        }}>
          {trS.heading1}{" "}
          <em style={{ fontStyle: "italic", color: "var(--accent)" }}>{trS.heading2}</em>
        </h2>
      </div>

      {/* Row 1 — scrolls left */}
      <div style={{ position: "relative", marginBottom: "0.75rem" }}>
        <div className="animate-marquee-left" style={{ display: "flex", gap: "1.5rem", width: "max-content", alignItems: "flex-start" }}>
          {[...TOOLS_ROW1, ...TOOLS_ROW1].map((t, i) => (
            <ToolChip key={i} name={t.name} icon={t.icon} hex={t.hex} />
          ))}
        </div>
      </div>

      {/* Row 2 — scrolls right */}
      <div style={{ position: "relative" }}>
        <div className="animate-marquee-right" style={{ display: "flex", gap: "1.5rem", width: "max-content", alignItems: "flex-start" }}>
          {[...TOOLS_ROW2, ...TOOLS_ROW2].map((t, i) => (
            <ToolChip key={i} name={t.name} icon={t.icon} hex={t.hex} />
          ))}
        </div>
      </div>

      {/* Fade edges */}
      <div aria-hidden style={{
        position: "absolute", left: 0, top: 0, width: "12rem", height: "100%",
        background: "linear-gradient(to right, var(--bg), transparent)",
        pointerEvents: "none", zIndex: 2,
      }} />
      <div aria-hidden style={{
        position: "absolute", right: 0, top: 0, width: "12rem", height: "100%",
        background: "linear-gradient(to left, var(--bg), transparent)",
        pointerEvents: "none", zIndex: 2,
      }} />
    </div>
    </>
  );
}

function ToolChip({ name, icon, hex }: Tool) {
  return (
    <span style={{
      display: "inline-flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "0.55rem",
      flexShrink: 0,
      width: "5.5rem",
    }}>
      {/* Circular logo badge */}
      <span style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "3.75rem",
        height: "3.75rem",
        borderRadius: "50%",
        background: "oklch(100% 0 0)",
        boxShadow: "0 2px 12px oklch(50% 0.05 50 / 0.12), 0 0 0 1px oklch(85% 0.02 50 / 0.6)",
        flexShrink: 0,
      }}>
        {icon ? (
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            width="22"
            height="22"
            style={{ fill: `#${hex}`, display: "block", flexShrink: 0 }}
            dangerouslySetInnerHTML={{ __html: `<path d="${icon.path}" />` }}
          />
        ) : (
          /* Fallback: coloured monogram for icons not in simple-icons */
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.6rem",
            fontWeight: 700,
            color: hex,
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}>
            {name.slice(0, 2).toUpperCase()}
          </span>
        )}
      </span>
      {/* Label under the circle */}
      <span style={{
        fontFamily: "var(--font-mono)",
        fontSize: "0.52rem",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: "var(--text-3)",
        whiteSpace: "nowrap",
        textAlign: "center",
      }}>
        {name}
      </span>
    </span>
  );
}
