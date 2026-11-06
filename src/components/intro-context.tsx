"use client"

import { createContext, useContext } from "react"

// `revealed` tells the page it may start its entrance animations. The preloader holds it back
// until it starts to leave.
export const IntroContext = createContext({ revealed: false })

export const useIntro = () => useContext(IntroContext)
