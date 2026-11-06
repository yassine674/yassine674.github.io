// Texts of the inner pages, taken from the CV ("newest version.pdf"). FR first, EN second.

export const EMAIL = "yassine127mn@gmail.com"
export const GITHUB = "https://github.com/yassine674"
export const LINKEDIN = "https://www.linkedin.com/in/yassine-moumoun"

const fr = {
  common: {
    stack: ["Cybersécurité", "Automatisation", "IA"],
    socials: "Réseaux",
    contactMe: "Me contacter",
  },
  about: {
    title: "À propos",
    begin: {
      label: "Le début",
      ghost: "2022",
      heading: "Tout a commencé par une question : comment on attaque, pour mieux défendre ?",
      body: "Je m'appelle Yassine. Après des classes préparatoires scientifiques au Maroc (MPSI puis MP), j'ai rejoint l'INSA Hauts-de-France pour devenir ingénieur en informatique et cybersécurité.",
    },
    steps: {
      label: "Le déclic",
      heading: "De la théorie aux labs, puis au terrain",
      items: [
        { year: "2022", text: "Classes préparatoires MPSI puis MP, à Casablanca et à Rabat : rigueur, maths, physique." },
        { year: "2025", text: "Entrée à l'INSA Hauts-de-France. Premiers labs SIEM et certifications TryHackMe et Hackviser." },
        { year: "2026", text: "Ambassadeur Hackviser sur le campus. Labs Active Directory et Splunk, détection d'attaques Kerberos." },
      ],
    },
    now: {
      label: "Aujourd'hui",
      ghost: "SOC",
      heading: "Détecter une menace avant qu'elle ne devienne un incident",
      body: "Je m'intéresse surtout à la sécurité défensive et aux environnements cloud : corréler des événements, investiguer une alerte, sécuriser une infrastructure. Je cherche un stage de fin d'études de 6 mois à partir de mars 2028, dans une équipe SOC, cybersécurité ou cloud security.",
    },
    numbers: {
      label: "En chiffres",
      heading: "Yassine, c'est",
      items: [
        { value: 3, text: "mois de SOC simulé sur LetsDefend : triage, investigation, threat hunting" },
        { value: 4, text: "outils SIEM/SOAR pratiqués : Wazuh, Splunk, QRadar, TheHive" },
        { value: 4, text: "langues : arabe, français, anglais (C1), allemand" },
      ],
    },
    also: {
      label: "Aussi",
      ghost: "PARTAGE",
      heading: "Partager. Sensibiliser. Transmettre.",
      body: "En tant qu'ambassadeur Hackviser, j'anime des ateliers pratiques (SIEM, réponse à incident) pour rendre la cybersécurité accessible à toute la communauté INSA, quel que soit le niveau technique.",
    },
    cta: {
      label: "Recrutement",
      heading: "Un stage SOC ou cloud security à pourvoir ?",
      body: "Parlons de votre équipe et de vos besoins.",
    },
  },
  skills: {
    label: "Compétences",
    ghost: "SKILLS",
    heading: "Détecter, investiguer, automatiser la réponse",
    body: "Ce que je sais faire aujourd'hui, appris en labs, en formation pratique et en stage. Chaque ligne est liée à des projets concrets.",
    rows: [
      { title: "SIEM & détection", text: "Déployer et configurer une solution SIEM/XDR, écrire des règles de détection et corréler des événements multi-sources.", tools: "Wazuh · Splunk · QRadar" },
      { title: "Réponse à incident & SOAR", text: "Investiguer des incidents (phishing, malware, intrusions) et automatiser la réponse avec des playbooks.", tools: "TheHive · Playbooks" },
      { title: "Active Directory", text: "Construire et sécuriser une infrastructure AD, détecter les attaques sur Kerberos et les GPO.", tools: "Windows Server · Kerberos · GPO" },
      { title: "Sécurité cloud", text: "Bases de la sécurité AWS et Azure : gestion des identités et des accès, durcissement.", tools: "AWS · Azure · IAM" },
      { title: "Réseaux & systèmes", text: "Comprendre ce qui circule sur un réseau et administrer les systèmes qui le composent.", tools: "TCP/IP · DNS · HTTP · SMB · Linux" },
      { title: "Programmation & IA", text: "Automatiser avec des scripts, construire des outils, entraîner des modèles de vision.", tools: "Python · Java · SQL · Bash · YOLO" },
    ],
    more: "Voir les projets",
    soft: {
      body: "Rigueur analytique, autonomie face aux problèmes complexes, esprit d'équipe et communication claire.",
      button: "Discutons de votre besoin",
      foot: "Arabe (natif) · Français (C1) · Anglais (C1, TOEIC) · Allemand (A1)",
    },
  },
  path: {
    label: "Parcours",
    ghost: "PATH",
    heading: "Formation, expériences et certifications",
    groups: [
      {
        name: "Expérience",
        items: [
          { date: "Sept. 2025 — Janv. 2026", title: "Stage ingénieur — Laboratoire LAMIH", text: "Conception d'une application Streamlit qui calcule la mémoire nécessaire pour déployer des modèles de langage (Llama, Mistral, Gemma) selon leur quantification et leur plateforme cible." },
          { date: "Nov. 2025", cert: "forage", title: "Analyste SOC — Simulation Commonwealth Bank (Forage)", text: "Qualification et investigation d'alertes en contexte bancaire, corrélation de logs pour identifier des indicateurs de compromission, rapports pour des équipes non techniques." },
          { date: "Depuis janv. 2026", title: "Ambassadeur — Hackviser", text: "Ateliers pratiques (SIEM, réponse à incident) pour la communauté INSA." },
        ],
      },
      {
        name: "Formation",
        items: [
          { date: "Depuis sept. 2025", title: "Diplôme d'ingénieur Informatique & Cybersécurité", text: "INSA Hauts-de-France, Valenciennes." },
          { date: "2023 — 2025", title: "Classes préparatoires MP", text: "Al Zahrawi, Rabat, Maroc." },
          { date: "2022 — 2023", title: "Classes préparatoires MPSI", text: "Lycée Mohamed V, Casablanca, Maroc." },
        ],
      },
      {
        name: "Certifications",
        items: [
          { date: "2025", cert: "sal1", title: "Security Analyst Level 1 (SAL1)", text: "TryHackMe." },
          { date: "2025", cert: "capt", title: "Certified Assistant Penetration Tester (CAPT)", text: "Hackviser." },
          { date: "En cours", cert: "sec1", title: "Security Engineer Level 1 (SEC1)", text: "TryHackMe." },
        ],
      },
    ],
  },
  contact: {
    label: "Passons aux choses sérieuses",
    heading: "Un stage SOC ou cloud security ? Parlons-en.",
    write: "M'écrire",
    linkedin: "Voir mon LinkedIn",
    cols: [
      { label: "E-mail", value: EMAIL, href: `mailto:${EMAIL}` },
      { label: "LinkedIn", value: "yassine-moumoun", href: LINKEDIN },
      { label: "GitHub", value: "yassine674", href: GITHUB },
    ],
    place: "Valenciennes, France",
  },
}

