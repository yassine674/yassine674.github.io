import type { Metadata } from "next"
import { SkillsPage } from "@/components/page/pages"

export const metadata: Metadata = {
  title: "Compétences — Yassine Moumoun",
  description: "SIEM, réponse à incident, Active Directory, sécurité cloud, réseaux, Python et IA.",
}

export default function Page() {
  return (
    <main>
      <SkillsPage />
    </main>
  )
}
