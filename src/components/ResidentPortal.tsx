import type { ReactElement } from 'react'
import { BrandLogo } from './BrandLogo'
import { ThemeToggle } from './ThemeToggle'
import { OnlineRequestsModule } from '../modules/OnlineRequestsModule'
import { AppointmentsModule } from '../modules/AppointmentsModule'
import { NotificationsModule } from '../modules/NotificationsModule'
import type { CurrentUser, Theme } from '../types/dashboard'

type ResidentPortalProps = {
  currentUser: CurrentUser
  theme: Theme
  onToggleTheme: () => void
  onLogout: () => void
}

type ResidentTab = 'requests' | 'appointments' | 'notifications'

const tabs: { key: ResidentTab; label: string; icon: ReactElement }[] = [
  {
    key: 'requests',
    label: 'My Requests',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
        <path d="M6 9v6M18 9v6" />
      </svg>
    ),
  },
  {
    key: 'appointments',
    label: 'Appointments',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
  },
  {
    key: 'notifications',
    label: 'Notifications',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
  },
]

import { useState } from 'react'

export function ResidentPortal({ currentUser, theme, onToggleTheme, onLogout }: ResidentPortalProps) {
  const [activeTab, setActiveTab] = useState<ResidentTab>('requests')

  const content: Record<ResidentTab, ReactElement> = {
    requests: <OnlineRequestsModule />,
    appointments: <AppointmentsModule />,
    notifications: <NotificationsModule />,
  }

  const initials = currentUser.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/90 px-6 py-3 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90">
        <div className="flex items-center gap-3">
          <BrandLogo sizeClassName="h-8 w-8" textClassName="text-xs" />
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Barangay San Vicente</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">Resident Portal</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />

          {/* User badge */}
          <div className="hidden items-center gap-2 sm:flex">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
              {initials}
            </div>
            <div className="leading-tight">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">{currentUser.name}</p>
              <p className="text-[10px] text-amber-600 dark:text-amber-400">{currentUser.roleName}</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </header>

      {/* Welcome banner */}
      <div className="border-b border-slate-100 bg-white px-6 py-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Welcome back, {currentUser.name.split(' ')[0]}!
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage your barangay service requests, appointments, and notifications below.
          </p>

          {/* Quick-action cards */}
          <div className="mt-5 grid grid-cols-3 gap-3 sm:gap-4">
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-900/40 dark:bg-blue-900/20">
              <p className="text-xs text-blue-500 dark:text-blue-400">Online Requests</p>
              <p className="mt-1 text-2xl font-bold text-blue-700 dark:text-blue-300">3</p>
              <p className="text-[10px] text-blue-400 dark:text-blue-500">Pending</p>
            </div>
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 dark:border-emerald-900/40 dark:bg-emerald-900/20">
              <p className="text-xs text-emerald-500 dark:text-emerald-400">Appointments</p>
              <p className="mt-1 text-2xl font-bold text-emerald-700 dark:text-emerald-300">1</p>
              <p className="text-[10px] text-emerald-400 dark:text-emerald-500">Upcoming</p>
            </div>
            <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 dark:border-amber-900/40 dark:bg-amber-900/20">
              <p className="text-xs text-amber-500 dark:text-amber-400">Notifications</p>
              <p className="mt-1 text-2xl font-bold text-amber-700 dark:text-amber-300">2</p>
              <p className="text-[10px] text-amber-400 dark:text-amber-500">Unread</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="border-b border-slate-200 bg-white px-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-4xl gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'border-slate-900 text-slate-900 dark:border-white dark:text-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Module content */}
      <main className="mx-auto max-w-4xl px-6 py-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {content[activeTab]}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-8 border-t border-slate-100 py-6 text-center text-xs text-slate-400 dark:border-slate-800 dark:text-slate-600">
        © {new Date().getFullYear()} Barangay San Vicente — Resident Portal
      </footer>
    </div>
  )
}
