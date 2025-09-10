"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, Eye } from "lucide-react"
import Link from "next/link"

interface WikiPage {
  id: string
  title: string
  slug: string
  content: string
  author_id: string
  created_at: string
  updated_at: string
}

interface WikiEditorProps {
  mode: "create" | "edit"
  page?: WikiPage
}

export function WikiEditor({ mode, page }: WikiEditorProps) {
  const [title, setTitle] = useState(page?.title || "")
  const [slug, setSlug] = useState(page?.slug || "")
  const [content, setContent] = useState(page?.content || "")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState(false)
  const router = useRouter()

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle)
    if (mode === "create") {
      setSlug(generateSlug(newTitle))
    }
  }

  const handleSave = async () => {
    if (!title.trim() || !slug.trim() || !content.trim()) {
      setError("Please fill in all fields")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data: user } = await supabase.auth.getUser()

      if (!user.user) {
        throw new Error("Not authenticated")
      }

      if (mode === "create") {
        const { error } = await supabase.from("wiki_pages").insert({
          title: title.trim(),
          slug: slug.trim(),
          content: content.trim(),
          author_id: user.user.id,
        })

        if (error) throw error
      } else {
        const { error } = await supabase
          .from("wiki_pages")
          .update({
            title: title.trim(),
            slug: slug.trim(),
            content: content.trim(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", page!.id)

        if (error) throw error
      }

      router.push(`/admin/wiki/${slug}`)
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
            <Link href="/admin/wiki">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Wiki
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {mode === "create" ? "Create Wiki Page" : "Edit Wiki Page"}
            </h1>
            <p className="text-slate-400">
              {mode === "create" ? "Add new documentation to the community wiki" : "Update existing wiki content"}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
            className="border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            <Eye className="h-4 w-4 mr-2" />
            {previewMode ? "Edit" : "Preview"}
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Saving..." : "Save Page"}
          </Button>
        </div>
      </div>

      {error && (
        <Card className="bg-red-500/10 border-red-500/20">
          <CardContent className="p-4">
            <p className="text-red-400">{error}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor */}
        <div className="lg:col-span-2">
          <Card className="bg-slate-900/80 backdrop-blur-xl border border-blue-500/20">
            <CardHeader>
              <CardTitle className="text-white">{previewMode ? "Preview" : "Editor"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!previewMode ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-slate-300">
                      Title
                    </Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="Enter page title..."
                      className="bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug" className="text-slate-300">
                      Slug
                    </Label>
                    <Input
                      id="slug"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="page-url-slug"
                      className="bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content" className="text-slate-300">
                      Content (Markdown supported)
                    </Label>
                    <Textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Write your wiki content here..."
                      rows={20}
                      className="bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 font-mono"
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <h1 className="text-2xl font-bold text-white">{title}</h1>
                  <div className="prose prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap text-slate-300 bg-slate-800/30 p-4 rounded-lg">{content}</pre>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="bg-slate-900/80 backdrop-blur-xl border border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-sm">Page Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-slate-400">Status</p>
                <p className="text-white">{mode === "create" ? "Draft" : "Published"}</p>
              </div>
              {page && (
                <>
                  <div>
                    <p className="text-slate-400">Created</p>
                    <p className="text-white">{new Date(page.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Last Updated</p>
                    <p className="text-white">{new Date(page.updated_at).toLocaleDateString()}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="bg-slate-900/80 backdrop-blur-xl border border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-sm">Markdown Guide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-slate-400">
              <div>
                <code className="text-blue-400"># Heading 1</code>
              </div>
              <div>
                <code className="text-blue-400">## Heading 2</code>
              </div>
              <div>
                <code className="text-blue-400">**bold text**</code>
              </div>
              <div>
                <code className="text-blue-400">*italic text*</code>
              </div>
              <div>
                <code className="text-blue-400">[link](url)</code>
              </div>
              <div>
                <code className="text-blue-400">- list item</code>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
