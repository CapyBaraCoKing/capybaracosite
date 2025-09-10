"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { LayoutDashboard, BookOpen, Ticket, UserX, LogOut, Menu, X } from "lucide-react"

interface AdminShellProps {
  children: React.ReactNode
}

export function AdminShell({ children }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      current: pathname === "/admin",
    },
    {
      name: "Wiki",
      href: "/admin/wiki",
      icon: BookOpen,
      current: pathname.startsWith("/admin/wiki"),
    },
    {
      name: "Tickets",
      href: "/admin/tickets",
      icon: Ticket,
      current: pathname.startsWith("/admin/tickets"),
    },
    {
      name: "User Bans",
      href: "/admin/bans",
      icon: UserX,
      current: pathname.startsWith("/admin/bans"),
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <Card className="h-full bg-slate-900/80 backdrop-blur-xl border-orange-500/20 rounded-none border-l-0 border-t-0 border-b-0">
          <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-orange-500/20">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-lg">🐹</span>
                </div>
                <div>
                  <h1 className="text-lg font-bold bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
                    Admin Shell
                  </h1>
                  <p className="text-xs text-slate-400">capybara.exe</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden text-slate-400 hover:text-white"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                      ${
                        item.current
                          ? "bg-gradient-to-r from-orange-500/20 to-pink-500/20 border border-orange-500/30 text-orange-300 shadow-lg shadow-orange-500/10"
                          : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                      }
                    `}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                )
              })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-orange-500/20">
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="w-full justify-start text-slate-400 hover:text-red-400 hover:bg-red-500/10"
              >
                <LogOut className="h-5 w-5 mr-3" />
                Logout
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <div className="sticky top-0 z-30 flex h-16 items-center gap-x-4 border-b border-orange-500/20 bg-slate-900/80 backdrop-blur-xl px-4 lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-white"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-pink-500 rounded flex items-center justify-center">
              <span className="text-sm">🐹</span>
            </div>
            <span className="text-sm font-medium bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
              Admin Shell
            </span>
          </div>
        </div>

        {/* Page content */}
        <main className="relative">{children}</main>
      </div>
    </div>
  )
}
