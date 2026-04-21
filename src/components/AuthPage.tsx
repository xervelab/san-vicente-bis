import { useState, type FormEvent } from 'react'
import { BrandLogo } from './BrandLogo'
import { LoadingOverlay } from './LoadingOverlay'

export type AuthMode = 'login' | 'signup' | 'forgot'

type AuthPageProps = {
  mode: AuthMode
  onChangeMode: (mode: AuthMode) => void
  onAuthenticate: (user: { name: string; role: string }) => void
}

export function AuthPage({ mode, onChangeMode, onAuthenticate }: AuthPageProps) {
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [signupName, setSignupName] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [forgotEmail, setForgotEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingMessage, setProcessingMessage] = useState('Processing request...')

  const runProcessing = (label: string, task: () => void) => {
    setMessage('')
    setProcessingMessage(label)
    setIsProcessing(true)

    window.setTimeout(() => {
      task()
      setIsProcessing(false)
    }, 1100)
  }

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!loginEmail || !loginPassword) {
      setMessage('Please enter your email and password.')
      return
    }

    runProcessing('Signing in...', () => {
      onAuthenticate({
        name: loginEmail.split('@')[0] || 'Barangay User',
        role: 'Staff',
      })
    })
  }

  const handleSignUp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!signupName || !signupEmail || !signupPassword) {
      setMessage('Please complete all sign up fields.')
      return
    }

    runProcessing('Creating account...', () => {
      onAuthenticate({
        name: signupName,
        role: 'Staff',
      })
    })
  }

  const handleForgotPassword = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!forgotEmail) {
      setMessage('Please enter your email to reset your password.')
      return
    }

    runProcessing('Sending reset link...', () => {
      setMessage(`Password reset link sent to ${forgotEmail} (demo).`)
    })
  }

  const handleGoogleSignIn = () => {
    runProcessing('Signing in with Google...', () => {
      onAuthenticate({
        name: 'Google User',
        role: 'Staff',
      })
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
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
              placeholder="Password"
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
  )
}
