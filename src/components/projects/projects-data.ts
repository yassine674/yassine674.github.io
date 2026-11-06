import type { Lang } from "@/components/i18n"

type T = Record<Lang, string>

export type Project = {
  slug: string
  title: T
  kind: T
  tags: string[]
  // picture or video shown in the card (put the file in public/projets/). Until then a poster is drawn.
  media?: string
}

// Taken from the CV ("newest version.pdf"); the order here is the order of the slider.
export const PROJECTS: Project[] = [
  {
    slug: "siem-wazuh",
    title: { fr: "Home Lab SIEM — Wazuh", en: "SIEM Home Lab — Wazuh" },
    kind: { fr: "Projet personnel", en: "Personal project" },
    tags: ["Wazuh", "Ubuntu", "Windows", "FIM"],
    media: "/projets/siem-wazuh.webp",
  },
  {
    slug: "ad-splunk",
    title: { fr: "Lab Active Directory & Splunk", en: "Active Directory & Splunk Lab" },
    kind: { fr: "Projet personnel", en: "Personal project" },
    tags: ["Windows Server", "Kali", "Splunk", "Kerberos"],
    media: "/projets/ad-splunk.webp",
  },
  {
    slug: "llm-memory",
    title: { fr: "Estimateur mémoire LLM", en: "LLM Memory Estimator" },
    kind: { fr: "Stage — LAMIH", en: "Internship — LAMIH" },
    tags: ["Python", "Streamlit", "Llama", "Quantization"],
    media: "/projets/llm-memory.webp",
  },
  {
    slug: "soc-letsdefend",
    title: { fr: "Monitoring SOC simulé", en: "Simulated SOC Monitoring" },
    kind: { fr: "Formation — LetsDefend", en: "Training — LetsDefend" },
    tags: ["Triage", "Phishing", "Malware", "Threat hunting"],
    media: "/projets/soc-letsdefend.webp",
  },
  {
    slug: "yolo-tracking",
    title: { fr: "Suivi de ballon par IA", en: "AI Ball Tracking" },
    kind: { fr: "Projet académique", en: "Academic project" },
    tags: ["YOLO", "Roboflow", "Python", "Temps réel"],
    media: "/projets/yolo-tracking.webp",
  },
  {
    slug: "mediconnect",
    title: { fr: "MediConnect", en: "MediConnect" },
    kind: { fr: "Plateforme web sécurisée", en: "Secure web platform" },
    tags: ["Auth", "RGPD", "Java", "PostgreSQL"],
    media: "/projets/mediconnect.webp",
  },
]
