"use client"

import { useState, useCallback } from "react"
import { toast } from "sonner"

interface FileOptions {
  accept?: string
  multiple?: boolean
  maxSize?: number // in bytes
  onSuccess?: (files: File[]) => void
  onError?: (error: Error) => void
}

export function useFileUpload(options: FileOptions = {}) {
  const {
    accept,
    multiple = false,
    maxSize,
    onSuccess,
    onError,
  } = options

  const [files, setFiles] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const validateFiles = useCallback(
    (files: File[]) => {
      if (maxSize) {
        const oversizedFiles = files.filter((file) => file.size > maxSize)
        if (oversizedFiles.length > 0) {
          throw new Error(
            `Los siguientes archivos exceden el tamaño máximo permitido: ${oversizedFiles
              .map((f) => f.name)
              .join(", ")}`
          )
        }
      }

      if (accept) {
        const acceptedTypes = accept.split(",").map((type) => type.trim())
        const invalidFiles = files.filter(
          (file) =>
            !acceptedTypes.some((type) =>
              type.startsWith(".")
                ? file.name.endsWith(type)
                : file.type.match(new RegExp(type.replace("*", ".*")))
            )
        )
        if (invalidFiles.length > 0) {
          throw new Error(
            `Los siguientes archivos no son del tipo permitido: ${invalidFiles
              .map((f) => f.name)
              .join(", ")}`
          )
        }
      }

      return true
    },
    [maxSize, accept]
  )

  const uploadFiles = useCallback(
    async (files: FileList | File[]) => {
      try {
        setIsLoading(true)
        setError(null)

        const fileArray = Array.from(files)
        if (!multiple && fileArray.length > 1) {
          throw new Error("Solo se permite subir un archivo")
        }

        validateFiles(fileArray)
        setFiles(fileArray)
        onSuccess?.(fileArray)

        return fileArray
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Error al subir archivos")
        setError(error)
        onError?.(error)
        toast.error(error.message)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [multiple, validateFiles, onSuccess, onError]
  )

  const clearFiles = useCallback(() => {
    setFiles([])
    setError(null)
  }, [])

  return {
    files,
    isLoading,
    error,
    uploadFiles,
    clearFiles,
  }
}

interface DownloadOptions {
  fileName?: string
  onSuccess?: (blob: Blob) => void
  onError?: (error: Error) => void
}

export function useFileDownload() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const downloadFile = useCallback(
    async (url: string, options: DownloadOptions = {}) => {
      const { fileName, onSuccess, onError } = options

      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(url)
        if (!response.ok) {
          throw new Error("Error al descargar el archivo")
        }

        const blob = await response.blob()
        onSuccess?.(blob)

        // Create download link
        const downloadUrl = window.URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = downloadUrl
        link.download = fileName || url.split("/").pop() || "download"
        document.body.appendChild(link)
        link.click()
        link.remove()

        // Clean up
        window.URL.revokeObjectURL(downloadUrl)

        return blob
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Error al descargar")
        setError(error)
        onError?.(error)
        toast.error(error.message)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  const downloadBlob = useCallback((blob: Blob, fileName: string) => {
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  }, [])

  return {
    isLoading,
    error,
    downloadFile,
    downloadBlob,
  }
}

export function useFileDrop(options: FileOptions = {}) {
  const [isDragging, setIsDragging] = useState(false)
  const { uploadFiles, ...rest } = useFileUpload(options)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const droppedFiles = Array.from(e.dataTransfer.files)
      await uploadFiles(droppedFiles)
    },
    [uploadFiles]
  )

  return {
    isDragging,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    ...rest,
  }
}
