import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "./api/auth/[...nextauth]/route"

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (session) {
    // If user is authenticated, redirect to dashboard
    redirect("/dashboard")
  } else {
    // If user is not authenticated, redirect to sign in
    redirect("/auth/signin")
  }
}

export const metadata = {
  title: "Bienvenido | Sistema de Gestión de Tours",
  description: "Sistema integral para la gestión de tours y reservas",
}
