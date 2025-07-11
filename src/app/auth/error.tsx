"use client"

import { ErrorLayout } from "@/components/layouts/error-layout"

export default function ErrorAuth({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <ErrorLayout
            error={error}
            reset={reset}
            title="Error de autenticación"
            description="Ocurrió un error al intentar autenticar. Por favor, intenta nuevamente."
            backLink={{
              href: "/auth/signin",
              label: "Volver al inicio de sesión"
            }}
          />
        </div>
      </div>
    </div>
  )
}
