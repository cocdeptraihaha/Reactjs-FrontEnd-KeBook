import { Navigate } from 'react-router-dom'
import { useAuth } from './auth-store'

export function RequireRole({ role, children }) {
  const { user } = useAuth()
  const isAdmin = user?.is_superuser === true || user?.role === 'ADMIN'
  const targetRole = role === 'ADMIN' ? isAdmin : user?.role === role

  if (!user || !targetRole) {
    return <Navigate to="/app/home" replace />
  }
  return children
}

