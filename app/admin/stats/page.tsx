"use client"

import { useEffect, useState } from "react"
import { AppHeader } from "@/components/app-header"
import { AppFooter } from "@/components/app-footer"
import { StatCard } from "@/components/stat-card"
import { StatsSection } from "@/components/stats-section"
import { Users, UserCheck, MessageSquare, TrendingUp, Settings } from "lucide-react"

interface Stats {
  totalUsers: number
  activeProfessionals: number
  totalSessions: number
  growthPercentage: number | string
  platformUsage: {
    freeChatsThisWeek: number
    premiumSessionsThisWeek: number
    newUsersThisWeek: number
    conversionsToPremiun: number
  }
  revenue: {
    monthlyRevenue: number
    activeSubscriptions: number
    retentionRate: number | string
    avgRevenuePerUser: number | string
  }
}

export default function AdminStatsPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/admin/stats")
        if (!response.ok) throw new Error("Failed to fetch stats")
        const data = await response.json()
        setStats(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading statistics")
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader showUserMenu={true} />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Cargando estadísticas...</p>
        </div>
        <AppFooter />
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader showUserMenu={true} />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-center text-destructive">{error || "Error al cargar estadísticas"}</p>
        </div>
        <AppFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader showUserMenu={true} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Panel de Administración</h1>
            <p className="text-muted-foreground">Bienvenido, Administrador GoodHealth</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Settings className="w-4 h-4" />
            Configuración
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Users className="w-6 h-6" />}
            title="Total Usuarios"
            value={stats.totalUsers.toLocaleString()}
            subtitle="+12% desde el mes pasado"
          />
          <div className="w-6 h-6"></div>
          <StatCard
            icon={<MessageSquare className="w-6 h-6" />}
            title="Sesiones Totales"
            value={stats.totalSessions.toLocaleString()}
            subtitle="+5% esta semana"
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            title="Crecimiento Mensual"
            value={`${stats.growthPercentage}%`}
            subtitle="Objetivo: 15%"
          />
        </div>

        {/* Stats Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StatsSection
            title="Uso de la Plataforma"
            items={[
              {
                label: "Chats con IA (Gratuitos)",
                value: `${stats.platformUsage.freeChatsThisWeek} esta semana`,
              },
              {
                label: "Sesiones Premium",
                value: `${stats.platformUsage.premiumSessionsThisWeek} esta semana`,
              },
              {
                label: "Nuevos Registros",
                value: `${stats.platformUsage.newUsersThisWeek} esta semana`,
              },
              {
                label: "Conversiones a Premium",
                value: stats.platformUsage.conversionsToPremiun,
              },
            ]}
          />

          <StatsSection
            title="Ingresos"
            items={[
              {
                label: "Ingresos Mensuales",
                value: `$${stats.revenue.monthlyRevenue.toLocaleString()}`,
              },
              {
                label: "Suscripciones Activas",
                value: stats.revenue.activeSubscriptions,
              },
              {
                label: "Tasa de Retención",
                value: `${stats.revenue.retentionRate}%`,
              },
              {
                label: "Valor Promedio por Usuario",
                value: `$${stats.revenue.avgRevenuePerUser}`,
              },
            ]}
          />
        </div>
      </main>

      <AppFooter />
    </div>
  )
}
