"use client"

import { useEffect, useState, useCallback } from "react"

interface RealtimeItem {
  id: string
  name: string
  quantity: number
  category?: string
  checked: boolean
  status: string
  proposedById?: string | { _id: string; name: string }
  proposedBy?: { name: string }
}

interface RealtimeList {
  id: string
  name: string
  items: RealtimeItem[]
}

export function useRealtimeList(listId: string | null) {
  const [list, setList] = useState<RealtimeList | null>(null)
  const [connected, setConnected] = useState(false)

  const connect = useCallback(() => {
    if (!listId) return

    const eventSource = new EventSource(`/api/lists/${listId}/stream`)

    eventSource.onopen = () => setConnected(true)

    eventSource.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data)
        if (parsed.data) {
          setList(parsed.data)
        }
      } catch {
        // ignore parse errors
      }
    }

    eventSource.onerror = () => {
      setConnected(false)
      eventSource.close()
      // Reconnect after 3s
      setTimeout(connect, 3000)
    }

    return () => {
      eventSource.close()
      setConnected(false)
    }
  }, [listId])

  useEffect(() => {
    const cleanup = connect()
    return cleanup
  }, [connect])

  return { list, connected }
}
