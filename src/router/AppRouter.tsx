import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { PrivateRoute } from './PrivateRoute'
import { PublicOnlyRoute } from './PublicOnlyRoute'
import { LandingPage } from '../components/LandingPage'
import { LoginPage } from '../pages/LoginPage.tsx'
import { DashboardPage } from '../pages/DashboardPage.tsx'
import { ResidentPortalPage } from '../pages/ResidentPortalPage.tsx'

function CatchAll() {
  const { isAuthenticated, currentUser } = useAuth()
  if (!isAuthenticated || !currentUser) return <Navigate to="/" replace />
  return <Navigate to={currentUser.role === 'resident' ? '/portal' : '/dashboard'} replace />
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Public-only routes (redirect away if already logged in) ── */}
        <Route element={<PublicOnlyRoute />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* ── Admin / Staff / Approver dashboard ── */}
        <Route element={<PrivateRoute allowedRoles={['admin', 'staff', 'approver']} />}>
          <Route path="/dashboard" element={<Navigate to="/dashboard/resident" replace />} />
          <Route path="/dashboard/:module" element={<DashboardPage />} />
        </Route>

        {/* ── Resident self-service portal ── */}
        <Route element={<PrivateRoute allowedRoles={['resident']} />}>
          <Route path="/portal" element={<Navigate to="/portal/requests" replace />} />
          <Route path="/portal/:tab" element={<ResidentPortalPage />} />
        </Route>

        {/* ── Fallback ── */}
        <Route path="*" element={<CatchAll />} />
      </Routes>
    </BrowserRouter>
  )
}
