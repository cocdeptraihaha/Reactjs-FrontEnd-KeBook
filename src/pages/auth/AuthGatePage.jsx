import { Navigate } from 'react-router-dom'
import { useAuth } from '../../auth/auth-store'

export function AuthGatePage() {
  const { isAuthenticated, isReady } = useAuth()
  if (!isReady) return null
  return <Navigate to="/app/home" replace />
}
