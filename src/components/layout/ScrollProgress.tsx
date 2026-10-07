"use client";
import { useScroll, useSpring, motion } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <motion.div
      aria-hidden="true"
      style={{
        scaleX,
        position: "fixed",
        top: 0, left: 0, right: 0,
        height: "1px",
        background: "var(--accent)",
        transformOrigin: "left",
        zIndex: 9000,
      }}
    />
  );
}
