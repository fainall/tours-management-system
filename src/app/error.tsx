"use client"

import { ErrorLayout } from "@/components/layouts/error-layout"

export default function Error({
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
      title="Error inesperado"
      description="Lo sentimos, ha ocurrido un error inesperado"
      backLink={{
        href: "/dashboard",
        label: "Ir al Dashboard"
      }}
    />
  )
}

export const metadata = {
  title: "Error | Sistema de Gestión",
  description: "Ha ocurrido un error inesperado",
}
