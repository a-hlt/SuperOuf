"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Household {
  id: string
  name: string
  inviteCode: string
}

export default function DashboardPage() {
  const [household, setHousehold] = useState<Household | null>(null)

  useEffect(() => {
    fetch("/api/household")
      .then((res) => res.json())
      .then((data) => setHousehold(data))
      .catch(() => {})
  }, [])

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard Parent</h2>

      {household ? (
        <Card>
          <CardHeader>
            <CardTitle>{household.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Code famille : <span className="font-mono font-bold">{household.inviteCode}</span>
            </p>
            <p className="mt-4 text-muted-foreground">
              Liste de courses à venir...
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">
              Vous n&apos;avez pas encore de foyer. Créez-en un pour commencer.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
