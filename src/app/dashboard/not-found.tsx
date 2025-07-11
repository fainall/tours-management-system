import { NotFoundLayout } from "@/components/layouts/not-found-layout"

export default function NotFoundDashboard() {
  return (
    <NotFoundLayout
      primaryAction={{
        href: "/tours",
        label: "Ver Tours"
      }}
    />
  )
}
