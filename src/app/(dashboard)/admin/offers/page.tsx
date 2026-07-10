'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, Globe, Check, X, Power, PowerOff } from 'lucide-react'

interface Offer {
  id: string
  country: string
  offerUrl: string
  isActive: boolean
  isGlobal: boolean
}

export default function OffersPage() {
  const router = useRouter()
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    country: '',
    offerUrl: '',
    isGlobal: false,
  })
  const [formError, setFormError] = useState('')
  const [formLoading, setFormLoading] = useState(false)

  useEffect(() => {
    fetchOffers()
  }, [])

  const fetchOffers = async () => {
    try {
      const response = await fetch('/api/offers')
      if (response.status === 401) {
        router.push('/login')
        return
      }
      const data = await response.json()
      setOffers(data)
    } catch (error) {
      console.error('Failed to fetch offers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    setFormLoading(true)

    try {
      const url = editingId ? `/api/offers/${editingId}` : '/api/offers'
      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save offer')
      }

      setShowForm(false)
      setEditingId(null)
      setFormData({ country: '', offerUrl: '', isGlobal: false })
      fetchOffers()
    } catch (err: any) {
      setFormError(err.message)
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this offer?')) return

    try {
      const response = await fetch(`/api/offers/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete offer')
      }

      fetchOffers()
    } catch (error) {
      console.error('Error deleting offer:', error)
    }
  }

  const handleToggle = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/offers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      })

      if (!response.ok) {
        throw new Error('Failed to toggle offer')
      }

      fetchOffers()
    } catch (error) {
      console.error('Error toggling offer:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400 mt-4 animate-pulse">Loading offers...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fadeInUp">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Offer Vault</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage geo-targeted offers for your links</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 btn-gradient rounded-xl text-sm font-medium flex items-center gap-2"
        >
          {showForm ? (
            <>
              <X className="w-4 h-4" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Add Offer
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
              <label className="form-label">Country (e.g., US, GB, CA)</label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value.toUpperCase() })}
                className="form-input"
                placeholder="Enter country code"
                required
                disabled={formLoading}
              />
            </div>

            <div>
              <label className="form-label">Offer URL</label>
              <input
                type="url"
                value={formData.offerUrl}
                onChange={(e) => setFormData({ ...formData, offerUrl: e.target.value })}
                className="form-input"
                placeholder="https://affiliate.com/?s1="
                required
                disabled={formLoading}
              />
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                The slug will be automatically appended to this URL
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isGlobal"
                checked={formData.isGlobal}
                onChange={(e) => setFormData({ ...formData, isGlobal: e.target.checked })}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                disabled={formLoading}
              />
              <label htmlFor="isGlobal" className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-1">
                <Globe className="w-4 h-4" />
                Global Smart Link (fallback for all countries)
              </label>
            </div>

            <button
              type="submit"
              disabled={formLoading}
              className="px-4 py-2 btn-gradient rounded-xl disabled:opacity-50 font-medium flex items-center gap-2"
            >
              {formLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  {editingId ? 'Update Offer' : 'Add Offer'}
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {offers.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-12 text-center shadow-sm border border-gray-100 dark:border-gray-800 animate-fadeInUp delay-200">
          <div className="text-5xl mb-4 animate-float">📦</div>
          <p className="text-gray-600 dark:text-gray-400">No offers found</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Add your first offer to start redirecting traffic</p>
        </div>
      ) : (
        <div className="space-y-4 animate-fadeInUp delay-200">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 card-hover"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    {offer.isGlobal ? (
                      <span className="text-sm font-medium text-purple-600 dark:text-purple-400 flex items-center gap-1">
                        <Globe className="w-4 h-4" /> Global
                      </span>
                    ) : (
                      <span className="text-sm font-medium flex items-center gap-1">
                        🌍 {offer.country}
                      </span>
                    )}
                    <span className={`badge ${offer.isActive ? 'badge-success' : 'badge-danger'}`}>
                      {offer.isActive ? (
                        <span className="flex items-center gap-1">
                          <Power className="w-3 h-3" /> Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <PowerOff className="w-3 h-3" /> Inactive
                        </span>
                      )}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 break-all font-mono">
                    {offer.offerUrl}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleToggle(offer.id, offer.isActive)}
                    className={`px-3 py-1 text-sm border rounded-lg transition flex items-center gap-1 ${
                      offer.isActive
                        ? 'border-yellow-300 text-yellow-700 hover:bg-yellow-50 dark:border-yellow-800 dark:text-yellow-400 dark:hover:bg-yellow-950/30'
                        : 'border-green-300 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-950/30'
                    }`}
                  >
                    {offer.isActive ? (
                      <>
                        <PowerOff className="w-3 h-3" /> Disable
                      </>
                    ) : (
                      <>
                        <Power className="w-3 h-3" /> Enable
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setFormData({
                        country: offer.country,
                        offerUrl: offer.offerUrl,
                        isGlobal: offer.isGlobal,
                      })
                      setEditingId(offer.id)
                      setShowForm(true)
                    }}
                    className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition flex items-center gap-1"
                  >
                    <Edit className="w-3 h-3" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(offer.id)}
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