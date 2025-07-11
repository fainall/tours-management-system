import { LoadingLayout } from "@/components/layouts/loading-layout"
import { LoadingCard } from "@/components/layouts/loading-layout"

export default function Loading() {
  return (
    <LoadingLayout title="Cargando...">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <LoadingCard key={i} />
        ))}
      </div>
    </LoadingLayout>
  )
}

export const metadata = {
  title: "Cargando... | Sistema de Gestión",
  description: "Cargando contenido",
}
