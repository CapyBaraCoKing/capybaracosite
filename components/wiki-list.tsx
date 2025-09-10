"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Plus, Search, Calendar } from "lucide-react"

interface WikiPage {
  id: string
  title: string
  slug: string
  content: string
  author_id: string
  created_at: string
  updated_at: string
}

interface WikiListProps {
  pages: WikiPage[]
}

export function WikiList({ pages }: WikiListProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredPages = pages.filter(
    (page) =>
      page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.content.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Wiki System
          </h1>
          <p className="text-slate-400">Manage community documentation and guides</p>
        </div>
        <Button asChild className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
          <Link href="/admin/wiki/new">
            <Plus className="h-4 w-4 mr-2" />
            New Page
          </Link>
        </Button>
      </div>

      {/* Search */}
      <Card className="bg-slate-900/80 backdrop-blur-xl border border-blue-500/20">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search wiki pages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-900/80 backdrop-blur-xl border border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Total Pages</p>
                <p className="text-xl font-bold text-white">{pages.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/80 backdrop-blur-xl border border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Search className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Search Results</p>
                <p className="text-xl font-bold text-white">{filteredPages.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/80 backdrop-blur-xl border border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">This Month</p>
                <p className="text-xl font-bold text-white">
                  {
                    pages.filter(
                      (page) =>
                        new Date(page.created_at).getMonth() === new Date().getMonth() &&
                        new Date(page.created_at).getFullYear() === new Date().getFullYear(),
                    ).length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Wiki Pages Grid */}
      {filteredPages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPages.map((page) => (
            <Card
              key={page.id}
              className="bg-slate-900/80 backdrop-blur-xl border border-blue-500/20 hover:border-blue-500/40 transition-all duration-200 group"
            >
              <CardHeader>
                <CardTitle className="text-white group-hover:text-blue-400 transition-colors">
                  <Link href={`/admin/wiki/${page.slug}`}>{page.title}</Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-400 text-sm line-clamp-3">
                  {page.content.substring(0, 150)}
                  {page.content.length > 150 ? "..." : ""}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs text-slate-500">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(page.updated_at).toLocaleDateString()}</span>
                  </div>
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    {page.slug}
                  </Badge>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" asChild className="flex-1 bg-transparent">
                    <Link href={`/admin/wiki/${page.slug}`}>View</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild className="flex-1 bg-transparent">
                    <Link href={`/admin/wiki/${page.slug}/edit`}>Edit</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-slate-900/80 backdrop-blur-xl border border-slate-700">
          <CardContent className="p-12 text-center">
            <BookOpen className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-400 mb-2">
              {searchTerm ? "No pages found" : "No wiki pages yet"}
            </h3>
            <p className="text-slate-500 mb-4">
              {searchTerm ? "Try adjusting your search terms" : "Get started by creating your first wiki page"}
            </p>
            {!searchTerm && (
              <Button asChild className="bg-gradient-to-r from-blue-500 to-cyan-500">
                <Link href="/admin/wiki/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Page
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
