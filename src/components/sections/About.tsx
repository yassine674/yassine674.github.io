"use client";

import { motion } from "framer-motion";
import { useLang, t } from "@/lib/i18n";
import { asset } from "@/lib/asset";

const GRID = {
  backgroundColor: "#faf8f5",
  backgroundImage:
    "linear-gradient(hsla(36,31%,69%,.25) 1px,transparent 0)," +
    "linear-gradient(90deg,hsla(36,31%,69%,.25) 1px,transparent 0)",
  backgroundSize: "56px 56px",
} as const;

/* ═══════════════════════════════════════════════════════
   STICKY NOTE SECTION
══════════════════════════════════════════════════════════ */
interface StickyProps {
  stickyNote: string;
  bio1pre: string; bio1into: string; bio1post: string; bio1badge: string;
  bio2badge: string; bio2post: string;
}

function StickyNoteSection({ stickyNote, bio1pre, bio1into, bio1post, bio1badge, bio2badge, bio2post }: StickyProps) {
  return (
    <div style={{ position: "relative", minHeight: "50vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "clamp(4rem,9vw,7rem) clamp(1.5rem,5vw,4rem) clamp(8rem,14vw,12rem)", gap: "clamp(2rem,4vw,3rem)" }}>
      {[{ top: 24, left: 24 }, { top: 24, right: 24 }, { bottom: 24, left: 24 }, { bottom: 24, right: 24 }].map((pos, i) => (
        <div key={i} style={{ position: "absolute", ...pos, width: 20, height: 20, opacity: 0.22, pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: "#a8a29e", transform: "translateY(-50%)" }} />
          <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: "#a8a29e", transform: "translateX(-50%)" }} />
        </div>
      ))}
      <motion.div
        initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }} viewport={{ once: true }}
      >
        <div
          style={{ position: "relative", background: "#FFF3A3", borderRadius: 3, width: "min(560px,90vw)", boxShadow: "0 8px 32px rgba(0,0,0,0.13),0 2px 6px rgba(0,0,0,0.07)", transform: "rotate(3deg)", overflow: "hidden", transition: "transform 0.25s ease, box-shadow 0.25s ease", cursor: "default" }}
          onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "rotate(1.5deg) translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 14px 40px rgba(0,0,0,0.16),0 4px 10px rgba(0,0,0,0.09)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "rotate(3deg)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.13),0 2px 6px rgba(0,0,0,0.07)"; }}
        >
          <div style={{ background: "#F0DC6A", height: 44, display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1px solid rgba(60,30,10,0.08)" }}>
            <span style={{ fontSize: "1.4rem", lineHeight: 1 }}>🌸</span>
          </div>
          <div style={{ position: "absolute", top: 44, left: 0, right: 0, bottom: 0, pointerEvents: "none" }}>
            {[44, 77, 110, 143, 176, 209, 242, 275].map(top => (
              <div key={top} style={{ position: "absolute", top, left: 20, right: 20, height: 1, background: "rgba(60,30,10,0.07)" }} />
            ))}
          </div>
          <div style={{ position: "relative", zIndex: 1, padding: "clamp(1.4rem,3vw,1.8rem) clamp(1.8rem,4vw,2.6rem) clamp(2rem,5vw,2.8rem)" }}>
            <p style={{ fontFamily: "var(--font-handwriting)", fontSize: "clamp(17px,1.9vw,23px)", lineHeight: 1.85, color: "#3d2f0e", margin: 0 }}>
              {stickyNote}
            </p>
          </div>
          <div style={{ position: "absolute", bottom: 0, right: 0, width: 34, height: 34, background: "linear-gradient(135deg, transparent 50%, #E8D040 50%)" }} />
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }} viewport={{ once: true }}
        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75em" }}
      >
        <p style={{ textAlign: "center", maxWidth: 700, fontFamily: "var(--font-mono,monospace)", fontSize: "clamp(13px,1.4vw,17px)", color: "#57534e", lineHeight: 1.7, margin: 0 }}>
          {bio1pre}{" "}
          <img src={asset("/about/messy.svg")} alt="" draggable={false} style={{ display: "inline-block", width: "clamp(22px,2.2vw,30px)", verticalAlign: "middle", margin: "0 3px -2px" }} />
          {" "}{bio1into}{" "}
          <span style={{ position: "relative", display: "inline-block", paddingTop: "22px" }}>
            <img src={asset("/about/highlights.svg")} alt="" draggable={false} style={{ position: "absolute", top: 0, left: "-4px", width: "clamp(18px,1.8vw,24px)", pointerEvents: "none" }} />
            AI
          </span>
          {" "}{bio1post}{" "}
          <span style={{ display: "inline-block", border: "1px solid #a8a29e", padding: "1px 10px", borderRadius: 4, background: "rgba(255,255,255,0.6)" }}>{bio1badge}</span>
        </p>
        <p style={{ textAlign: "center", maxWidth: 700, fontFamily: "var(--font-mono,monospace)", fontSize: "clamp(13px,1.4vw,17px)", color: "#57534e", lineHeight: 1.7, margin: 0 }}>
          <img src={asset("/about/star.svg")} alt="" draggable={false} style={{ display: "inline-block", width: "clamp(22px,2.2vw,30px)", verticalAlign: "middle", marginRight: 6 }} />
          <span style={{ display: "inline-block", border: "1px solid #a8a29e", padding: "1px 10px", borderRadius: 4, background: "rgba(255,255,255,0.6)" }}>{bio2badge}</span>{" "}
          {bio2post}
        </p>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ABOUT
══════════════════════════════════════════════════════════ */
export function About() {
  const { lang } = useLang();
  const tr = t[lang].about;

  return (
    <section id="about" className="section-light" style={{ position: "relative", ...GRID }}>
      <StickyNoteSection
        stickyNote={tr.stickyNote}
        bio1pre={tr.bio1pre}
        bio1into={tr.bio1into}
        bio1post={tr.bio1post}
        bio1badge={tr.bio1badge}
        bio2badge={tr.bio2badge}
        bio2post={tr.bio2post}
      />

      {/* gradient fade into Experience */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 100,
        background: "linear-gradient(to bottom, transparent, rgba(20,14,10,1))",
        pointerEvents: "none",
        zIndex: 10,
      }} />
    </section>
  );
}
