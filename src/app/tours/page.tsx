import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { DataTable } from "@/components/tours/data-table"
import { columns } from "@/components/tours/columns"
import { prisma } from "@/lib/prisma"
import { TourDialog } from "@/components/tours/tour-dialog"
import { Role } from "@/types"

export default async function ToursPage() {
  const session = await getServerSession(authOptions)
  
  const tours = await prisma.tour.findMany({
    orderBy: {
      createdAt: "desc"
    },
    include: {
      createdBy: {
        select: {
          name: true
        }
      }
    }
  })

  const canCreateTour = session?.user?.role === Role.ADMIN || session?.user?.role === Role.SUPERVISOR

  return (
    <main className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Tours</h2>
        {canCreateTour && <TourDialog />}
      </div>
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={tours} />
      </div>
    </main>
  )
}
