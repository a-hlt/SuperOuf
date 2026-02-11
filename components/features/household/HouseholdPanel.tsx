"use client"

import { useState } from "react"
import { Copy, UserPlus, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"

interface HouseholdPanelProps {
  householdId: string
  householdName: string
  inviteCode: string
  children: { id: string; name: string }[]
}

export function HouseholdPanel({
  householdId,
  householdName,
  inviteCode,
  children,
}: HouseholdPanelProps) {
  const router = useRouter()
  const [childName, setChildName] = useState("")
  const [childPin, setChildPin] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [copied, setCopied] = useState(false)
  const [open, setOpen] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(inviteCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleAddChild(e: React.FormEvent) {
    e.preventDefault()
    if (!childName.trim() || childPin.length !== 4 || submitting) return

    setSubmitting(true)
    try {
      const res = await fetch("/api/household/children", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: childName,
          pin: childPin,
          householdId,
        }),
      })

      if (res.ok) {
        setChildName("")
        setChildPin("")
        setOpen(false)
        router.refresh()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto w-full px-4 pt-4">
      <div className="flex items-center justify-between flex-wrap gap-2 p-3 rounded-lg border bg-muted/30">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-sm">{householdName}</span>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs gap-1"
            onClick={handleCopy}
          >
            <Copy className="h-3 w-3" />
            {copied ? "Copié !" : inviteCode}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {children.map((child) => (
            <Badge key={child.id} variant="secondary" className="text-xs">
              {child.name}
            </Badge>
          ))}

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                <UserPlus className="h-3 w-3" /> Enfant
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un enfant</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddChild} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Prénom</label>
                  <Input
                    placeholder="Ex: Lucas"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Code PIN (4 chiffres)</label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="1234"
                    value={childPin}
                    onChange={(e) => setChildPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    className="text-center text-lg tracking-widest"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={submitting || childPin.length !== 4}>
                  {submitting ? "Création..." : "Ajouter"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
