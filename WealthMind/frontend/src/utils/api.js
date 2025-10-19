import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add token to requests if available
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

// Authentication APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data)
}

// User APIs
export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  getPreferences: () => api.get('/user/preferences'),
  updatePreferences: (data) => api.post('/user/preferences', data)
}

// Market APIs
export const marketAPI = {
  getAllStocks: (params) => api.get('/market', { params }),
  getStockBySymbol: (symbol) => api.get(`/market/${symbol}`),
  searchStocks: (query) => api.get(`/market/search/${query}`)
}

// Portfolio APIs
export const portfolioAPI = {
  getPortfolio: () => api.get('/portfolio'),
  getStats: () => api.get('/portfolio/stats')
}

// Order APIs
export const orderAPI = {
  buy: (data) => api.post('/orders/buy', data),
  sell: (data) => api.post('/orders/sell', data),
  getHistory: (params) => api.get('/orders/history', { params })
}

// Recommendation APIs
export const recommendationAPI = {
  getRecommendations: (userId) => api.get(`/recommendations/${userId}`)
}

export default api
