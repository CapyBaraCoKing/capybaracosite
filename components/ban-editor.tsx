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
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Save, UserX, AlertTriangle } from "lucide-react"
import Link from "next/link"

interface BanEditorProps {
  mode: "create" | "edit"
  currentUserId: string
  ban?: {
    id: string
    user_id: string
    username: string
    reason: string
    expires_at: string | null
    is_active: boolean
  }
}

export function BanEditor({ mode, currentUserId, ban }: BanEditorProps) {
  const [userId, setUserId] = useState(ban?.user_id || "")
  const [username, setUsername] = useState(ban?.username || "")
  const [reason, setReason] = useState(ban?.reason || "")
  const [durationType, setDurationType] = useState<"permanent" | "temporary">(
    ban?.expires_at ? "temporary" : "permanent",
  )
  const [duration, setDuration] = useState("7")
  const [durationUnit, setDurationUnit] = useState("days")
  const [isActive, setIsActive] = useState(ban?.is_active ?? true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSave = async () => {
    if (!username.trim() || !reason.trim()) {
      setError("Please fill in all required fields")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      let expiresAt: string | null = null
      if (durationType === "temporary") {
        const now = new Date()
        const durationMs =
          Number.parseInt(duration) *
          (durationUnit === "hours"
            ? 3600000
            : durationUnit === "days"
              ? 86400000
              : durationUnit === "weeks"
                ? 604800000
                : 2592000000) // months
        expiresAt = new Date(now.getTime() + durationMs).toISOString()
      }

      if (mode === "create") {
        const { error } = await supabase.from("user_bans").insert({
          user_id: userId.trim() || username.trim(), // Use username as fallback for user_id
          username: username.trim(),
          reason: reason.trim(),
          banned_by: currentUserId,
          expires_at: expiresAt,
          is_active: isActive,
        })

        if (error) throw error
      } else {
        const { error } = await supabase
          .from("user_bans")
          .update({
            username: username.trim(),
            reason: reason.trim(),
            expires_at: expiresAt,
            is_active: isActive,
          })
          .eq("id", ban!.id)

        if (error) throw error
      }

      router.push("/admin/bans")
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
            <Link href="/admin/bans">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Bans
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
              {mode === "create" ? "Create User Ban" : "Edit User Ban"}
            </h1>
            <p className="text-slate-400">
              {mode === "create" ? "Restrict a user from the community" : "Update ban details"}
            </p>
          </div>
        </div>
        <Button
          onClick={handleSave}
          disabled={isLoading}
          className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
        >
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? "Saving..." : "Save Ban"}
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
          <Card className="bg-slate-900/80 backdrop-blur-xl border border-red-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <UserX className="h-5 w-5 mr-2 text-red-400" />
                Ban Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-slate-300">
                    Username *
                  </Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username..."
                    className="bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-red-500 focus:ring-red-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="userId" className="text-slate-300">
                    User ID (optional)
                  </Label>
                  <Input
                    id="userId"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="Enter user ID..."
                    className="bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-red-500 focus:ring-red-500/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason" className="text-slate-300">
                  Reason *
                </Label>
                <Textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Explain the reason for this ban..."
                  rows={4}
                  className="bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-red-500 focus:ring-red-500/20"
                />
              </div>

              <div className="space-y-4">
                <Label className="text-slate-300">Ban Duration</Label>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="permanent"
                      checked={durationType === "permanent"}
                      onCheckedChange={(checked) => setDurationType(checked ? "permanent" : "temporary")}
                      className="border-slate-600 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
                    />
                    <Label htmlFor="permanent" className="text-slate-300">
                      Permanent ban
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="temporary"
                      checked={durationType === "temporary"}
                      onCheckedChange={(checked) => setDurationType(checked ? "temporary" : "permanent")}
                      className="border-slate-600 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
                    />
                    <Label htmlFor="temporary" className="text-slate-300">
                      Temporary ban
                    </Label>
                  </div>
                </div>

                {durationType === "temporary" && (
                  <div className="grid grid-cols-2 gap-4 ml-6">
                    <div className="space-y-2">
                      <Label className="text-slate-300">Duration</Label>
                      <Input
                        type="number"
                        min="1"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="bg-slate-800/50 border-slate-700 text-slate-100 focus:border-red-500 focus:ring-red-500/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-300">Unit</Label>
                      <Select value={durationUnit} onValueChange={setDurationUnit}>
                        <SelectTrigger className="bg-slate-800/50 border-slate-700 text-slate-100 focus:border-red-500 focus:ring-red-500/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="hours" className="text-slate-100 focus:bg-slate-700">
                            Hours
                          </SelectItem>
                          <SelectItem value="days" className="text-slate-100 focus:bg-slate-700">
                            Days
                          </SelectItem>
                          <SelectItem value="weeks" className="text-slate-100 focus:bg-slate-700">
                            Weeks
                          </SelectItem>
                          <SelectItem value="months" className="text-slate-100 focus:bg-slate-700">
                            Months
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={isActive}
                  onCheckedChange={(checked) => setIsActive(checked as boolean)}
                  className="border-slate-600 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
                />
                <Label htmlFor="isActive" className="text-slate-300">
                  Ban is active
                </Label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="bg-slate-900/80 backdrop-blur-xl border border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-sm">Ban Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-slate-400">Banned By</p>
                <p className="text-white">You ({currentUserId.substring(0, 8)}...)</p>
              </div>
              <div>
                <p className="text-slate-400">Status</p>
                <p className="text-white">{isActive ? "Active" : "Inactive"}</p>
              </div>
              {ban && (
                <div>
                  <p className="text-slate-400">Created</p>
                  <p className="text-white">{new Date().toLocaleDateString()}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-red-500/10 border-red-500/20">
            <CardHeader>
              <CardTitle className="text-red-400 text-sm flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Warning
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-red-300">
              <p>User bans are serious moderation actions that should be used carefully and fairly.</p>
              <p>Make sure to document the reason clearly and follow community guidelines.</p>
              <p>Permanent bans should only be used for severe violations.</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/80 backdrop-blur-xl border border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-sm">Quick Presets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start bg-transparent text-slate-300 border-slate-600"
                onClick={() => {
                  setReason("Spam or inappropriate content")
                  setDurationType("temporary")
                  setDuration("7")
                  setDurationUnit("days")
                }}
              >
                7-day spam ban
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start bg-transparent text-slate-300 border-slate-600"
                onClick={() => {
                  setReason("Harassment or toxic behavior")
                  setDurationType("temporary")
                  setDuration("30")
                  setDurationUnit("days")
                }}
              >
                30-day behavior ban
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start bg-transparent text-slate-300 border-slate-600"
                onClick={() => {
                  setReason("Severe violation of community guidelines")
                  setDurationType("permanent")
                }}
              >
                Permanent ban
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
