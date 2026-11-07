import type { Lang } from "@/components/i18n"
import { GITHUB } from "@/components/page/content"

// The story of each project (its own page, /projets/<slug>), told to the visitor in the first person.
// Facts come from the CV; the technical explanations describe how these tools work and how such a lab is built.
// `shots`: screenshots. A shot without `src` is drawn as an empty frame "capture à venir" until the real one is added
// (put the file in public/projets/<slug>/ and set src). `github`: link to the repository (the profile until then).

type T = Record<Lang, string>
export type Detail = {
  intro: T
  context: T
  build: { title: T; text: T }[]
  tools: { name: string; role: T }[]
  result: T
  shots: { src?: string; caption: T }[]
  github: string
}

const soon: T = { fr: "Capture à venir", en: "Screenshot coming" }

export const DETAILS: Record<string, Detail> = {
  "siem-wazuh": {
    intro: {
      fr: "J'ai monté mon propre SIEM à la maison pour comprendre, de l'intérieur, comment un SOC voit ce qui se passe sur ses machines.",
      en: "I built my own SIEM at home to understand, from the inside, how a SOC sees what happens on its machines.",
    },
    context: {
      fr: "Dans un SOC, tout part du SIEM : c'est l'outil qui rassemble les journaux de toutes les machines et lève une alerte quand quelque chose cloche. Je voulais arrêter de le voir seulement en cours, alors je l'ai installé, configuré et testé moi-même.",
      en: "In a SOC, everything starts with the SIEM: the tool that gathers the logs of every machine and raises an alert when something is off. I wanted to stop seeing it only in class, so I installed, configured and tested it myself.",
    },
    build: [
      {
        title: { fr: "Le serveur", en: "The server" },
        text: {
          fr: "J'ai installé le Wazuh Manager sur une machine Ubuntu. C'est le cerveau : il reçoit les événements, les décode et les compare à des règles. Le tableau de bord sert ensuite à tout visualiser.",
          en: "I installed the Wazuh Manager on an Ubuntu machine. It is the brain: it receives events, decodes them and checks them against rules. The dashboard then shows everything.",
        },
      },
      {
        title: { fr: "Les agents", en: "The agents" },
        text: {
          fr: "Sur les postes Windows, j'ai déployé des agents Wazuh. Chaque agent lit les journaux de sa machine et les envoie au serveur en continu.",
          en: "On the Windows machines I deployed Wazuh agents. Each agent reads its machine's logs and sends them to the server continuously.",
        },
      },
      {
        title: { fr: "Les règles de détection", en: "Detection rules" },
        text: {
          fr: "J'ai écrit mes propres règles : quand un événement correspond à un scénario suspect, Wazuh crée une alerte avec un niveau de gravité.",
          en: "I wrote my own rules: when an event matches a suspicious scenario, Wazuh creates an alert with a severity level.",
        },
      },
      {
        title: { fr: "L'intégrité des fichiers", en: "File integrity" },
        text: {
          fr: "J'ai activé le File Integrity Monitoring (FIM) : si un fichier sensible est créé, modifié ou supprimé, je le vois apparaître dans les dashboards en temps réel.",
          en: "I turned on File Integrity Monitoring (FIM): if a sensitive file is created, changed or deleted, it shows up in the real-time dashboards.",
        },
      },
    ],
    tools: [
      { name: "Wazuh", role: { fr: "Le SIEM / XDR : collecte, règles, alertes, dashboards", en: "The SIEM / XDR: collection, rules, alerts, dashboards" } },
      { name: "Ubuntu", role: { fr: "Le système du serveur Wazuh", en: "The Wazuh server's system" } },
      { name: "Windows", role: { fr: "Les postes surveillés, avec leurs agents", en: "The monitored machines, with their agents" } },
      { name: "FIM", role: { fr: "La surveillance des fichiers sensibles", en: "Watching sensitive files" } },
    ],
    result: {
      fr: "Aujourd'hui j'ai un environnement de supervision qui tourne : je peux y rejouer des scénarios d'attaque et vérifier qu'ils sont bien détectés.",
      en: "Today I have a working monitoring environment: I can replay attack scenarios in it and check that they are detected.",
    },
    shots: [{ caption: soon }, { caption: soon }],
    github: GITHUB,
  },
  "ad-splunk": {
    intro: {
      fr: "J'ai construit un petit réseau d'entreprise avec Active Directory, je l'ai attaqué depuis Kali Linux, puis j'ai cherché les traces de ces attaques dans Splunk.",
      en: "I built a small company network with Active Directory, attacked it from Kali Linux, then looked for the attacks' traces in Splunk.",
    },
    context: {
      fr: "Presque toutes les entreprises gèrent leurs comptes avec Active Directory, et beaucoup d'attaques passent par Kerberos, le protocole qui distribue les « tickets » d'authentification. Je voulais voir ces attaques côté défenseur : qu'est-ce qu'elles laissent dans les journaux ?",
      en: "Almost every company manages its accounts with Active Directory, and many attacks go through Kerberos, the protocol that hands out authentication \"tickets\". I wanted to see those attacks from the defender's side: what do they leave in the logs?",
    },
    build: [
      {
        title: { fr: "Le domaine", en: "The domain" },
        text: {
          fr: "Un contrôleur de domaine sous Windows Server, avec des utilisateurs et des machines, pour reproduire un vrai réseau d'entreprise.",
          en: "A domain controller on Windows Server, with users and machines, to reproduce a real company network.",
        },
      },
      {
        title: { fr: "L'attaquant", en: "The attacker" },
        text: {
          fr: "Une machine Kali Linux dans le même réseau, d'où je lance des attaques sur l'authentification Kerberos.",
          en: "A Kali Linux machine on the same network, from which I run attacks on Kerberos authentication.",
        },
      },
      {
        title: { fr: "La collecte", en: "Collection" },
        text: {
          fr: "Les journaux de sécurité Windows partent vers Splunk, qui les indexe pour qu'on puisse les interroger.",
          en: "The Windows security logs are sent to Splunk, which indexes them so they can be searched.",
        },
      },
      {
        title: { fr: "La détection", en: "Detection" },
        text: {
          fr: "Avec des recherches Splunk, je corrèle les événements Kerberos et je repère les anomalies de comportement qui trahissent l'attaque.",
          en: "With Splunk searches, I correlate the Kerberos events and spot the behavioural anomalies that give the attack away.",
        },
      },
    ],
    tools: [
      { name: "Windows Server", role: { fr: "Le contrôleur de domaine Active Directory", en: "The Active Directory domain controller" } },
      { name: "Kali Linux", role: { fr: "La machine de l'attaquant", en: "The attacker's machine" } },
      { name: "Splunk", role: { fr: "Indexation des logs, recherches et corrélation", en: "Log indexing, searches and correlation" } },
      { name: "Kerberos", role: { fr: "Le protocole d'authentification visé", en: "The authentication protocol targeted" } },
    ],
    result: {
      fr: "J'ai maintenant une idée concrète de ce qu'une attaque Active Directory laisse dans les logs, et des recherches Splunk prêtes pour la repérer.",
      en: "I now have a concrete idea of what an Active Directory attack leaves in the logs, and Splunk searches ready to spot it.",
    },
    shots: [{ caption: soon }, { caption: soon }],
    github: GITHUB,
  },
  "llm-memory": {
    intro: {
      fr: "Pendant mon stage au laboratoire LAMIH, j'ai créé un outil qui répond à une question simple : combien de mémoire faut-il pour faire tourner ce modèle de langage ?",
      en: "During my internship at the LAMIH lab, I built a tool that answers a simple question: how much memory does it take to run this language model?",
    },
    context: {
      fr: "Stage ingénieur de 4e année, de septembre 2025 à janvier 2026. Les formules pour estimer la mémoire d'un LLM existent dans la littérature, mais elles sont difficiles à appliquer à un vrai déploiement. Mon rôle : les transformer en un outil fiable que n'importe qui peut utiliser.",
      en: "4th-year engineering internship, September 2025 to January 2026. Formulas to estimate an LLM's memory exist in the literature, but they are hard to apply to a real deployment. My job: turn them into a reliable tool anyone can use.",
    },
    build: [
      {
        title: { fr: "Comprendre les formules", en: "Understanding the formulas" },
        text: {
          fr: "La mémoire d'un modèle dépend surtout de son nombre de paramètres et de la place que prend chaque paramètre. J'ai traduit ces formules théoriques en calculs Python.",
          en: "A model's memory mostly depends on its number of parameters and how much space each parameter takes. I turned those theoretical formulas into Python calculations.",
        },
      },
      {
        title: { fr: "La quantification", en: "Quantization" },
        text: {
          fr: "Un même modèle peut être stocké avec plus ou moins de précision (on parle de quantification). Moins de précision, c'est moins de mémoire : l'outil en tient compte.",
          en: "The same model can be stored with more or less precision (quantization). Less precision means less memory: the tool takes it into account.",
        },
      },
      {
        title: { fr: "Les modèles et les cibles", en: "Models and targets" },
        text: {
          fr: "L'outil couvre des familles de modèles comme Llama, Mistral et Gemma, et adapte le résultat à la plateforme cible.",
          en: "The tool covers model families such as Llama, Mistral and Gemma, and adapts the result to the target platform.",
        },
      },
      {
        title: { fr: "L'interface", en: "The interface" },
        text: {
          fr: "J'ai construit l'application avec Streamlit : on choisit le modèle et ses réglages, et la mémoire nécessaire s'affiche aussitôt.",
          en: "I built the app with Streamlit: you pick the model and its settings, and the memory needed shows up right away.",
        },
      },
    ],
    tools: [
      { name: "Python", role: { fr: "Les calculs et toute la logique", en: "The calculations and all the logic" } },
      { name: "Streamlit", role: { fr: "L'interface web de l'outil", en: "The tool's web interface" } },
      { name: "Llama", role: { fr: "Une des familles de modèles couvertes", en: "One of the model families covered" } },
      { name: "Quantization", role: { fr: "Le réglage qui change la mémoire nécessaire", en: "The setting that changes the memory needed" } },
    ],
    result: {
      fr: "Un outil qui donne la mémoire réellement nécessaire avant de déployer un modèle, au lieu de la deviner.",
      en: "A tool that gives the memory actually needed before deploying a model, instead of guessing it.",
    },
    shots: [{ caption: soon }, { caption: soon }],
    github: GITHUB,
  },
  "soc-letsdefend": {
    intro: {
      fr: "Pendant trois mois, je me suis mis dans la peau d'un analyste SOC sur LetsDefend, une plateforme qui simule un vrai centre de sécurité.",
      en: "For three months, I worked as a SOC analyst on LetsDefend, a platform that simulates a real security centre.",
    },
    context: {
      fr: "Sur LetsDefend, les alertes arrivent comme dans un vrai SOC. Il faut décider vite : fausse alerte ou vraie attaque ? Je voulais apprendre la méthode d'un analyste, du premier tri jusqu'à la conclusion.",
      en: "On LetsDefend, alerts come in as in a real SOC. You have to decide fast: false alarm or real attack? I wanted to learn an analyst's method, from first triage to conclusion.",
    },
    build: [
      {
        title: { fr: "Le triage", en: "Triage" },
        text: {
          fr: "Chaque alerte est d'abord triée : phishing, malware ou intrusion ? Est-ce que ça mérite une enquête ?",
          en: "Each alert is first triaged: phishing, malware or intrusion? Does it deserve an investigation?",
        },
      },
      {
        title: { fr: "L'investigation", en: "Investigation" },
        text: {
          fr: "Pour les alertes retenues, je remonte le fil : quel mail, quel fichier, quelle machine, quelle connexion.",
          en: "For the alerts kept, I follow the thread: which email, which file, which machine, which connection.",
        },
      },
      {
        title: { fr: "Plusieurs sources", en: "Several sources" },
        text: {
          fr: "Je croise plusieurs sources de données (logs, messagerie, poste de travail) pour ne pas conclure sur un seul indice.",
          en: "I cross several data sources (logs, email, endpoint) so I never conclude on a single clue.",
        },
      },
      {
        title: { fr: "Le threat hunting", en: "Threat hunting" },
        text: {
          fr: "Au-delà des alertes, je pars à la chasse aux menaces selon des méthodologies standardisées.",
          en: "Beyond alerts, I go threat hunting with standardised methodologies.",
        },
      },
    ],
    tools: [
      { name: "Triage", role: { fr: "Trier vite et bien les alertes", en: "Sorting alerts fast and right" } },
      { name: "Phishing", role: { fr: "Analyse des mails piégés", en: "Analysing malicious emails" } },
      { name: "Malware", role: { fr: "Analyse des fichiers malveillants", en: "Analysing malicious files" } },
      { name: "Threat hunting", role: { fr: "Chercher ce que les alertes ont raté", en: "Finding what the alerts missed" } },
    ],
    result: {
      fr: "Une méthode d'analyse rodée sur des alertes réelles, que j'ai réutilisée ensuite dans la simulation SOC de la Commonwealth Bank.",
      en: "An analysis method practised on real alerts, which I then used again in the Commonwealth Bank SOC simulation.",
    },
    shots: [{ caption: soon }, { caption: soon }],
    github: GITHUB,
  },
  "yolo-tracking": {
    intro: {
      fr: "Dans ce projet académique, j'ai appris à une IA à suivre un ballon de football en temps réel.",
      en: "In this academic project, I taught an AI to follow a football in real time.",
    },
    context: {
      fr: "Un ballon, c'est petit, rapide, souvent caché par les joueurs. Pour le suivre, il faut un modèle capable de le retrouver image après image, assez vite pour suivre la vidéo.",
      en: "A ball is small, fast and often hidden by the players. Following it takes a model able to find it frame after frame, fast enough to keep up with the video.",
    },
    build: [
      {
        title: { fr: "Les données", en: "The data" },
        text: {
          fr: "J'ai préparé un dataset d'images annotées avec Roboflow : sur chaque image, on indique où se trouve le ballon.",
          en: "I prepared a dataset of annotated images with Roboflow: on each image, you mark where the ball is.",
        },
      },
      {
        title: { fr: "L'entraînement", en: "Training" },
        text: {
          fr: "J'ai entraîné un modèle YOLO sur ces images. YOLO regarde l'image entière en une seule passe, ce qui le rend assez rapide pour le temps réel.",
          en: "I trained a YOLO model on these images. YOLO looks at the whole image in a single pass, which makes it fast enough for real time.",
        },
      },
      {
        title: { fr: "Le suivi", en: "Tracking" },
        text: {
          fr: "Le modèle détecte le ballon sur chaque image de la vidéo, et on relie ces détections pour suivre sa trajectoire.",
          en: "The model detects the ball on each frame of the video, and those detections are linked to follow its path.",
        },
      },
    ],
    tools: [
      { name: "YOLO", role: { fr: "Le modèle de détection d'objets", en: "The object detection model" } },
      { name: "Roboflow", role: { fr: "Annotation et préparation du dataset", en: "Annotating and preparing the dataset" } },
      { name: "Python", role: { fr: "L'entraînement et le traitement de la vidéo", en: "Training and video processing" } },
    ],
    result: {
      fr: "Un suivi du ballon en temps réel, et surtout une vraie compréhension de toute la chaîne d'un projet de vision : données, entraînement, détection.",
      en: "Real-time ball tracking, and above all a real grasp of the whole pipeline of a vision project: data, training, detection.",
    },
    shots: [{ caption: soon }, { caption: soon }],
    github: GITHUB,
  },
  mediconnect: {
    intro: {
      fr: "MediConnect est une plateforme web qui manipule des données médicales. Mon objectif : qu'elle soit sécurisée dès la conception.",
      en: "MediConnect is a web platform handling medical data. My goal: make it secure by design.",
    },
    context: {
      fr: "Les données de santé font partie des données les plus sensibles qui existent. Une fuite peut faire beaucoup de mal. Pour ce projet personnel, j'ai donc pensé la sécurité avant les fonctionnalités.",
      en: "Health data is among the most sensitive data there is. A leak can do a lot of harm. So for this personal project, I thought about security before features.",
    },
    build: [
      {
        title: { fr: "L'authentification", en: "Authentication" },
        text: {
          fr: "Chaque utilisateur doit prouver son identité avant d'accéder à quoi que ce soit : c'est la première barrière.",
          en: "Every user has to prove who they are before accessing anything: that is the first barrier.",
        },
      },
      {
        title: { fr: "La protection des données", en: "Data protection" },
        text: {
          fr: "Les données sensibles sont protégées : chacun n'accède qu'à ce qui le concerne.",
          en: "Sensitive data is protected: everyone only reaches what concerns them.",
        },
      },
      {
        title: { fr: "Le RGPD", en: "GDPR" },
        text: {
          fr: "L'application suit les principes du RGPD : ne garder que les données nécessaires, et les traiter de façon maîtrisée.",
          en: "The app follows GDPR principles: keep only the data needed, and handle it in a controlled way.",
        },
      },
    ],
    tools: [
      { name: "Java", role: { fr: "Le langage de l'application", en: "The app's language" } },
      { name: "PostgreSQL", role: { fr: "La base de données", en: "The database" } },
      { name: "Auth", role: { fr: "L'authentification des utilisateurs", en: "User authentication" } },
      { name: "RGPD", role: { fr: "Le cadre de protection des données", en: "The data protection framework" } },
    ],
    result: {
      fr: "Une application qui traite des données sensibles en appliquant les bonnes pratiques de sécurité, du login jusqu'à la base de données.",
      en: "An app that handles sensitive data with security best practices, from login to database.",
    },
    shots: [{ caption: soon }, { caption: soon }],
    github: GITHUB,
  },
}
