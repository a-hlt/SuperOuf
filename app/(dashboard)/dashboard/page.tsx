import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { connectDB } from "@/lib/db"
import { User } from "@/lib/models"
import { redirect } from "next/navigation"
import { CreateOrJoinHousehold } from "@/components/features/household/CreateOrJoinHousehold"

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/login")
  }

  await connectDB

  const user = await User.findById(session.user.id)

  if (!user?.householdId) {
    return <CreateOrJoinHousehold />
  }

  redirect(`/dashboard/${user.householdId}`)
}
