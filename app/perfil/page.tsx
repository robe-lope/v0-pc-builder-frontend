import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getUserBuilds } from "@/lib/supabase/queries"
import { PerfilContent } from "./perfil-content"

export default async function PerfilPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const [profile, builds] = await Promise.all([
    supabase.from("profiles").select("full_name").eq("id", user.id).single(),
    getUserBuilds(user.id),
  ])

  const fullName = profile.data?.full_name || user.email?.split("@")[0] || "Usuario"

  return <PerfilContent fullName={fullName} email={user.email ?? ""} builds={builds} />
}
