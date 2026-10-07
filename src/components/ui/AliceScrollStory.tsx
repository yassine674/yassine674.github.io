"use client";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type FloatEl = {
  text: string;
  size: string;
  opacity: number;
  speed: number;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  serif?: boolean;
};

const FLOATS: FloatEl[] = [
  { text: "43.3°N",  size: "0.62rem", opacity: 0.6,  speed: 18, top: "18%",    left: "8%",   serif: false },
  { text: "✦",       size: "1.5rem",  opacity: 0.45, speed: 8,  top: "22%",    right: "11%", serif: false },
  { text: "01",      size: "5.5vw",   opacity: 0.07, speed: 14, bottom: "28%", left: "6%",   serif: false },
  { text: "✦",       size: "0.9rem",  opacity: 0.38, speed: 23, bottom: "30%", right: "9%",  serif: false },
  { text: "§",       size: "3vw",     opacity: 0.06, speed: 11, top: "44%",    left: "3%",   serif: true  },
  { text: "2025",    size: "0.6rem",  opacity: 0.42, speed: 16, top: "60%",    right: "7%",  serif: false },
  { text: "48.8°N",  size: "0.6rem",  opacity: 0.35, speed: 5,  bottom: "18%", left: "18%",  serif: false },
];

interface Props {
  wordA?: string;
  wordB?: string;
  eyebrow?: string;
  /** Total scroll distance that drives the animation (vh). Default 220. */
  scrollLength?: number;
}

