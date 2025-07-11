export enum ReservationStatus {
  RESERVADO = "RESERVADO",
  CANCELADO = "CANCELADO",
  NO_SHOW = "NO_SHOW",
  CONFIRMADO = "CONFIRMADO",
  REALIZADO = "REALIZADO",
  PAGADO = "PAGADO",
  COMISION_PENDIENTE = "COMISION_PENDIENTE",
  COMISION_PAGADA = "COMISION_PAGADA"
}

export interface Tour {
  id: number
  title: string
  description: string
  priceAdult: number
  priceChild: number
  minPrice: number
  directCost: number
  vehicleCost?: number | null
  duration: string
  maxCapacity: number
  createdById: number
  active: boolean
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: number
  email: string
  name: string
  role: Role
  active: boolean
  commissionRate?: number | null
  salesTarget?: number | null
  createdAt: Date
  updatedAt: Date
}

export enum Role {
  ADMIN = "ADMIN",
  SUPERVISOR = "SUPERVISOR",
  VENDEDOR = "VENDEDOR",
  GUIA = "GUIA",
  TRANSPORTISTA = "TRANSPORTISTA",
  LOGISTICA = "LOGISTICA",
  CLIENTE = "CLIENTE"
}
