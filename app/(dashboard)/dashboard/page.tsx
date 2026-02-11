"use client"

import { TodoList } from "@/components/features/todo/TodoList"
import { ItemStatus, ShoppingItem, Role } from "@/types/schema"
import { useSession } from "@/lib/auth-client"

const MOCK_ITEMS: ShoppingItem[] = [
  {
    id: "1", name: "Lait demi-écrémé", quantity: 2, checked: false,
    status: ItemStatus.VALIDATED, createdAt: new Date(), listId: "1"
  },
  {
    id: "2", name: "Oeufs bio", quantity: 12, checked: true,
    status: ItemStatus.VALIDATED, createdAt: new Date(), listId: "1"
  },
  {
    id: "3", name: "Pâtes", quantity: 1, checked: false,
    status: ItemStatus.VALIDATED, createdAt: new Date(), listId: "1"
  },
  {
    id: "4", name: "Bonbons Haribo", quantity: 1, checked: false,
    status: ItemStatus.PENDING, createdAt: new Date(), listId: "1",
    proposedBy: { name: "Léo" } as any
  },
  {
    id: "5", name: "Coca Cola", quantity: 2, checked: false,
    status: ItemStatus.PENDING, createdAt: new Date(), listId: "1",
    proposedBy: { name: "Emma" } as any
  },
];

export default function DashboardPage() {
  const { data: session } = useSession();
  // 1 = PARENT (Admin view), 2 = PARENT (Standard), 3 = CHILD
  // Determine Permissions based on client-side session or pass from server if preferred
  // For now using client-side session hooks as typical for interactive components

  const role = (session?.user as any)?.role
  const isParentView = role === "PARENT" || role === "SUPEROUF" || !role // Default to parent view if no role yet? Or restricted?

  return (
    <TodoList
      title="Courses Semaine"
      items={MOCK_ITEMS}
      isParentView={isParentView}
    />
  );
}
