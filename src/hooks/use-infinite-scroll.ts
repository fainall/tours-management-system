"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useQuery } from "./use-query"

interface UseInfiniteScrollOptions<T> {
  pageSize?: number
  threshold?: number
  enabled?: boolean
  onLoadMore?: () => void
  hasNextPage?: boolean
}

export function useInfiniteScroll<T>(
  fetcher: (page: number) => Promise<T[]>,
  options: UseInfiniteScrollOptions<T> = {}
) {
  const {
    pageSize = 10,
    threshold = 100,
    enabled = true,
    onLoadMore,
    hasNextPage: initialHasNextPage = true,
  } = options

  const [page, setPage] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage)
  const [allItems, setAllItems] = useState<T[]>([])
  const loaderRef = useRef<HTMLDivElement>(null)
  const observer = useRef<IntersectionObserver>()

  const { data, isLoading, error } = useQuery(
    `infinite-scroll-${page}`,
    () => fetcher(page),
    {
      enabled: enabled && hasNextPage,
      onSuccess: (newItems) => {
        setAllItems((prev) => [...prev, ...newItems])
        setHasNextPage(newItems.length === pageSize)
        onLoadMore?.()
      },
    }
  )

  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return

      if (observer.current) {
        observer.current.disconnect()
      }

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage) {
            setPage((prev) => prev + 1)
          }
        },
        {
          root: null,
          rootMargin: `${threshold}px`,
          threshold: 0.1,
        }
      )

      if (node) {
        observer.current.observe(node)
      }
    },
    [isLoading, hasNextPage, threshold]
  )

  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect()
      }
    }
  }, [])

  return {
    items: allItems,
    isLoading,
    error,
    hasNextPage,
    lastElementRef,
    loaderRef,
    page,
  }
}

interface UsePaginationOptions<T> {
  pageSize?: number
  initialPage?: number
  enabled?: boolean
  onPageChange?: (page: number) => void
}

export function usePagination<T>(
  fetcher: (page: number, pageSize: number) => Promise<{
    items: T[]
    total: number
  }>,
  options: UsePaginationOptions<T> = {}
) {
  const {
    pageSize = 10,
    initialPage = 1,
    enabled = true,
    onPageChange,
  } = options

  const [page, setPage] = useState(initialPage)
  const [total, setTotal] = useState(0)

  const { data, isLoading, error } = useQuery(
    `pagination-${page}-${pageSize}`,
    async () => {
      const result = await fetcher(page, pageSize)
      setTotal(result.total)
      return result.items
    },
    { enabled }
  )

  const totalPages = Math.ceil(total / pageSize)
  const hasNextPage = page < totalPages
  const hasPreviousPage = page > 1

  const goToPage = useCallback(
    (newPage: number) => {
      if (newPage >= 1 && newPage <= totalPages) {
        setPage(newPage)
        onPageChange?.(newPage)
      }
    },
    [totalPages, onPageChange]
  )

  const nextPage = useCallback(() => {
    if (hasNextPage) {
      goToPage(page + 1)
    }
  }, [hasNextPage, page, goToPage])

  const previousPage = useCallback(() => {
    if (hasPreviousPage) {
      goToPage(page - 1)
    }
  }, [hasPreviousPage, page, goToPage])

  return {
    items: data || [],
    isLoading,
    error,
    page,
    pageSize,
    total,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    goToPage,
    nextPage,
    previousPage,
  }
}
