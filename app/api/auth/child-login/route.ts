import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcrypt"
import { connectDB } from "@/lib/db"
import { Household, User } from "@/lib/models"

export async function POST(request: NextRequest) {
  try {
    const { inviteCode, pin } = await request.json()

    if (!inviteCode || !pin) {
      return NextResponse.json(
        { error: "Code famille et PIN requis" },
        { status: 400 }
      )
    }

    await connectDB

    const household = await Household.findOne({
      inviteCode: inviteCode.toUpperCase(),
    }).lean()

    if (!household) {
      return NextResponse.json(
        { error: "Code famille invalide" },
        { status: 401 }
      )
    }

    const children = await User.find({
      householdId: household._id,
      role: "CHILD",
    }).lean()

    for (const child of children) {
      if (!child.pinCode) continue

      const isMatch = await bcrypt.compare(pin, child.pinCode)
      if (isMatch) {
        // Return child info - session will be created client-side
        const { pinCode: _, ...childWithoutPin } = child
        return NextResponse.json({ success: true, user: childWithoutPin })
      }
    }

    return NextResponse.json(
      { error: "Code PIN invalide" },
      { status: 401 }
    )
  } catch {
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    )
  }
}
