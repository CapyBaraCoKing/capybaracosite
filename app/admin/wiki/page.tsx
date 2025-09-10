import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { WikiList } from "@/components/wiki-list"

export default async function WikiPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/login")
  }

  const { data: wikiPages } = await supabase
    .from("wiki_pages")
    .select("id, title, slug, content, author_id, created_at, updated_at")
    .order("updated_at", { ascending: false })

  return <WikiList pages={wikiPages || []} />
}
