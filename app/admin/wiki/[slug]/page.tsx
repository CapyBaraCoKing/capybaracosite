import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { WikiViewer } from "@/components/wiki-viewer"

interface WikiPageProps {
  params: Promise<{ slug: string }>
}

export default async function WikiPage({ params }: WikiPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/login")
  }

  const { data: wikiPage } = await supabase
    .from("wiki_pages")
    .select("id, title, slug, content, author_id, created_at, updated_at")
    .eq("slug", slug)
    .single()

  if (!wikiPage) {
    notFound()
  }

  return <WikiViewer page={wikiPage} />
}
