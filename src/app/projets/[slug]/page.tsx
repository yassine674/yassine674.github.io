import type { Metadata } from "next"
import { Suspense } from "react"
import { notFound } from "next/navigation"
import ProjectPage from "@/components/projects/project-page"
import { PROJECTS } from "@/components/projects/projects-data"

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps<"/projets/[slug]">): Promise<Metadata> {
  const { slug } = await params
  const p = PROJECTS.find((x) => x.slug === slug)
  return { title: p ? `${p.title.fr} — Yassine Moumoun` : "Projet — Yassine Moumoun", description: p?.kind.fr }
}

// cacheComponents: the URL params are read inside <Suspense> (Next 16 rule), the pages are still prerendered
export default function Page({ params }: PageProps<"/projets/[slug]">) {
  return (
    <main>
      <Suspense fallback={null}>
        <Project params={params} />
      </Suspense>
    </main>
  )
}

async function Project({ params }: { params: PageProps<"/projets/[slug]">["params"] }) {
  const { slug } = await params
  if (!PROJECTS.some((p) => p.slug === slug)) notFound()
  return <ProjectPage slug={slug} />
}
