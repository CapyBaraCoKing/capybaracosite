"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      router.push("/admin")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />

      <div className="relative w-full max-w-md">
        <Card className="bg-slate-900/80 backdrop-blur-xl border-orange-500/20 shadow-2xl shadow-orange-500/10">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🐹</span>
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
              Admin Access
            </CardTitle>
            <CardDescription className="text-slate-400">
              Enter your credentials to access the Capybara Community admin shell
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@capybara.community"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-orange-500 focus:ring-orange-500/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-800/50 border-slate-700 text-slate-100 focus:border-orange-500 focus:ring-orange-500/20"
                />
              </div>
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold py-3 transition-all duration-200 shadow-lg shadow-orange-500/25"
                disabled={isLoading}
              >
                {isLoading ? "Accessing..." : "Enter Admin Shell"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
