"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { TourForm } from "./tour-form"
import { Tour } from "@/types"
import { PlusIcon } from "lucide-react"

interface TourDialogProps {
  tour?: Tour
  trigger?: React.ReactNode
}

export function TourDialog({ tour, trigger }: TourDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="flex items-center gap-2">
            <PlusIcon className="h-4 w-4" />
            Nuevo Tour
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{tour ? "Editar Tour" : "Crear Nuevo Tour"}</DialogTitle>
          <DialogDescription>
            {tour
              ? "Actualiza los detalles del tour existente."
              : "Completa los detalles para crear un nuevo tour."}
          </DialogDescription>
        </DialogHeader>
        <TourForm tour={tour} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
