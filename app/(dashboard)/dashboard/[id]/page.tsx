import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { connectDB } from "@/lib/db"
import { ShoppingList, ShoppingItem, User, Household } from "@/lib/models"
import { TodoList } from "@/components/features/todo/TodoList"
import { HouseholdPanel } from "@/components/features/household/HouseholdPanel"
import { redirect } from "next/navigation"

interface DashboardDetailProps {
    params: Promise<{
        id: string
    }>
}

export default async function DashboardDetailPage({ params }: DashboardDetailProps) {
    const { id } = await params

    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        redirect("/login")
    }

    await connectDB

    const user = await User.findById(session.user.id)

    if (!user?.householdId) {
        redirect("/dashboard") // Will fallback to create/join
    }

    // Verify access: User must belong to the household requested
    if (user.householdId.toString() !== id) {
        // Potentially allow SUPEROUF to view any list? For now restrict.
        if (user.role !== "SUPEROUF") {
            redirect(`/dashboard`) // Redirect to their own dashboard
        }
    }

    // Fetch logic similar to original dashboard
    let list = await ShoppingList.findOne({
        householdId: id,
        isActive: true,
    })

    // Start migration: if list doesn't exist for a valid household, create one
    if (!list) {
        list = await ShoppingList.create({
            name: "Liste courante",
            householdId: id,
            isActive: true,
        })
    }

    // Fetch items
    const items = await ShoppingItem.find({ listId: list._id })
        .sort({ createdAt: -1 })
        .populate("proposedById", "name")
        .lean()

    // Fetch Templates & History
    const templates = await ShoppingList.find({
        householdId: id,
        isTemplate: true,
    })
        .sort({ createdAt: -1 })
        .lean()

    const history = await ShoppingList.find({
        householdId: id,
        isActive: false,
        isTemplate: false,
        completedAt: { $exists: true },
    })
        .sort({ completedAt: -1 })
        .limit(10)
        .lean()

    // Serialize
    const serializedItems = JSON.parse(JSON.stringify(items)).map((item: Record<string, unknown>) => ({
        ...item,
        id: item._id,
        listId: String(item.listId),
        proposedBy: item.proposedById && typeof item.proposedById === "object" ? item.proposedById : null,
    }))

    const serializedListId = list._id.toString()
    const serializedTemplates = JSON.parse(JSON.stringify(templates)).map(
        (t: Record<string, unknown>) => ({ ...t, id: t._id })
    )
    const serializedHistory = JSON.parse(JSON.stringify(history)).map(
        (h: Record<string, unknown>) => ({ ...h, id: h._id })
    )

    // Fetch household info
    const household = await Household.findById(id).lean()
    const children = await User.find({ householdId: id, role: "CHILD" })
        .select("name _id")
        .lean()

    const role = user.role || "PARENT"
    const isParentView = role === "PARENT" || role === "SUPEROUF"

    return (
        <div className="flex flex-col h-full">
            {isParentView && household && (
                <HouseholdPanel
                    householdId={id}
                    householdName={(household as { name: string }).name}
                    inviteCode={(household as { inviteCode: string }).inviteCode}
                    children={JSON.parse(JSON.stringify(children)).map((c: { _id: string; name: string }) => ({ id: c._id, name: c.name }))}
                />
            )}
            <TodoList
                title={list.name}
                items={serializedItems}
                listId={serializedListId}
                isParentView={isParentView}
                templates={serializedTemplates}
                history={serializedHistory}
            />
        </div>
    )
}
