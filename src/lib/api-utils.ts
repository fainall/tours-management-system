import { NextResponse } from "next/server"
import { ZodError } from "zod"
import { getZodErrorMessages } from "./form-utils"

export type ApiResponse<T = any> = {
  data?: T
  error?: string | Record<string, string>
  status: number
}

export async function handleApiError(error: unknown): Promise<NextResponse<ApiResponse>> {
  console.error("API Error:", error)

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: getZodErrorMessages(error),
        status: 400,
      },
      { status: 400 }
    )
  }

  if (error instanceof Error) {
    return NextResponse.json(
      {
        error: error.message,
        status: 500,
      },
      { status: 500 }
    )
  }

  return NextResponse.json(
    {
      error: "Error interno del servidor",
      status: 500,
    },
    { status: 500 }
  )
}

export function successResponse<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      data,
      status,
    },
    { status }
  )
}

export function errorResponse(
  error: string | Record<string, string>,
  status = 400
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      error,
      status,
    },
    { status }
  )
}

export function unauthorizedResponse(
  message = "No autorizado"
): NextResponse<ApiResponse> {
  return errorResponse(message, 401)
}

export function forbiddenResponse(
  message = "No tiene permisos para realizar esta acción"
): NextResponse<ApiResponse> {
  return errorResponse(message, 403)
}

export function notFoundResponse(
  message = "Recurso no encontrado"
): NextResponse<ApiResponse> {
  return errorResponse(message, 404)
}

export async function handleApiRoute<T>(
  handler: () => Promise<T>
): Promise<NextResponse<ApiResponse<T>>> {
  try {
    const data = await handler()
    return successResponse(data)
  } catch (error) {
    return handleApiError(error)
  }
}
