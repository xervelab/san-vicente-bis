import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * PublicOnlyRoute — if the user is already authenticated,
 * redirect them to the appropriate portal instead of showing
 * the login or landing page again.
 */
export function PublicOnlyRoute() {
  const { isAuthenticated, currentUser } = useAuth()

  if (isAuthenticated && currentUser) {
    const redirect = currentUser.role === 'resident' ? '/portal' : '/dashboard'
    return <Navigate to={redirect} replace />
  }

  return <Outlet />
}
