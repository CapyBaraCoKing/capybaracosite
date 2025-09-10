import { updateSession } from "@/lib/supabase/middleware"
import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const response = await updateSession(request)

    // Check if user is authenticated for admin routes
    const supabase = createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    })

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = "/login"
      return NextResponse.redirect(url)
    }

    return response
  }

  return await updateSession(request)
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
