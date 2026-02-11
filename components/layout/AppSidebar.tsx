"use client"

import * as React from "react"
import { ShoppingBasket, LogOut } from "lucide-react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { User, ShoppingList } from "@/types/schema" // Use new types

interface AppSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    user?: Partial<User> // Allow partial for mock convenience
    lists?: Partial<ShoppingList>[]
}

export function AppSidebar({ className, user, lists }: AppSidebarProps) {
    return (
        <div className={cn("pb-12 w-64 border-r min-h-screen bg-background flex flex-col", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <div className="flex items-center gap-2 mb-6 px-4">
                        <Avatar>
                            <AvatarImage src={user?.image || undefined} /> {/* Prisma uses 'image' */}
                            <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="font-semibold text-sm">{user?.name || "Guest"}</span>
                            <span className="text-xs text-muted-foreground">{user?.role || "Visitor"}</span>
                        </div>
                    </div>
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                        Mes Listes
                    </h2>
                    <ScrollArea className="h-[300px] px-1">
                        <div className="space-y-1 p-2">
                            {lists?.map((list) => (
                                <Button
                                    key={list.id}
                                    variant={list.isActive ? "secondary" : "ghost"} // Prisma uses 'isActive'
                                    className="w-full justify-start"
                                >
                                    <ShoppingBasket className="mr-2 h-4 w-4" />
                                    {list.name}
                                </Button>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </div>
            <div className="mt-auto p-4">
                <Separator className="my-4" />
                <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50">
                    <LogOut className="mr-2 h-4 w-4" />
                    Déconnexion
                </Button>
            </div>
        </div>
    )
}
