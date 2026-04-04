import api from './api'

export const couponService = {
  validate: (code, planId) => api.post('/coupons/validate', { code, planId }),
  list: () => api.get('/admin/coupons'),
  create: (data) => api.post('/admin/coupons', data),
  update: (id, data) => api.put(`/admin/coupons/${id}`, data),
  delete: (id) => api.delete(`/admin/coupons/${id}`),
}
