"use client"

import { useState } from "react"
import { ShoppingCart, Send, Clock, Check, X, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { proposeItem } from "@/app/actions/child"
import { useRouter } from "next/navigation"
import { useRealtimeList } from "@/hooks/use-realtime-list"

interface Item {
  id: string
  name: string
  quantity: number
  checked: boolean
  status: string
}

interface ChildViewProps {
  childName: string
  listId: string | null
  items: Item[]
  proposals: Item[]
}

export function ChildView({ childName, listId, items: initialItems, proposals }: ChildViewProps) {
  const router = useRouter()
  const [newItem, setNewItem] = useState("")
  const [newQty, setNewQty] = useState("1")
  const [submitting, setSubmitting] = useState(false)

  // SSE real-time updates
  const { list: realtimeList } = useRealtimeList(listId)
  const items = (realtimeList?.items as unknown as Item[]) || initialItems

  const validatedItems = items.filter((i) => i.status === "VALIDATED")

  async function handlePropose(e: React.FormEvent) {
    e.preventDefault()
    if (!newItem.trim() || !listId || submitting) return

    setSubmitting(true)
    try {
      await proposeItem(listId, newItem.trim(), parseInt(newQty) || 1)
      setNewItem("")
      setNewQty("1")
      router.refresh()
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/child-logout", { method: "POST" })
    window.location.href = "/child/login"
  }

  return (
    <div className="flex flex-col gap-6 py-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Salut {childName} !
          </h1>
          <p className="text-sm text-muted-foreground">Liste de courses familiale</p>
        </div>
        <Button variant="ghost" size="icon" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>

      {/* Shopping List (read-only) */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ShoppingCart className="h-5 w-5" />
            Liste de courses
          </CardTitle>
        </CardHeader>
        <CardContent>
          {validatedItems.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Aucun produit dans la liste
            </p>
          ) : (
            <div className="space-y-2">
              {validatedItems.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    item.checked
                      ? "bg-green-50 border-green-200 opacity-60"
                      : "bg-white"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {item.checked && <Check className="h-4 w-4 text-green-600" />}
                    <span className={item.checked ? "line-through text-muted-foreground" : "font-medium"}>
                      {item.name}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">x{item.quantity}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Propose Item Form */}
      {listId && (
        <Card className="border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Proposer un produit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePropose} className="flex gap-2">
              <Input
                placeholder="Nom du produit..."
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                className="flex-1"
                disabled={submitting}
              />
              <Input
                type="number"
                min="1"
                placeholder="Qté"
                className="w-16"
                value={newQty}
                onChange={(e) => setNewQty(e.target.value)}
                disabled={submitting}
              />
              <Button
                type="submit"
                disabled={submitting}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* My Proposals */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Mes propositions</CardTitle>
        </CardHeader>
        <CardContent>
          {proposals.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Tu n&apos;as encore rien proposé
            </p>
          ) : (
            <div className="space-y-2">
              {proposals.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <span className="font-medium">{p.name}</span>
                  <StatusBadge status={p.status} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "PENDING":
      return (
        <Badge variant="outline" className="text-yellow-600 border-yellow-300">
          <Clock className="h-3 w-3 mr-1" /> En attente
        </Badge>
      )
    case "VALIDATED":
      return (
        <Badge variant="outline" className="text-green-600 border-green-300">
          <Check className="h-3 w-3 mr-1" /> Validé
        </Badge>
      )
    case "REJECTED":
      return (
        <Badge variant="outline" className="text-red-600 border-red-300">
          <X className="h-3 w-3 mr-1" /> Rejeté
        </Badge>
      )
    default:
      return null
  }
}
