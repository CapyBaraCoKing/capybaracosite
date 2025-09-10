"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Ticket, Clock, User, AlertTriangle } from "lucide-react"

interface TicketData {
  id: string
  title: string
  description: string | null
  status: string
  priority: string
  assignee_id: string | null
  reporter_id: string
  created_at: string
  updated_at: string
}

interface TicketsKanbanProps {
  tickets: TicketData[]
  currentUserId: string
}

export function TicketsKanban({ tickets, currentUserId }: TicketsKanbanProps) {
  const [ticketList, setTicketList] = useState(tickets)
  const [draggedTicket, setDraggedTicket] = useState<string | null>(null)

  const columns = [
    {
      id: "todo",
      title: "To Do",
      color: "from-slate-500 to-slate-600",
      borderColor: "border-slate-500/20",
      bgColor: "bg-slate-500/10",
    },
    {
      id: "in-progress",
      title: "In Progress",
      color: "from-yellow-500 to-orange-500",
      borderColor: "border-yellow-500/20",
      bgColor: "bg-yellow-500/10",
    },
    {
      id: "done",
      title: "Done",
      color: "from-green-500 to-emerald-500",
      borderColor: "border-green-500/20",
      bgColor: "bg-green-500/10",
    },
  ]

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

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertTriangle className="h-3 w-3" />
      default:
        return null
    }
  }

  const handleDragStart = (e: React.DragEvent, ticketId: string) => {
    setDraggedTicket(ticketId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault()
    if (!draggedTicket) return

    const ticket = ticketList.find((t) => t.id === draggedTicket)
    if (!ticket || ticket.status === newStatus) {
      setDraggedTicket(null)
      return
    }

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("tickets")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", draggedTicket)

      if (error) throw error

      setTicketList((prev) => prev.map((t) => (t.id === draggedTicket ? { ...t, status: newStatus } : t)))
    } catch (error) {
      console.error("Error updating ticket:", error)
    } finally {
      setDraggedTicket(null)
    }
  }

  const getTicketsForColumn = (status: string) => {
    return ticketList.filter((ticket) => ticket.status === status)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Tickets Kanban
          </h1>
          <p className="text-slate-400">Manage community issues and feature requests</p>
        </div>
        <Button
          asChild
          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
        >
          <Link href="/admin/tickets/new">
            <Plus className="h-4 w-4 mr-2" />
            New Ticket
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/80 backdrop-blur-xl border border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Ticket className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Total Tickets</p>
                <p className="text-xl font-bold text-white">{ticketList.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        {columns.map((column) => (
          <Card key={column.id} className={`bg-slate-900/80 backdrop-blur-xl border ${column.borderColor}`}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 bg-gradient-to-br ${column.color} rounded-lg flex items-center justify-center`}
                >
                  <span className="text-white font-bold">{getTicketsForColumn(column.id).length}</span>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">{column.title}</p>
                  <p className="text-xl font-bold text-white">{getTicketsForColumn(column.id).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {columns.map((column) => (
          <div
            key={column.id}
            className={`space-y-4 min-h-[600px] p-4 rounded-lg border-2 border-dashed ${column.borderColor} ${column.bgColor} transition-colors duration-200`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white flex items-center">
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${column.color} mr-2`} />
                {column.title}
                <Badge variant="secondary" className="ml-2 bg-slate-800 text-slate-300">
                  {getTicketsForColumn(column.id).length}
                </Badge>
              </h3>
            </div>

            {/* Tickets */}
            <div className="space-y-3">
              {getTicketsForColumn(column.id).map((ticket) => (
                <Card
                  key={ticket.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, ticket.id)}
                  className={`
                    bg-slate-900/80 backdrop-blur-xl border border-slate-700 cursor-move transition-all duration-200
                    hover:border-slate-600 hover:shadow-lg hover:shadow-slate-500/10
                    ${draggedTicket === ticket.id ? "opacity-50 rotate-2 scale-105" : ""}
                  `}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-sm font-medium text-white line-clamp-2">{ticket.title}</CardTitle>
                      <div className="flex items-center space-x-1">
                        {getPriorityIcon(ticket.priority)}
                        <Badge className={getPriorityColor(ticket.priority)} variant="outline">
                          {ticket.priority}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-3">
                    {ticket.description && <p className="text-xs text-slate-400 line-clamp-2">{ticket.description}</p>}
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{ticket.reporter_id === currentUserId ? "You" : ticket.reporter_id.substring(0, 6)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {getTicketsForColumn(column.id).length === 0 && (
                <div className="text-center py-8">
                  <Ticket className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-slate-500 text-sm">No tickets in {column.title.toLowerCase()}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
