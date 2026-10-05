import { createContext, useContext, useState, useEffect } from 'react'
import { apiFetch } from '../services/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const data = await apiFetch('/auth/me')
          setUser(data.user)
          setIsAuthenticated(true)
        } catch (error) {
          console.error('Failed to validate token:', error)
          localStorage.removeItem('token')
        }
      }
      setIsLoading(false)
    }

    initAuth()
  }, [])

  const login = async (email, password) => {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    
    localStorage.setItem('token', data.token)
    setUser(data.user)
    setIsAuthenticated(true)
    return data
  }

  const register = async (name, email, password) => {
    const data = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    })
    
    localStorage.setItem('token', data.token)
    setUser(data.user)
    setIsAuthenticated(true)
    return data
  }

  const logout = async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' })
    } catch (e) {
      console.error(e)
    } finally {
      localStorage.removeItem('token')
      setUser(null)
      setIsAuthenticated(false)
    }
  }

  const updateProfile = async (updates) => {
    const data = await apiFetch('/auth/me', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
    setUser(data.user)
    return data
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
