import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminShell } from "@/components/admin-shell"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/login")
  }

  return <AdminShell>{children}</AdminShell>
}
