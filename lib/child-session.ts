import { cookies } from "next/headers"

export interface ChildSession {
  id: string
  name: string
  role: "CHILD"
  householdId: string
}

export async function getChildSession(): Promise<ChildSession | null> {
  const cookieStore = await cookies()
  const raw = cookieStore.get("child-session")?.value
  if (!raw) return null
  try {
    return JSON.parse(raw) as ChildSession
  } catch {
    return null
  }
}
