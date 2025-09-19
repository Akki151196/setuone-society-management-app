import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  console.log("[v0] NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "✓ Set" : "✗ Missing")
  console.log("[v0] NEXT_PUBLIC_SUPABASE_ANON_KEY:", supabaseKey ? "✓ Set" : "✗ Missing")
  console.log("[v0] URL value:", supabaseUrl)
  console.log("[v0] Key value:", supabaseKey ? `${supabaseKey.substring(0, 10)}...` : "undefined")

  if (!supabaseUrl || !supabaseKey) {
    console.error("[v0] Missing Supabase credentials in middleware")
    return NextResponse.next({ request })
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (request.nextUrl.pathname !== "/" && !user && !request.nextUrl.pathname.startsWith("/auth")) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
