import { useEffect, useMemo, useState, type ReactElement } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BrandLogo } from '../components/BrandLogo'
import { LoadingOverlay } from '../components/LoadingOverlay'
import { ThemeToggle } from '../components/ThemeToggle'
import { useAuth } from '../context/AuthContext'
import {
  modules,
  quickActions,
  recentActivity,
  statCards,
} from '../data/dashboardData'
import { AppointmentsModule } from '../modules/AppointmentsModule'
import { BlotterModule, FILE_BLOTTER_EVENT } from '../modules/BlotterModule'
import { CertificatesModule, ISSUE_CERTIFICATE_EVENT } from '../modules/CertificatesModule'
import { HouseholdModule, ADD_HOUSEHOLD_EVENT } from '../modules/HouseholdModule'
import { NotificationsModule } from '../modules/NotificationsModule'
import { OnlineRequestsModule } from '../modules/OnlineRequestsModule'
import { ReportsModule } from '../modules/ReportsModule'
import { ResidentModule, ADD_RESIDENT_EVENT } from '../modules/ResidentModule'
import { UsersModule, ADD_USER_EVENT } from '../modules/UsersModule'
import type { ModuleKey } from '../types/dashboard'
import { canAccessModule, ROLE_MODULE_ACCESS } from '../types/dashboard'

const moduleIcons: Record<ModuleKey, ReactElement> = {
  resident: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8" r="3" />
      <path d="M5 19a7 7 0 0 1 14 0" />
    </svg>
  ),
  household: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="m3 10 9-7 9 7" />
      <path d="M5 9.5V21h14V9.5" />
    </svg>
  ),
  certificates: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 8h8M8 12h8M8 16h5" />
    </svg>
  ),
  blotter: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M8 3h8l3 3v15H5V3h3" />
      <path d="M9 11h6M9 15h6" />
    </svg>
  ),
  users: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="9" cy="8" r="3" />
      <path d="M2.5 19a6.5 6.5 0 0 1 13 0" />
      <path d="M17 8h5M19.5 5.5v5" />
    </svg>
  ),
  reports: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 20h16" />
      <path d="M7 16v-4M12 16V8M17 16v-7" />
    </svg>
  ),
  onlineRequests: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 8h8M8 12h8M8 16h4" />
      <path d="M17 14v4M15 16h4" />
    </svg>
  ),
  notifications: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 6h16v12H4z" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  ),
  appointments: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 10h18" />
    </svg>
  ),
}

const barangayInfo = { name: 'Barangay San Vicente', city: 'Bamban, Tarlac' }

const moduleContentMap: Record<ModuleKey, ReactElement> = {
  resident: <ResidentModule />,
  household: <HouseholdModule />,
  certificates: <CertificatesModule />,
  blotter: <BlotterModule />,
  users: <UsersModule />,
  reports: <ReportsModule />,
  onlineRequests: <OnlineRequestsModule />,
  notifications: <NotificationsModule />,
  appointments: <AppointmentsModule />,
}

const ALL_MODULE_KEYS = Object.keys(moduleContentMap) as ModuleKey[]

