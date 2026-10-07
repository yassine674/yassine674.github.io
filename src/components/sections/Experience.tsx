"use client";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Timeline, type TimelineEntry } from "@/components/ui/Timeline";
import { Starfield } from "@/components/ui/Starfield";
import { useLang, t } from "@/lib/i18n";

gsap.registerPlugin(ScrollTrigger);

function EntryCard({
  label,
  title,
  period,
  location,
  description,
  tags,
  incoming,
  incomingLabel = "incoming",
}: {
  label: string;
  title: string;
  period: string;
  location: string;
  description: string;
  tags: string[];
  incoming?: boolean;
  incomingLabel?: string;
}) {
  return (
    <article
      style={{
        paddingLeft: "clamp(1.5rem,3vw,2.5rem)",
        paddingBottom: "clamp(2rem,4vw,3.5rem)",
        position: "relative",
      }}
    >
      {/* Type label */}
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.55rem",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "var(--accent)",
          marginBottom: "0.6rem",
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
        }}
      >
        {incoming && (
          <span
            style={{
              background: "var(--accent)",
              color: "var(--bg)",
              borderRadius: "2px",
              padding: "0.1rem 0.35rem",
              fontSize: "0.5rem",
              fontWeight: 700,
              letterSpacing: "0.15em",
            }}
          >
            {incomingLabel}
          </span>
        )}
        {label}
      </div>

      {/* Title */}
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: "clamp(1rem,2.2vw,1.45rem)",
          color: "var(--text)",
          letterSpacing: "-0.01em",
          marginBottom: "0.4rem",
          lineHeight: 1.2,
        }}
      >
        {title}
      </h3>

      {/* Period + location */}
      <div
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.72rem",
          color: "var(--text-3)",
          letterSpacing: "0.06em",
          marginBottom: "0.9rem",
        }}
      >
        {period} · {location}
      </div>

      {/* Description */}
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "clamp(0.82rem,1.2vw,0.92rem)",
          lineHeight: 1.8,
          color: "var(--text-2)",
          maxWidth: "55ch",
          marginBottom: "1rem",
        }}
      >
        {description}
      </p>

      {/* Tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
        {tags.map((tag) => (
          <span
            key={tag}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.64rem",
              letterSpacing: "0.05em",
              padding: "0.2rem 0.55rem",
              border: "1px solid var(--border)",
              borderRadius: "3px",
              color: "var(--text-3)",
              background: "var(--surface)",
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}

type Entry = { title: string; period: string; location: string; description: string };

type ExperienceTr = {
  label: string;
  heading1: string;
  heading2: string;
  labelEdu: string;
  labelExp: string;
  labelCert: string;
  incoming: string;
  entries: {
    cpge: Entry;
    insa: Entry;
    cba: Entry;
    hackviser: Entry;
    certs: Entry;
  };
};

/* Build the merged timeline entries grouped by year, oldest first */
function buildCarriereData(tr: ExperienceTr): TimelineEntry[] {
  const e = tr.entries;
  return [
    {
      title: "2022 – 25",
      content: (
        <EntryCard
          label={tr.labelEdu}
          title={e.cpge.title}
          period={e.cpge.period}
          location={e.cpge.location}
          description={e.cpge.description}
          tags={["Mathematics", "Physics", "Python", "Competitive Exam"]}
        />
      ),
    },
    {
      title: "2025",
      content: (
        <div>
          <EntryCard
            label={tr.labelEdu}
            title={e.insa.title}
            period={e.insa.period}
            location={e.insa.location}
            description={e.insa.description}
            tags={["Cybersecurity", "Networks", "Systems", "Java", "C"]}
          />
          <EntryCard
            label={tr.labelExp}
            title={e.cba.title}
            period={e.cba.period}
            location={e.cba.location}
            description={e.cba.description}
            tags={["SOC L1", "Alert Triage", "Log Analysis", "Incident Reporting"]}
          />
        </div>
      ),
    },
    {
      title: "2026",
      content: (
        <div>
          <EntryCard
            label={tr.labelExp}
            title={e.hackviser.title}
            period={e.hackviser.period}
            location={e.hackviser.location}
            description={e.hackviser.description}
            tags={["Leadership", "Workshops", "Security Awareness"]}
          />
          <EntryCard
            label={`✦ ${tr.labelCert}`}
            title={e.certs.title}
            period={e.certs.period}
            location={e.certs.location}
            description={e.certs.description}
            tags={["TryHackMe SEC1", "Hackviser CAPT", "TryHackMe SAL1"]}
          />
        </div>
      ),
    },
  ];
}

export function Experience() {
  const { lang } = useLang();
  const tr = t[lang].experience;
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from(".car-label", {
        scrollTrigger: { trigger: ".car-label", start: "top 88%", once: true },
        opacity: 0, y: 14, duration: 0.6, ease: "power3.out",
      });
      gsap.from(".car-heading .ci", {
        scrollTrigger: { trigger: ".car-heading", start: "top 85%", once: true },
        yPercent: 108, duration: 1, stagger: 0.1, ease: "power4.out",
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  const Clip = ({ children }: { children: React.ReactNode }) => (
    <div style={{ overflow: "hidden" }}>
      <span className="ci" style={{ display: "block" }}>{children}</span>
    </div>
  );

  const data = buildCarriereData(tr);

  return (
    <section
      ref={ref}
      id="experience"
      aria-labelledby="car-h"
      style={{
        padding: "clamp(5rem, 10vw, 9rem) clamp(1.5rem, 5vw, 3.5rem) clamp(6rem, 14vw, 12rem)",
        position: "relative",
        zIndex: 1,
        marginTop: "-60px",
        borderRadius: "40px 40px 0 0",
        boxShadow: "0 -8px 40px rgba(0,0,0,0.08), 0 -1px 0 rgba(0,0,0,0.04)",
        background: "var(--bg)",
        overflow: "clip",
      }}
    >
      <Starfield
        starColor="rgba(255,255,255,1)"
        bgColor="rgba(20,14,10,1)"
        speed={0.5}
        quantity={600}
      />
      <div style={{ position: "relative", zIndex: 1 }}>
      <div id="car-h" className="car-heading" style={{ marginBottom: "clamp(3rem, 7vw, 6rem)" }}>
        {/* main heading */}
        <h2 id="car-h-text" style={{ margin: 0 }}>
          {/* "Career" â€” massive outlined */}
          <Clip>
            <span style={{
              display: "block",
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: "clamp(3rem, 11vw, 10rem)",
              lineHeight: 0.88,
              letterSpacing: "-0.04em",
              WebkitTextStroke: "1.5px var(--text)",
              color: "transparent",
            }}>
              {tr.heading1}
            </span>
          </Clip>

          {/* "& training" â€” filled serif, offset right */}
          <Clip>
            <span style={{
              display: "block",
              fontFamily: "var(--font-serif)",
              fontWeight: 400,
              fontStyle: "italic",
              fontSize: "clamp(2rem, 8.5vw, 8rem)",
              lineHeight: 1,
              letterSpacing: "-0.02em",
              color: "var(--accent)",
              paddingLeft: "clamp(0.5rem, 6vw, 6rem)",
            }}>
              {tr.heading2}
            </span>
          </Clip>
        </h2>
      </div>

        <Timeline data={data} />
      </div>
    </section>
  );
}
