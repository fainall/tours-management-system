import { NotFoundLayout } from "@/components/layouts/not-found-layout"

export default function NotFound() {
  return (
    <NotFoundLayout
      title="Página no encontrada"
      description="Lo sentimos, la página que estás buscando no existe o ha sido movida"
      primaryAction={{
        href: "/dashboard",
        label: "Ir al Dashboard"
      }}
      secondaryAction={{
        href: "/tours",
        label: "Ver Tours"
      }}
    />
  )
}

export const metadata = {
  title: "404: No encontrado | Sistema de Gestión",
  description: "La página solicitada no existe",
}
