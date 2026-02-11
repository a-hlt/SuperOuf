import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcrypt"
import { auth } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import { User } from "@/lib/models"
import { headers } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    await connectDB

    const user = await User.findById(session.user.id).lean()

    if (!user || user.role !== "PARENT") {
      return NextResponse.json(
        { error: "Seuls les parents peuvent créer des enfants" },
        { status: 403 }
      )
    }

    const { name, pin, householdId } = await request.json()

    if (!name || !pin || !householdId) {
      return NextResponse.json(
        { error: "Nom, PIN et householdId requis" },
        { status: 400 }
      )
    }

    if (!/^\d{4}$/.test(pin)) {
      return NextResponse.json(
        { error: "Le PIN doit être composé de 4 chiffres" },
        { status: 400 }
      )
    }

    const hashedPin = await bcrypt.hash(pin, 10)

    const email = `${name.toLowerCase().replace(/\s/g, "")}@child.local`

    const child = await User.create({
      name,
      email,
      role: "CHILD",
      pinCode: hashedPin,
      householdId,
    })

    const childObj = child.toObject()
    const { pinCode: _, ...childWithoutPin } = childObj

    return NextResponse.json(childWithoutPin)
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
