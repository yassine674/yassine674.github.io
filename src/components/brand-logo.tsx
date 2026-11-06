import { LOGOS } from "@/components/home/logos"

// One component for every brand logo on the site, in its real colours.
// Two sources: Simple Icons paths (logos.ts) and official logo files (public/logos/, taken from the brands' sites).
// `tone` is the background the logo sits on, so a dark logo is never drawn on a dark background (and vice versa).

type FileLogo = { src: string; wide?: boolean; onDark?: "white"; onLight?: "darker"; darkSrc?: string }
const FILES: Record<string, FileLogo> = {
  Wazuh: { src: "/logos/wazuh.png", darkSrc: "/logos/wazuh-white.png", wide: true },
  TheHive: { src: "/logos/thehive.svg", wide: true, onDark: "white" },
  QRadar: { src: "/logos/ibm.svg", wide: true },
  IBM: { src: "/logos/ibm.svg", wide: true },
  Windows: { src: "/logos/windows.svg" },
  "Windows Server": { src: "/logos/windows.svg" },
  "Active Directory": { src: "/logos/windows.svg" },
  Azure: { src: "/logos/azure.svg" },
  YOLO: { src: "/logos/ultralytics.svg" },
  Hackviser: { src: "/logos/hackviser.svg", wide: true, onLight: "darker" },
  Forage: { src: "/logos/forage.svg", wide: true, onDark: "white" },
  "TryHackMe full": { src: "/logos/tryhackme-full.svg", wide: true },
}
// a few names on the site that map to another logo
const ALIAS: Record<string, string> = { Llama: "Llama", Kali: "Kali Linux" }

export const hasLogo = (name: string) => !!(FILES[name] || LOGOS[ALIAS[name] ?? name])

const dark = (hex: string) => {
  const n = parseInt(hex.slice(1), 16)
  const l = (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255
  return l < 0.3
}

export default function BrandLogo({ name, tone = "light", className }: { name: string; tone?: "light" | "dark"; className?: string }) {
  const f = FILES[name]
  if (f) {
    const filter = tone === "dark" && f.onDark === "white" ? "brightness(0) invert(1)" : tone === "light" && f.onLight === "darker" ? "brightness(0.55)" : undefined
    return (
      // eslint-disable-next-line @next/next/no-img-element -- small static logo file
      <img className={`blogo ${f.wide ? "blogo--wide" : ""} ${className ?? ""}`} src={tone === "dark" && f.darkSrc ? f.darkSrc : f.src} alt={name} style={{ filter }} />
    )
  }
  const l = LOGOS[ALIAS[name] ?? name]
  if (!l) return null
  const fill = tone === "dark" && dark(l.hex) ? "#fff" : l.hex
  return (
    <svg className={`blogo ${className ?? ""}`} viewBox="0 0 24 24" role="img" aria-label={name} style={{ fill }}>
      <path d={l.path} />
    </svg>
  )
}
