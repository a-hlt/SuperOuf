import { getChildSession } from "@/lib/child-session"
import { redirect } from "next/navigation"
import { getChildList, getMyProposals } from "@/app/actions/child"
import { ChildView } from "@/components/child/child-view"

export default async function ChildPage() {
  const child = await getChildSession()
  if (!child) redirect("/child/login")

  const data = await getChildList()
  const proposals = await getMyProposals()

  return (
    <ChildView
      childName={child.name}
      listId={data?.list?.id || null}
      items={data?.items || []}
      proposals={proposals}
    />
  )
}
