import { NextRequest } from "next/server"
import { connectDB } from "@/lib/db"
import { ShoppingList, ShoppingItem } from "@/lib/models"

export const dynamic = "force-dynamic"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: listId } = await params

  await connectDB

  const list = await ShoppingList.findById(listId)
  if (!list) {
    return new Response("List not found", { status: 404 })
  }

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const sendUpdate = async () => {
        try {
          const currentList = await ShoppingList.findById(listId).lean()
          if (!currentList) {
            controller.close()
            return
          }

          const items = await ShoppingItem.find({ listId })
            .populate("proposedById", "name")
            .sort({ createdAt: -1 })
            .lean()

          const serializedItems = JSON.parse(JSON.stringify(items)).map(
            (item: Record<string, unknown>) => ({
              ...item,
              id: item._id,
            })
          )

          const data = JSON.stringify({
            type: "update",
            data: {
              ...JSON.parse(JSON.stringify(currentList)),
              id: currentList._id,
              items: serializedItems,
            },
          })

          controller.enqueue(encoder.encode(`data: ${data}\n\n`))
        } catch {
          // Connection likely closed
        }
      }

      // Send initial data
      await sendUpdate()

      // Poll every 2 seconds
      const interval = setInterval(sendUpdate, 2000)

      // Cleanup on close
      request.signal.addEventListener("abort", () => {
        clearInterval(interval)
        controller.close()
      })
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
