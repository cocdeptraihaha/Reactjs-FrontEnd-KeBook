import { apiClient } from './client'

export const cartApi = {
  get: () => apiClient.get('/cart'),
  summary: () => apiClient.get('/cart/summary'),
  add: (payload) => apiClient.post('/cart', payload),
  update: (cartId, payload) => apiClient.patch(`/cart/${cartId}`, payload),
  remove: (cartId) => apiClient.delete(`/cart/${cartId}`),
}