type Dict = typeof fr

const en: Dict = {
  common: {
    stack: ["Cybersecurity", "Automation", "AI"],
    socials: "Socials",
    contactMe: "Contact me",
  },
  about: {
    title: "About",
    begin: {
      label: "Beginning",
      ghost: "2022",
      heading: "It all started with one question: how do attackers work, so we can defend better?",
      body: "I'm Yassine. After two years of scientific preparatory classes in Morocco (MPSI then MP), I joined INSA Hauts-de-France to become an engineer in computer science and cybersecurity.",
    },
    steps: {
      label: "Breaking point",
      heading: "From theory to labs, then to the field",
      items: [
        { year: "2022", text: "MPSI then MP preparatory classes in Casablanca and Rabat: rigour, maths, physics." },
        { year: "2025", text: "Joined INSA Hauts-de-France. First SIEM labs and TryHackMe and Hackviser certifications." },
        { year: "2026", text: "Hackviser campus ambassador. Active Directory and Splunk labs, Kerberos attack detection." },
      ],
    },
    now: {
      label: "Today",
      ghost: "SOC",
      heading: "Detecting a threat before it becomes an incident",
      body: "I focus on defensive security and cloud environments: correlating events, investigating alerts, securing infrastructure. I'm looking for a 6-month final-year internship starting March 2028, in a SOC, cybersecurity or cloud security team.",
    },
    numbers: {
      label: "In numbers",
      heading: "Yassine is",
      items: [
        { value: 3, text: "months of simulated SOC on LetsDefend: triage, investigation, threat hunting" },
        { value: 4, text: "SIEM/SOAR tools used: Wazuh, Splunk, QRadar, TheHive" },
        { value: 4, text: "languages: Arabic, French, English (C1), German" },
      ],
    },
    also: {
      label: "Also",
      ghost: "SHARE",
      heading: "Share. Raise awareness. Teach.",
      body: "As a Hackviser ambassador, I run hands-on workshops (SIEM, incident response) to make cybersecurity accessible to the whole INSA community, whatever their technical level.",
    },
    cta: {
      label: "Hiring",
      heading: "Have a SOC or cloud security internship?",
      body: "Let's talk about your team and your needs.",
    },
  },
  skills: {
    label: "Skills",
    ghost: "SKILLS",
    heading: "Detect, investigate, automate the response",
    body: "What I can do today, learned in labs, hands-on training and an internship. Each line is backed by real projects.",
    rows: [
      { title: "SIEM & detection", text: "Deploy and configure a SIEM/XDR, write detection rules and correlate events from many sources.", tools: "Wazuh · Splunk · QRadar" },
      { title: "Incident response & SOAR", text: "Investigate incidents (phishing, malware, intrusions) and automate the response with playbooks.", tools: "TheHive · Playbooks" },
      { title: "Active Directory", text: "Build and secure an AD infrastructure, detect attacks on Kerberos and GPOs.", tools: "Windows Server · Kerberos · GPO" },
      { title: "Cloud security", text: "AWS and Azure security basics: identity and access management, hardening.", tools: "AWS · Azure · IAM" },
      { title: "Networks & systems", text: "Understand what flows through a network and run the systems it connects.", tools: "TCP/IP · DNS · HTTP · SMB · Linux" },
      { title: "Programming & AI", text: "Automate with scripts, build tools, train computer-vision models.", tools: "Python · Java · SQL · Bash · YOLO" },
    ],
    more: "See the projects",
    soft: {
      body: "Analytical rigour, autonomy on complex problems, team spirit and clear communication.",
      button: "Let's discuss your needs",
      foot: "Arabic (native) · French (C1) · English (C1, TOEIC) · German (A1)",
    },
  },
  path: {
    label: "Experience",
    ghost: "PATH",
    heading: "Education, experience and certifications",
    groups: [
      {
        name: "Experience",
        items: [
          { date: "Sept. 2025 — Jan. 2026", title: "Engineering intern — LAMIH laboratory", text: "Built a Streamlit app that computes the memory needed to deploy language models (Llama, Mistral, Gemma) depending on their quantization and target platform." },
          { date: "Nov. 2025", cert: "forage", title: "SOC analyst — Commonwealth Bank simulation (Forage)", text: "Triaged and investigated alerts in a banking context, correlated logs to find indicators of compromise, wrote reports for non-technical teams." },
          { date: "Since Jan. 2026", title: "Ambassador — Hackviser", text: "Hands-on workshops (SIEM, incident response) for the INSA community." },
        ],
      },
      {
        name: "Education",
        items: [
          { date: "Since Sept. 2025", title: "Engineering degree in Computer Science & Cybersecurity", text: "INSA Hauts-de-France, Valenciennes." },
          { date: "2023 — 2025", title: "MP preparatory classes", text: "Al Zahrawi, Rabat, Morocco." },
          { date: "2022 — 2023", title: "MPSI preparatory classes", text: "Lycée Mohamed V, Casablanca, Morocco." },
        ],
      },
      {
        name: "Certifications",
        items: [
          { date: "2025", cert: "sal1", title: "Security Analyst Level 1 (SAL1)", text: "TryHackMe." },
          { date: "2025", cert: "capt", title: "Certified Assistant Penetration Tester (CAPT)", text: "Hackviser." },
          { date: "In progress", cert: "sec1", title: "Security Engineer Level 1 (SEC1)", text: "TryHackMe." },
        ],
      },
    ],
  },
  contact: {
    label: "Let's get down to business",
    heading: "A SOC or cloud security internship? Let's talk.",
    write: "Write to me",
    linkedin: "See my LinkedIn",
    cols: [
      { label: "E-mail", value: EMAIL, href: `mailto:${EMAIL}` },
      { label: "LinkedIn", value: "yassine-moumoun", href: LINKEDIN },
      { label: "GitHub", value: "yassine674", href: GITHUB },
    ],
    place: "Valenciennes, France",
  },
}

export const PAGES = { fr, en }
