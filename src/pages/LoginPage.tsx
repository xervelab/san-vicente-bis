import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthPage, type AuthMode } from '../components/AuthPage'
import { useAuth } from '../context/AuthContext'

export function LoginPage() {
  const [mode, setMode] = useState<AuthMode>('login')
  const { login } = useAuth()
  const navigate = useNavigate()

  return (
    <AuthPage
      mode={mode}
      onChangeMode={setMode}
      onAuthenticate={(user) => {
        login(user)
        const dest = user.role === 'resident' ? '/portal' : '/dashboard'
        navigate(dest, { replace: true })
      }}
    />
  )
}
