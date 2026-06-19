import { apiClient } from './client'
import { ensureArray } from './normalize'

export const usersApi = {
  me: () => apiClient.get('/users/me'),
  update: (userId, payload) => apiClient.patch(`/users/${userId}`, payload),
  myPoints: () => apiClient.get('/users/me/points'),
  pointTransactions: async () => ensureArray(await apiClient.get('/users/me/point-transactions')),
  myPromotions: async () => ensureArray(await apiClient.get('/users/me/promotions')),

  // Admin APIs
  listAll: async (params = {}) => {
    const query = new URLSearchParams()
    if (params.skip !== undefined) query.set('skip', String(params.skip))
    if (params.limit !== undefined) query.set('limit', String(params.limit))
    if (params.q) query.set('q', params.q)
    if (params.is_active !== undefined) query.set('is_active', String(params.is_active))
    if (params.is_superuser !== undefined) query.set('is_superuser', String(params.is_superuser))
    const suffix = query.toString() ? `?${query.toString()}` : ''
    return ensureArray(await apiClient.get(`/users/admin/all${suffix}`))
  },
  updateStatus: (userId, isActive) => apiClient.patch(`/users/admin/${userId}/status`, { is_active: isActive }),
  updateRole: (userId, isSuperuser) => apiClient.patch(`/users/admin/${userId}/role`, { is_superuser: isSuperuser }),
  adjustPoints: (userId, delta, reason) => apiClient.post(`/users/admin/${userId}/points/adjust`, { delta, reason }),
}

