import type { ReactNode } from "react"

interface StatCardProps {
  icon: ReactNode
  title: string
  value: string | number
  subtitle: string
  bgColor?: string
}

export function StatCard({ icon, title, value, subtitle, bgColor = "bg-green-50" }: StatCardProps) {
  return (
    <div className={`${bgColor} rounded-lg p-6 border border-green-200`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="text-green-600">{icon}</div>
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-500">{subtitle}</p>
    </div>
  )
}
