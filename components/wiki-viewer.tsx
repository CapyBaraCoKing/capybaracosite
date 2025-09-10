"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, Trash2, Calendar, User } from "lucide-react"

interface WikiPage {
  id: string
  title: string
  slug: string
  content: string
  author_id: string
  created_at: string
  updated_at: string
}

interface WikiViewerProps {
  page: WikiPage
}

export function WikiViewer({ page }: WikiViewerProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this wiki page? This action cannot be undone.")) {
      return
    }

    setIsDeleting(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from("wiki_pages").delete().eq("id", page.id)

      if (error) throw error

      router.push("/admin/wiki")
    } catch (error) {
      console.error("Error deleting page:", error)
      alert("Failed to delete page")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/wiki">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Wiki
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {page.title}
            </h1>
            <div className="flex items-center space-x-4 text-sm text-slate-400 mt-1">
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>Updated {new Date(page.updated_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <User className="h-3 w-3" />
                <span>Author: {page.author_id.substring(0, 8)}...</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link href={`/admin/wiki/${page.slug}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
          <Button
            variant="outline"
            onClick={handleDelete}
            disabled={isDeleting}
            className="border-red-500/30 text-red-400 hover:bg-red-500/10 bg-transparent"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="bg-slate-900/80 backdrop-blur-xl border border-blue-500/20">
            <CardContent className="p-8">
              <div className="prose prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-slate-300 leading-relaxed font-sans">{page.content}</pre>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="bg-slate-900/80 backdrop-blur-xl border border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-sm">Page Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-slate-400">Slug</p>
                <p className="text-white font-mono">{page.slug}</p>
              </div>
              <div>
                <p className="text-slate-400">Created</p>
                <p className="text-white">{new Date(page.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-slate-400">Last Updated</p>
                <p className="text-white">{new Date(page.updated_at).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-slate-400">Author ID</p>
                <p className="text-white font-mono text-xs">{page.author_id.substring(0, 16)}...</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/80 backdrop-blur-xl border border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" asChild className="w-full justify-start bg-transparent">
                <Link href={`/admin/wiki/${page.slug}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Page
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild className="w-full justify-start bg-transparent">
                <Link href="/admin/wiki/new">
                  <Edit className="h-4 w-4 mr-2" />
                  New Page
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
