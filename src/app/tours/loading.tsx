import { LoadingLayout, LoadingTable } from "@/components/layouts/loading-layout"

export default function LoadingTours() {
  return (
    <LoadingLayout>
      <div className="container mx-auto py-10">
        <LoadingTable />
      </div>
    </LoadingLayout>
  )
}
