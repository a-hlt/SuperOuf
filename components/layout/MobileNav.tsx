"use client"

import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { AppSidebar } from "@/components/layout/AppSidebar"
import { User, ShoppingList } from "@/types/schema"

interface MobileNavProps {
    user?: Partial<User>
    lists?: Partial<ShoppingList>[]
}

export function MobileNav({ user, lists }: MobileNavProps) {
    return (
        <div className="md:hidden flex items-center p-4 border-b bg-background sticky top-0 z-50">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="-ml-2">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Toggle Sidebar</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 border-r-0 w-72">
                    <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                    <AppSidebar user={user} lists={lists} className="border-none w-full h-full" />
                </SheetContent>
            </Sheet>
            <h1 className="ml-4 font-semibold text-lg">Super OUF</h1>
        </div>
    )
}
