"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function PinLogin() {
  const [inviteCode, setInviteCode] = useState("")
  const [pin, setPin] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  function handlePinInput(digit: string) {
    if (pin.length < 4) {
      setPin((prev) => prev + digit)
    }
  }

  function handleClear() {
    setPin("")
  }

  async function handleSubmit() {
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/auth/child-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteCode: inviteCode.toUpperCase(), pin }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Erreur de connexion")
      } else {
        window.location.href = "/child"
      }
    } catch {
      setError("Erreur de connexion")
    } finally {
      setLoading(false)
    }
  }

  const isValid = pin.length === 4 && inviteCode.length > 0

  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-1" />
      <CardHeader>
        <CardTitle className="text-2xl">Connexion Enfant</CardTitle>
        <CardDescription>Entre le code famille et ton code PIN</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="inviteCode">Code Famille</Label>
          <Input
            id="inviteCode"
            type="text"
            placeholder="ABC123"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value.toUpperCase().slice(0, 6))}
            maxLength={6}
            className="text-center text-lg tracking-widest uppercase"
          />
        </div>

        <div className="space-y-3">
          <Label>Code PIN</Label>
          <div className="flex justify-center gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex h-14 w-14 items-center justify-center rounded-lg border-2 border-border text-2xl font-bold"
              >
                {pin[i] ? "\u2022" : ""}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
            <Button
              key={digit}
              type="button"
              variant="outline"
              size="lg"
              className="text-xl font-bold h-14"
              onClick={() => handlePinInput(String(digit))}
            >
              {digit}
            </Button>
          ))}
          <Button
            type="button"
            variant="ghost"
            size="lg"
            className="text-sm h-14"
            onClick={handleClear}
          >
            Effacer
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="text-xl font-bold h-14"
            onClick={() => handlePinInput("0")}
          >
            0
          </Button>
          <div />
        </div>

        <Button
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
          disabled={!isValid || loading}
          onClick={handleSubmit}
        >
          {loading ? "Connexion..." : "Valider"}
        </Button>
      </CardContent>
    </Card>
  )
}
