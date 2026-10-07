"use client";
import { useScroll, useTransform, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

export interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export function Timeline({ data }: { data: TimelineEntry[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.getBoundingClientRect().height);
    }
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 40%", "end 90%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.05], [0, 1]);

  return (
    <div ref={containerRef} style={{ width: "100%", fontFamily: "var(--font-body)" }}>
      <div ref={ref} style={{ position: "relative", maxWidth: "1200px", margin: "0 auto", paddingBottom: "clamp(4rem,8vw,7rem)" }}>
        {data.map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: "flex-start",
              paddingTop: index === 0 ? "0" : "clamp(3rem,7vw,6rem)",
              gap: "clamp(2rem,5vw,4rem)",
            }}
          >
            {/* Left sticky: year label */}
            <div
              style={{
                position: "sticky",
                top: "40vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                zIndex: 40,
                alignSelf: "flex-start",
                minWidth: "clamp(3rem,8vw,6rem)",
              }}
            >
              {/* Dot */}
              <div
                style={{
                  height: "0.75rem",
                  width: "0.75rem",
                  borderRadius: "50%",
                  background: "var(--bg)",
                  border: "2px solid var(--accent)",
                  flexShrink: 0,
                  marginBottom: "0.75rem",
                  marginLeft: "0.5rem",
                }}
              />
              {/* Year */}
              <span
                style={{
                  fontFamily: "var(--font-serif)",
                  fontWeight: 400,
                  fontStyle: "italic",
                  fontSize: "clamp(1.4rem,3.5vw,3rem)",
                  color: "var(--text-3)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                  writingMode: "vertical-rl",
                  transform: "rotate(180deg)",
                  userSelect: "none",
                }}
              >
                {item.title}
              </span>
            </div>

            {/* Right: content */}
            <div style={{ flex: 1, paddingTop: "0.1rem" }}>
              {item.content}
            </div>
          </div>
        ))}

        {/* Vertical track */}
        <div
          style={{
            position: "absolute",
            left: "0.85rem",
            top: 0,
            bottom: 0,
            width: "1px",
            background: "var(--border)",
            maskImage: "linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)",
          }}
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
              position: "absolute",
              inset: "0 0 auto 0",
              width: "1px",
              background: "linear-gradient(to bottom, transparent, var(--accent) 30%, var(--accent))",
              borderRadius: "9999px",
            }}
          />
        </div>
      </div>
    </div>
  );
}
