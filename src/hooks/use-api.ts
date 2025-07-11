"use client"

import { useState } from "react"
import { toast } from "sonner"
import { ApiResponse } from "@/lib/api-utils"

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void
  onError?: (error: string | Record<string, string>) => void
  successMessage?: string
  errorMessage?: string
}

export function useApi<T = any>() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | Record<string, string> | null>(null)
  const [data, setData] = useState<T | null>(null)

  async function mutate<D = T>(
    url: string,
    options?: RequestInit & UseApiOptions<D>
  ) {
    const {
      onSuccess,
      onError,
      successMessage,
      errorMessage,
      ...fetchOptions
    } = options || {}

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(url, {
        ...fetchOptions,
        headers: {
          "Content-Type": "application/json",
          ...fetchOptions?.headers,
        },
      })

      const result = (await response.json()) as ApiResponse<D>

      if (!response.ok) {
        throw result.error || "Ocurrió un error"
      }

      setData(result.data as any)
      if (successMessage) {
        toast.success(successMessage)
      }
      onSuccess?.(result.data as D)

      return result.data
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : errorMessage || "Ocurrió un error"
      setError(errorMsg)
      if (errorMessage) {
        toast.error(errorMessage)
      }
      onError?.(errorMsg)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  async function get<D = T>(url: string, options?: UseApiOptions<D>) {
    return mutate<D>(url, { method: "GET", ...options })
  }

  async function post<D = T>(url: string, data: any, options?: UseApiOptions<D>) {
    return mutate<D>(url, {
      method: "POST",
      body: JSON.stringify(data),
      ...options,
    })
  }

  async function put<D = T>(url: string, data: any, options?: UseApiOptions<D>) {
    return mutate<D>(url, {
      method: "PUT",
      body: JSON.stringify(data),
      ...options,
    })
  }

  async function del<D = T>(url: string, options?: UseApiOptions<D>) {
    return mutate<D>(url, { method: "DELETE", ...options })
  }

  return {
    isLoading,
    error,
    data,
    mutate,
    get,
    post,
    put,
    delete: del,
  }
}

export function useApiMutation<T = any, D = any>(
  url: string,
  options?: UseApiOptions<D> & {
    method?: "POST" | "PUT" | "DELETE"
  }
) {
  const { mutate, isLoading, error } = useApi<T>()
  const { method = "POST", ...mutateOptions } = options || {}

  async function execute(data?: any) {
    return mutate(url, {
      method,
      body: data ? JSON.stringify(data) : undefined,
      ...mutateOptions,
    })
  }

  return {
    execute,
    isLoading,
    error,
  }
}
