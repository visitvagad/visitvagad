import React from 'react'

interface StatsCardProps {
  title: string
  value: number | string
  icon?: React.ReactNode
  description?: string
  trend?: {
    value: number
    isPositive: boolean
  }
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, description }) => {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/10 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="text-on-surface/50 text-xs font-bold uppercase tracking-widest">{title}</div>
        {icon && <div className="text-primary">{icon}</div>}
      </div>
      <div className="text-3xl font-epilogue font-bold text-on-surface mb-1">{value}</div>
      {description && <div className="text-on-surface/40 text-[10px] uppercase font-bold tracking-tighter">{description}</div>}
    </div>
  )
}

export default StatsCard
