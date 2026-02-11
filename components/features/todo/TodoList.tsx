"use client"

import * as React from "react"
import { Search, Plus, Send } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TodoItem } from "./TodoItem"
import { ShoppingItem, ItemStatus, ShoppingList } from "@/types/schema"
import { addItem, toggleItem, validateItem, deleteItem } from "@/app/actions/item"
import { ListMenu } from "./ListMenu"
import { useRealtimeList } from "@/hooks/use-realtime-list"

interface TodoListProps {
    title: string
    items: ShoppingItem[]
    listId: string
    isParentView?: boolean
    templates?: ShoppingList[]
    history?: ShoppingList[]
}

export function TodoList({
    title,
    items: initialItems,
    listId,
    isParentView = true,
    templates = [],
    history = []
}: TodoListProps) {
    // SSE real-time updates
    const { list: realtimeList } = useRealtimeList(listId)
    const items = (realtimeList?.items as unknown as ShoppingItem[]) || initialItems

    const [searchQuery, setSearchQuery] = React.useState("")
    const [newItemName, setNewItemName] = React.useState("")
    const [newItemQuantity, setNewItemQuantity] = React.useState("1")
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleToggle = async (id: string, checked: boolean) => {
        try {
            await toggleItem(id, checked)
        } catch (error) {
            console.error(error)
        }
    }

    const handleValidate = async (id: string, approve: boolean) => {
        try {
            await validateItem(id, approve)
        } catch (error) {
            console.error(error)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Supprimer cet article ?")) return
        try {
            await deleteItem(id)
        } catch (error) {
            console.error(error)
        }
    }

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newItemName.trim() || isSubmitting) return

        setIsSubmitting(true)
        const quantityInt = parseInt(newItemQuantity) || 1

        try {
            await addItem(listId, newItemName, quantityInt)
            setNewItemName("")
            setNewItemQuantity("1")
        } catch (error) {
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex flex-col h-full w-full max-w-3xl mx-auto pt-8 px-4">
            <div className="flex flex-col gap-4 mb-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                    {isParentView && (
                        <ListMenu
                            listId={listId}
                            templates={templates}
                            history={history}
                        />
                    )}
                </div>
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
                                    onDelete={handleDelete}
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
                                    onDelete={handleDelete}
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
                        disabled={isSubmitting}
                    />
                    <Input
                        type="number"
                        min="1"
                        placeholder="Qté"
                        className="w-20"
                        value={newItemQuantity}
                        onChange={(e) => setNewItemQuantity(e.target.value)}
                        disabled={isSubmitting}
                    />
                    <Button type="submit" disabled={isSubmitting}>
                        {isParentView ? <Plus className="mr-2 h-4 w-4" /> : <Send className="mr-2 h-4 w-4" />}
                        {isParentView ? "Ajouter" : "Proposer"}
                    </Button>
                </form>
            </div>
        </div>
    )
}
