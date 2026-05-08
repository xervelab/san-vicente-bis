import { useState, type FormEvent } from 'react'
import { BrandLogo } from './BrandLogo'
import { LoadingOverlay } from './LoadingOverlay'
import type { CurrentUser, UserRole } from '../types/dashboard'
import { authService } from '../services/authService'

export type AuthMode = 'login' | 'signup' | 'forgot' | 'reset'

type AuthPageProps = {
  mode: AuthMode
  onChangeMode: (mode: AuthMode) => void
  onAuthenticate: (user: CurrentUser) => void
}

// Demo credentials — each email maps to a specific role
const DEMO_ACCOUNTS: Record<string, { name: string; role: UserRole; roleName: string }> = {
  'admin@bisv.ph': { name: 'Ricardo Dela Cruz', role: 'admin', roleName: 'Administrator' },
  'staff@bisv.ph': { name: 'Maria Santos', role: 'staff', roleName: 'Barangay Staff' },
  'captain@bisv.ph': { name: 'Eduardo Reyes', role: 'approver', roleName: 'Barangay Captain' },
  'resident@bisv.ph': { name: 'Ana Bautista', role: 'resident', roleName: 'Resident' },
}

const demoBadgeColors: Record<UserRole, string> = {
  admin: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  staff: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  approver: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  resident: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
}

