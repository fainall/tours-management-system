import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { Role } from "@/types"

export async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  return session?.user
}

export async function requireAuth() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/signin")
  }

  return user
}

export async function requireRole(allowedRoles: Role[]) {
  const user = await requireAuth()

  if (!allowedRoles.includes(user.role as Role)) {
    redirect("/dashboard")
  }

  return user
}

export function isAuthorized(userRole: string | undefined, allowedRoles: Role[]) {
  return userRole && allowedRoles.includes(userRole as Role)
}

export function formatRole(role: string) {
  const roleMap: Record<string, string> = {
    ADMIN: "Administrador",
    SUPERVISOR: "Supervisor",
    VENDEDOR: "Vendedor",
    GUIA: "Guía",
    TRANSPORTISTA: "Transportista",
    LOGISTICA: "Logística",
    CLIENTE: "Cliente",
  }

  return roleMap[role] || role
}

export function canManageTours(role: string | undefined) {
  return isAuthorized(role, [Role.ADMIN, Role.SUPERVISOR])
}

export function canManageUsers(role: string | undefined) {
  return isAuthorized(role, [Role.ADMIN])
}

export function canViewCommissions(role: string | undefined) {
  return isAuthorized(role, [Role.ADMIN, Role.SUPERVISOR, Role.VENDEDOR])
}

export function canManageExpenses(role: string | undefined) {
  return isAuthorized(role, [Role.ADMIN, Role.SUPERVISOR, Role.GUIA, Role.TRANSPORTISTA])
}
