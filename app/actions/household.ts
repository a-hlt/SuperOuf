"use server"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { connectDB } from "@/lib/db"
import { Household, User } from "@/lib/models"
import { revalidatePath } from "next/cache"

async function getUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session) return null
  return session.user
}

function generateInviteCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export async function createHousehold(name: string) {
    const user = await getUser()
    if (!user) throw new Error("Non autorisé")
    
    await connectDB

    let inviteCode = generateInviteCode()
    // Simple retry logic for collision
    let existing = await Household.findOne({ inviteCode })
    while (existing) {
      inviteCode = generateInviteCode()
      existing = await Household.findOne({ inviteCode })
    }

    const household = await Household.create({ name, inviteCode })

    await User.findByIdAndUpdate(user.id, {
        householdId: household._id
    })

    revalidatePath("/dashboard") // Should trigger redirect or UI update
    return JSON.parse(JSON.stringify(household))
}

export async function joinHousehold(inviteCode: string) {
    const user = await getUser()
    if (!user) throw new Error("Non autorisé")
    
    await connectDB

    const household = await Household.findOne({ inviteCode: inviteCode.toUpperCase() })
    if (!household) {
        throw new Error("Code foyer invalide")
    }

    await User.findByIdAndUpdate(user.id, {
        householdId: household._id
    })

    revalidatePath("/dashboard")
    return JSON.parse(JSON.stringify(household))
}
