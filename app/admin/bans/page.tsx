import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { BansManagement } from "@/components/bans-management"

export default async function BansPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/login")
  }

  const { data: bans } = await supabase
    .from("user_bans")
    .select("id, user_id, username, reason, banned_by, banned_at, expires_at, is_active")
    .order("banned_at", { ascending: false })

  return <BansManagement bans={bans || []} currentUserId={data.user.id} />
}
