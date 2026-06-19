import { apiClient } from './client'
import { ensureArray } from './normalize'

export const promotionsApi = {
  validate: (code, orderTotal = 0) => apiClient.get(`/promotions/validate?code=${encodeURIComponent(code)}&order_total=${orderTotal}`),
  listAvailable: async (orderTotal = 0) => ensureArray(await apiClient.get(`/promotions/available?order_total=${orderTotal}`)),
  list: async () => ensureArray(await apiClient.get('/promotions/')),
  create: (data) => apiClient.post('/promotions/', data),
  update: (id, data) => apiClient.patch(`/promotions/${id}`, data),
  delete: (id) => apiClient.delete(`/promotions/${id}`),
  getStats: (id) => apiClient.get(`/promotions/${id}/stats`),
  issuePersonal: (data) => apiClient.post('/promotions/admin/issue', data),
}

