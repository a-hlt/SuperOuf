"use server"

import { connectDB } from "@/lib/db"
import { ShoppingItem, ShoppingList } from "@/lib/models"
import { getChildSession } from "@/lib/child-session"
import { revalidatePath } from "next/cache"

export async function getChildList() {
  const child = await getChildSession()
  if (!child) return null

  await connectDB

  const list = await ShoppingList.findOne({
    householdId: child.householdId,
    isActive: true,
  }).lean()

  if (!list) return null

  const items = await ShoppingItem.find({ listId: list._id })
    .populate("proposedById", "name")
    .sort({ createdAt: -1 })
    .lean()

  return {
    list: JSON.parse(JSON.stringify({ ...list, id: list._id })),
    items: JSON.parse(JSON.stringify(items)).map((item: Record<string, unknown>) => ({
      ...item,
      id: item._id,
    })),
  }
}

export async function proposeItem(listId: string, name: string, quantity: number = 1) {
  const child = await getChildSession()
  if (!child) throw new Error("Non autorisé")

  await connectDB

  const list = await ShoppingList.findById(listId)
  if (!list || list.householdId.toString() !== child.householdId) {
    throw new Error("Non autorisé")
  }

  const item = await ShoppingItem.create({
    name,
    quantity,
    status: "PENDING",
    checked: false,
    listId: list._id,
    proposedById: child.id,
  })

  revalidatePath("/child")
  revalidatePath("/dashboard")
  return JSON.parse(JSON.stringify(item))
}

export async function getMyProposals() {
  const child = await getChildSession()
  if (!child) return []

  await connectDB

  const items = await ShoppingItem.find({
    proposedById: child.id,
    status: { $in: ["PENDING", "VALIDATED", "REJECTED"] },
  })
    .sort({ createdAt: -1 })
    .lean()

  return JSON.parse(JSON.stringify(items)).map((item: Record<string, unknown>) => ({
    ...item,
    id: item._id,
  }))
}
