import type { Metadata } from "next"
import { PathPage } from "@/components/page/pages"

export const metadata: Metadata = {
  title: "Parcours — Yassine Moumoun",
  description: "Formation, expériences et certifications de Yassine Moumoun.",
}

export default function Page() {
  return (
    <main>
      <PathPage />
    </main>
  )
}
