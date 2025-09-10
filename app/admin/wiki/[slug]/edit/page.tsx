import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { WikiEditor } from "@/components/wiki-editor"

interface EditWikiPageProps {
  params: Promise<{ slug: string }>
}

export default async function EditWikiPage({ params }: EditWikiPageProps) {
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

  return <WikiEditor mode="edit" page={wikiPage} />
}
