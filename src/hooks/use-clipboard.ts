"use client"

import { useState, useCallback } from "react"
import { toast } from "sonner"

interface UseClipboardOptions {
  timeout?: number
  onSuccess?: (text: string) => void
  onError?: (error: Error) => void
  successMessage?: string
  errorMessage?: string
}

export function useClipboard(options: UseClipboardOptions = {}) {
  const {
    timeout = 2000,
    onSuccess,
    onError,
    successMessage = "Copiado al portapapeles",
    errorMessage = "Error al copiar al portapapeles",
  } = options

  const [hasCopied, setHasCopied] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const copy = useCallback(
    async (text: string) => {
      if (!navigator?.clipboard) {
        const error = new Error("Clipboard API no disponible")
        setError(error)
        onError?.(error)
        toast.error(errorMessage)
        return false
      }

      try {
        await navigator.clipboard.writeText(text)
        setHasCopied(true)
        onSuccess?.(text)
        toast.success(successMessage)

        setTimeout(() => {
          setHasCopied(false)
        }, timeout)

        return true
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Error al copiar")
        setError(error)
        onError?.(error)
        toast.error(errorMessage)
        return false
      }
    },
    [timeout, onSuccess, onError, successMessage, errorMessage]
  )

  const copyWithoutToast = useCallback(
    async (text: string) => {
      if (!navigator?.clipboard) {
        const error = new Error("Clipboard API no disponible")
        setError(error)
        onError?.(error)
        return false
      }

      try {
        await navigator.clipboard.writeText(text)
        setHasCopied(true)
        onSuccess?.(text)

        setTimeout(() => {
          setHasCopied(false)
        }, timeout)

        return true
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Error al copiar")
        setError(error)
        onError?.(error)
        return false
      }
    },
    [timeout, onSuccess, onError]
  )

  return {
    copy,
    copyWithoutToast,
    hasCopied,
    error,
  }
}

export function useCopyToClipboard() {
  const [copiedText, setCopiedText] = useState<string | null>(null)
  const { copy, error } = useClipboard({
    onSuccess: (text) => setCopiedText(text),
  })

  return { copiedText, copy, error }
}

export function useClipboardText() {
  const [text, setText] = useState<string>("")
  const [error, setError] = useState<Error | null>(null)

  const read = useCallback(async () => {
    if (!navigator?.clipboard) {
      const error = new Error("Clipboard API no disponible")
      setError(error)
      return ""
    }

    try {
      const text = await navigator.clipboard.readText()
      setText(text)
      return text
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Error al leer")
      setError(error)
      return ""
    }
  }, [])

  return {
    text,
    read,
    error,
  }
}

export function useClipboardImage() {
  const [image, setImage] = useState<Blob | null>(null)
  const [error, setError] = useState<Error | null>(null)

  const read = useCallback(async () => {
    if (!navigator?.clipboard) {
      const error = new Error("Clipboard API no disponible")
      setError(error)
      return null
    }

    try {
      const items = await navigator.clipboard.read()
      for (const item of items) {
        for (const type of item.types) {
          if (type.startsWith("image/")) {
            const blob = await item.getType(type)
            setImage(blob)
            return blob
          }
        }
      }
      return null
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Error al leer imagen")
      setError(error)
      return null
    }
  }, [])

  return {
    image,
    read,
    error,
  }
}
