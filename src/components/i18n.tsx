"use client"

import { createContext, useCallback, useContext, useEffect, useState } from "react"

export type Lang = "fr" | "en"

export const DICT = {
  fr: {
    menu: "Menu",
    items: ["Accueil", "À propos", "Projets", "Compétences", "Parcours", "Contact"],
    caption: "Cybersécurité, automatisation & IA",
    stack: ["Cybersécurité", "Automatisation", "IA"],
    corner: "Projets",
    tagline: ["Sécurité", "d'abord"],
    home: "Accueil",
    scroll: "Défiler vers le bas",
    sections: "Sections",
  },
  en: {
    menu: "Menu",
    items: ["Home", "About", "Projects", "Skills", "Experience", "Contact"],
    caption: "Cybersecurity, automation & AI",
    stack: ["Cybersecurity", "Automation", "AI"],
    corner: "Projects",
    tagline: ["Security", "first"],
    home: "Home",
    scroll: "Scroll down",
    sections: "Sections",
  },
} as const

export const MENU_HREFS = ["/", "/a-propos", "/projets", "/competences", "/parcours", "/contact"]

const STORAGE_KEY = "lang"
const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: "fr",
  setLang: () => {},
})

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr")

  // The stored choice only exists in the browser, so it is read after hydration.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored === "fr" || stored === "en") {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLangState(stored)
      }
    } catch {}
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    try {
      localStorage.setItem(STORAGE_KEY, l)
    } catch {}
  }, [])

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>
}

export const useLang = () => {
  const { lang, setLang } = useContext(LangContext)
  return { lang, setLang, t: DICT[lang] }
}
