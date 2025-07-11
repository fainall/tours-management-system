"use client"

import { useState, useCallback } from "react"
import { z } from "zod"
import { getZodErrorMessages } from "@/lib/form-utils"

interface UseFormOptions<T> {
  initialValues: T
  schema?: z.ZodType<T>
  onSubmit: (values: T) => Promise<void> | void
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  schema,
  onSubmit,
}: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const validateField = useCallback(
    (name: keyof T, value: any) => {
      if (!schema) return

      try {
        schema.pick({ [name]: true }).parse({ [name]: value })
        setErrors((prev) => ({ ...prev, [name]: "" }))
      } catch (error) {
        if (error instanceof z.ZodError) {
          const fieldErrors = getZodErrorMessages(error)
          setErrors((prev) => ({ ...prev, [name]: fieldErrors[name] }))
        }
      }
    },
    [schema]
  )

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = event.target
      const newValue = type === "checkbox" 
        ? (event.target as HTMLInputElement).checked
        : value

      setValues((prev) => ({ ...prev, [name]: newValue }))
      validateField(name, newValue)
    },
    [validateField]
  )

  const handleBlur = useCallback((event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name } = event.target
    setTouched((prev) => ({ ...prev, [name]: true }))
  }, [])

  const setFieldValue = useCallback((name: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }))
    validateField(name, value)
  }, [validateField])

  const setFieldTouched = useCallback((name: keyof T, isTouched = true) => {
    setTouched((prev) => ({ ...prev, [name]: isTouched }))
  }, [])

  const validateForm = useCallback(() => {
    if (!schema) return true

    try {
      schema.parse(values)
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formErrors = getZodErrorMessages(error)
        setErrors(formErrors)
      }
      return false
    }
  }, [schema, values])

  const handleSubmit = useCallback(
    async (event?: React.FormEvent) => {
      event?.preventDefault()

      if (!validateForm()) {
        return
      }

      setIsSubmitting(true)
      try {
        await onSubmit(values)
      } finally {
        setIsSubmitting(false)
      }
    },
    [validateForm, values, onSubmit]
  )

  const resetForm = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }, [initialValues])

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldTouched,
    resetForm,
  }
}
