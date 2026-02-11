"use client"

import { useState } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TodoList } from "@/components/features/todo/TodoList";
import { MobileNav } from "@/components/layout/MobileNav";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Role, ItemStatus, User, ShoppingList, ShoppingItem } from "@/types/schema";

// --- Mock Data (Type Safe) ---
const MOCK_LISTS: Partial<ShoppingList>[] = [
    { id: "1", name: "Courses Semaine", isActive: true, isTemplate: false, householdId: "h1" },
    { id: "2", name: "Anniversaire Léo", isActive: false, isTemplate: false, householdId: "h1" },
    { id: "3", name: "Bricolage", isActive: false, isTemplate: false, householdId: "h1" },
];

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

export default function Home() {
    // 1 = PARENT (Admin view), 2 = PARENT (Standard), 3 = CHILD
    const [currentRoleEnum, setCurrentRoleEnum] = useState<Role>(Role.PARENT);
    const [isChildMode, setIsChildMode] = useState(false);

    // Derive User Object based on Role Enum and Mode
    const getUser = (): Partial<User> => {
        if (isChildMode) {
            return { name: "Léo", role: Role.CHILD, image: undefined };
        }
        return { name: "Nathan", role: Role.PARENT, image: "https://github.com/shadcn.png" };
    };

    const currentUser = getUser();

    // Determine Permissions
    const isParentView = currentUser.role === Role.PARENT || currentUser.role === Role.SUPEROUF;

    // Filter Lists for Child (Guest Mode)
    const filteredLists = isChildMode
        ? MOCK_LISTS.filter(l => l.isActive)
        : MOCK_LISTS;

    const handleRoleChange = (val: string) => {
        if (val === "CHILD") {
            setCurrentRoleEnum(Role.CHILD);
            setIsChildMode(true);
        } else {
            setCurrentRoleEnum(Role.PARENT);
            setIsChildMode(false);
        }
    }

    return (
        <div className="flex flex-col md:flex-row h-screen bg-background overflow-hidden font-sans text-foreground relative">

            {/* --- Debug Role Switcher (Bottom Right) --- */}
            <div className="fixed bottom-4 right-4 z-50 bg-card border rounded-md shadow-lg p-2 flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground uppercase">Role:</span>
                <Select
                    value={isChildMode ? "CHILD" : "PARENT"}
                    onValueChange={handleRoleChange}
                >
                    <SelectTrigger className="h-8 w-[100px]">
                        <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="PARENT">Parent</SelectItem>
                        <SelectItem value="CHILD">Enfant</SelectItem>
                    </SelectContent>
                </Select>
            </div>


            {/* Mobile Navigation */}
            <MobileNav user={currentUser} lists={filteredLists} />

            {/* Sidebar - Fixed Width on Desktop */}
            <aside className="hidden md:block shrink-0 h-full">
                <AppSidebar user={currentUser} lists={filteredLists} />
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center overflow-hidden h-full transition-all">
                <TodoList
                    key={isChildMode ? "child" : "parent"} // Force re-render on role change
                    title="Courses Semaine"
                    items={MOCK_ITEMS}
                    isParentView={isParentView}
                />
            </main>
        </div>
    );
}