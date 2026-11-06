"use client"

import { useEffect, useRef, useState } from "react"
import RainingLetters from "@/components/ui/modern-animated-hero-section"
import { IntroContext } from "@/components/intro-context"

// The 21st.dev component runs on its own and never says when it is done, so it is watched from
// outside: once its title shows the last phrase, we wait a moment so it can be read, then fade
// out. This must be the last phrase written in modern-animated-hero-section.tsx.
const LAST_PHRASE = "my STORY starts HERE\n0xY4SSIN3"
const READ_MS = 2400 // how long the last phrase stays up, once it is fully written
const FADE_MS = 700
const STALL_MS = 8000 // safety net: leave if the title has not changed for this long (e.g. tab in the background)

type Phase = "on" | "leaving" | "done"

export default function Preloader({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<Phase>("on")
  const root = useRef<HTMLDivElement>(null)

  // reduced motion: no preloader at all
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- needs window, so it cannot be the initial state (SSR)
      setPhase("done")
    }
  }, [])

  // watch the title; leave once it reads the last phrase
  useEffect(() => {
    if (phase !== "on") return
    const h1 = root.current?.querySelector("h1")
    if (!h1) return
    let timer: ReturnType<typeof setTimeout> | undefined
    let stall: ReturnType<typeof setTimeout> | undefined
    // the safety net is re-armed every time the title changes, so a slow machine is never cut short
    const arm = () => {
      clearTimeout(stall)
      stall = setTimeout(() => setPhase("leaving"), STALL_MS)
    }
    const check = () => {
      arm()
      if (!timer && (h1 as HTMLElement).innerText === LAST_PHRASE) {
        timer = setTimeout(() => setPhase("leaving"), READ_MS)
      }
    }
    const observer = new MutationObserver(check)
    observer.observe(h1, { childList: true, subtree: true, characterData: true })
    arm()
    return () => {
      observer.disconnect()
      clearTimeout(timer)
      clearTimeout(stall)
    }
  }, [phase])

  // fade, then remove (which also stops the component's own animation loops)
  useEffect(() => {
    if (phase !== "leaving") return
    const id = setTimeout(() => setPhase("done"), FADE_MS)
    return () => clearTimeout(id)
  }, [phase])

  useEffect(() => {
    document.body.style.overflow = phase === "done" ? "" : "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [phase])

  return (
    // the page starts its own opening only once the preloader is fully gone, so the two never overlap
    <IntroContext.Provider value={{ revealed: phase === "done" }}>
      {children}
      {phase !== "done" && (
        <div ref={root} className="preloader" data-leaving={phase === "leaving"}>
          <RainingLetters />
        </div>
      )}
    </IntroContext.Provider>
  )
}
