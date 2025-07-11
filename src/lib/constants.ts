export const siteConfig = {
  name: "Sistema de Gestión de Tours",
  description: "Sistema integral para la gestión de tours y reservas",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:8000",
  ogImage: "/og.jpg",
  links: {
    github: "https://github.com/yourusername/tours-management",
  },
}

export const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    roles: ["ADMIN", "SUPERVISOR", "VENDEDOR", "GUIA", "TRANSPORTISTA", "LOGISTICA"],
  },
  {
    title: "Tours",
    href: "/tours",
    roles: ["ADMIN", "SUPERVISOR", "VENDEDOR", "GUIA", "TRANSPORTISTA", "LOGISTICA"],
  },
  {
    title: "Reservas",
    href: "/reservations",
    roles: ["ADMIN", "SUPERVISOR", "VENDEDOR"],
  },
  {
    title: "Calendario",
    href: "/calendar",
    roles: ["ADMIN", "SUPERVISOR", "VENDEDOR", "GUIA", "TRANSPORTISTA"],
  },
  {
    title: "Comisiones",
    href: "/commission",
    roles: ["ADMIN", "SUPERVISOR", "VENDEDOR"],
  },
  {
    title: "Gastos",
    href: "/expenses",
    roles: ["ADMIN", "SUPERVISOR", "GUIA", "TRANSPORTISTA"],
  },
  {
    title: "Usuarios",
    href: "/users",
    roles: ["ADMIN"],
  },
]

export const dateFormat = "dd/MM/yyyy"
export const timeFormat = "HH:mm"
export const dateTimeFormat = `${dateFormat} ${timeFormat}`

export const currency = {
  code: "PEN",
  symbol: "S/",
  locale: "es-PE",
}

export const paginationConfig = {
  defaultPageSize: 10,
  pageSizeOptions: [10, 20, 30, 50],
}

export const tourStatuses = {
  active: "Activo",
  inactive: "Inactivo",
} as const

export const reservationStatuses = {
  RESERVADO: "Reservado",
  CANCELADO: "Cancelado",
  NO_SHOW: "No Show",
  CONFIRMADO: "Confirmado",
  REALIZADO: "Realizado",
  PAGADO: "Pagado",
  COMISION_PENDIENTE: "Comisión Pendiente",
  COMISION_PAGADA: "Comisión Pagada",
} as const

export const userRoles = {
  ADMIN: "Administrador",
  SUPERVISOR: "Supervisor",
  VENDEDOR: "Vendedor",
  GUIA: "Guía",
  TRANSPORTISTA: "Transportista",
  LOGISTICA: "Logística",
  CLIENTE: "Cliente",
} as const
