import type { Metadata } from "next"
import { AboutPage } from "@/components/page/pages"

export const metadata: Metadata = {
  title: "À propos — Yassine Moumoun",
  description: "Qui est Yassine Moumoun : étudiant ingénieur en cybersécurité défensive et cloud.",
}

export default function Page() {
  return (
    <main>
      <AboutPage />
    </main>
  )
}
