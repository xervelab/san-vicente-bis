import { useEffect, useMemo, useState, type ReactElement } from 'react'
import { AuthPage, type AuthMode } from './components/AuthPage'
import { BrandLogo } from './components/BrandLogo'
import { ThemeToggle } from './components/ThemeToggle'
import {
  modules,
  quickActions,
  recentActivity,
  statCards,
} from './data/dashboardData'
import { AppointmentsModule } from './modules/AppointmentsModule'
import { BlotterModule } from './modules/BlotterModule'
import { CertificatesModule } from './modules/CertificatesModule'
import { HouseholdModule } from './modules/HouseholdModule'
import { NotificationsModule } from './modules/NotificationsModule'
import { OnlineRequestsModule } from './modules/OnlineRequestsModule'
import { ReportsModule } from './modules/ReportsModule'
import { ResidentModule } from './modules/ResidentModule'
import { UsersModule } from './modules/UsersModule'
import type { ModuleKey, Theme } from './types/dashboard'

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

const barangayInfo = {
  name: 'Barangay San Isidro',
  city: 'Quezon City',
}

function App() {
  const [authMode, setAuthMode] = useState<AuthMode>('login')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState({
    name: 'Maria Santos',
    role: 'Barangay Admin',
  })
  const [activeModule, setActiveModule] = useState<ModuleKey>('resident')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('bis-theme')
    return savedTheme === 'dark' ? 'dark' : 'light'
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('bis-theme', theme)
  }, [theme])

  const activeLabel = useMemo(
    () => modules.find((module) => module.key === activeModule)?.label ?? '',
    [activeModule],
  )

  const activeModuleInfo = useMemo(
    () => modules.find((module) => module.key === activeModule),
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

  const moduleContent = useMemo(() => {
    const contentMap: Record<ModuleKey, ReactElement> = {
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

    return contentMap[activeModule]
  }, [activeModule])

  if (!isAuthenticated) {
    return (
      <AuthPage
        mode={authMode}
        onChangeMode={setAuthMode}
        onAuthenticate={(user) => {
          setCurrentUser(user)
          setIsAuthenticated(true)
        }}
      />
    )
  }

  return (
    <div className="min-h-screen w-full p-2 sm:p-3 lg:p-4">
      {isMenuOpen && (
        <button
          type="button"
          onClick={() => setIsMenuOpen(false)}
          className="fixed inset-0 z-30 bg-slate-950/50 lg:hidden"
          aria-label="Close menu"
        />
      )}

      <div className="relative flex gap-3 lg:gap-4">
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-72 transform rounded-r-2xl border border-slate-200 bg-white p-4 pb-16 shadow-sm transition-all dark:border-slate-700 dark:bg-slate-900 lg:static lg:h-auto lg:translate-x-0 lg:rounded-2xl ${
            isSidebarCollapsed ? 'lg:w-[86px]' : 'lg:w-[280px]'
          } ${
            isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="mb-4 border-b border-slate-200 pb-4 dark:border-slate-700">
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-2">
                <BrandLogo sizeClassName="h-10 w-10" textClassName="text-sm" />
                {!isSidebarCollapsed && (
                  <div>
                    <h1 className="text-sm font-bold text-slate-900 dark:text-white">{barangayInfo.name}</h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{barangayInfo.city}</p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
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
          </div>

          <nav className="grid gap-2">
            {modules.map((module) => (
              <button
                key={module.key}
                onClick={() => {
                  setActiveModule(module.key)
                  setIsMenuOpen(false)
                }}
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

          <button
            type="button"
            onClick={() => setIsSidebarCollapsed((current) => !current)}
            className="absolute bottom-4 left-4 hidden h-9 w-9 items-center justify-center rounded-md bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 lg:inline-flex"
            title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
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

          <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-700">
            <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-2'}`}>
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-100">
                {currentUser.name
                  .split(' ')
                  .map((name) => name[0])
                  .join('')
                  .slice(0, 2)}
              </div>
              {!isSidebarCollapsed && (
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{currentUser.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{currentUser.role}</p>
                </div>
              )}
            </div>
          </div>
        </aside>

        <div className="w-full space-y-3 lg:space-y-4">
          <header className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => setIsMenuOpen((current) => !current)}
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
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{activeLabel}</h2>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                  title="Notifications"
                  aria-label="Notifications"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9">
                    <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V10a6 6 0 1 0-12 0v4.2a2 2 0 0 1-.6 1.4L4 17h5" />
                    <path d="M9.5 19a2.5 2.5 0 0 0 5 0" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                  title="Settings"
                  aria-label="Settings"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.2a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.2a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3h.1a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.2a1.6 1.6 0 0 0 1 1.5h.1a1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8v.1a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.2a1.6 1.6 0 0 0-1.4 1z" />
                  </svg>
                  <span className="hidden sm:inline">Settings</span>
                </button>
                <ThemeToggle
                  theme={theme}
                  onToggle={() => setTheme((current) => (current === 'light' ? 'dark' : 'light'))}
                />
                <button
                  type="button"
                  onClick={() => {
                    setIsAuthenticated(false)
                    setAuthMode('login')
                  }}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 text-sm font-medium text-rose-700 transition hover:bg-rose-100 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300 dark:hover:bg-rose-900/40"
                  title="Logout"
                  aria-label="Logout"
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

          <section className="grid gap-3 lg:gap-4 2xl:grid-cols-[1fr_340px]">
            <main className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-6">
              <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">{activeModuleInfo?.description}</p>
              {moduleContent}
            </main>

            <aside className="space-y-4">
              <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">Quick Actions</h3>
                <div className="grid gap-2">
                  {quickActions.map((action) => (
                    <button
                      key={action}
                      type="button"
                      className="rounded-lg bg-slate-100 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                    >
                      {action}
                    </button>
                  ))}
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

export default App
