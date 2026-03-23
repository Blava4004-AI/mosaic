import { createContext, useState, useEffect, useCallback } from 'react'

export const AuthContext = createContext(null)

function decodeToken(token) {
  try {
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload))
  } catch {
    return null
  }
}

function isTokenExpired(token) {
  const payload = decodeToken(token)
  if (!payload || !payload.exp) return true
  return Date.now() >= payload.exp * 1000
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    const stored = localStorage.getItem('mosaic_token')
    if (stored && !isTokenExpired(stored)) return stored
    if (stored) localStorage.removeItem('mosaic_token')
    return null
  })
  const [user, setUser] = useState(() => {
    if (token) return decodeToken(token)
    return null
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!token) return
    // Check token expiry periodically
    const interval = setInterval(() => {
      if (isTokenExpired(token)) {
        setToken(null)
        setUser(null)
        localStorage.removeItem('mosaic_token')
      }
    }, 60000) // check every minute
    return () => clearInterval(interval)
  }, [token])

  const login = useCallback(async (email, password, authServiceUrl) => {
    const res = await fetch(`${authServiceUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.error || data.message || `Login failed (${res.status})`)
    }

    const data = await res.json()
    const jwt = data.token
    if (!jwt) throw new Error('No token received')

    localStorage.setItem('mosaic_token', jwt)
    setToken(jwt)
    setUser(decodeToken(jwt))
    return data
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('mosaic_token')
    setToken(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
