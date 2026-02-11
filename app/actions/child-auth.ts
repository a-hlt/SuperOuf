"use server"

import { connectDB } from "@/lib/db"
import { Household, User } from "@/lib/models"

export async function getHouseholdChildren(inviteCode: string) {
    await connectDB
    const household = await Household.findOne({ inviteCode: inviteCode.toUpperCase() })
    if (!household) {
        throw new Error("Foyer introuvable")
    }

    const children = await User.find({
        householdId: household._id,
        role: "CHILD"
    }).select("name _id image")

    return {
        children: JSON.parse(JSON.stringify(children)),
        householdName: household.name
    }
}
