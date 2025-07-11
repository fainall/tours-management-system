"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Tour } from "@/types"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Pencil, Trash } from "lucide-react"
import { TourDialog } from "./tour-dialog"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const columns: ColumnDef<Tour>[] = [
  {
    accessorKey: "title",
    header: "Nombre del Tour",
  },
  {
    accessorKey: "priceAdult",
    header: "Precio Adulto",
    cell: ({ row }: { row: { getValue: (key: string) => any } }) => {
      const price = parseFloat(row.getValue("priceAdult"))
      const formatted = new Intl.NumberFormat("es-PE", {
        style: "currency",
        currency: "PEN",
      }).format(price)
      return formatted
    },
  },
  {
    accessorKey: "priceChild",
    header: "Precio Niño",
    cell: ({ row }: { row: { getValue: (key: string) => any } }) => {
      const price = parseFloat(row.getValue("priceChild"))
      const formatted = new Intl.NumberFormat("es-PE", {
        style: "currency",
        currency: "PEN",
      }).format(price)
      return formatted
    },
  },
  {
    accessorKey: "duration",
    header: "Duración",
  },
  {
    accessorKey: "maxCapacity",
    header: "Capacidad",
  },
  {
    id: "actions",
    cell: ({ row }: { row: { original: Tour } }) => {
      const tour = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(tour.id.toString())}
            >
              Copiar ID del Tour
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <TourDialog
                tour={tour}
                trigger={
                  <Button variant="ghost" className="w-full justify-start">
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar tour
                  </Button>
                }
              />
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={async () => {
                try {
                  const response = await fetch(`/api/tours/${tour.id}`, {
                    method: "DELETE",
                  })

                  if (!response.ok) {
                    throw new Error("Error al eliminar el tour")
                  }

                  toast.success("Tour eliminado correctamente")
                  window.location.reload()
                } catch (error) {
                  toast.error("Error al eliminar el tour")
                }
              }}
              className="text-red-600 focus:text-red-600"
            >
              <Trash className="mr-2 h-4 w-4" />
              Eliminar tour
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
