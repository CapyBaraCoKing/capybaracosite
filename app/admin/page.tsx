import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminDashboard } from "@/components/admin-dashboard"

export default async function AdminPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/login")
  }

  const [{ data: wikiPages }, { data: tickets }, { data: activeBans }] = await Promise.all([
    supabase.from("wiki_pages").select("id, title, created_at").order("created_at", { ascending: false }).limit(5),
    supabase
      .from("tickets")
      .select("id, title, status, priority, created_at")
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("user_bans")
      .select("id, username, reason, banned_at")
      .eq("is_active", true)
      .order("banned_at", { ascending: false })
      .limit(5),
  ])

  const dashboardData = {
    stats: {
      totalUsers: 1234, // This would come from auth.users count in a real app
      wikiPages: wikiPages?.length || 0,
      openTickets: tickets?.filter((t) => t.status !== "done").length || 0,
      activeBans: activeBans?.length || 0,
    },
    recentWikiPages: wikiPages || [],
    recentTickets: tickets || [],
    activeBans: activeBans || [],
    user: data.user,
  }

  return <AdminDashboard data={dashboardData} />
}
