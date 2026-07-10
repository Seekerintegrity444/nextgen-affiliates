'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, CheckCircle, RefreshCw, XCircle } from 'lucide-react'

interface Domain {
  id: string
  domain: string
  verified: boolean
  sslEnabled: boolean
  isActive: boolean
  createdAt: string
}

export default function DomainsPage() {
  const router = useRouter()
  const [domains, setDomains] = useState<Domain[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [newDomain, setNewDomain] = useState('')
  const [formError, setFormError] = useState('')
  const [formLoading, setFormLoading] = useState(false)

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
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    setFormLoading(true)

    try {
      const response = await fetch('/api/domains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: newDomain }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to add domain')
      }

      setNewDomain('')
      setShowForm(false)
      fetchDomains()
    } catch (err: any) {
      setFormError(err.message)
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this domain?')) return

    try {
      const response = await fetch(`/api/domains/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete domain')
      }

      fetchDomains()
    } catch (error) {
      console.error('Error deleting domain:', error)
    }
  }

  const handleVerify = async (id: string) => {
    try {
      const response = await fetch(`/api/domains/${id}/verify`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to verify domain')
      }

      fetchDomains()
    } catch (error) {
      console.error('Error verifying domain:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400 mt-4 animate-pulse">Loading domains...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fadeInUp">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Custom Domains</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Connect your own domains for white-label tracking</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 btn-gradient rounded-xl text-sm font-medium flex items-center gap-2"
        >
          {showForm ? (
            <>
              <XCircle className="w-4 h-4" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Add Domain
            </>
          )}
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 animate-fadeInUp delay-100">
          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && (
              <div className="bg-red-50/80 dark:bg-red-950/30 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm border border-red-200 dark:border-red-800">
                {formError}
              </div>
            )}

            <div>
              <label className="form-label">Domain Name</label>
              <input
                type="text"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value.toLowerCase())}
                placeholder="example.com"
                className="form-input"
                required
                disabled={formLoading}
              />
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Add a CNAME record pointing to your platform domain
              </p>
            </div>

            <button
              type="submit"
              disabled={formLoading}
              className="px-4 py-2 btn-gradient rounded-xl disabled:opacity-50 font-medium flex items-center gap-2"
            >
              {formLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Add Domain
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {domains.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-12 text-center shadow-sm border border-gray-100 dark:border-gray-800 animate-fadeInUp delay-200">
          <div className="text-5xl mb-4 animate-float">🌐</div>
          <p className="text-gray-600 dark:text-gray-400">No custom domains added yet</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Add your first domain to use custom tracking links</p>
        </div>
      ) : (
        <div className="space-y-4 animate-fadeInUp delay-200">
          {domains.map((domain) => (
            <div
              key={domain.id}
              className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 card-hover"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {domain.domain}
                    </span>
                    <span className={`badge ${domain.verified ? 'badge-success' : 'badge-warning'}`}>
                      {domain.verified ? (
                        <span className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Verified
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <RefreshCw className="w-3 h-3 animate-spin" /> Pending
                        </span>
                      )}
                    </span>
                    <span className={`badge ${domain.isActive ? 'badge-success' : 'badge-danger'}`}>
                      {domain.isActive ? '● Active' : '● Inactive'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                    Added: {new Date(domain.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {!domain.verified && (
                    <button
                      onClick={() => handleVerify(domain.id)}
                      className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" /> Verify
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(domain.id)}
                    className="px-3 py-1 text-sm border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}