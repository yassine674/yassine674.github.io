"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

const words = ["Hello", "Bonjour", "السلام عليكم", "Olà", "やあ", "Hallå", "Guten tag", "হ্যালো"]

const opacity = {
  initial: { opacity: 0 },
  enter: {
    opacity: 0.75,
    transition: { duration: 0.2 },
  },
}

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const [index, setIndex] = useState(0)
  const [dimension, setDimension] = useState({ width: 0, height: 0 })
  const [isExiting, setIsExiting] = useState(false)
  const onCompleteRef = useRef(onComplete)
  useEffect(() => { onCompleteRef.current = onComplete }, [onComplete])

  useEffect(() => {
    setDimension({ width: window.innerWidth, height: window.innerHeight })
  }, [])

  useEffect(() => {
    if (index === words.length - 1) {
      const t1 = setTimeout(() => {
        setIsExiting(true)
        setTimeout(() => {
          onCompleteRef.current()
        }, 900)
      }, 500)
      return () => clearTimeout(t1)
    }

    const t = setTimeout(
      () => { setIndex(index + 1) },
      index === 0 ? 800 : 380,
    )
    return () => clearTimeout(t)
  }, [index])

  // Slide far enough to clear the 300px SVG overhang below the viewport
  const exitY = dimension.height > 0 ? -(dimension.height + 320) : "-110vh"

  const slideUp = {
    initial: { y: 0 },
    exit: {
      y: exitY,
      transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] as const, delay: 0.15 },
    },
  }

  const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height + 300} 0 ${dimension.height} L0 0`
  const targetPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height} 0 ${dimension.height} L0 0`

  const curve = {
    initial: {
      d: initialPath,
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] as const },
    },
    exit: {
      d: targetPath,
      transition: { duration: 0.3, ease: [0.76, 0, 0.24, 1] as const, delay: 0 },
    },
  }

  return (
    <motion.div
      variants={slideUp}
      initial="initial"
      animate={isExiting ? "exit" : "initial"}
      style={{ background: "#2d1e24", pointerEvents: isExiting ? "none" : "auto" }}
      className="fixed top-0 left-0 right-0 bottom-0 w-screen h-screen flex items-center justify-center z-[99999]"
    >
      {dimension.width > 0 && (
        <>
          <motion.p
            variants={opacity}
            initial="initial"
            animate="enter"
            key={index}
            className="flex items-center text-white text-4xl md:text-5xl lg:text-6xl absolute z-10 font-medium"
          >
            <span className="block w-2.5 h-2.5 bg-white rounded-full mr-2.5"></span>
            {words[index]}
          </motion.p>
          <svg className="absolute top-0 w-full h-[calc(100%+300px)]" style={{ pointerEvents: "none" }}>
            <motion.path variants={curve} initial="initial" animate={isExiting ? "exit" : "initial"} fill="#2d1e24" />
          </svg>
        </>
      )}
    </motion.div>
  )
}
