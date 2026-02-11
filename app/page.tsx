import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/login")
  }

  const role = (session.user as { role?: string }).role

  if (role === "CHILD") {
    redirect("/child")
  }

  if (role === "SUPEROUF") {
    redirect("/superouf")
  }

  redirect("/dashboard")
}
