import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { WikiEditor } from "@/components/wiki-editor"

export default async function NewWikiPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/login")
  }

  return <WikiEditor mode="create" />
}