export function AliceScrollStory({
  wordA = "SELECTED",
  wordB = "WORKS",
  eyebrow = "a collection of case studies",
  scrollLength = 220,
}: Props) {
  const wrapRef    = useRef<HTMLDivElement>(null);
  const topRef     = useRef<HTMLDivElement>(null);
  const botRef     = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || !topRef.current || !botRef.current || !contentRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Convert vh to pixels — GSAP end strings don't parse "vh" units
    const endPx = `+=${Math.round((scrollLength / 100) * window.innerHeight)}`;

    const ctx = gsap.context(() => {
      // Pin the viewport while the curtains animate
      ScrollTrigger.create({
        trigger: wrap,
        start: "top top",
        end: endPx,
        pin: true,
        pinSpacing: true,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: "top top",
          end: endPx,
          scrub: 1.3,
        },
      });

      // Top curtain collapses upward: height 100% → 0%
      tl.to(topRef.current, {
        clipPath: "polygon(0 0, 100% 0, 100% 0%, 0 0%)",
        ease: "none",
      }, 0);

      // Bottom curtain collapses downward
      tl.to(botRef.current, {
        clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
        ease: "none",
      }, 0);

      // Content behind fades in once panels are ~40% open
      tl.fromTo(
        contentRef.current,
        { opacity: 0, y: "4%" },
        { opacity: 1, y: "0%", ease: "power2.out" },
        0.38,
      );

      // Each floating label drifts at its own parallax speed
      wrap.querySelectorAll<HTMLElement>("[data-float-speed]").forEach((el) => {
        const speedPx = Math.round((parseFloat(el.dataset.floatSpeed ?? "12") / 100) * window.innerHeight);
        gsap.to(el, {
          y: `-${speedPx}`,
          ease: "none",
          scrollTrigger: {
            trigger: wrap,
            start: "top top",
            end: endPx,
            scrub: 1,
          },
        });
      });
    }, wrapRef);

    return () => ctx.revert();
  }, [scrollLength]);

  return (
    <div
      ref={wrapRef}
      role="region"
      aria-label={`Transition into ${wordA} ${wordB}`}
      style={{
        position: "relative",
        height: "100vh",
        overflow: "hidden",
        background: "rgba(20,14,10,1)",
      }}
    >
      {/* ── Floating editorial micro-labels ── */}
      {FLOATS.map((f, i) => (
        <span
          key={i}
          aria-hidden="true"
          data-float-speed={f.speed}
          style={{
            position:      "absolute",
            top:           f.top,
            bottom:        f.bottom,
            left:          f.left,
            right:         f.right,
            fontFamily:    f.serif ? "var(--font-serif)" : "var(--font-mono)",
            fontSize:      f.size,
            color:         i % 3 === 2 ? "var(--accent)" : "var(--text)",
            opacity:       f.opacity,
            zIndex:        6,
            pointerEvents: "none",
            userSelect:    "none",
            lineHeight:    1,
            letterSpacing: "0.06em",
          }}
        >
          {f.text}
        </span>
      ))}

      {/* ── Horizontal split hairline ── */}
      <div
        aria-hidden="true"
        style={{
          position:   "absolute",
          top:        "50%",
          left:       "clamp(1.5rem, 5vw, 3.5rem)",
          right:      "clamp(1.5rem, 5vw, 3.5rem)",
          height:     "1px",
          background: "color-mix(in oklch, var(--text) 10%, transparent)",
          transform:  "translateY(-0.5px)",
          zIndex:     15,
          pointerEvents: "none",
        }}
      />

      {/* ── Top curtain panel ── */}
      <div
        ref={topRef}
        aria-hidden="true"
        style={{
          position:   "absolute",
          top: 0, left: 0, right: 0,
          height:     "50%",
          background: "rgba(20,14,10,1)",
          zIndex:     10,
          clipPath:   "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
          overflow:   "hidden",
          display:    "flex",
          alignItems: "flex-end",
        }}
      >
        <span
          style={{
            display:       "block",
            width:         "100%",
            fontFamily:    "var(--font-serif)",
            fontStyle:     "italic",
            fontSize:      "clamp(5rem, 19vw, 17rem)",
            lineHeight:    0.88,
            color:         "var(--text)",
            textAlign:     "center",
            whiteSpace:    "nowrap",
            letterSpacing: "-0.02em",
            userSelect:    "none",
            paddingBottom: "0.02em",
          }}
        >
          {wordA}
        </span>
      </div>

      {/* ── Bottom curtain panel ── */}
      <div
        ref={botRef}
        aria-hidden="true"
        style={{
          position:   "absolute",
          bottom: 0, left: 0, right: 0,
          height:     "50%",
          background: "rgba(20,14,10,1)",
          zIndex:     10,
          clipPath:   "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
          overflow:   "hidden",
          display:    "flex",
          alignItems: "flex-start",
        }}
      >
        <span
          style={{
            display:       "block",
            width:         "100%",
            fontFamily:    "var(--font-serif)",
            fontSize:      "clamp(5rem, 19vw, 17rem)",
            lineHeight:    0.88,
            color:         "var(--accent)",
            textAlign:     "center",
            whiteSpace:    "nowrap",
            letterSpacing: "-0.02em",
            userSelect:    "none",
            paddingTop:    "0.02em",
          }}
        >
          {wordB}
        </span>
      </div>

      {/* ── Content revealed as panels open ── */}
      <div
        ref={contentRef}
        style={{
          position:       "absolute",
          inset:          0,
          zIndex:         5,
          display:        "flex",
          flexDirection:  "column",
          alignItems:     "center",
          justifyContent: "center",
          gap:            "1.8rem",
          opacity:        0,
          padding:        "2rem",
          textAlign:      "center",
        }}
      >
        <p
          style={{
            fontFamily:    "var(--font-mono)",
            fontSize:      "0.66rem",
            letterSpacing: "0.24em",
            color:         "var(--accent)",
            textTransform: "lowercase",
          }}
        >
          {eyebrow}
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: "1.8rem" }}>
          <div
            aria-hidden="true"
            style={{ width: "44px", height: "1px", background: "var(--border)" }}
          />
          <h2
            style={{
              fontFamily:    "var(--font-serif)",
              fontStyle:     "italic",
              fontSize:      "clamp(2.2rem, 5.5vw, 4.5rem)",
              lineHeight:    1.05,
              color:         "var(--text)",
              letterSpacing: "-0.02em",
            }}
          >
            {wordA} {wordB}
          </h2>
          <div
            aria-hidden="true"
            style={{ width: "44px", height: "1px", background: "var(--border)" }}
          />
        </div>

        {/* Scroll indicator line */}
        <div
          aria-hidden="true"
          style={{
            width:      "1px",
            height:     "72px",
            background: "linear-gradient(to bottom, var(--accent) 0%, transparent 100%)",
            marginTop:  "0.5rem",
          }}
        />
      </div>
    </div>
  );
}
