import { apiClient } from './client'
import { ensureArray } from './normalize'

function normalizeSummaryRows(payload) {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.items)) return payload.items
  if (Array.isArray(payload?.data)) return payload.data
  return []
}

export const cartApi = {
  get: async () => ensureArray(await apiClient.get('/cart/')),
  summary: async () => normalizeSummaryRows(await apiClient.get('/cart/summary')),
  add: (payload) => apiClient.post('/cart/', payload),
  update: (cartId, payload) => apiClient.patch(`/cart/${cartId}`, payload),
  remove: (cartId) => apiClient.delete(`/cart/${cartId}`),
}
