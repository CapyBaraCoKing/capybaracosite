"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  BookOpen,
  Ticket,
  UserX,
  TrendingUp,
  Activity,
  Clock,
  AlertTriangle,
  CheckCircle,
  Circle,
  PlayCircle,
} from "lucide-react"

interface DashboardData {
  stats: {
    totalUsers: number
    wikiPages: number
    openTickets: number
    activeBans: number
  }
  recentWikiPages: Array<{
    id: string
    title: string
    created_at: string
  }>
  recentTickets: Array<{
    id: string
    title: string
    status: string
    priority: string
    created_at: string
  }>
  activeBans: Array<{
    id: string
    username: string
    reason: string
    banned_at: string
  }>
  user: {
    email?: string
  }
}

interface AdminDashboardProps {
  data: DashboardData
}

export function AdminDashboard({ data }: AdminDashboardProps) {
  const [selectedTile, setSelectedTile] = useState<string | null>(null)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "todo":
        return <Circle className="h-4 w-4 text-slate-400" />
      case "in-progress":
        return <PlayCircle className="h-4 w-4 text-yellow-400" />
      case "done":
        return <CheckCircle className="h-4 w-4 text-green-400" />
      default:
        return <Circle className="h-4 w-4 text-slate-400" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "low":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  const quickActions = [
    {
      title: "Create Wiki Page",
      description: "Add new documentation",
      href: "/admin/wiki/new",
      icon: BookOpen,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "New Ticket",
      description: "Report an issue",
      href: "/admin/tickets/new",
      icon: Ticket,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Manage Bans",
      description: "User moderation",
      href: "/admin/bans",
      icon: UserX,
      color: "from-red-500 to-pink-500",
    },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Welcome header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <p className="text-slate-400">
          Welcome back, {data.user.email?.split("@")[0]}. Here's what's happening in the Capybara Community.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Total Users",
            value: data.stats.totalUsers.toLocaleString(),
            icon: Users,
            change: "+12%",
            color: "from-blue-500 to-cyan-500",
          },
          {
            label: "Wiki Pages",
            value: data.stats.wikiPages.toString(),
            icon: BookOpen,
            change: "+3",
            color: "from-green-500 to-emerald-500",
          },
          {
            label: "Open Tickets",
            value: data.stats.openTickets.toString(),
            icon: Ticket,
            change: "-2",
            color: "from-yellow-500 to-orange-500",
          },
          {
            label: "Active Bans",
            value: data.stats.activeBans.toString(),
            icon: UserX,
            change: "0",
            color: "from-red-500 to-pink-500",
          },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <Card
              key={stat.label}
              className={`
                bg-slate-900/80 backdrop-blur-xl border border-orange-500/20 rounded-lg shadow-lg shadow-orange-500/5 
                cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-orange-500/10 hover:border-orange-500/30
                ${selectedTile === stat.label ? "ring-2 ring-orange-500/50" : ""}
              `}
              onClick={() => setSelectedTile(selectedTile === stat.label ? null : stat.label)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">{stat.label}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <div className="flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 text-green-400 mr-1" />
                      <span className="text-xs text-green-400">{stat.change}</span>
                    </div>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <Card className="bg-slate-900/80 backdrop-blur-xl border border-orange-500/20 rounded-lg shadow-lg shadow-orange-500/5">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Activity className="h-5 w-5 mr-2 text-orange-400" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Link key={action.title} href={action.href}>
                  <Card className="bg-slate-800/50 border-slate-700 hover:border-orange-500/30 transition-all duration-200 cursor-pointer group">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}
                        >
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium text-white">{action.title}</h3>
                          <p className="text-sm text-slate-400">{action.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Wiki Pages */}
        <Card className="bg-slate-900/80 backdrop-blur-xl border border-orange-500/20 rounded-lg shadow-lg shadow-orange-500/5">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-blue-400" />
              Recent Wiki Pages
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/wiki" className="text-blue-400 hover:text-blue-300">
                View All
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.recentWikiPages.length > 0 ? (
              data.recentWikiPages.map((page) => (
                <div key={page.id} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">{page.title}</h4>
                    <p className="text-xs text-slate-400 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(page.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-center py-4">No wiki pages yet</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Tickets */}
        <Card className="bg-slate-900/80 backdrop-blur-xl border border-orange-500/20 rounded-lg shadow-lg shadow-orange-500/5">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white flex items-center">
              <Ticket className="h-5 w-5 mr-2 text-green-400" />
              Recent Tickets
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/tickets" className="text-green-400 hover:text-green-300">
                View All
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.recentTickets.length > 0 ? (
              data.recentTickets.slice(0, 5).map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(ticket.status)}
                    <div>
                      <h4 className="text-white font-medium">{ticket.title}</h4>
                      <p className="text-xs text-slate-400 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(ticket.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-center py-4">No tickets yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Active Bans */}
      {data.activeBans.length > 0 && (
        <Card className="bg-slate-900/80 backdrop-blur-xl border border-red-500/20 rounded-lg shadow-lg shadow-red-500/5">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-400" />
              Active Bans
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/bans" className="text-red-400 hover:text-red-300">
                Manage All
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.activeBans.map((ban) => (
              <div
                key={ban.id}
                className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
              >
                <div>
                  <h4 className="text-white font-medium">{ban.username}</h4>
                  <p className="text-sm text-slate-300">{ban.reason}</p>
                  <p className="text-xs text-slate-400 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    Banned {new Date(ban.banned_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
