'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
  LayoutDashboard,
  Plus,
  Package,
  Globe2,
  Link2,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Logo } from '@/components/ui/Logo'

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) setCollapsed(true)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const menuItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/links/create', label: 'Create Link', icon: Plus },
    { href: '/admin/offers', label: 'Offer Vault', icon: Package },
    { href: '/admin/domains', label: 'Custom Domains', icon: Globe2 },
    { href: '/admin/links', label: 'All Links', icon: Link2 },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ]

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  const sidebarContent = (
    <>
      <div className={`p-4 border-b border-gray-200 dark:border-gray-800 ${collapsed && !isMobile ? 'text-center' : ''}`}>
        <Logo
          variant={collapsed && !isMobile ? 'icon' : 'compact'}
          size="md"
          showAnimation={true}
        />
      </div>

      {!isMobile && (
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex items-center justify-center p-2 mx-4 mt-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      )}

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => isMobile && setMobileOpen(false)}
              className={`flex items-center ${collapsed && !isMobile ? 'justify-center' : 'gap-3'} px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 text-indigo-700 dark:text-indigo-400 font-medium shadow-sm'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Icon className={`${collapsed && !isMobile ? 'w-6 h-6' : 'w-5 h-5'} transition-transform duration-200 group-hover:scale-110`} />
              {(!collapsed || isMobile) && <span className="text-sm">{item.label}</span>}
              {isActive && !collapsed && !isMobile && (
                <span className="ml-auto w-1.5 h-8 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full animate-pulse" />
              )}
            </Link>
          )
        })}
      </nav>

      <div className={`p-4 border-t border-gray-200 dark:border-gray-800 ${collapsed && !isMobile ? 'text-center' : ''}`}>
        <div className={`flex ${collapsed && !isMobile ? 'flex-col items-center' : 'items-center gap-3'}`}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white font-semibold shadow-lg flex-shrink-0">
            <span className="text-sm">A</span>
          </div>
          {(!collapsed || isMobile) && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">Admin</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">admin@nextgen.com</p>
            </div>
          )}
        </div>
        {(!collapsed || isMobile) && (
          <button
            onClick={handleLogout}
            className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all duration-200 group"
          >
            <LogOut className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
            Logout
          </button>
        )}
      </div>
    </>
  )

  if (isMobile) {
    return (
      <>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 lg:hidden"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {mobileOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-fadeIn"
            onClick={() => setMobileOpen(false)}
          />
        )}

        <aside
          className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-gray-900 z-50 transition-transform duration-300 lg:hidden ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {sidebarContent}
        </aside>
      </>
    )
  }

  return (
    <aside
      className={`${collapsed ? 'w-20' : 'w-64'} bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 min-h-screen flex flex-col transition-all duration-300 hidden md:flex`}
    >
      {sidebarContent}
    </aside>
  )
}