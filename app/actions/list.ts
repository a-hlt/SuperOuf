"use server"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { connectDB } from "@/lib/db"
import { ShoppingList, ShoppingItem, User } from "@/lib/models"
import { revalidatePath } from "next/cache"

async function getUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session) return null
  return session.user
}

// Save current list as a template
export async function saveAsTemplate(listId: string, templateName: string) {
    const user = await getUser()
    if (!user) throw new Error("Non autorisé")
    
    await connectDB
    
    // Verify list belongs to user's household
    const list = await ShoppingList.findById(listId)
    if (!list) throw new Error("Liste introuvable")
        
    // Create Template List
    const template = await ShoppingList.create({
        name: templateName,
        householdId: list.householdId,
        isActive: false,
        isTemplate: true
    })

    // Copy items
    const items = await ShoppingItem.find({ listId: list._id })
    const newItems = items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        category: item.category,
        checked: false,
        status: "VALIDATED", // Always validated in template
        listId: template._id,
        // No proposedBy for template items ideally, or keep original? Let's clear it
    }))

    if (newItems.length > 0) {
        await ShoppingItem.insertMany(newItems)
    }

    revalidatePath("/dashboard")
    return JSON.parse(JSON.stringify(template))
}

// Create a new active list from a template (archives current active list)
export async function createListFromTemplate(templateId: string, newListName: string) {
    const user = await getUser()
    if (!user) throw new Error("Non autorisé")
    
    await connectDB

    const userDb = await User.findById(user.id)
    if (!userDb?.householdId) throw new Error("Aucun foyer")

    // Find template
    const template = await ShoppingList.findById(templateId)
    if (!template) throw new Error("Modèle introuvable")

    // Archive current active list if exists
    await ShoppingList.updateMany(
        { householdId: userDb.householdId, isActive: true },
        { isActive: false, completedAt: new Date() }
    )

    // Create new list
    const newList = await ShoppingList.create({
        name: newListName || template.name,
        householdId: userDb.householdId,
        isActive: true,
        isTemplate: false
    })

    // Copy items from template
    const items = await ShoppingItem.find({ listId: template._id })
    const newItems = items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        category: item.category,
        checked: false,
        status: "VALIDATED",
        listId: newList._id
    }))

    if (newItems.length > 0) {
        await ShoppingItem.insertMany(newItems)
    }

    revalidatePath("/dashboard")
    return JSON.parse(JSON.stringify(newList))
}

// Use a previous list (History) - similar to template but from history
export async function restoreList(listId: string) {
     const user = await getUser()
    if (!user) throw new Error("Non autorisé")
    
    await connectDB
    const userDb = await User.findById(user.id)

    const oldList = await ShoppingList.findById(listId)
    if (!oldList) throw new Error("Liste introuvable")

     // Archive current active list
     await ShoppingList.updateMany(
        { householdId: userDb?.householdId, isActive: true },
        { isActive: false, completedAt: new Date() }
    )

     // Create new list copy
     const newList = await ShoppingList.create({
        name: `Copie de ${oldList.name}`,
        householdId: oldList.householdId,
        isActive: true,
        isTemplate: false
    })

    const items = await ShoppingItem.find({ listId: oldList._id })
    const newItems = items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        category: item.category,
        checked: false,
        status: "VALIDATED",
        listId: newList._id
    }))

    if (newItems.length > 0) {
        await ShoppingItem.insertMany(newItems)
    }

    revalidatePath("/dashboard")
}

// Archive current list (Finish shopping)
export async function archiveCurrentList(listId: string) {
    const user = await getUser()
    if (!user) throw new Error("Non autorisé")
    await connectDB
    
    await ShoppingList.findByIdAndUpdate(listId, {
        isActive: false,
        completedAt: new Date()
    })
    
    // Page reload will create a new empty list automatically
    revalidatePath("/dashboard")
}

// Get Templates
export async function getTemplates() {
    const user = await getUser()
    if (!user) return []
    await connectDB
    const userDb = await User.findById(user.id)
    if (!userDb?.householdId) return []

    const templates = await ShoppingList.find({
        householdId: userDb.householdId,
        isTemplate: true
    }).sort({ createdAt: -1 }).lean()
    
    return JSON.parse(JSON.stringify(templates))
}

// Get History
export async function getHistory() {
    const user = await getUser()
    if (!user) return []
    await connectDB
    const userDb = await User.findById(user.id)
    if (!userDb?.householdId) return []

    // History: not active, not template
    const history = await ShoppingList.find({
        householdId: userDb.householdId,
        isActive: false,
        isTemplate: false
    }).sort({ completedAt: -1 }).limit(10).lean()
    
    return JSON.parse(JSON.stringify(history))
}
