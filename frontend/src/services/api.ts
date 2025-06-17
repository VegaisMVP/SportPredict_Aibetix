import axios from 'axios'

export const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API endpoints
export const endpoints = {
  // Auth
  login: '/auth/login',
  register: '/auth/register',
  me: '/auth/me',
  
  // Matches
  matches: '/matches',
  match: (id: string) => `/matches/${id}`,
  matchPrediction: (id: string) => `/matches/${id}/prediction`,
  
  // Strategies
  strategies: '/strategies',
  strategy: (id: string) => `/strategies/${id}`,
  executeStrategy: (id: string) => `/strategies/${id}/execute`,
  
  // ETF
  etfBalance: '/etf/balance',
  etfDeposit: '/etf/deposit',
  etfWithdraw: '/etf/withdraw',
  etfHistory: '/etf/history',
  
  // AI Chat
  chat: '/ai/chat',
  
  // User
  userProfile: '/user/profile',
  userStats: '/user/stats',
} 