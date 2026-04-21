import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { CurrentUser, Theme } from '../types/dashboard'
import { ROLE_MODULE_ACCESS } from '../types/dashboard'
import type { ModuleKey } from '../types/dashboard'

type AuthContextValue = {
  currentUser: CurrentUser | null
  isAuthenticated: boolean
  theme: Theme
  activeModule: ModuleKey
  login: (user: CurrentUser) => void
  logout: () => void
  toggleTheme: () => void
  setActiveModule: (module: ModuleKey) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const STORAGE_KEY = 'bis-user'

function loadStoredUser(): CurrentUser | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as CurrentUser) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(loadStoredUser)
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('bis-theme')
    const resolved: Theme = saved === 'dark' ? 'dark' : 'light'
    // Apply immediately so there's no flash before the first useEffect
    document.documentElement.classList.toggle('dark', resolved === 'dark')
    return resolved
  })
  const [activeModule, setActiveModule] = useState<ModuleKey>(() => {
    const user = loadStoredUser()
    return user ? (ROLE_MODULE_ACCESS[user.role][0] ?? 'resident') : 'resident'
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('bis-theme', theme)
  }, [theme])

  const login = (user: CurrentUser) => {
    setCurrentUser(user)
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    const firstModule = ROLE_MODULE_ACCESS[user.role][0] ?? 'resident'
    setActiveModule(firstModule)
  }

  const logout = () => {
    setCurrentUser(null)
    sessionStorage.removeItem(STORAGE_KEY)
  }

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'))

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: currentUser !== null,
        theme,
        activeModule,
        login,
        logout,
        toggleTheme,
        setActiveModule,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
