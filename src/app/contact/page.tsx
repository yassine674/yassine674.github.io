import type { Metadata } from "next"
import { ContactPage } from "@/components/page/pages"

export const metadata: Metadata = {
  title: "Contact — Yassine Moumoun",
  description: "Contacter Yassine Moumoun pour un stage SOC ou cloud security.",
}

export default function Page() {
  return (
    <main>
      <ContactPage />
    </main>
  )
}
