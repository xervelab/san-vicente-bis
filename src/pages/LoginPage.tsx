import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthPage, type AuthMode } from '../components/AuthPage'
import { useAuth } from '../context/AuthContext'

export function LoginPage() {
  const [mode, setMode] = useState<AuthMode>('login')
  const { login } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="relative">
      {/* Back to landing */}
      <button
        type="button"
        onClick={() => navigate('/')}
        className="absolute left-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-600 backdrop-blur-sm transition hover:bg-white dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m15 18-6-6 6-6" />
        </svg>
        Back to Home
      </button>

      <AuthPage
        mode={mode}
        onChangeMode={setMode}
        onAuthenticate={(user) => {
          login(user)
          const dest = user.role === 'resident' ? '/portal' : '/dashboard'
          navigate(dest, { replace: true })
        }}
      />
    </div>
  )
}
