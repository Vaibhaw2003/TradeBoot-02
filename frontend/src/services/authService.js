import api from './api'

// Mock User Data for Demo Fallback
const MOCK_USER = {
  id: 'demouser123',
  name: 'Demo Trader',
  email: 'test@example.com',
  role: 'user',
  createdAt: new Date().toISOString()
}

export const authService = {
  login: async (credentials) => {
    try {
      return await api.post('/auth/login', credentials)
    } catch (err) {
      console.warn('[Mock API Fallback] login fallback')
      return new Promise(resolve => setTimeout(() => resolve({ token: 'mock-jwt-token-123', user: MOCK_USER }), 500))
    }
  },
  register: (data) => api.post('/auth/register', data),
  verifyOtp: (data) => api.post('/auth/verify-otp', data),
  resendOtp: (email) => api.post('/auth/resend-otp', { email }),
  
  getProfile: async () => {
    try {
      return await api.get('/auth/me')
    } catch (err) {
      console.warn('[Mock API Fallback] getProfile fallback')
      // If there's a token, resolve the mock user to keep the session alive
      const token = localStorage.getItem('tb_token')
      if (token) return new Promise(resolve => setTimeout(() => resolve(MOCK_USER), 200))
      throw err;
    }
  },
  
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
}
