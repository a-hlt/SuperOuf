"use server"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { connectDB } from "@/lib/db"
import {
  Household,
  ShoppingList,
  ShoppingItem,
  ProductAnalytics,
  Suggestion,
} from "@/lib/models"
import { revalidatePath } from "next/cache"

interface ProductData {
  id: string
  productName: string
  totalRequests: number
  totalPurchased: number
  category?: string
}

interface ListData {
  id: string
  householdId: string
  name: string
  isActive: boolean
  itemCount: number
  updatedAt: string
}

interface SuggestionData {
  id: string
  productName: string
  description: string
  discount?: string
  isActive: boolean
}

interface CategoryData {
  category: string
  totalRequests: number
  totalPurchased: number
}

async function requireSuperOuf() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session || session.user.role !== "SUPEROUF") {
    throw new Error("Non autorisé - SUPEROUF uniquement")
  }
  return session.user
}

// US12: Global stats
export async function getGlobalStats() {
  await requireSuperOuf()
  await connectDB

  const [totalHouseholds, totalLists, totalItems] = await Promise.all([
    Household.countDocuments(),
    ShoppingList.countDocuments({ isActive: true }),
    ShoppingItem.countDocuments(),
  ])

  return { totalHouseholds, totalLists, totalItems }
}

// US12: Aggregated lists (anonymized)
export async function getAggregatedLists(): Promise<ListData[]> {
  await requireSuperOuf()
  await connectDB

  const lists = await ShoppingList.find({ isActive: true })
    .select("householdId name isActive updatedAt")
    .sort({ updatedAt: -1 })
    .limit(50)
    .lean()

  // Count items per list
  const listIds = lists.map((l) => l._id)
  const itemCounts = await ShoppingItem.aggregate([
    { $match: { listId: { $in: listIds } } },
    { $group: { _id: "$listId", count: { $sum: 1 } } },
  ])

  const countMap = new Map(itemCounts.map((c: { _id: string; count: number }) => [c._id.toString(), c.count]))

  return JSON.parse(
    JSON.stringify(
      lists.map((list) => ({
        id: list._id,
        householdId: `H-${list.householdId?.toString().slice(-4) || "????"}`,
        name: list.name,
        isActive: list.isActive,
        itemCount: countMap.get(list._id!.toString()) || 0,
        updatedAt: list.updatedAt,
      }))
    )
  )
}

// US13: Top 10 products
export async function getTopProducts(): Promise<ProductData[]> {
  await requireSuperOuf()
  await connectDB

  const products = await ProductAnalytics.find()
    .sort({ totalRequests: -1 })
    .limit(10)
    .lean()

  return JSON.parse(
    JSON.stringify(
      products.map((p) => ({ ...p, id: p._id }))
    )
  )
}

// US15: Stats by category
export async function getCategoryStats(): Promise<CategoryData[]> {
  await requireSuperOuf()
  await connectDB

  const stats = await ProductAnalytics.aggregate([
    {
      $group: {
        _id: { $ifNull: ["$category", "Non catégorisé"] },
        totalRequests: { $sum: "$totalRequests" },
        totalPurchased: { $sum: "$totalPurchased" },
      },
    },
    { $sort: { totalRequests: -1 } },
  ])

  return stats.map((s: { _id: string; totalRequests: number; totalPurchased: number }) => ({
    category: s._id,
    totalRequests: s.totalRequests,
    totalPurchased: s.totalPurchased,
  }))
}

// US14: Get suggestions
export async function getSuggestions(): Promise<SuggestionData[]> {
  await requireSuperOuf()
  await connectDB

  const suggestions = await Suggestion.find({ isActive: true })
    .sort({ createdAt: -1 })
    .lean()

  return JSON.parse(
    JSON.stringify(
      suggestions.map((s) => ({ ...s, id: s._id }))
    )
  )
}

// US14: Create suggestion
export async function createSuggestion(
  productName: string,
  description: string,
  discount?: string
) {
  await requireSuperOuf()
  await connectDB

  const suggestion = await Suggestion.create({
    productName,
    description,
    discount: discount || undefined,
    isActive: true,
  })

  revalidatePath("/superouf/suggestions")
  return JSON.parse(JSON.stringify({ ...suggestion.toObject(), id: suggestion._id }))
}

// US14: Delete suggestion
export async function deleteSuggestion(id: string) {
  await requireSuperOuf()
  await connectDB

  await Suggestion.findByIdAndDelete(id)
  revalidatePath("/superouf/suggestions")
}
