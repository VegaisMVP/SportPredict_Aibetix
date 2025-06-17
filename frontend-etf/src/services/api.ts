import axios from 'axios'

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
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
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ETF related APIs
export const etfApi = {
  // Get ETF list
  getEtfs: () => api.get('/api/etf'),
  
  // Get ETF details
  getEtfDetail: (id: string) => api.get(`/api/etf/${id}`),
  
  // Get ETF historical data
  getEtfHistory: (id: string, period: string) => 
    api.get(`/api/etf/${id}/history`, { params: { period } }),
  
  // Buy ETF
  buyEtf: (etfId: string, amount: number) => 
    api.post(`/api/etf/${etfId}/buy`, { amount }),
  
  // Sell ETF
  sellEtf: (etfId: string, amount: number) => 
    api.post(`/api/etf/${etfId}/sell`, { amount }),
  
  // Get my holdings
  getMyHoldings: () => api.get('/api/etf/holdings'),
  
  // Get transaction history
  getTransactionHistory: () => api.get('/api/etf/transactions'),
}

// User related APIs
export const userApi = {
  // Login
  login: (email: string, password: string) => 
    api.post('/api/auth/login', { email, password }),
  
  // Register
  register: (email: string, password: string, username: string) => 
    api.post('/api/auth/register', { email, password, username }),
  
  // Get user info
  getProfile: () => api.get('/api/auth/me'),
  
  // Update user info
  updateProfile: (data: any) => api.put('/api/users/profile', data),
  
  // Get wallet balance
  getBalance: () => api.get('/api/wallet/balance'),
  
  // Deposit
  deposit: (amount: number) => api.post('/api/wallet/deposit', { amount }),
  
  // Withdraw
  withdraw: (amount: number) => api.post('/api/wallet/withdraw', { amount }),
}

export default api 