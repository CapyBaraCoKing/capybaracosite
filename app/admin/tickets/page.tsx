import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { TicketsKanban } from "@/components/tickets-kanban"

export default async function TicketsPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/login")
  }

  const { data: tickets } = await supabase
    .from("tickets")
    .select("id, title, description, status, priority, assignee_id, reporter_id, created_at, updated_at")
    .order("created_at", { ascending: false })

  return <TicketsKanban tickets={tickets || []} currentUserId={data.user.id} />
}
