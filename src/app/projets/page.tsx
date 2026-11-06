import type { Metadata } from "next"
import ProjectsPanel from "@/components/projects/projects-panel"

export const metadata: Metadata = {
  title: "Projets — Yassine Moumoun",
  description: "Labs SIEM, Active Directory, SOC et IA : les projets de Yassine Moumoun.",
}

export default function ProjetsPage() {
  return (
    <main>
      <ProjectsPanel />
    </main>
  )
}
