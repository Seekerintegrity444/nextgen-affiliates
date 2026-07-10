'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, Link2 } from 'lucide-react'

interface Domain {
  id: string
  domain: string
}

export default function CreateLinkPage() {
  const router = useRouter()
  const [accountName, setAccountName] = useState('')
  const [slug, setSlug] = useState('')
  const [customDomainId, setCustomDomainId] = useState('')
  const [domains, setDomains] = useState<Domain[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchDomains()
  }, [])

  const fetchDomains = async () => {
    try {
      const response = await fetch('/api/domains')
      if (response.status === 401) {
        router.push('/login')
        return
      }
      const data = await response.json()
      setDomains(data)
    } catch (error) {
      console.error('Failed to fetch domains:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountName,
          slug,
          customDomainId: customDomainId || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create link')
      }

      router.push('/admin/links')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 animate-fadeInUp">
        <Link
          href="/admin/links"
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Create New Link Account
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Set up a new tracking link for your campaigns
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 animate-fadeInUp delay-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50/80 dark:bg-red-950/30 backdrop-blur text-red-600 dark:text-red-400 p-3 rounded-xl text-sm border border-red-200 dark:border-red-800 animate-fadeIn">
              {error}
            </div>
          )}

          <div>
            <label className="form-label">Account Name</label>
            <input
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              className="form-input"
              placeholder="e.g., iPhone Campaign"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="form-label">Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s/g, '-'))}
              className="form-input"
              placeholder="e.g., iphone-offer"
              required
              disabled={loading}
            />
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Must be unique. Use letters, numbers, and hyphens only.
            </p>
          </div>

          <div>
            <label className="form-label">Custom Domain (Optional)</label>
            <select
              value={customDomainId}
              onChange={(e) => setCustomDomainId(e.target.value)}
              className="form-select"
              disabled={loading}
            >
              <option value="">Use default domain</option>
              {domains.map((domain) => (
                <option key={domain.id} value={domain.id}>
                  {domain.domain}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <Link2 className="w-4 h-4" />
              Tracking Link Preview:
            </p>
            <p className="text-sm font-mono text-indigo-600 dark:text-indigo-400 mt-1 break-all">
              {customDomainId
                ? `https://${domains.find((d) => d.id === customDomainId)?.domain}/${slug || 'your-slug'}`
                : `https://yourdomain.com/${slug || 'your-slug'}`}
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 btn-gradient rounded-xl disabled:opacity-50 font-medium flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Create Link Account
                </>
              )}
            </button>
            <Link
              href="/admin/links"
              className="px-6 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-300 font-medium"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}