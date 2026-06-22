import { apiClient } from './client'
import { ensureArray } from './normalize'

export const bookDiscountsApi = {
  list: async (params = {}) => {
    const query = new URLSearchParams()
    if (params.skip !== undefined) query.set('skip', String(params.skip))
    if (params.limit !== undefined) query.set('limit', String(params.limit))
    if (params.active_only !== undefined) query.set('active_only', String(params.active_only))
    const suffix = query.toString() ? `?${query.toString()}` : ''
    return ensureArray(await apiClient.get(`/book-discounts/${suffix}`))
  },
  create: (data) => apiClient.post('/book-discounts/', data),
  update: (id, data) => apiClient.patch(`/book-discounts/${id}`, data),
  delete: (id) => apiClient.delete(`/book-discounts/${id}`),
}