export function DashboardPage() {
  const { module: moduleParam } = useParams<{ module: string }>()
  const { currentUser, theme, toggleTheme, logout } = useAuth()
  const navigate = useNavigate()

  const [isModuleLoading, setIsModuleLoading] = useState(false)
  const [isLogoutLoading, setIsLogoutLoading] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  // Resolve active module from URL param, fallback to first allowed
  const activeModule = useMemo<ModuleKey>(() => {
    if (!currentUser) return 'resident'
    const fromParam = ALL_MODULE_KEYS.find((k) => k === moduleParam)
    if (fromParam && canAccessModule(currentUser.role, fromParam)) return fromParam
    return ROLE_MODULE_ACCESS[currentUser.role][0] ?? 'resident'
  }, [moduleParam, currentUser])

  // Redirect to correct module URL if param is invalid/missing
  useEffect(() => {
    if (!currentUser) return
    const fromParam = ALL_MODULE_KEYS.find((k) => k === moduleParam)
    const isValid = fromParam && canAccessModule(currentUser.role, fromParam)
    if (!isValid) {
      const fallback = ROLE_MODULE_ACCESS[currentUser.role][0] ?? 'resident'
      navigate(`/dashboard/${fallback}`, { replace: true })
    }
  }, [moduleParam, currentUser, navigate])

  const allowedModules = useMemo(
    () => (currentUser ? modules.filter((m) => canAccessModule(currentUser.role, m.key)) : []),
    [currentUser],
  )

  const activeModuleInfo = useMemo(
    () => modules.find((m) => m.key === activeModule),
    [activeModule],
  )

  const dateLabel = useMemo(
    () =>
      new Date().toLocaleDateString('en-PH', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    [],
  )

  const handleModuleNavigation = (moduleKey: ModuleKey) => {
    setIsMenuOpen(false)
    if (moduleKey === activeModule) return
    setIsModuleLoading(true)
    window.setTimeout(() => {
      navigate(`/dashboard/${moduleKey}`)
      setIsModuleLoading(false)
    }, 550)
  }

  const handleLogout = () => {
    setIsLogoutLoading(true)
    window.setTimeout(() => {
      logout()
      navigate('/', { replace: true })
    }, 900)
  }

  if (!currentUser) return null

  const initials = currentUser.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="min-h-screen w-full p-2 sm:p-3 lg:p-4">
      <LoadingOverlay isVisible={isLogoutLoading} message="Signing out..." fullscreen />

      {isMenuOpen && (
        <button
          type="button"
          onClick={() => setIsMenuOpen(false)}
          className="fixed inset-0 z-30 bg-slate-950/50 lg:hidden"
          aria-label="Close menu"
        />
      )}

      <div className="relative flex gap-3 lg:gap-4">
        {/* ── Sidebar ── */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-72 transform rounded-r-2xl border border-slate-200 bg-white p-4 pb-16 shadow-sm transition-all dark:border-slate-700 dark:bg-slate-900 lg:static lg:h-auto lg:translate-x-0 lg:rounded-2xl ${
            isSidebarCollapsed ? 'lg:w-[86px]' : 'lg:w-[280px]'
          } ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          {/* Brand */}
          <div className="mb-4 border-b border-slate-200 pb-4 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BrandLogo sizeClassName="h-10 w-10" textClassName="text-sm" />
                {!isSidebarCollapsed && (
                  <div>
                    <h1 className="text-sm font-bold text-slate-900 dark:text-white">{barangayInfo.name}</h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{barangayInfo.city}</p>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 lg:hidden"
                title="Close menu"
                aria-label="Close menu"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Role badge */}
          {!isSidebarCollapsed && (
            <div className="mb-3">
              <span
                className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                  currentUser.role === 'admin'
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
                    : currentUser.role === 'approver'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                      : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                }`}
              >
                {currentUser.roleName}
              </span>
            </div>
          )}

          {/* Module nav */}
          <nav className="grid gap-2">
            {allowedModules.map((module) => (
              <button
                key={module.key}
                onClick={() => handleModuleNavigation(module.key)}
                disabled={isModuleLoading || isLogoutLoading}
                className={`w-full rounded-lg px-3 py-2 text-sm font-medium transition ${
                  activeModule === module.key
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
                }`}
                type="button"
                title={module.label}
              >
                <span className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-2'}`}>
                  {moduleIcons[module.key]}
                  {!isSidebarCollapsed && <span className="whitespace-nowrap">{module.label}</span>}
                </span>
              </button>
            ))}
          </nav>

          {/* Collapse toggle */}
          <button
            type="button"
            onClick={() => setIsSidebarCollapsed((c) => !c)}
            className="absolute bottom-4 left-4 hidden h-9 w-9 items-center justify-center rounded-md bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 lg:inline-flex"
            title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isSidebarCollapsed ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m9 6 6 6-6 6" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m15 6-6 6 6 6" />
              </svg>
            )}
          </button>

          {/* User info */}
          <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-700">
            <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-2'}`}>
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-100">
                {initials}
              </div>
              {!isSidebarCollapsed && (
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{currentUser.name}</p>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">{currentUser.roleName}</p>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* ── Main content ── */}
        <div className="w-full space-y-3 lg:space-y-4">
          {/* Header */}
          <header className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => setIsMenuOpen((c) => !c)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 lg:hidden"
                  title="Open menu"
                  aria-label="Open menu"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 7h16M4 12h16M4 17h16" />
                  </svg>
                </button>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{dateLabel}</p>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {activeModuleInfo?.label ?? activeModule}
                  </h2>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                  title="Notifications"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9">
                    <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V10a6 6 0 1 0-12 0v4.2a2 2 0 0 1-.6 1.4L4 17h5" />
                    <path d="M9.5 19a2.5 2.5 0 0 0 5 0" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                  title="Settings"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.2a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.2a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3h.1a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.2a1.6 1.6 0 0 0 1 1.5h.1a1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8v.1a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.2a1.6 1.6 0 0 0-1.4 1z" />
                  </svg>
                  <span className="hidden sm:inline">Settings</span>
                </button>
                <ThemeToggle theme={theme} onToggle={toggleTheme} />
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLogoutLoading}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 text-sm font-medium text-rose-700 hover:bg-rose-100 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300 dark:hover:bg-rose-900/40"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <path d="m16 17 5-5-5-5" />
                    <path d="M21 12H9" />
                  </svg>
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </header>

          {/* Stat cards */}
          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map((card) => (
              <article
                key={card.label}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900"
              >
                <p className="text-sm text-slate-500 dark:text-slate-400">{card.label}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{card.value}</p>
              </article>
            ))}
          </section>

          {/* Module + sidebar */}
          <section className="grid gap-3 lg:gap-4 2xl:grid-cols-[1fr_340px]">
            <main className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-6">
              {isModuleLoading ? (
                <div className="animate-pulse">
                  <div className="mb-4 h-4 w-1/3 rounded bg-slate-200 dark:bg-slate-700" />
                  <div className="mb-3 h-3 w-2/3 rounded bg-slate-200 dark:bg-slate-700" />
                  <div className="mb-6 h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-700" />
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="h-10 w-full rounded bg-slate-200 dark:bg-slate-700" />
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">{activeModuleInfo?.description}</p>
                  {moduleContentMap[activeModule]}
                </>
              )}
            </main>

            <aside className="space-y-4">
              <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">Quick Actions</h3>
                <div className="grid gap-2">
                  {quickActions.map((action) => {
                    // Determine which module this action relates to for highlighting
                    const actionModuleMap: Record<string, ModuleKey> = {
                      'Add Resident': 'resident',
                      'Create Household': 'household',
                      'Issue Certificate': 'certificates',
                      'Record Blotter': 'blotter',
                      'Add User': 'users',
                      'Approve Online Request': 'onlineRequests',
                    }
                    const isActive = actionModuleMap[action] === activeModule

                    return (
                      <button
                        key={action}
                        type="button"
                        onClick={() => {
                          if (action === 'Add Resident') {
                            if (activeModule !== 'resident') {
                              navigate(`/dashboard/resident`)
                            }
                            window.setTimeout(() => {
                              window.dispatchEvent(new Event(ADD_RESIDENT_EVENT))
                            }, activeModule !== 'resident' ? 600 : 0)
                          } else if (action === 'Create Household') {
                            if (activeModule !== 'household') {
                              navigate(`/dashboard/household`)
                            }
                            window.setTimeout(() => {
                              window.dispatchEvent(new Event(ADD_HOUSEHOLD_EVENT))
                            }, activeModule !== 'household' ? 600 : 0)
                          } else if (action === 'Issue Certificate') {
                            if (activeModule !== 'certificates') {
                              navigate(`/dashboard/certificates`)
                            }
                            window.setTimeout(() => {
                              window.dispatchEvent(new Event(ISSUE_CERTIFICATE_EVENT))
                            }, activeModule !== 'certificates' ? 600 : 0)
                          } else if (action === 'Record Blotter') {
                            if (activeModule !== 'blotter') {
                              navigate(`/dashboard/blotter`)
                            }
                            window.setTimeout(() => {
                              window.dispatchEvent(new Event(FILE_BLOTTER_EVENT))
                            }, activeModule !== 'blotter' ? 600 : 0)
                          } else if (action === 'Add User') {
                            if (activeModule !== 'users') {
                              navigate(`/dashboard/users`)
                            }
                            window.setTimeout(() => {
                              window.dispatchEvent(new Event(ADD_USER_EVENT))
                            }, activeModule !== 'users' ? 600 : 0)
                          }
                        }}
                        className={`rounded-lg px-3 py-2 text-left text-sm transition ${
                          isActive
                            ? 'bg-indigo-100 text-indigo-700 ring-1 ring-indigo-300 dark:bg-indigo-500/20 dark:text-indigo-300 dark:ring-indigo-500/40'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {action}
                      </button>
                    )
                  })}
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">Recent Activity</h3>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  {recentActivity.map((item) => (
                    <li key={item} className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800">
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            </aside>
          </section>
        </div>
      </div>
    </div>
  )
}
