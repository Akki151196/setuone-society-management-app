import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"

export default async function HomePage() {
  const cookieStore = cookies()
  const supabase = await createClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile to determine role-based redirect
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (profile?.role === "admin") {
    redirect("/admin/dashboard")
  } else if (profile?.role === "secretary") {
    redirect("/secretary/dashboard")
  } else if (profile?.role === "security") {
    redirect("/security/dashboard")
  } else {
    redirect("/member/dashboard")
  }
}
