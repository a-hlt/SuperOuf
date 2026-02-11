import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import { Household, User, ShoppingList, ShoppingItem } from "@/lib/models"
import { headers } from "next/headers"

function generateInviteCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { name } = await request.json()

    if (!name) {
      return NextResponse.json({ error: "Nom requis" }, { status: 400 })
    }

    await connectDB

    let inviteCode = generateInviteCode()
    let existing = await Household.findOne({ inviteCode })
    while (existing) {
      inviteCode = generateInviteCode()
      existing = await Household.findOne({ inviteCode })
    }

    const household = await Household.create({ name, inviteCode })

    await User.findByIdAndUpdate(session.user.id, {
      householdId: household._id,
    })

    const populatedHousehold = await Household.findById(household._id).lean()
    const users = await User.find({ householdId: household._id })
      .select("-pinCode")
      .lean()

    return NextResponse.json({ ...populatedHousehold, users })
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    await connectDB

    const user = await User.findById(session.user.id).lean()

    if (!user || !user.householdId) {
      return NextResponse.json(null)
    }

    const household = await Household.findById(user.householdId).lean()
    if (!household) {
      return NextResponse.json(null)
    }

    const users = await User.find({ householdId: household._id })
      .select("-pinCode")
      .lean()
    const lists = await ShoppingList.find({
      householdId: household._id,
    }).lean()
    const listIds = lists.map((l) => l._id)
    const items = await ShoppingItem.find({ listId: { $in: listIds } }).lean()

    const listsWithItems = lists.map((list) => ({
      ...list,
      items: items.filter(
        (item) => item.listId.toString() === list._id!.toString()
      ),
    }))

    return NextResponse.json({ ...household, users, lists: listsWithItems })
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
