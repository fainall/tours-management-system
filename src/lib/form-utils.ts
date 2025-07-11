import { ZodError } from "zod"

export function getZodErrorMessages(error: ZodError) {
  return error.errors.reduce((acc, err) => {
    const path = err.path.join(".")
    acc[path] = err.message
    return acc
  }, {} as Record<string, string>)
}

export function formatValidationErrors(errors: Record<string, string[]>) {
  return Object.entries(errors).reduce((acc, [key, value]) => {
    acc[key] = value[0]
    return acc
  }, {} as Record<string, string>)
}

export function formatPrice(amount: number) {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
  }).format(amount)
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("es-PE", {
    dateStyle: "long",
  }).format(new Date(date))
}

export function formatTime(date: Date | string) {
  return new Intl.DateTimeFormat("es-PE", {
    timeStyle: "short",
  }).format(new Date(date))
}

export function formatDateTime(date: Date | string) {
  return new Intl.DateTimeFormat("es-PE", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(date))
}

export function formatPhoneNumber(phoneNumber: string) {
  const cleaned = phoneNumber.replace(/\D/g, "")
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})$/)
  if (match) {
    return `${match[1]} ${match[2]} ${match[3]}`
  }
  return phoneNumber
}

export function formatDocumentNumber(documentNumber: string) {
  const cleaned = documentNumber.replace(/\D/g, "")
  if (cleaned.length === 8) {
    // DNI
    return cleaned
  } else if (cleaned.length === 11) {
    // RUC
    return cleaned
  }
  return documentNumber
}

export function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function validatePassword(password: string) {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password)
}

export function validatePhoneNumber(phoneNumber: string) {
  return /^\d{9}$/.test(phoneNumber.replace(/\D/g, ""))
}

export function validateDocumentNumber(documentNumber: string, type: "DNI" | "RUC") {
  const cleaned = documentNumber.replace(/\D/g, "")
  if (type === "DNI") {
    return cleaned.length === 8
  } else if (type === "RUC") {
    return cleaned.length === 11
  }
  return false
}
