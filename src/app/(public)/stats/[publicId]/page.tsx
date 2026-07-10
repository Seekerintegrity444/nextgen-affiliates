'use client'

import { useState, useEffect } from 'react'
import { formatNumber } from '@/lib/utils/helpers'
import {
  Eye,
  MousePointerClick,
  Users,
  Globe2,
  Bot,
  User,
  CheckCircle,
  XCircle,
  ExternalLink,
  Search,
  ChevronLeft,
  ChevronRight,
  Monitor,
  Smartphone,
  Tablet,
  Clock,
} from 'lucide-react'
import { Logo } from '@/components/ui/Logo'

interface Stats {
  totalClicks: number
  uniqueClicks: number
  clicks: Array<{
    id: string
    timestamp: string
    country: string
    browser: string
    ipAddress: string
    referrer: string | null
    deviceType: string | null
    isUnique: boolean
    isBot: boolean
    createdAt: string
  }>
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export default function PublicStatsPage({ params }: { params: { publicId: string } }) {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [filterCountry, setFilterCountry] = useState('')
  const [filterUnique, setFilterUnique] = useState('')
  const limit = 10

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(
          `/api/analytics/public/${params.publicId}?page=${page}&limit=${limit}&search=${search}&country=${filterCountry}&unique=${filterUnique}`
        )
        if (!response.ok) throw new Error('Dashboard not found')
        const data = await response.json()
        setStats(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [params.publicId, page, search, filterCountry, filterUnique])

  const getCountryFlag = (country: string | null) => {
    if (!country) return '🌍'
    const flags: Record<string, string> = {
      'US': '🇺🇸',
      'GB': '🇬🇧',
      'CA': '🇨🇦',
      'AU': '🇦🇺',
      'DE': '🇩🇪',
      'FR': '🇫🇷',
      'JP': '🇯🇵',
      'CN': '🇨🇳',
      'IN': '🇮🇳',
      'BR': '🇧🇷',
      'RU': '🇷🇺',
      'ZA': '🇿🇦',
      'ES': '🇪🇸',
      'IT': '🇮🇹',
      'MX': '🇲🇽',
      'KR': '🇰🇷',
    }
    return flags[country] || '🌍'
  }

  const getDeviceIcon = (deviceType: string | null) => {
    if (!deviceType) return <Monitor className="w-4 h-4" />
    const device = deviceType.toLowerCase()
    if (device.includes('mobile') || device.includes('phone')) {
      return <Smartphone className="w-4 h-4" />
    }
    if (device.includes('tablet')) {
      return <Tablet className="w-4 h-4" />
    }
    return <Monitor className="w-4 h-4" />
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const countries = stats?.clicks
    ? Array.from(new Set(stats.clicks.map((c) => c.country).filter(Boolean)))
    : []

  const totalClicks = stats?.pagination?.total || stats?.clicks?.length || 0
  const totalPages = stats?.pagination?.totalPages || Math.ceil(totalClicks / limit) || 1

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg-hero">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400 mt-4 animate-pulse">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg-hero">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-float">🔒</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Dashboard Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400">This dashboard may have been removed or is private.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 sm:py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 sm:mb-12 animate-fadeInDown">
          <Logo variant="compact" size="lg" showAnimation={true} />
          <div className="text-center sm:text-right">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">📊 Analytics Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Public stats for your tracking link</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 animate-fadeInUp delay-100">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 card-hover">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl">
                <MousePointerClick className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Clicks</p>
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {formatNumber(stats?.totalClicks || 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 card-hover">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 dark:bg-green-950/30 rounded-xl">
                <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Unique Clicks</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {formatNumber(stats?.uniqueClicks || 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 card-hover">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-xl">
                <Globe2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Countries</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {countries.length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 animate-fadeInUp delay-200 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-800">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Click Logs</h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">({totalClicks} clicks)</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 pr-3 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition dark:text-white"
                    placeholder="Search..."
                  />
                </div>
                {countries.length > 0 && (
                  <select
                    value={filterCountry}
                    onChange={(e) => setFilterCountry(e.target.value)}
                    className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition dark:text-white"
                  >
                    <option value="">All Countries</option>
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {getCountryFlag(country)} {country}
                      </option>
                    ))}
                  </select>
                )}
                <select
                  value={filterUnique}
                  onChange={(e) => setFilterUnique(e.target.value)}
                  className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition dark:text-white"
                >
                  <option value="">All</option>
                  <option value="true">✅ Unique</option>
                  <option value="false">🔄 Duplicate</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Time</span>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">IP</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Device</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Referrer</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {stats?.clicks && stats.clicks.length > 0 ? (
                  stats.clicks.slice((page - 1) * limit, page * limit).map((click) => (
                    <tr key={click.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                        {formatDate(click.createdAt || click.timestamp)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 font-mono">
                        {click.ipAddress || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center gap-1">
                          {getCountryFlag(click.country)}
                          <span>{click.country || 'Unknown'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center gap-1">
                          {getDeviceIcon(click.deviceType)}
                          <span>{click.browser || 'Unknown'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 max-w-[150px] truncate">
                        {click.referrer ? (
                          <a
                            href={click.referrer}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline"
                          >
                            {new URL(click.referrer).hostname}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-gray-400">Direct</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex flex-wrap items-center justify-center gap-1">
                          {click.isBot ? (
                            <span className="badge badge-danger flex items-center gap-1">
                              <Bot className="w-3 h-3" /> Bot
                            </span>
                          ) : (
                            <span className="badge badge-success flex items-center gap-1">
                              <User className="w-3 h-3" /> Human
                            </span>
                          )}
                          {click.isUnique ? (
                            <span className="badge badge-success flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> ✓
                            </span>
                          ) : (
                            <span className="badge badge-warning flex items-center gap-1">
                              <XCircle className="w-3 h-3" /> ✗
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-gray-500 dark:text-gray-400">
                      <div className="flex flex-col items-center gap-2">
                        <Eye className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                        <p>No clicks recorded yet</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalClicks > 0 && (
            <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, totalClicks)} of {totalClicks} clicks
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-600 dark:text-gray-300 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  Page {page} of {totalPages || 1}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages || 1, p + 1))}
                  disabled={page === totalPages || totalPages === 0}
                  className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
          <Logo variant="compact" size="sm" showAnimation={true} />
          <p className="text-xs text-gray-500 dark:text-gray-500">Powered by NextGen Affiliates</p>
        </div>
      </div>
    </div>
  )
}