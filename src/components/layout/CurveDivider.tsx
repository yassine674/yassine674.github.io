"use client";

/* Smooth curved seam between two sections of different colour.
   `from` is the colour of the section above (fills the backdrop),
   `to` is the section below, drawn as a shallow dome rising into it.
   An optional 1px accent stroke traces the seam for a refined edge. */

const COLORS = {
  dark: "oklch(11% 0.018 28)",
  paper: "oklch(96% 0.03 78)",
} as const;

type Tone = keyof typeof COLORS | (string & {});

function resolve(tone: Tone) {
  return tone in COLORS ? COLORS[tone as keyof typeof COLORS] : (tone as string);
}

export function CurveDivider({
  from,
  to,
  accent,
}: {
  from: Tone;
  to: Tone;
  accent?: string;
}) {
  const fromC = resolve(from);
  const toC = resolve(to);

  return (
    <div
      aria-hidden="true"
      style={{
        background: fromC,
        lineHeight: 0,
        marginTop: "-1px",
        marginBottom: "-1px",
        position: "relative",
        zIndex: 2,
      }}
    >
      <svg
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        style={{ display: "block", width: "100%", height: "clamp(48px, 6vw, 100px)" }}
      >
        <path d="M0,100 L0,34 Q720,-28 1440,34 L1440,100 Z" fill={toC} />
        {accent && (
          <path
            d="M0,34 Q720,-28 1440,34"
            fill="none"
            stroke={accent}
            strokeWidth="1.5"
            opacity="0.6"
            vectorEffect="non-scaling-stroke"
          />
        )}
      </svg>
    </div>
  );
}
