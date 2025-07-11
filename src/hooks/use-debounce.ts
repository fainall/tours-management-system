"use client"

import { useState, useEffect, useCallback, useRef } from "react"

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

export function useThrottle<T>(value: T, limit: number = 500): T {
  const [throttledValue, setThrottledValue] = useState<T>(value)
  const lastRan = useRef(Date.now())

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value)
        lastRan.current = Date.now()
      }
    }, limit - (Date.now() - lastRan.current))

    return () => {
      clearTimeout(handler)
    }
  }, [value, limit])

  return throttledValue
}

export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 500
): T {
  const timeoutRef = useRef<NodeJS.Timeout>()
  const callbackRef = useRef(callback)

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  return useCallback(
    ((...args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args)
      }, delay)
    }) as T,
    [delay]
  )
}

export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  limit: number = 500
): T {
  const timeoutRef = useRef<NodeJS.Timeout>()
  const lastRan = useRef(Date.now())
  const callbackRef = useRef(callback)

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  return useCallback(
    ((...args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      const now = Date.now()
      const remaining = limit - (now - lastRan.current)

      if (remaining <= 0) {
        callbackRef.current(...args)
        lastRan.current = now
      } else {
        timeoutRef.current = setTimeout(() => {
          callbackRef.current(...args)
          lastRan.current = Date.now()
        }, remaining)
      }
    }) as T,
    [limit]
  )
}

// Example usage with search input
export function useSearch<T>(
  searchFn: (query: string) => Promise<T[]>,
  options: {
    delay?: number
    minLength?: number
    onSuccess?: (results: T[]) => void
    onError?: (error: Error) => void
  } = {}
) {
  const {
    delay = 500,
    minLength = 2,
    onSuccess,
    onError = console.error,
  } = options

  const [query, setQuery] = useState("")
  const [results, setResults] = useState<T[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const debouncedQuery = useDebounce(query, delay)

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < minLength) {
      setResults([])
      return
    }

    const fetchResults = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const data = await searchFn(debouncedQuery)
        setResults(data)
        onSuccess?.(data)
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Error en la búsqueda")
        setError(error)
        onError(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchResults()
  }, [debouncedQuery, minLength, searchFn, onSuccess, onError])

  return {
    query,
    setQuery,
    results,
    isLoading,
    error,
  }
}
