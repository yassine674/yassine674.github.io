"use client";
import { useRef, type ReactNode } from "react";

/* Magnetic CTA: the button eases toward the cursor while hovered,
   then springs back on leave. Combined with the .btn-slide fill in
   globals.css this gives a high-end, tactile feel. Falls back to a
   plain anchor under prefers-reduced-motion (no translate applied). */

interface Props {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  external?: boolean;
  ariaLabel?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  strength?: number;
  className?: string;
}

export function MagneticButton({
  href,
  children,
  variant = "primary",
  external = false,
  ariaLabel,
  onClick,
  strength = 0.4,
  className = "",
}: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const handleMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    ref.current.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };

  const handleLeave = () => {
    if (ref.current) ref.current.style.transform = "translate(0, 0)";
  };

  return (
    <a
      ref={ref}
      href={href}
      aria-label={ariaLabel}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`btn-slide ${variant === "primary" ? "btn-primary" : "btn-ghost"} ${className}`.trim()}
    >
      <span style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: "0.6rem" }}>
        {children}
      </span>
    </a>
  );
}
