// Texts of the home page sections (everything comes from the CV, "newest version.pdf"). FR first, EN second.
import { EMAIL, GITHUB, LINKEDIN } from "@/components/page/content"

const fr = {
  features: {
    skip: "Passer",
    slides: [
      { title: "Je détecte les menaces avant qu'elles ne deviennent des incidents", media: "/img/servers.webp" },
      { title: "J'investigue les alertes et j'automatise la réponse", media: "/img/lock.webp" },
      { title: "Je mets l'IA et le code au service de la sécurité", media: "/img/keyboard.webp" },
    ],
  },
  skills: {
    label: "Ce que je fais",
    ghost: "DÉFENSE",
    title: "Je détecte les menaces, j'investigue et j'automatise la réponse",
    cols: [
      { num: "01", title: "SIEM & détection", text: "Déployer un SIEM, écrire des règles de détection, corréler des événements multi-sources.", tags: "Wazuh · Splunk · QRadar" },
      { num: "02", title: "Réponse à incident", text: "Investiguer phishing, malware et intrusions, puis automatiser la réponse avec des playbooks.", tags: "TheHive · SOAR" },
      { num: "03", title: "Automatisation & IA", text: "Scripts, outils et modèles : de l'estimateur mémoire LLM au suivi d'objets par YOLO.", tags: "Python · Bash · YOLO" },
    ],
    more: "Toutes mes compétences",
  },
  projects: {
    label: "Projets",
    ghost: "LABS",
    title: "Des labs et des projets concrets, du SOC à l'IA",
    more: "Voir les projets",
  },
  certs: {
    label: "Certifications",
    title: "Mes certifications, vérifiables en un clic",
  },
  awards: {
    label: "En chiffres",
    items: [
      { ico: "Projets", logos: [] as string[], value: 6, lines: ["Projets cyber,", "cloud et IA"] },
      { ico: "SIEM / SOAR", logos: ["Splunk", "Wazuh", "QRadar", "TheHive"], value: 4, lines: ["Outils SIEM / SOAR", "pratiqués"] },
      { ico: "LetsDefend", logos: [] as string[], value: 3, lines: ["Mois de SOC simulé", "sur LetsDefend"] },
      { ico: "Langues", logos: [] as string[], value: 4, lines: ["Arabe · Français", "Anglais · Allemand"] },
    ],
  },
  fans: {
    label: "Passionné de cyber",
    ghost: "HACKER",
    title: "Comprendre comment on attaque, pour mieux défendre",
    text: "Après des classes préparatoires scientifiques au Maroc, j'ai rejoint l'INSA Hauts-de-France pour devenir ingénieur en informatique et cybersécurité. Je corrèle des événements, j'investigue des alertes et je sécurise des infrastructures, en poussant chaque détail jusqu'à la",
    perfect: "précision",
  },
  ways: [
    { label: "Blue team · SOC", title: "Défense", href: "/competences", btn: "Compétences", media: "/projets/soc-letsdefend.webp" },
    { label: "Labs · IA", title: "Projets", href: "/projets", btn: "Voir les projets", media: "/img/code.webp" },
  ],
  tools: {
    label: "Les outils que j'utilise",
    items: ["Splunk", "Wazuh", "QRadar", "TheHive", "Kali Linux", "Ubuntu", "AWS", "Python", "Bash", "Java", "Streamlit", "Roboflow"],
  },
  path: {
    label: "Parcours",
    title: "De la prépa au SOC",
    cols: [
      { num: "2022", text: "Classes préparatoires MPSI puis MP, à Casablanca et à Rabat." },
      { num: "2025", text: "INSA Hauts-de-France, cycle ingénieur informatique & cybersécurité. Stage au LAMIH." },
      { num: "2026", text: "Ambassadeur Hackviser. Labs Active Directory, Splunk et détection Kerberos." },
    ],
    more: "Tout le parcours",
  },
  contact: {
    label: "Passons aux choses sérieuses",
    title: "Je cherche un stage de 6 mois à partir de mars 2028",
    write: "M'écrire",
    cv: "Voir mon parcours",
    cols: [
      { label: "E-mail", value: EMAIL, href: `mailto:${EMAIL}`, sub: "Valenciennes, France" },
      { label: "LinkedIn", value: "yassine-moumoun", href: LINKEDIN, sub: "SOC · cybersécurité · cloud security" },
      { label: "GitHub", value: "yassine674", href: GITHUB, sub: "Labs et outils" },
    ],
  },
}

