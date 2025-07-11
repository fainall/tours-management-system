import { NotFoundLayout } from "@/components/layouts/not-found-layout"

export default function NotFoundTours() {
  return (
    <NotFoundLayout
      title="Tour no encontrado"
      description="El tour que estás buscando no existe o ha sido eliminado"
      primaryAction={{
        href: "/tours",
        label: "Ver todos los tours"
      }}
    />
  )
}
