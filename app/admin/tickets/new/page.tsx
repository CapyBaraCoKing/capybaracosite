import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { TicketEditor } from "@/components/ticket-editor"

export default async function NewTicketPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/login")
  }

  return <TicketEditor mode="create" currentUserId={data.user.id} />
}
