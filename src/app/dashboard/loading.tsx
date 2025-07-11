import { LoadingLayout, LoadingCard } from "@/components/layouts/loading-layout"

export default function LoadingDashboard() {
  return (
    <LoadingLayout>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <LoadingCard key={i} />
        ))}
      </div>
    </LoadingLayout>
  )
}
