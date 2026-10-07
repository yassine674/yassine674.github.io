"use client";
import { useLang } from "@/lib/i18n";

export function LanguageSwitcher({ variant = "light" }: { variant?: "light" | "dark" }) {
  const { lang, toggle } = useLang();

  const active   = variant === "dark" ? "rgba(30,18,12,0.9)"  : "rgba(255,255,255,0.9)";
  const inactive = variant === "dark" ? "rgba(30,18,12,0.35)" : "rgba(255,255,255,0.3)";
  const divider  = variant === "dark" ? "rgba(30,18,12,0.2)"  : "rgba(255,255,255,0.25)";

  return (
    <button
      onClick={toggle}
      aria-label="Switch language"
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 0,
        display: "flex",
        alignItems: "center",
        gap: "0.3rem",
        pointerEvents: "auto",
      }}
    >
      <span style={{ fontFamily: "var(--font-body)", fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: lang === "en" ? active : inactive, transition: "color 0.3s ease" }}>
        EN
      </span>
      <span style={{ color: divider, fontSize: "0.65rem" }}>|</span>
      <span style={{ fontFamily: "var(--font-body)", fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: lang === "fr" ? active : inactive, transition: "color 0.3s ease" }}>
        FR
      </span>
    </button>
  );
}
