import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { BanEditor } from "@/components/ban-editor"

export default async function NewBanPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/login")
  }

  return <BanEditor mode="create" currentUserId={data.user.id} />
}
