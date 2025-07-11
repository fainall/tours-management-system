import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// Schema for tour validation
const tourSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  description: z.string().min(1, "La descripción es requerida"),
  priceAdult: z.number().min(0, "El precio debe ser mayor o igual a 0"),
  priceChild: z.number().min(0, "El precio debe ser mayor o igual a 0"),
  minPrice: z.number().min(0, "El precio mínimo debe ser mayor o igual a 0"),
  directCost: z.number().min(0, "El costo directo debe ser mayor o igual a 0"),
  vehicleCost: z.number().optional(),
  duration: z.string().min(1, "La duración es requerida"),
  maxCapacity: z.number().min(1, "La capacidad debe ser mayor a 0"),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return new NextResponse("No autorizado", { status: 401 })
    }

    if (!["ADMIN", "SUPERVISOR"].includes(session.user.role)) {
      return new NextResponse("No tiene permisos para esta acción", { status: 403 })
    }

    const json = await req.json()
    const body = tourSchema.parse(json)

    const tour = await prisma.tour.create({
      data: {
        ...body,
        createdById: parseInt(session.user.id)
      }
    })

    return NextResponse.json(tour)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.errors), { status: 422 })
    }

    return new NextResponse("Error interno del servidor", { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return new NextResponse("No autorizado", { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const query = searchParams.get("query")

    const tours = await prisma.tour.findMany({
      where: query ? {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } }
        ]
      } : undefined,
      orderBy: {
        createdAt: "desc"
      }
    })

    return NextResponse.json(tours)
  } catch (error) {
    return new NextResponse("Error interno del servidor", { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return new NextResponse("No autorizado", { status: 401 })
    }

    if (!["ADMIN", "SUPERVISOR"].includes(session.user.role)) {
      return new NextResponse("No tiene permisos para esta acción", { status: 403 })
    }

    const json = await req.json()
    const { id, ...updateData } = json
    const body = tourSchema.parse(updateData)

    const tour = await prisma.tour.update({
      where: { id: parseInt(id) },
      data: body
    })

    return NextResponse.json(tour)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.errors), { status: 422 })
    }

    return new NextResponse("Error interno del servidor", { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return new NextResponse("No autorizado", { status: 401 })
    }

    if (!["ADMIN"].includes(session.user.role)) {
      return new NextResponse("No tiene permisos para esta acción", { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return new NextResponse("ID no proporcionado", { status: 400 })
    }

    await prisma.tour.delete({
      where: { id: parseInt(id) }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    return new NextResponse("Error interno del servidor", { status: 500 })
  }
}
