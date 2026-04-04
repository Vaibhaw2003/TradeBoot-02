import api from './api'

export const userService = {
  getPortfolio: () => api.get('/user/portfolio'),
  addToPortfolio: (data) => api.post('/user/portfolio', data),
  removeFromPortfolio: (id) => api.delete(`/user/portfolio/${id}`),
  updatePortfolioEntry: (id, data) => api.put(`/user/portfolio/${id}`, data),
  getUsage: () => api.get('/user/usage'),
  getNotifications: () => api.get('/user/notifications'),
  markNotificationsRead: () => api.put('/user/notifications/read'),
}
