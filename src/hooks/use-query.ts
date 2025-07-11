"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { toast } from "sonner"
import { ApiResponse } from "@/lib/api-utils"

interface QueryOptions<T> {
  enabled?: boolean
  refetchInterval?: number
  onSuccess?: (data: T) => void
  onError?: (error: string | Record<string, string>) => void
  initialData?: T
  cacheTime?: number
}

interface QueryState<T> {
  data: T | null
  error: string | Record<string, string> | null
  isLoading: boolean
  isError: boolean
  isSuccess: boolean
}

const cache = new Map<string, { data: any; timestamp: number }>()

export function useQuery<T = any>(
  key: string,
  fetcher: () => Promise<T>,
  options: QueryOptions<T> = {}
) {
  const {
    enabled = true,
    refetchInterval,
    onSuccess,
    onError,
    initialData = null,
    cacheTime = 5 * 60 * 1000, // 5 minutes
  } = options

  const [state, setState] = useState<QueryState<T>>({
    data: initialData,
    error: null,
    isLoading: true,
    isError: false,
    isSuccess: false,
  })

  const fetcherRef = useRef(fetcher)
  const intervalRef = useRef<NodeJS.Timeout>()

  const fetchData = useCallback(async () => {
    // Check cache first
    const cached = cache.get(key)
    if (cached && Date.now() - cached.timestamp < cacheTime) {
      setState({
        data: cached.data,
        error: null,
        isLoading: false,
        isError: false,
        isSuccess: true,
      })
      onSuccess?.(cached.data)
      return
    }

    setState((prev) => ({ ...prev, isLoading: true }))

    try {
      const response = await fetcherRef.current()
      const result = response as unknown as ApiResponse<T>
      const data = result.data || (response as T)

      // Update cache
      cache.set(key, { data, timestamp: Date.now() })

      setState({
        data,
        error: null,
        isLoading: false,
        isError: false,
        isSuccess: true,
      })

      onSuccess?.(data)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al cargar los datos"

      setState({
        data: null,
        error: errorMessage,
        isLoading: false,
        isError: true,
        isSuccess: false,
      })

      onError?.(errorMessage)
    }
  }, [key, cacheTime, onSuccess, onError])

  useEffect(() => {
    if (!enabled) return

    fetchData()

    if (refetchInterval) {
      intervalRef.current = setInterval(fetchData, refetchInterval)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [enabled, fetchData, refetchInterval])

  const refetch = useCallback(() => {
    return fetchData()
  }, [fetchData])

  const invalidateQuery = useCallback(() => {
    cache.delete(key)
    return fetchData()
  }, [key, fetchData])

  const setQueryData = useCallback(
    (updater: T | ((oldData: T | null) => T)) => {
      setState((prev) => {
        const newData =
          typeof updater === "function" ? updater(prev.data) : updater

        // Update cache
        cache.set(key, { data: newData, timestamp: Date.now() })

        return {
          data: newData,
          error: null,
          isLoading: false,
          isError: false,
          isSuccess: true,
        }
      })
    },
    [key]
  )

  return {
    ...state,
    refetch,
    invalidateQuery,
    setQueryData,
  }
}

export function useMutation<T = any, V = any>(
  mutationFn: (variables: V) => Promise<T>,
  options: {
    onSuccess?: (data: T, variables: V) => void | Promise<void>
    onError?: (error: string | Record<string, string>, variables: V) => void
    onSettled?: (
      data: T | null,
      error: string | Record<string, string> | null,
      variables: V
    ) => void
  } = {}
) {
  const [state, setState] = useState<{
    isLoading: boolean
    error: string | Record<string, string> | null
    data: T | null
  }>({
    isLoading: false,
    error: null,
    data: null,
  })

  const mutate = useCallback(
    async (variables: V) => {
      setState({ isLoading: true, error: null, data: null })

      try {
        const response = await mutationFn(variables)
        const result = response as unknown as ApiResponse<T>
        const data = result.data || (response as T)

        setState({ isLoading: false, error: null, data })

        await options.onSuccess?.(data, variables)
        options.onSettled?.(data, null, variables)

        return data
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Error en la operación"

        setState({ isLoading: false, error: errorMessage, data: null })

        options.onError?.(errorMessage, variables)
        options.onSettled?.(null, errorMessage, variables)

        throw error
      }
    },
    [mutationFn, options]
  )

  return {
    ...state,
    mutate,
    reset: useCallback(() => {
      setState({ isLoading: false, error: null, data: null })
    }, []),
  }
}
