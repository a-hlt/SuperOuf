"use client"

import * as React from "react"
import { Search, Plus, Send } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TodoItem } from "./TodoItem"
import { ShoppingItem, ItemStatus } from "@/types/schema" // Use new types

interface TodoListProps {
    title: string
    items: ShoppingItem[]
    isParentView?: boolean
}

export function TodoList({ title, items: initialItems, isParentView = true }: TodoListProps) {
    const [items, setItems] = React.useState<ShoppingItem[]>(initialItems)
    const [searchQuery, setSearchQuery] = React.useState("")
    const [newItemName, setNewItemName] = React.useState("")
    const [newItemQuantity, setNewItemQuantity] = React.useState("1") // UI state as string

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleToggle = (id: string, checked: boolean) => {
        setItems(prev => prev.map(item =>
            item.id === id ? { ...item, checked } : item
        ))
    }

    const handleValidate = (id: string, approve: boolean) => {
        if (approve) {
            setItems(prev => prev.map(item =>
                item.id === id ? { ...item, status: ItemStatus.VALIDATED } : item
            ))
        } else {
            setItems(prev => prev.filter(item => item.id !== id)) // Or set to REJECTED if you want to keep history
        }
    }

    const handleAddItem = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newItemName.trim()) return

        const quantityInt = parseInt(newItemQuantity) || 1

        const newItem: ShoppingItem = {
            id: Math.random().toString(36).substr(2, 9),
            name: newItemName,
            quantity: quantityInt,
            checked: false,
            status: isParentView ? ItemStatus.VALIDATED : ItemStatus.PENDING,
            createdAt: new Date(),
            listId: "mock-list-id",
            proposedBy: isParentView ? undefined : { name: "Moi" } as any // Mock User for proposedBy
        }

        setItems(prev => [...prev, newItem])
        setNewItemName("")
        setNewItemQuantity("1")
    }

    return (
        <div className="flex flex-col h-full w-full max-w-3xl mx-auto pt-8 px-4">
            <div className="flex flex-col gap-4 mb-6">
                <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Rechercher un produit..."
                        className="pl-9 bg-muted/50"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <ScrollArea className="flex-1 pr-4 -mr-4">
                <div className="space-y-1">
                    {/* Show Pending Items First if Parent */}
                    {filteredItems.filter(i => i.status === ItemStatus.PENDING).length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-sm font-medium text-yellow-600 mb-2 px-1">Propositions en attente</h3>
                            {filteredItems.filter(i => i.status === ItemStatus.PENDING).map((item) => (
                                <TodoItem
                                    key={item.id}
                                    item={item}
                                    isParentView={isParentView}
                                    onValidate={handleValidate}
                                />
                            ))}
                        </div>
                    )}

                    {/* Validated Items */}
                    {filteredItems.filter(i => i.status === ItemStatus.VALIDATED).length > 0 && (
                        <div>
                            {filteredItems.filter(i => i.status === ItemStatus.VALIDATED).map((item) => (
                                <TodoItem
                                    key={item.id}
                                    item={item}
                                    isParentView={isParentView}
                                    onToggle={handleToggle}
                                />
                            ))}
                        </div>
                    )}

                    {filteredItems.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                            Aucun produit trouvé
                        </div>
                    )}
                </div>
            </ScrollArea>

            <div className="py-4 mt-auto">
                <form onSubmit={handleAddItem} className="flex gap-2">
                    <Input
                        placeholder={isParentView ? "Ajouter un produit..." : "Proposer un produit..."}
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        className="flex-1"
                    />
                    <Input
                        type="number"
                        min="1"
                        placeholder="Qté"
                        className="w-20"
                        value={newItemQuantity}
                        onChange={(e) => setNewItemQuantity(e.target.value)}
                    />
                    <Button type="submit">
                        {isParentView ? <Plus className="mr-2 h-4 w-4" /> : <Send className="mr-2 h-4 w-4" />}
                        {isParentView ? "Ajouter" : "Proposer"}
                    </Button>
                </form>
            </div>
        </div>
    )
}
