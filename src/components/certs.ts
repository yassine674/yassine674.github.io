// Certifications shown on the site. `file` is what opens when you click one: an image (.png/.jpg/.webp/.svg)
// or a PDF. The .svg files in public/certifs/ are temporary placeholders, to be replaced by the real certificates.
// `tile`: background of the logo tile, `tone`: whether that background is dark or light (picks the logo version).
export type Cert = {
  id: string
  code: string
  title: string
  issuer: string
  logo: string
  tile: string
  tone: "light" | "dark"
  done: boolean
  date: { fr: string; en: string }
  file: string
}

export const CERTS: Record<string, Cert> = {
  sal1: { id: "sal1", code: "SAL1", title: "Security Analyst Level 1", issuer: "TryHackMe", logo: "TryHackMe full", tile: "#212c42", tone: "dark", done: true, date: { fr: "2025", en: "2025" }, file: "/certifs/sal1.svg" },
  capt: { id: "capt", code: "CAPT", title: "Certified Assistant Penetration Tester", issuer: "Hackviser", logo: "Hackviser", tile: "#0d120d", tone: "dark", done: true, date: { fr: "2025", en: "2025" }, file: "/certifs/capt.svg" },
  forage: { id: "forage", code: "Job Simulation", title: "Cybersecurity — Commonwealth Bank", issuer: "Forage", logo: "Forage", tile: "#f4f6fb", tone: "light", done: true, date: { fr: "Nov. 2025", en: "Nov. 2025" }, file: "/certifs/forage.svg" },
  sec1: { id: "sec1", code: "SEC1", title: "Security Engineer Level 1", issuer: "TryHackMe", logo: "TryHackMe full", tile: "#212c42", tone: "dark", done: false, date: { fr: "En cours", en: "In progress" }, file: "/certifs/sec1.svg" },
}
export const CERT_ORDER = ["sal1", "capt", "forage", "sec1"]
