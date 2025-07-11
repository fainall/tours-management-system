"use client"

import { ErrorLayout } from "@/components/layouts/error-layout"

export default function ErrorDashboard({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <ErrorLayout
      error={error}
      reset={reset}
      description="Ocurrió un error al cargar el dashboard"
      backLink={{
        href: "/tours",
        label: "Ver Tours"
      }}
    />
  )
}
