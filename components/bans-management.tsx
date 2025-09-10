"use client"

import { useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { UserX, Plus, Search, Calendar, Clock, Shield, AlertTriangle } from "lucide-react"

interface BanData {
  id: string
  user_id: string
  username: string
  reason: string
  banned_by: string
  banned_at: string
  expires_at: string | null
  is_active: boolean
}

interface BansManagementProps {
  bans: BanData[]
  currentUserId: string
}

export function BansManagement({ bans, currentUserId }: BansManagementProps) {
  const [banList, setBanList] = useState(bans)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const filteredBans = banList.filter((ban) => {
    const matchesSearch =
      ban.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ban.reason.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && ban.is_active) ||
      (statusFilter === "expired" && !ban.is_active)

    return matchesSearch && matchesStatus
  })

  const activeBans = banList.filter((ban) => ban.is_active)
  const expiredBans = banList.filter((ban) => !ban.is_active)

  const handleToggleBan = async (banId: string, currentStatus: boolean) => {
    setIsLoading(banId)
    try {
      const supabase = createClient()
      const { error } = await supabase.from("user_bans").update({ is_active: !currentStatus }).eq("id", banId)

      if (error) throw error

      setBanList((prev) => prev.map((ban) => (ban.id === banId ? { ...ban, is_active: !currentStatus } : ban)))
    } catch (error) {
      console.error("Error updating ban:", error)
    } finally {
      setIsLoading(null)
    }
  }

  const getBanStatus = (ban: BanData) => {
    if (!ban.is_active) return { label: "Revoked", color: "bg-slate-500/20 text-slate-400 border-slate-500/30" }

    if (ban.expires_at) {
      const expiresAt = new Date(ban.expires_at)
      const now = new Date()

      if (expiresAt <= now) {
        return { label: "Expired", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" }
      }
      return { label: "Temporary", color: "bg-orange-500/20 text-orange-400 border-orange-500/30" }
    }

    return { label: "Permanent", color: "bg-red-500/20 text-red-400 border-red-500/30" }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
            User Bans Management
          </h1>
          <p className="text-slate-400">Manage community moderation and user restrictions</p>
        </div>
        <Button asChild className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600">
          <Link href="/admin/bans/new">
            <Plus className="h-4 w-4 mr-2" />
            New Ban
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/80 backdrop-blur-xl border border-red-500/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                <UserX className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Total Bans</p>
                <p className="text-xl font-bold text-white">{banList.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/80 backdrop-blur-xl border border-orange-500/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Active Bans</p>
                <p className="text-xl font-bold text-white">{activeBans.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/80 backdrop-blur-xl border border-yellow-500/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Expired/Revoked</p>
                <p className="text-xl font-bold text-white">{expiredBans.length}</p>
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
                    banList.filter(
                      (ban) =>
                        new Date(ban.banned_at).getMonth() === new Date().getMonth() &&
                        new Date(ban.banned_at).getFullYear() === new Date().getFullYear(),
                    ).length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-slate-900/80 backdrop-blur-xl border border-red-500/20">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by username or reason..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-red-500 focus:ring-red-500/20"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 bg-slate-800/50 border-slate-700 text-slate-100 focus:border-red-500 focus:ring-red-500/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all" className="text-slate-100 focus:bg-slate-700">
                  All Bans
                </SelectItem>
                <SelectItem value="active" className="text-slate-100 focus:bg-slate-700">
                  Active Only
                </SelectItem>
                <SelectItem value="expired" className="text-slate-100 focus:bg-slate-700">
                  Expired/Revoked
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bans Table */}
      <Card className="bg-slate-900/80 backdrop-blur-xl border border-red-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Shield className="h-5 w-5 mr-2 text-red-400" />
            User Bans ({filteredBans.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredBans.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700 hover:bg-slate-800/50">
                    <TableHead className="text-slate-300">Username</TableHead>
                    <TableHead className="text-slate-300">Reason</TableHead>
                    <TableHead className="text-slate-300">Status</TableHead>
                    <TableHead className="text-slate-300">Banned At</TableHead>
                    <TableHead className="text-slate-300">Expires At</TableHead>
                    <TableHead className="text-slate-300">Banned By</TableHead>
                    <TableHead className="text-slate-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBans.map((ban) => {
                    const status = getBanStatus(ban)
                    return (
                      <TableRow key={ban.id} className="border-slate-700 hover:bg-slate-800/30">
                        <TableCell className="font-medium text-white">{ban.username}</TableCell>
                        <TableCell className="text-slate-300 max-w-xs truncate">{ban.reason}</TableCell>
                        <TableCell>
                          <Badge className={status.color} variant="outline">
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-400 text-sm">{formatDate(ban.banned_at)}</TableCell>
                        <TableCell className="text-slate-400 text-sm">
                          {ban.expires_at ? formatDate(ban.expires_at) : "Never"}
                        </TableCell>
                        <TableCell className="text-slate-400 text-sm">
                          {ban.banned_by === currentUserId ? "You" : ban.banned_by.substring(0, 8) + "..."}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleBan(ban.id, ban.is_active)}
                            disabled={isLoading === ban.id}
                            className={`
                              ${
                                ban.is_active
                                  ? "border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
                                  : "border-green-500/30 text-green-400 hover:bg-green-500/10"
                              } bg-transparent
                            `}
                          >
                            {isLoading === ban.id ? "..." : ban.is_active ? "Revoke" : "Restore"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <UserX className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-400 mb-2">
                {searchTerm || statusFilter !== "all" ? "No bans found" : "No user bans yet"}
              </h3>
              <p className="text-slate-500 mb-4">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "User bans will appear here when created"}
              </p>
              {!searchTerm && statusFilter === "all" && (
                <Button asChild className="bg-gradient-to-r from-red-500 to-pink-500">
                  <Link href="/admin/bans/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Ban
                  </Link>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
