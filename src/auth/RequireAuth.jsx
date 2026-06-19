import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './auth-store'

// Helper to decode JWT and check expiration
function isTokenExpired(token) {
  if (!token) return true
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return true
    const payload = JSON.parse(atob(parts[1]))
    if (!payload.exp) return false
    const now = Math.floor(Date.now() / 1000)
    return payload.exp < now
  } catch {
    return true
  }
}

export function RequireAuth({ children }) {
  const { isAuthenticated, logout } = useAuth()
  const location = useLocation()

  const token = localStorage.getItem('access_token')
  const expired = isTokenExpired(token)

  if (expired && isAuthenticated) {
    // Clear state if token expired but context thinks we are authenticated
    logout()
  }

  if (!isAuthenticated || expired) {
    return <Navigate to="/auth/login" replace state={{ from: location.pathname }} />
  }

  return children
}
