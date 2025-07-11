"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tour } from "@/types"

const formSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  description: z.string().min(1, "La descripción es requerida"),
  priceAdult: z.coerce.number().min(0, "El precio debe ser mayor o igual a 0"),
  priceChild: z.coerce.number().min(0, "El precio debe ser mayor o igual a 0"),
  minPrice: z.coerce.number().min(0, "El precio mínimo debe ser mayor o igual a 0"),
  directCost: z.coerce.number().min(0, "El costo directo debe ser mayor o igual a 0"),
  vehicleCost: z.coerce.number().min(0, "El costo del vehículo debe ser mayor o igual a 0").optional(),
  duration: z.string().min(1, "La duración es requerida"),
  maxCapacity: z.coerce.number().min(1, "La capacidad debe ser mayor a 0"),
})

type FormValues = z.infer<typeof formSchema>

interface TourFormProps {
  tour?: Tour
  onSuccess?: () => void
}

export function TourForm({ tour, onSuccess }: TourFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const defaultValues: FormValues = tour ? {
    title: tour.title,
    description: tour.description,
    priceAdult: tour.priceAdult,
    priceChild: tour.priceChild,
    minPrice: tour.minPrice,
    directCost: tour.directCost,
    vehicleCost: tour.vehicleCost ?? undefined,
    duration: tour.duration,
    maxCapacity: tour.maxCapacity,
  } : {
    title: "",
    description: "",
    priceAdult: 0,
    priceChild: 0,
    minPrice: 0,
    directCost: 0,
    vehicleCost: undefined,
    duration: "",
    maxCapacity: 0
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  })

  async function onSubmit(data: FormValues) {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/tours${tour ? `/${tour.id}` : ""}`, {
        method: tour ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message)
      }

      toast.success(tour ? "Tour actualizado" : "Tour creado")
      router.refresh()
      if (onSuccess) onSuccess()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Ocurrió un error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Tour al Valle Sagrado" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descripción detallada del tour..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="priceAdult"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio Adulto</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="priceChild"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio Niño</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="minPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio Mínimo</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="directCost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Costo Directo</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="vehicleCost"
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem>
                <FormLabel>Costo de Vehículo</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01" 
                    value={value ?? ""} 
                    onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined)}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duración</FormLabel>
                <FormControl>
                  <Input placeholder="2 horas" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maxCapacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capacidad Máxima</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Guardando..." : tour ? "Actualizar Tour" : "Crear Tour"}
        </Button>
      </form>
    </Form>
  )
}
