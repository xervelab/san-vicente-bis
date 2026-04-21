import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { UserRole } from '../types/dashboard'

/**
 * PrivateRoute — redirects to /login if not authenticated.
 * Optionally restricts to specific roles; mismatched roles are
 * redirected to the correct route for their role.
 */
type PrivateRouteProps = {
  allowedRoles?: UserRole[]
}

export function PrivateRoute({ allowedRoles }: PrivateRouteProps) {
  const { isAuthenticated, currentUser } = useAuth()
  const location = useLocation()

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // Redirect to the correct portal for their role
    const redirect = currentUser.role === 'resident' ? '/portal' : '/dashboard'
    return <Navigate to={redirect} replace />
  }

  return <Outlet />
}
