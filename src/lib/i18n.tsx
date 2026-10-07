"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

export type Lang = "en" | "fr"

interface LangCtx {
  lang: Lang
  toggle: () => void
}

const Ctx = createContext<LangCtx>({ lang: "en", toggle: () => {} })

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en")

  useEffect(() => {
    const stored = localStorage.getItem("lang") as Lang | null
    if (stored === "en" || stored === "fr") setLang(stored)
  }, [])

  const toggle = () => {
    setLang((prev) => {
      const next: Lang = prev === "en" ? "fr" : "en"
      localStorage.setItem("lang", next)
      return next
    })
  }

  return <Ctx.Provider value={{ lang, toggle }}>{children}</Ctx.Provider>
}

export function useLang() {
  return useContext(Ctx)
}

export { t } from "@/lib/translations"
