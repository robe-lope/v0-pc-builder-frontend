import { notFound } from "next/navigation"
import { getBuildById, getStores } from "@/lib/supabase/queries"
import { BuildView } from "./build-view"

export default async function BuildViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [build, stores] = await Promise.all([getBuildById(id), getStores()])

  if (!build) {
    notFound()
  }

  return <BuildView build={build} stores={stores} />
}
