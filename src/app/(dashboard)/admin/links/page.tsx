'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, Plus, MousePointerClick, Users, Bot } from 'lucide-react'
import { formatNumber } from '@/lib/utils/helpers'

interface LinkAccount {
  id: string
  accountName: string
  slug: string
  totalClicks: number
  uniqueClicks: number
  botClicks: number
  createdAt: string
  isActive: boolean
  customDomain: { domain: string } | null
}

export default function LinksPage() {
  const router = useRouter()
  const [links, setLinks] = useState<LinkAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchLinks()
  }, [])

  const fetchLinks = async () => {
    try {
      const response = await fetch('/api/links')
      if (response.status === 401) {
        router.push('/login')
        return
      }
      const data = await response.json()
      setLinks(data)
    } catch (error) {
      console.error('Failed to fetch links:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredLinks = links.filter((link) =>
    link.accountName.toLowerCase().includes(search.toLowerCase()) ||
    link.slug.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400 mt-4 animate-pulse">Loading links...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fadeInUp">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">All Link Accounts</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage and track all your affiliate links</p>
        </div>
        <Link
          href="/admin/links/create"
          className="px-4 py-2 btn-gradient rounded-xl text-sm font-medium flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create New Link
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-800 animate-fadeInUp delay-100">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by account name or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
        </div>
      </div>

      {filteredLinks.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 sm:p-12 shadow-sm border border-gray-100 dark:border-gray-800 text-center animate-fadeInUp delay-200">
          <div className="text-5xl mb-4 animate-float">📭</div>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">No links found</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">Create your first link to get started</p>
          <Link
            href="/admin/links/create"
            className="px-4 py-2 btn-outline rounded-xl text-sm"
          >
            Create your first link →
          </Link>
        </div>
      ) : (
        <div className="space-y-4 animate-fadeInUp delay-200">
          {filteredLinks.map((link) => (
            <div
              key={link.id}
              className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 card-hover"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                      {link.accountName}
                    </h3>
                    <span className={`badge ${link.isActive ? 'badge-success' : 'badge-danger'}`}>
                      {link.isActive ? '● Active' : '● Inactive'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Slug: <span className="font-mono text-indigo-600 dark:text-indigo-400">/{link.slug}</span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Created: {new Date(link.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-wrap gap-4 sm:gap-6">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1 justify-center">
                      <MousePointerClick className="w-3 h-3" /> Total
                    </p>
                    <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                      {formatNumber(link.totalClicks)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1 justify-center">
                      <Users className="w-3 h-3" /> Unique
                    </p>
                    <p className="text-xl font-bold text-green-600 dark:text-green-400">
                      {formatNumber(link.uniqueClicks)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1 justify-center">
                      <Bot className="w-3 h-3" /> Bots
                    </p>
                    <p className="text-xl font-bold text-red-600 dark:text-red-400">
                      {formatNumber(link.botClicks)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}