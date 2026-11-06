/* eslint-disable */
// Component from the 21st.dev prompt, copied as given. Six edits, each marked "EDIT":
//  1. the phrases it writes (and the title shown before the first one);
//  2. a cleanup so its phrase loop stops when the component is unmounted (otherwise it would
//     keep writing into a detached element forever once the preloader has left);
//  3. the pause between two phrases is 800 ms instead of 2000 ms (the preloader was too long);
//  4. "\n" in a phrase writes a line break (so the name can sit on its own line);
//  5. the scrambling runs 20% faster (SCRAMBLE_SPEED, 1 = original speed);
//  6. it stops after the last phrase instead of looping back to the first, so that phrase stays
//     still while it is read (the loop made its letters start changing again).
"use client"

import type React from "react"
import { useState, useEffect, useCallback, useRef } from "react"

// EDIT 5: speed of the scrambling effect. 1 = the prompt's original speed; 1.2 = 20% faster.
// Change this single number to speed it up further, or set it back to 1 to cancel.
const SCRAMBLE_SPEED = 1.2

interface Character {
  char: string
  x: number
  y: number
  speed: number
}

class TextScramble {
  el: HTMLElement
  chars: string
  queue: Array<{
    from: string
    to: string
    start: number
    end: number
    char?: string
  }>
  frame: number
  frameRequest: number
  resolve: (value: void | PromiseLike<void>) => void

  constructor(el: HTMLElement) {
    this.el = el
    this.chars = '!<>-_\\/[]{}—=+*^?#'
    this.queue = []
    this.frame = 0
    this.frameRequest = 0
    this.resolve = () => {}
    this.update = this.update.bind(this)
  }

  setText(newText: string) {
    const oldText = this.el.innerText
    const length = Math.max(oldText.length, newText.length)
    const promise = new Promise<void>((resolve) => this.resolve = resolve)
    this.queue = []

    for (let i = 0; i < length; i++) {
      const from = oldText[i] || ''
      const to = newText[i] || ''
      const start = Math.floor(Math.random() * 40)
      const end = start + Math.floor(Math.random() * 40)
      this.queue.push({ from, to, start, end })
    }

    cancelAnimationFrame(this.frameRequest)
    this.frame = 0
    this.update()
    return promise
  }

  update() {
    let output = ''
    let complete = 0

    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i]
      if (this.frame >= end) {
        complete++
        output += to === '\n' ? '<br>' : to // EDIT 4: line break
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.chars[Math.floor(Math.random() * this.chars.length)]
          this.queue[i].char = char
        }
        output += `<span class="dud">${char}</span>`
      } else {
        output += from === '\n' ? '<br>' : from // EDIT 4: line break
      }
    }

    this.el.innerHTML = output
    if (complete === this.queue.length) {
      this.resolve()
    } else {
      this.frameRequest = requestAnimationFrame(this.update)
      this.frame += SCRAMBLE_SPEED // EDIT 5 (was: this.frame++)
    }
  }
}

const ScrambledTitle: React.FC = () => {
  const elementRef = useRef<HTMLHeadingElement>(null)
  const scramblerRef = useRef<TextScramble | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (elementRef.current && !scramblerRef.current) {
      scramblerRef.current = new TextScramble(elementRef.current)
      setMounted(true)
    }
  }, [])

  useEffect(() => {
    if (mounted && scramblerRef.current) {
      const phrases = [
        // EDIT 1: phrases
        'welcome, VISITOR',
        'every LOG tells a STORY',
        'my STORY starts HERE\n0xY4SSIN3' // EDIT 4: \n = second line
      ]

      let counter = 0
      let stopped = false // EDIT 2
      const next = () => {
        if (stopped) return // EDIT 2
        if (scramblerRef.current) {
          scramblerRef.current.setText(phrases[counter]).then(() => {
            // `counter` has already moved on: 0 means the last phrase was just written, so stop there (EDIT 6)
            if (!stopped && counter !== 0) setTimeout(next, 800) // EDIT 2 (stop on unmount) + EDIT 3 (pause between phrases: 2000 -> 800 ms)
          })
          counter = (counter + 1) % phrases.length
        }
      }

      next()

      // EDIT 2: stop the loop on unmount
      return () => {
        stopped = true
        if (scramblerRef.current) cancelAnimationFrame(scramblerRef.current.frameRequest)
      }
    }
  }, [mounted])

  return (
    <h1
      ref={elementRef}
      className="text-white text-6xl font-bold tracking-wider justify-center"
      style={{ fontFamily: 'monospace' }}
    >
      {/* EDIT 1: title shown before the first phrase */}
      BOOTING SYSTEM
    </h1>
  )
}

const RainingLetters: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([])
  const [activeIndices, setActiveIndices] = useState<Set<number>>(new Set())

  const createCharacters = useCallback(() => {
    const allChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?"
    const charCount = 300
    const newCharacters: Character[] = []

    for (let i = 0; i < charCount; i++) {
      newCharacters.push({
        char: allChars[Math.floor(Math.random() * allChars.length)],
        x: Math.random() * 100,
        y: Math.random() * 100,
        speed: 0.1 + Math.random() * 0.3,
      })
    }

    return newCharacters
  }, [])

  useEffect(() => {
    setCharacters(createCharacters())
  }, [createCharacters])

  useEffect(() => {
    const updateActiveIndices = () => {
      const newActiveIndices = new Set<number>()
      const numActive = Math.floor(Math.random() * 3) + 3
      for (let i = 0; i < numActive; i++) {
        newActiveIndices.add(Math.floor(Math.random() * characters.length))
      }
      setActiveIndices(newActiveIndices)
    }

    const flickerInterval = setInterval(updateActiveIndices, 50)
    return () => clearInterval(flickerInterval)
  }, [characters.length])

  useEffect(() => {
    let animationFrameId: number

    const updatePositions = () => {
      setCharacters(prevChars =>
        prevChars.map(char => ({
          ...char,
          y: char.y + char.speed,
          ...(char.y >= 100 && {
            y: -5,
            x: Math.random() * 100,
            char: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?"[
              Math.floor(Math.random() * "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?".length)
            ],
          }),
        }))
      )
      animationFrameId = requestAnimationFrame(updatePositions)
    }

    animationFrameId = requestAnimationFrame(updatePositions)
    return () => cancelAnimationFrame(animationFrameId)
  }, [])

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Title */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
        <ScrambledTitle />
      </div>

      {/* Raining Characters */}
      {characters.map((char, index) => (
        <span
          key={index}
          className={`absolute text-xs transition-colors duration-100 ${
            activeIndices.has(index)
              ? "text-[#00ff00] text-base scale-125 z-10 font-bold animate-pulse"
              : "text-slate-600 font-light"
          }`}
          style={{
            left: `${char.x}%`,
            top: `${char.y}%`,
            transform: `translate(-50%, -50%) ${activeIndices.has(index) ? 'scale(1.25)' : 'scale(1)'}`,
            textShadow: activeIndices.has(index)
              ? '0 0 8px rgba(255,255,255,0.8), 0 0 12px rgba(255,255,255,0.4)'
              : 'none',
            opacity: activeIndices.has(index) ? 1 : 0.4,
            transition: 'color 0.1s, transform 0.1s, text-shadow 0.1s',
            willChange: 'transform, top',
            fontSize: '1.8rem'
          }}
        >
          {char.char}
        </span>
      ))}

      <style jsx global>{`
        .dud {
          color: #0f0;
          opacity: 0.7;
        }
      `}</style>
    </div>
  )
}

export default RainingLetters
