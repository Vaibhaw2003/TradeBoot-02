import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('tb_token'))
  const [loading, setLoading] = useState(true)

  const loadUser = useCallback(async () => {
    const savedToken = localStorage.getItem('tb_token')
    if (!savedToken) { setLoading(false); return }
    try {
      const data = await authService.getProfile()
      setUser(data)
    } catch {
      localStorage.removeItem('tb_token')
      setToken(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadUser() }, [loadUser])

  const login = async (credentials) => {
    const { token: newToken, user: userData } = await authService.login(credentials)
    localStorage.setItem('tb_token', newToken)
    setToken(newToken)
    setUser(userData)
    return userData
  }

  const register = async (data) => {
    const result = await authService.register(data)
    return result
  }

  const logout = () => {
    localStorage.removeItem('tb_token')
    setToken(null)
    setUser(null)
  }

  const updateUser = (updates) => setUser(prev => ({ ...prev, ...updates }))

  const isAdmin = user?.role === 'admin'
  const isAuthenticated = !!token && !!user

  return (
    <AuthContext.Provider value={{
      user, token, loading, isAdmin, isAuthenticated,
      login, register, logout, updateUser, loadUser
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
