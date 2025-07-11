"use client"

import { useState, useEffect, useCallback } from "react"

type StorageType = "localStorage" | "sessionStorage"

interface StorageOptions<T> {
  storage?: StorageType
  serializer?: (value: T) => string
  deserializer?: (value: string) => T
  onError?: (error: Error) => void
}

const defaultSerializer = JSON.stringify
const defaultDeserializer = JSON.parse

export function useStorage<T>(
  key: string,
  initialValue: T,
  options: StorageOptions<T> = {}
) {
  const {
    storage = "localStorage",
    serializer = defaultSerializer,
    deserializer = defaultDeserializer,
    onError = console.error,
  } = options

  // Get storage object
  const storageObject = typeof window !== "undefined" ? window[storage] : null

  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (!storageObject) {
      return initialValue
    }

    try {
      const item = storageObject.getItem(key)
      return item ? deserializer(item) : initialValue
    } catch (error) {
      onError(error as Error)
      return initialValue
    }
  })

  // Return a wrapped version of useState's setter function that persists the new value to storage
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value

        // Save state
        setStoredValue(valueToStore)

        // Save to storage
        if (storageObject) {
          storageObject.setItem(key, serializer(valueToStore))
        }
      } catch (error) {
        onError(error as Error)
      }
    },
    [key, serializer, storageObject, storedValue, onError]
  )

  // Remove from storage
  const remove = useCallback(() => {
    try {
      if (storageObject) {
        storageObject.removeItem(key)
      }
      setStoredValue(initialValue)
    } catch (error) {
      onError(error as Error)
    }
  }, [key, storageObject, initialValue, onError])

  useEffect(() => {
    if (!storageObject) return

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key !== key || e.storageArea !== storageObject) return

      try {
        const newValue = e.newValue ? deserializer(e.newValue) : initialValue
        setStoredValue(newValue)
      } catch (error) {
        onError(error as Error)
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [key, storageObject, deserializer, initialValue, onError])

  return [storedValue, setValue, remove] as const
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: Omit<StorageOptions<T>, "storage"> = {}
) {
  return useStorage(key, initialValue, { ...options, storage: "localStorage" })
}

export function useSessionStorage<T>(
  key: string,
  initialValue: T,
  options: Omit<StorageOptions<T>, "storage"> = {}
) {
  return useStorage(key, initialValue, { ...options, storage: "sessionStorage" })
}

// Example usage with custom serializer/deserializer for Date objects
export function useDateStorage(key: string, initialValue: Date) {
  return useStorage(key, initialValue, {
    serializer: (date: Date) => date.toISOString(),
    deserializer: (value: string) => new Date(value),
  })
}

// Example usage with Map
export function useMapStorage<K, V>(key: string, initialValue: Map<K, V>) {
  return useStorage(key, initialValue, {
    serializer: (map: Map<K, V>) => JSON.stringify(Array.from(map.entries())),
    deserializer: (value: string) => new Map(JSON.parse(value)),
  })
}

// Example usage with Set
export function useSetStorage<T>(key: string, initialValue: Set<T>) {
  return useStorage(key, initialValue, {
    serializer: (set: Set<T>) => JSON.stringify(Array.from(set)),
    deserializer: (value: string) => new Set(JSON.parse(value)),
  })
}
