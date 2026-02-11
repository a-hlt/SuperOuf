"use server"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { connectDB } from "@/lib/db"
import { ShoppingItem, ShoppingList, User, ProductAnalytics } from "@/lib/models"
import { revalidatePath } from "next/cache"

async function getUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session) return null
  return session.user
}

function requireParent(user: { role?: string }) {
  if (user.role !== "PARENT") throw new Error("Réservé aux parents")
}

// Upsert product analytics: increment totalRequests
async function trackProductRequest(name: string, category?: string) {
  await ProductAnalytics.findOneAndUpdate(
    { productName: name },
    {
      $inc: { totalRequests: 1 },
      $set: { lastRequested: new Date(), ...(category ? { category } : {}) },
    },
    { upsert: true }
  )
}

// Upsert product analytics: increment totalPurchased
async function trackProductPurchased(name: string) {
  await ProductAnalytics.findOneAndUpdate(
    { productName: name },
    { $inc: { totalPurchased: 1 } },
    { upsert: true }
  )
}

export async function addItem(listId: string, name: string, quantity: number = 1) {
  const user = await getUser()
  if (!user) throw new Error("Non autorisé")
  requireParent(user)

  await connectDB

  const dbUser = await User.findById(user.id)
  if (!dbUser?.householdId) throw new Error("Aucun foyer rejoint")

  let list = await ShoppingList.findById(listId)
  if (!list) {
    list = await ShoppingList.findOne({ householdId: dbUser.householdId, isActive: true })
  }
  if (!list) {
    list = await ShoppingList.create({
      name: "Liste courante",
      householdId: dbUser.householdId,
      isActive: true,
    })
  }
  if (list.householdId.toString() !== dbUser.householdId.toString()) {
    throw new Error("Non autorisé sur cette liste")
  }

  const newItem = await ShoppingItem.create({
    name,
    quantity,
    status: "VALIDATED",
    checked: false,
    listId: list._id,
    proposedById: user.id,
  })

  // Track analytics
  await trackProductRequest(name)

  revalidatePath("/dashboard")
  revalidatePath("/child")
  return JSON.parse(JSON.stringify(newItem))
}

export async function toggleItem(itemId: string, checked: boolean) {
  const user = await getUser()
  if (!user) throw new Error("Non autorisé")
  requireParent(user)

  await connectDB

  const item = await ShoppingItem.findByIdAndUpdate(itemId, { checked }, { new: true })

  // Track purchase when checking off
  if (checked && item) {
    await trackProductPurchased(item.name)
  }

  revalidatePath("/dashboard")
  revalidatePath("/child")
}

export async function deleteItem(itemId: string) {
  const user = await getUser()
  if (!user) throw new Error("Non autorisé")
  requireParent(user)

  await connectDB
  await ShoppingItem.findByIdAndDelete(itemId)
  revalidatePath("/dashboard")
}

export async function validateItem(itemId: string, approved: boolean) {
  const user = await getUser()
  if (!user) throw new Error("Non autorisé")
  requireParent(user)

  await connectDB

  const item = await ShoppingItem.findById(itemId)
  if (!item) throw new Error("Item introuvable")

  if (approved) {
    item.status = "VALIDATED"
    await item.save()
    // Track analytics when validating a candidate
    await trackProductRequest(item.name)
  } else {
    item.status = "REJECTED"
    await item.save()
  }

  revalidatePath("/dashboard")
  revalidatePath("/child")
}
