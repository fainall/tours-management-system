import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, Users, Map, DollarSign } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { ReservationStatus } from "@/types"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  const [tourCount, reservationCount, totalRevenue] = await Promise.all([
    prisma.tour.count({ where: { active: true } }),
    prisma.reservation.count(),
    prisma.reservation.aggregate({
      _sum: {
        totalPrice: true
      },
      where: {
        status: ReservationStatus.PAGADO
      }
    })
  ])

  const cards = [
    {
      title: "Tours Activos",
      value: tourCount,
      icon: Map,
      description: "Total de tours disponibles"
    },
    {
      title: "Reservas",
      value: reservationCount,
      icon: CalendarDays,
      description: "Total de reservas realizadas"
    },
    {
      title: "Ingresos",
      value: new Intl.NumberFormat("es-PE", {
        style: "currency",
        currency: "PEN"
      }).format(totalRevenue._sum.totalPrice || 0),
      icon: DollarSign,
      description: "Total de ingresos por reservas pagadas"
    },
    {
      title: "Usuarios",
      value: await prisma.user.count(),
      icon: Users,
      description: "Total de usuarios registrados"
    }
  ]

  return (
    <main className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </main>
  )
}