export function AuthPage({ mode, onChangeMode, onAuthenticate }: AuthPageProps) {
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [signupName, setSignupName] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [forgotEmail, setForgotEmail] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [resetEmail, setResetEmail] = useState('')
  const [resetPassword, setResetPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingMessage, setProcessingMessage] = useState('Processing request...')

  const startProcessing = (label: string) => {
    setMessage('')
    setProcessingMessage(label)
    setIsProcessing(true)
  }

  const endProcessing = () => {
    setIsProcessing(false)
  }

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!loginEmail || !loginPassword) {
      setMessage('Please enter your email and password.')
      return
    }

    startProcessing('Signing in...')
    try {
      const user = await authService.login({ email: loginEmail.trim(), password: loginPassword })
      onAuthenticate(user)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to sign in. Please try again.')
    } finally {
      endProcessing()
    }
  }

  const handleSignUp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!signupName || !signupEmail || !signupPassword) {
      setMessage('Please complete all sign up fields.')
      return
    }

    startProcessing('Creating account...')
    try {
      const user = await authService.register({
        name: signupName.trim(),
        email: signupEmail.trim(),
        password: signupPassword,
      })
      onAuthenticate(user)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to create your account. Please try again.')
    } finally {
      endProcessing()
    }
  }

  const handleForgotPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!forgotEmail) {
      setMessage('Please enter your email to reset your password.')
      return
    }

    startProcessing('Sending reset link...')
    try {
      const response = await authService.forgotPassword(forgotEmail.trim())
      setMessage(response.message ?? `Password reset link sent to ${forgotEmail.trim()}.`)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to send reset instructions. Please try again.')
    } finally {
      endProcessing()
    }
  }

  const handleResetPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!resetToken || !resetEmail || !resetPassword) {
      setMessage('Please complete all reset password fields.')
      return
    }

    startProcessing('Resetting password...')
    try {
      const response = await authService.resetPassword({
        token: resetToken.trim(),
        email: resetEmail.trim(),
        password: resetPassword,
      })
      setMessage(response.message ?? 'Your password has been reset successfully.')
      onChangeMode('login')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to reset your password. Please try again.')
    } finally {
      endProcessing()
    }
  }

  const handleGoogleSignIn = () => {
    // runProcessing('Signing in with Google...', () => {
    //   onAuthenticate({
    //     name: 'Google User',
    //     email: 'google@bisv.ph',
    //     role: 'resident',
    //     roleName: 'Resident',
    //   })
    // })
  }

  const fillDemo = (email: string) => {
    setLoginEmail(email)
    setMessage('')
    onChangeMode('login')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-slate-950">
      <div className="w-full max-w-md space-y-4">
        {/* Demo credentials panel */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Demo Accounts — click to fill
          </p>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(DEMO_ACCOUNTS).map(([email, info]) => (
              <button
                key={email}
                type="button"
                onClick={() => fillDemo(email)}
                className="flex flex-col items-start gap-0.5 rounded-xl border border-slate-100 px-3 py-2.5 text-left transition hover:border-slate-300 hover:shadow-sm dark:border-slate-800 dark:hover:border-slate-600"
              >
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${demoBadgeColors[info.role]}`}>
                  {info.roleName}
                </span>
                <span className="mt-1 w-full truncate text-xs font-medium text-slate-800 dark:text-slate-100">
                  {info.name}
                </span>
                <span className="w-full truncate text-[10px] text-slate-400 dark:text-slate-500">{email}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Auth card */}
        <div className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <LoadingOverlay isVisible={isProcessing} message={processingMessage} />

          <div className="mb-6 text-center">
            <div className="mx-auto mb-3">
              <BrandLogo sizeClassName="h-12 w-12" textClassName="text-sm" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Barangay Information System</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Secure access portal</p>
          </div>

          {mode === 'login' && (
            <form className="space-y-3" onSubmit={handleLogin}>
              <input
                type="email"
                value={loginEmail}
                onChange={(event) => setLoginEmail(event.target.value)}
                disabled={isProcessing}
                placeholder="Email"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
              <input
                type="password"
                value={loginPassword}
                onChange={(event) => setLoginPassword(event.target.value)}
                disabled={isProcessing}
                placeholder="Password (any value for demo)"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
              >
                Login
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => onChangeMode('forgot')}
                className="w-full text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              >
                Forgot password?
              </button>
            </form>
          )}

          {mode === 'signup' && (
            <form className="space-y-3" onSubmit={handleSignUp}>
              <input
                type="text"
                value={signupName}
                onChange={(event) => setSignupName(event.target.value)}
                disabled={isProcessing}
                placeholder="Full Name"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
              <input
                type="email"
                value={signupEmail}
                onChange={(event) => setSignupEmail(event.target.value)}
                disabled={isProcessing}
                placeholder="Email"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
              <input
                type="password"
                value={signupPassword}
                onChange={(event) => setSignupPassword(event.target.value)}
                disabled={isProcessing}
                placeholder="Password"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                New sign-ups are registered as{' '}
                <span className="font-medium text-amber-600 dark:text-amber-400">Residents</span>. Contact the
                barangay for staff or approver access.
              </p>
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
              >
                Create Account
              </button>
            </form>
          )}

          {mode === 'forgot' && (
            <form className="space-y-3" onSubmit={handleForgotPassword}>
              <input
                type="email"
                value={forgotEmail}
                onChange={(event) => setForgotEmail(event.target.value)}
                disabled={isProcessing}
                placeholder="Enter your account email"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
              >
                Send Reset Link
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => onChangeMode('reset')}
                className="w-full text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              >
                I have a reset token
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => onChangeMode('login')}
                className="w-full text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              >
                Back to login
              </button>
            </form>
          )}

          {mode === 'reset' && (
            <form className="space-y-3" onSubmit={handleResetPassword}>
              <input
                type="text"
                value={resetToken}
                onChange={(event) => setResetToken(event.target.value)}
                disabled={isProcessing}
                placeholder="Reset token"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
              <input
                type="email"
                value={resetEmail}
                onChange={(event) => setResetEmail(event.target.value)}
                disabled={isProcessing}
                placeholder="Account email"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
              <input
                type="password"
                value={resetPassword}
                onChange={(event) => setResetPassword(event.target.value)}
                disabled={isProcessing}
                placeholder="New password"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
              >
                Reset Password
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => onChangeMode('login')}
                className="w-full text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              >
                Back to login
              </button>
            </form>
          )}

          <div className="my-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
            <span className="text-xs text-slate-500 dark:text-slate-400">OR</span>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isProcessing}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
              <path
                fill="#EA4335"
                d="M12 10.2v3.9h5.4c-.2 1.3-1.5 3.9-5.4 3.9-3.2 0-5.9-2.7-5.9-6s2.7-6 5.9-6c1.8 0 3 0.8 3.7 1.4l2.5-2.4C16.6 3.4 14.5 2.5 12 2.5A9.5 9.5 0 0 0 2.5 12c0 5.2 4.3 9.5 9.5 9.5 5.5 0 9.1-3.9 9.1-9.3 0-.6-.1-1.1-.2-1.5H12Z"
              />
            </svg>
            Continue with Google
          </button>

          {message && <p className="mt-4 text-center text-sm text-amber-600 dark:text-amber-300">{message}</p>}

          <div className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
            {mode !== 'signup' ? (
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => onChangeMode('signup')}
                className="font-medium text-slate-900 hover:underline dark:text-slate-100"
              >
                Create an account
              </button>
            ) : (
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => onChangeMode('login')}
                className="font-medium text-slate-900 hover:underline dark:text-slate-100"
              >
                Already have an account? Login
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

