import { apiClient } from './client'
import { ensureArray } from './normalize'

export const supportRequestsApi = {
  create: (payload) => apiClient.post('/support-requests/', payload),
  adminList: async (params = {}) => {
    const query = new URLSearchParams()
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') query.set(key, value)
    }
    const suffix = query.toString() ? `?${query.toString()}` : ''
    return ensureArray(await apiClient.get(`/support-requests/${suffix}`))
  },
  adminUpdate: (requestId, payload) => apiClient.patch(`/support-requests/${requestId}`, payload),
  adminStatus: (requestId, payload) => apiClient.patch(`/support-requests/${requestId}/status`, payload),
}
