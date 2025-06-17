import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  username: string
  email: string
  role: string
  balance: number
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check local storage for authentication status
    const token = localStorage.getItem('authToken')
    if (token) {
      // Validate token validity
      validateToken(token)
    } else {
      setIsLoading(false)
    }
  }, [])

  const validateToken = async (token: string) => {
    try {
      // This should call backend API to validate token
      // const response = await api.get('/auth/validate', { headers: { Authorization: `Bearer ${token}` } })
      // setUser(response.data.user)
      
      // Simulate successful validation
      setUser({
        id: '1',
        username: 'etf_user',
        email: 'user@etf.com',
        role: 'investor',
        balance: 10000
      })
    } catch (error) {
      localStorage.removeItem('authToken')
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      // This should call backend API for login
      // const response = await api.post('/auth/login', { email, password })
      // const { token, user } = response.data
      
      // Simulate successful login
      const mockUser = {
        id: '1',
        username: 'etf_user',
        email: email,
        role: 'investor',
        balance: 10000
      }
      
      localStorage.setItem('authToken', 'mock_token')
      setUser(mockUser)
    } catch (error) {
      throw new Error('Login failed')
    }
  }

  const logout = () => {
    localStorage.removeItem('authToken')
    setUser(null)
  }

  const value = {
    user,
    login,
    logout,
    isLoading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 