type Dict = typeof fr

const en: Dict = {
  features: {
    skip: "Skip",
    slides: [
      { title: "I detect threats before they become incidents", media: "/img/servers.webp" },
      { title: "I investigate alerts and automate the response", media: "/img/lock.webp" },
      { title: "I put AI and code to work for security", media: "/img/keyboard.webp" },
    ],
  },
  skills: {
    label: "What I do",
    ghost: "DEFENSE",
    title: "I detect threats, investigate them and automate the response",
    cols: [
      { num: "01", title: "SIEM & detection", text: "Deploy a SIEM, write detection rules, correlate events from many sources.", tags: "Wazuh · Splunk · QRadar" },
      { num: "02", title: "Incident response", text: "Investigate phishing, malware and intrusions, then automate the response with playbooks.", tags: "TheHive · SOAR" },
      { num: "03", title: "Automation & AI", text: "Scripts, tools and models: from the LLM memory estimator to YOLO object tracking.", tags: "Python · Bash · YOLO" },
    ],
    more: "All my skills",
  },
  projects: {
    label: "Projects",
    ghost: "LABS",
    title: "Labs and real projects, from the SOC to AI",
    more: "See the projects",
  },
  certs: {
    label: "Certifications",
    title: "My certifications, one click to check them",
  },
  awards: {
    label: "In numbers",
    items: [
      { ico: "Projects", logos: [] as string[], value: 6, lines: ["Cyber, cloud", "and AI projects"] },
      { ico: "SIEM / SOAR", logos: ["Splunk", "Wazuh", "QRadar", "TheHive"], value: 4, lines: ["SIEM / SOAR tools", "used"] },
      { ico: "LetsDefend", logos: [] as string[], value: 3, lines: ["Months of simulated", "SOC on LetsDefend"] },
      { ico: "Languages", logos: [] as string[], value: 4, lines: ["Arabic · French", "English · German"] },
    ],
  },
  fans: {
    label: "Into cyber",
    ghost: "HACKER",
    title: "Understand how attacks work, to defend better",
    text: "After scientific preparatory classes in Morocco, I joined INSA Hauts-de-France to become a computer science and cybersecurity engineer. I correlate events, investigate alerts and secure infrastructures, taking every detail to",
    perfect: "precision",
  },
  ways: [
    { label: "Blue team · SOC", title: "Defense", href: "/competences", btn: "Skills", media: "/projets/soc-letsdefend.webp" },
    { label: "Labs · AI", title: "Projects", href: "/projets", btn: "See the projects", media: "/img/code.webp" },
  ],
  tools: {
    label: "Tools I use",
    items: fr.tools.items,
  },
  path: {
    label: "Path",
    title: "From prep school to the SOC",
    cols: [
      { num: "2022", text: "MPSI then MP preparatory classes, in Casablanca and Rabat." },
      { num: "2025", text: "INSA Hauts-de-France, computer science & cybersecurity engineering. Internship at LAMIH." },
      { num: "2026", text: "Hackviser ambassador. Active Directory, Splunk and Kerberos detection labs." },
    ],
    more: "The whole path",
  },
  contact: {
    label: "Let's get down to business",
    title: "I am looking for a 6-month internship from March 2028",
    write: "Write to me",
    cv: "See my path",
    cols: [
      { label: "E-mail", value: EMAIL, href: `mailto:${EMAIL}`, sub: "Valenciennes, France" },
      { label: "LinkedIn", value: "yassine-moumoun", href: LINKEDIN, sub: "SOC · cybersecurity · cloud security" },
      { label: "GitHub", value: "yassine674", href: GITHUB, sub: "Labs and tools" },
    ],
  },
}

export const HOME = { fr, en }
