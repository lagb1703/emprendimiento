import type { ReactNode } from "react"

interface StatItem {
  label: string
  value: string | number
}

interface StatsSectionProps {
  title: string
  icon?: ReactNode
  items: StatItem[]
}

export function StatsSection({ title, icon, items }: StatsSectionProps) {
  return (
    <div className="bg-green-50 rounded-lg p-6 border border-green-200">
      <div className="flex items-center gap-2 mb-6">
        {icon && <div className="text-green-600">{icon}</div>}
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{item.label}</span>
            <span className="font-semibold text-gray-800">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
