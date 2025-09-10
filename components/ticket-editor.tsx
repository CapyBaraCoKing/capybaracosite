"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Ticket } from "lucide-react"
import Link from "next/link"

interface TicketEditorProps {
  mode: "create" | "edit"
  currentUserId: string
  ticket?: {
    id: string
    title: string
    description: string | null
    status: string
    priority: string
    assignee_id: string | null
    reporter_id: string
  }
}

export function TicketEditor({ mode, currentUserId, ticket }: TicketEditorProps) {
  const [title, setTitle] = useState(ticket?.title || "")
  const [description, setDescription] = useState(ticket?.description || "")
  const [priority, setPriority] = useState(ticket?.priority || "medium")
  const [status, setStatus] = useState(ticket?.status || "todo")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSave = async () => {
    if (!title.trim()) {
      setError("Please enter a ticket title")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      if (mode === "create") {
        const { error } = await supabase.from("tickets").insert({
          title: title.trim(),
          description: description.trim() || null,
          priority,
          status,
          reporter_id: currentUserId,
        })

        if (error) throw error
      } else {
        const { error } = await supabase
          .from("tickets")
          .update({
            title: title.trim(),
            description: description.trim() || null,
            priority,
            status,
            updated_at: new Date().toISOString(),
          })
          .eq("id", ticket!.id)

        if (error) throw error
      }

      router.push("/admin/tickets")
    } catch (error: any) {
      setError(error.message || "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/tickets">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tickets
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              {mode === "create" ? "Create Ticket" : "Edit Ticket"}
            </h1>
            <p className="text-slate-400">
              {mode === "create" ? "Report a new issue or feature request" : "Update ticket details"}
            </p>
          </div>
        </div>
        <Button
          onClick={handleSave}
          disabled={isLoading}
          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
        >
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? "Saving..." : "Save Ticket"}
        </Button>
      </div>

      {error && (
        <Card className="bg-red-500/10 border-red-500/20">
          <CardContent className="p-4">
            <p className="text-red-400">{error}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card className="bg-slate-900/80 backdrop-blur-xl border border-green-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Ticket className="h-5 w-5 mr-2 text-green-400" />
                Ticket Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-slate-300">
                  Title *
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter ticket title..."
                  className="bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-green-500 focus:ring-green-500/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-300">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the issue or feature request..."
                  rows={8}
                  className="bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-green-500 focus:ring-green-500/20"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Priority</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger className="bg-slate-800/50 border-slate-700 text-slate-100 focus:border-green-500 focus:ring-green-500/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="low" className="text-slate-100 focus:bg-slate-700">
                        Low
                      </SelectItem>
                      <SelectItem value="medium" className="text-slate-100 focus:bg-slate-700">
                        Medium
                      </SelectItem>
                      <SelectItem value="high" className="text-slate-100 focus:bg-slate-700">
                        High
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="bg-slate-800/50 border-slate-700 text-slate-100 focus:border-green-500 focus:ring-green-500/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="todo" className="text-slate-100 focus:bg-slate-700">
                        To Do
                      </SelectItem>
                      <SelectItem value="in-progress" className="text-slate-100 focus:bg-slate-700">
                        In Progress
                      </SelectItem>
                      <SelectItem value="done" className="text-slate-100 focus:bg-slate-700">
                        Done
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="bg-slate-900/80 backdrop-blur-xl border border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-sm">Ticket Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-slate-400">Reporter</p>
                <p className="text-white">You ({currentUserId.substring(0, 8)}...)</p>
              </div>
              {ticket && (
                <>
                  <div>
                    <p className="text-slate-400">Created</p>
                    <p className="text-white">{new Date(ticket.reporter_id).toLocaleDateString()}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="bg-slate-900/80 backdrop-blur-xl border border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-sm">Priority Guide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-slate-400">
              <div>
                <span className="text-red-400 font-medium">High:</span> Critical bugs, security issues
              </div>
              <div>
                <span className="text-yellow-400 font-medium">Medium:</span> Important features, moderate bugs
              </div>
              <div>
                <span className="text-green-400 font-medium">Low:</span> Minor improvements, nice-to-have features
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
