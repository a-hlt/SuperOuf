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
        const childSession = {
          id: child._id!.toString(),
          name: child.name,
          role: "CHILD",
          householdId: child.householdId!.toString(),
        }

        const res = NextResponse.json({ success: true, user: childSession })

        // Set a simple cookie for child session
        res.cookies.set("child-session", JSON.stringify(childSession), {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: "/",
        })

        return res
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
