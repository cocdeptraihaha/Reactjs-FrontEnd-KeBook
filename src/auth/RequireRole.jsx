import { Navigate } from 'react-router-dom'
import { useAuth } from './auth-store'

export function RequireRole({ role, children }) {
  const { user } = useAuth()
  if (!user || user.role !== role) {
    return <Navigate to="/app/home" replace />
  }
  return children
}

