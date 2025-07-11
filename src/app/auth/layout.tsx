import type { Metadata } from "next"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "../api/auth/[...nextauth]/route"

export const metadata: Metadata = {
  title: "Autenticación | Sistema de Gestión de Tours",
  description: "Autenticación para el sistema de gestión de tours",
}

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen">
      {children}
    </div>
  )
}
