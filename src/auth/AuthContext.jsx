import { useMemo, useState } from 'react'
import { authApi } from '../api/auth'
import { AuthContext } from './auth-store'

const TOKEN_KEY = 'access_token'
const USER_KEY = 'auth_user'

function readStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '')
  const [user, setUser] = useState(() => readStoredUser())
  const [isReady] = useState(true)
  const isAuthenticated = Boolean(token)

  async function login(username, password) {
    const res = await authApi.login(username, password)
    const nextToken = res?.access_token || ''
    const nextUser = res?.user || null
    if (!nextToken) throw new Error('Missing access token')
    localStorage.setItem(TOKEN_KEY, nextToken)
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser))
    setToken(nextToken)
    setUser(nextUser)
    return res
  }

  function replaceUser(nextUser) {
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser))
    setUser(nextUser)
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setToken('')
    setUser(null)
  }

  const value = useMemo(
    () => ({ token, user, isAuthenticated, isReady, login, logout, replaceUser }),
    [token, user, isAuthenticated, isReady],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
