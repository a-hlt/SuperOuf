"use client"

import { useRouter } from "next/navigation"
import { signOut, useSession } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { data: session } = useSession()

  async function handleLogout() {
    await signOut()
    router.push("/login")
  }

  return (
    <div className="min-h-screen">
      <header className="border-b bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold text-primary">Super OUF</h1>
          <div className="flex items-center gap-4">
            {session?.user && (
              <span className="text-sm text-muted-foreground">
                {session.user.name}
              </span>
            )}
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Déconnexion
            </Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4">{children}</main>
    </div>
  )
}
