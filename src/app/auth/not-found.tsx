import { NotFoundLayout } from "@/components/layouts/not-found-layout"

export default function NotFoundAuth() {
  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <NotFoundLayout
            title="Página no encontrada"
            description="La página de autenticación que buscas no existe"
            primaryAction={{
              href: "/auth/signin",
              label: "Volver al inicio de sesión"
            }}
            secondaryAction={{
              href: "/",
              label: "Ir al inicio"
            }}
          />
        </div>
      </div>
    </div>
  )
}

export const metadata = {
  title: "404: No encontrado | Autenticación",
  description: "La página de autenticación solicitada no existe",
}
