"use client"

import { Check, X, Clock } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ShoppingItem, ItemStatus } from "@/types/schema" // Use new types

export interface TodoItemProps {
    item: ShoppingItem
    isParentView?: boolean
    onToggle?: (id: string, checked: boolean) => void
    onValidate?: (id: string, approve: boolean) => void
}

export function TodoItem({ item, isParentView, onToggle, onValidate }: TodoItemProps) {
    const isPending = item.status === ItemStatus.PENDING

    return (
        <div className={cn(
            "flex items-center justify-between p-3 rounded-lg border mb-2 transition-all",
            isPending ? "border-yellow-400 bg-yellow-50/50" : "border-border bg-card",
            item.checked && "opacity-60"
        )}>
            <div className="flex items-center gap-3">
                {!isPending && (
                    <Checkbox
                        checked={item.checked}
                        onCheckedChange={(checked) => onToggle?.(item.id, checked as boolean)}
                        disabled={!isParentView}
                    />
                )}
                {isPending && <Clock className="h-4 w-4 text-yellow-600 animate-pulse" />}

                <div className="flex flex-col">
                    <span className={cn(
                        "font-medium",
                        item.checked && "line-through text-muted-foreground"
                    )}>
                        {item.name}
                    </span>
                    {item.quantity && <span className="text-xs text-muted-foreground">Qté: {item.quantity}</span>}
                    {isPending && item.proposedBy && (
                        <span className="text-xs text-yellow-700">Proposé par {item.proposedBy.name}</span>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2">
                {isPending && isParentView && onValidate && (
                    <>
                        <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                            onClick={() => onValidate(item.id, true)}
                        >
                            <Check className="h-4 w-4" />
                        </Button>
                        <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                            onClick={() => onValidate(item.id, false)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </>
                )}
                {isParentView && !isPending && (
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    )
}
