"use client";
import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { useLang, t } from "@/lib/i18n";
import { Preloader } from "@/components/layout/Preloader";
import { Header } from "@/components/layout/Header";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { Hero } from "@/components/sections/Hero";
import { YanCursor } from "@/components/ui/YanCursor";

// Below-fold sections — loaded as separate JS chunks, not in the initial bundle
const About = dynamic(() => import("@/components/sections/About").then(m => ({ default: m.About })));
const Experience = dynamic(() => import("@/components/sections/Experience").then(m => ({ default: m.Experience })));
const AliceScrollStory = dynamic(() => import("@/components/ui/AliceScrollStory").then(m => ({ default: m.AliceScrollStory })));
const CurveDivider = dynamic(() => import("@/components/layout/CurveDivider").then(m => ({ default: m.CurveDivider })));
const ScrollingFeatureShowcase = dynamic(() => import("@/components/ui/ScrollingFeatureShowcase").then(m => ({ default: m.ScrollingFeatureShowcase })));
const Contact = dynamic(() => import("@/components/sections/Contact").then(m => ({ default: m.Contact })));

export default function Home() {
  const { lang } = useLang();
  const trP = t[lang].projects;
  const [loaded, setLoaded] = useState(false);
  const handleComplete = useCallback(() => setLoaded(true), []);

  useEffect(() => {
    const el = document.documentElement;
    el.style.overflowY = loaded ? "" : "hidden";
    return () => { el.style.overflowY = ""; };
  }, [loaded]);

  return (
    <>
      <YanCursor />
      <Preloader onComplete={handleComplete} />
      <ScrollProgress />
      <div style={{ pointerEvents: loaded ? "auto" : "none" }}>
        <Header />
        <main id="main-content" tabIndex={-1}>
          <Hero />
          <About />
          <Experience />
          <AliceScrollStory
            wordA={trP.aliceWordA}
            wordB={trP.aliceWordB}
            eyebrow={trP.aliceEyebrow}
          />
          <CurveDivider from="dark" to="paper" accent="oklch(70% 0.22 48)" />
          <ScrollingFeatureShowcase />
          <CurveDivider from="paper" to="dark" />
          <Contact />
        </main>
      </div>
    </>
  );
}
