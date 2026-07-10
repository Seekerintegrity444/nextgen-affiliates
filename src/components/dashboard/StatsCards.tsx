'use client'

import { StatsCard } from '@/components/ui/StatsCard'
import { Chart } from '@/components/ui/Chart'
import { MousePointerClick, Users, Link2, Bot } from 'lucide-react'

interface StatsCardsProps {
  stats: {
    totalClicks: number
    uniqueClicks: number
    totalLinks: number
    botClicks: number
  }
  chartData?: Array<{ label: string; value: number; color?: string }>
}

export default function StatsCards({ stats, chartData }: StatsCardsProps) {
  const defaultChartData = [
    { label: 'Mon', value: 420, color: '#6366F1' },
    { label: 'Tue', value: 580, color: '#6366F1' },
    { label: 'Wed', value: 720, color: '#8B5CF6' },
    { label: 'Thu', value: 650, color: '#8B5CF6' },
    { label: 'Fri', value: 890, color: '#06B6D4' },
    { label: 'Sat', value: 540, color: '#06B6D4' },
    { label: 'Sun', value: 380, color: '#6366F1' },
  ]

  const data = chartData || defaultChartData

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatsCard
          title="Total Clicks"
          value={stats.totalClicks}
          icon={MousePointerClick}
          trend={12}
          color="indigo"
          subtitle={`${stats.totalLinks} active links`}
          delay={0}
        />
        <StatsCard
          title="Unique Visitors"
          value={stats.uniqueClicks}
          icon={Users}
          trend={8}
          color="green"
          subtitle="New visitors this month"
          delay={100}
        />
        <StatsCard
          title="Total Links"
          value={stats.totalLinks}
          icon={Link2}
          trend={5}
          color="purple"
          subtitle="Active campaigns"
          delay={200}
        />
        <StatsCard
          title="Bot Detected"
          value={stats.botClicks}
          icon={Bot}
          trend={-3}
          color="red"
          subtitle="Blocked bots"
          delay={300}
        />
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-800 animate-fadeInUp delay-400">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              📊 Weekly Click Activity
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Click volume over the last 7 days
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Week', 'Month', 'Year'].map((period) => (
              <button
                key={period}
                className={`px-3 py-1.5 text-sm rounded-lg transition ${
                  period === 'Week'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
        <Chart
          data={data}
          type="bar"
          height={250}
          title="Clicks"
          subtitle="Last 7 days"
        />
      </div>
    </div>
  )
}