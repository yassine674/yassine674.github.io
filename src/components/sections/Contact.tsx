"use client";
import React, { useRef, useState, useEffect } from "react";
import { useScroll, useTransform, AnimatePresence, motion } from "framer-motion";
const EMAIL = "yassine127mn@gmail.com";
import { useLang, t } from "@/lib/i18n";
import { GoogleGeminiEffect } from "@/components/ui/GoogleGeminiEffect";
import ContactCards, { LinkedinIcon, XIcon } from "@/components/ui/ContactCards";
import { asset } from "@/lib/asset";
import {
  PopoverFormButton,
  PopoverFormCutOutLeftIcon,
  PopoverFormCutOutRightIcon,
  PopoverFormSeparator,
  PopoverFormSuccess,
} from "@/components/ui/PopoverForm";

type FormState = "idle" | "loading" | "success" | "error";

export function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  const [btnHovered, setBtnHovered] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [formState, setFormState] = useState<FormState>("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const formRef = useRef<HTMLDivElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !message) return;
    setFormState("loading");
    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) throw new Error();
      setFormState("success");
      setTimeout(() => {
        setFormOpen(false);
        setFormState("idle");
      }, 3300);
    } catch {
      setFormState("error");
    }
  }

  useEffect(() => {
    if (formOpen) {
      setName(""); setEmail(""); setMessage(""); setFormState("idle");
    }
  }, [formOpen]);

  useEffect(() => {
    if (!formOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setFormOpen(false); };
    const onClick = (e: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(e.target as Node)) setFormOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => { window.removeEventListener("keydown", onKey); document.removeEventListener("mousedown", onClick); };
  }, [formOpen]);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 70%", "end start"],
  });

  const pathLengthFirst  = useTransform(scrollYProgress, [0, 0.6], [0.05, 1.2]);
  const pathLengthSecond = useTransform(scrollYProgress, [0, 0.6], [0.04, 1.2]);
  const pathLengthThird  = useTransform(scrollYProgress, [0, 0.6], [0.03, 1.2]);
  const pathLengthFourth = useTransform(scrollYProgress, [0, 0.6], [0.01, 1.2]);
  const pathLengthFifth  = useTransform(scrollYProgress, [0, 0.6], [0, 1.2]);

  const { lang } = useLang();
  const tr = t[lang].contact;


  return (
    <section id="contact" aria-labelledby="ct-h" style={{ borderTop: "1px solid var(--border)" }}>
      <div
        ref={ref}
        style={{ height: "350vh", background: "#050505", position: "relative", overflow: "clip" }}
      >
        <div
          style={{
            position: "sticky", top: 0, height: "100vh",
            display: "flex", flexDirection: "column",
            justifyContent: "space-between", alignItems: "center",
            padding: "clamp(2.5rem, 5vw, 4rem) 0 1.5rem",
            zIndex: 10, pointerEvents: "none",
          }}
        >
          {/* TOP â€” badge + headline */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.9rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
              <span style={{ display: "block", width: 8, height: 8, borderRadius: "50%", background: "oklch(72% 0.2 145)", animation: "pulse 2s infinite", flexShrink: 0 }} />
              <span style={{ fontFamily: "var(--font-body)", fontSize: "0.6rem", letterSpacing: "0.22em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>
                {tr.available}
              </span>
            </div>

            <div
              style={{
                textAlign: "center", lineHeight: 1,
                transform: btnHovered ? "translateY(-10px)" : "translateY(0)",
                transition: "transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              }}
            >
              <h2
                id="ct-h"
                style={{
                  fontFamily: "var(--font-display)", fontWeight: 300,
                  fontSize: "clamp(2.4rem, 6vw, 5.5rem)", letterSpacing: "-0.03em",
                  color: "rgba(255,255,255,0.9)", margin: 0, lineHeight: 1.05,
                }}
              >
                {tr.heading1}
              </h2>
              <div
                style={{
                  fontFamily: "var(--font-serif)", fontWeight: 400, fontStyle: "italic",
                  fontSize: "clamp(2.2rem, 5.8vw, 5.2rem)", letterSpacing: "-0.02em",
                  color: "rgba(255,255,255,0.22)", lineHeight: 1.05,
                }}
              >
                {tr.heading2}
              </div>
            </div>
          </div>

          {/* BOTTOM â€” CTA + tagline + email */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", position: "relative" }}>
            <button
              onClick={() => setFormOpen(true)}
              onMouseEnter={() => setBtnHovered(true)}
              onMouseLeave={() => setBtnHovered(false)}
              style={{
                pointerEvents: "auto", cursor: "pointer",
                background: "#fff", border: "none",
                borderRadius: "100px", padding: "1rem 2.6rem",
                fontFamily: "var(--font-body)", fontWeight: 500,
                fontSize: "0.88rem", letterSpacing: "0.04em", color: "#0a0a0a",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                transform: btnHovered ? "scale(1.06)" : "scale(1)",
                boxShadow: btnHovered
                  ? "0 0 0 1px rgba(255,255,255,0.4), 0 0 45px rgba(255,255,255,0.3), 0 0 90px rgba(255,255,255,0.12)"
                  : "0 0 28px rgba(255,255,255,0.18), 0 0 60px rgba(255,255,255,0.07)",
              }}
              aria-label="Open contact form"
            >
              {tr.cta}
            </button>

            <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(0.72rem, 1vw, 0.85rem)", color: "rgba(255,255,255,0.28)", textAlign: "center", maxWidth: "38ch", lineHeight: 1.75, margin: 0 }}>
              {tr.tagline.split("\n").map((line, i) => (
                <React.Fragment key={i}>{line}{i === 0 && <br />}</React.Fragment>
              ))}
            </p>

            <div style={{ pointerEvents: "auto", fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif", fontSize: "16px", marginTop: "3rem" }} className="dark">
              <ContactCards
                email={EMAIL}
                labels={{ copy: tr.copyEmail, copied: tr.emailCopied }}
                github={{
                  username: "yassine674",
                  url: "https://github.com/yassine674",
                  avatar: (
                    <img
                      src="https://github.com/yassine674.png"
                      alt="yassine674"
                      width={40}
                      height={40}
                      style={{ borderRadius: "50%", width: 40, height: 40, objectFit: "cover", flexShrink: 0 }}
                    />
                  ),
                }}
                links={[
                  {
                    label: "LinkedIn",
                    href: "https://www.linkedin.com/in/yassine-moumoun/",
                    icon: <LinkedinIcon />,
                    card: (
                      <div style={{ width: '16rem', overflow: 'hidden' }}>
                        {/* Banner */}
                        <div style={{ height: '3.5rem', position: 'relative', overflow: 'hidden' }}>
                          <img
                            src={asset("/linkedin-banner.jpg")}
                            alt=""
                            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
                          />
                        </div>
                        {/* Avatar overlapping banner */}
                        <div style={{ padding: '0 1rem 0.6rem', position: 'relative' }}>
                          <img
                            src="https://github.com/yassine674.png"
                            alt="Yassine MOUMOUN"
                            width={56}
                            height={56}
                            style={{
                              borderRadius: '50%',
                              width: 56,
                              height: 56,
                              objectFit: 'cover',
                              border: '3px solid #18181b',
                              position: 'absolute',
                              top: -28,
                              left: '1rem',
                            }}
                          />
                          <div style={{ paddingTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                            <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Yassine MOUMOUN</span>
                            <span style={{ fontSize: '0.8rem', color: 'rgb(161 161 170)', lineHeight: 1.4 }}>AI &amp; ML Engineer · Mines Saint-Étienne → ENS Paris-Saclay</span>
                            <span style={{ fontSize: '0.75rem', color: 'rgb(113 113 122)', marginTop: '0.15rem' }}>Morocco · 500+ connections</span>
                          </div>
                        </div>
                      </div>
                    ),
                  },
                  {
                    label: "X",
                    href: "https://x.com/yassine674",
                    icon: <XIcon />,
                    card: (
                      <div style={{ width: '16rem', padding: '0.8rem' }} className="flex items-center gap-3">
                        <img
                          src="https://github.com/yassine674.png"
                          alt="yassine674"
                          width={40}
                          height={40}
                          style={{ borderRadius: "50%", width: 40, height: 40, objectFit: "cover", flexShrink: 0 }}
                        />
                        <div className="flex flex-col">
                          <span className="font-medium">Yassine MOUMOUN</span>
                          <span className="text-sm text-zinc-500">@yassine674</span>
                        </div>
                      </div>
                    ),
                  },
                ]}
              />
            </div>
          </div>
        </div>

        {/* Contact form modal */}
        <AnimatePresence>
          {formOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setFormOpen(false)}
                style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(2px)", zIndex: 9998 }}
              />
              <motion.div
                ref={formRef}
                initial={{ opacity: 0, scale: 0.96, y: 14 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 14 }}
                transition={{ type: "spring", duration: 0.4, bounce: 0 }}
                className="grid grid-cols-1 min-[540px]:grid-cols-[1fr_1.15fr]"
                style={{
                  position: "fixed",
                  top: "50%",
                  left: "50%",
                  translate: "-50% -50%",
                  zIndex: 9999,
                  width: "min(680px, 94vw)",
                  borderRadius: 20,
                  overflow: "hidden",
                  background: "rgba(255,255,255,0.07)",
                  backdropFilter: "blur(28px) saturate(1.4)",
                  WebkitBackdropFilter: "blur(28px) saturate(1.4)",
                  border: "1px solid rgba(255,255,255,0.14)",
                  boxShadow: "0 40px 120px rgba(0,0,0,0.5), 0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
                }}
              >
                {/* LEFT â€” invitation panel */}
                <div
                  className="hidden min-[540px]:flex flex-col justify-between"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    padding: "2rem",
                    borderRight: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.8rem" }}>
                      <span style={{ display: "block", width: 7, height: 7, borderRadius: "50%", background: "oklch(72% 0.2 145)", animation: "pulse 2s infinite", flexShrink: 0 }} />
                      <span style={{ fontSize: 10, letterSpacing: "0.14em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", fontFamily: "var(--font-body)" }}>Open to collabs</span>
                    </div>
                    <h3 style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 800,
                      fontSize: "clamp(1.7rem, 3vw, 2.4rem)",
                      color: "#fff",
                      lineHeight: 1.05,
                      letterSpacing: "-0.04em",
                      margin: 0,
                    }}>
                      Let&apos;s build<br />something<br />together.
                    </h3>
                    <p style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.75rem",
                      color: "rgba(255,255,255,0.3)",
                      lineHeight: 1.65,
                      marginTop: "1rem",
                      maxWidth: "22ch",
                    }}>
                      AI research, ML systems, or anything in between.
                    </p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
                    <img
                      src="https://github.com/yassine674.png"
                      alt="Yassine Moumoun"
                      width={34}
                      height={34}
                      style={{ borderRadius: "50%", width: 34, height: 34, objectFit: "cover", flexShrink: 0 }}
                    />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", fontFamily: "var(--font-body)", lineHeight: 1.2 }}>Yassine Moumoun</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-body)" }}>AI &amp; ML Engineer</div>
                    </div>
                  </div>
                </div>

                {/* RIGHT â€” form */}
                <div style={{ position: "relative", overflow: "hidden" }}>
                  <AnimatePresence mode="popLayout">
                    {formState === "success" ? (
                      <motion.div
                        key="success"
                        initial={{ y: -32, opacity: 0, filter: "blur(4px)" }}
                        animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                        transition={{ type: "spring", duration: 0.4, bounce: 0 }}
                        style={{ padding: "3rem 2rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 300, color: "#fff" }}
                      >
                        <PopoverFormSuccess title={tr.successTitle} description={tr.successDesc} />
                      </motion.div>
                    ) : (
                      <motion.form
                        key="form"
                        exit={{ y: 8, opacity: 0, filter: "blur(4px)" }}
                        transition={{ type: "spring", duration: 0.4, bounce: 0 }}
                        onSubmit={handleSubmit}
                        style={{ display: "flex", flexDirection: "column", padding: "1.6rem", gap: "0.85rem" }}
                      >
                        {/* Header row */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.2rem" }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-body)", letterSpacing: "0.01em" }}>{tr.formTitle}</span>
                          <button type="button" onClick={() => setFormOpen(false)} aria-label="Close" style={{ background: "rgba(255,255,255,0.07)", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.45)", fontSize: 15, lineHeight: 1, padding: "4px 8px", borderRadius: 6 }}>×</button>
                        </div>

                        {/* Name + Email grouped block */}
                        <div style={{ borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden", background: "rgba(255,255,255,0.06)" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", padding: "12px 14px" }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></svg>
                            <input
                              type="text"
                              value={name}
                              onChange={e => setName(e.target.value)}
                              placeholder={tr.namePlaceholder}
                              style={{ flex: 1, background: "none", border: "none", outline: "none", fontSize: 13.5, color: "#fff", fontFamily: "var(--font-body)" }}
                              required
                            />
                          </div>
                          <div style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />
                          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", padding: "12px 14px" }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                            <input
                              type="email"
                              value={email}
                              onChange={e => setEmail(e.target.value)}
                              placeholder="you@example.com"
                              style={{ flex: 1, background: "none", border: "none", outline: "none", fontSize: 13.5, color: "#fff", fontFamily: "var(--font-body)" }}
                              required
                            />
                          </div>
                        </div>

                        {/* Message block */}
                        <div style={{ borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "flex-start", gap: "0.65rem", padding: "12px 14px" }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: 2, flexShrink: 0 }}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                          <textarea
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            rows={4}
                            placeholder={tr.messagePlaceholder}
                            style={{ flex: 1, background: "none", border: "none", outline: "none", resize: "none", fontSize: 13.5, color: "#fff", lineHeight: 1.55, fontFamily: "var(--font-body)" }}
                            required
                          />
                        </div>

                        {/* Submit */}
                        <button
                          type="submit"
                          disabled={formState === "loading"}
                          style={{
                            padding: "12px",
                            borderRadius: 12,
                            border: "none",
                            background: "#fff",
                            color: "#0a0a0a",
                            fontSize: 13.5,
                            fontWeight: 600,
                            cursor: formState === "loading" ? "default" : "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8,
                            opacity: formState === "loading" ? 0.7 : 1,
                            fontFamily: "var(--font-body)",
                            transition: "opacity 0.2s",
                          }}
                        >
                          {formState === "loading" ? (
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ animation: "spin 1s linear infinite" }}><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeDasharray="20" strokeDashoffset="10" /></svg>
                          ) : tr.sendButton}
                        </button>
                        {formState === "error" && (
                          <p style={{ fontSize: 12, color: "rgba(255,100,100,0.85)", textAlign: "center", margin: 0, fontFamily: "var(--font-body)" }}>
                            {tr.errorText}
                          </p>
                        )}
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Animated lines */}
        <div style={{ position: "absolute", inset: 0, zIndex: 1, transform: "translateY(-5.5vh)" }}>
          <GoogleGeminiEffect
            pathLengths={[pathLengthFirst, pathLengthSecond, pathLengthThird, pathLengthFourth, pathLengthFifth]}
          />
        </div>
      </div>
    </section>
  );
}
