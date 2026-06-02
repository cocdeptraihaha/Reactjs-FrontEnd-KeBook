import { apiClient } from './client'
import { ensureArray } from './normalize'

export const usersApi = {
  me: () => apiClient.get('/users/me'),
  update: (userId, payload) => apiClient.patch(`/users/${userId}`, payload),
  myPoints: () => apiClient.get('/users/me/points'),
  pointTransactions: async () => ensureArray(await apiClient.get('/users/me/point-transactions')),
  myPromotions: async () => ensureArray(await apiClient.get('/users/me/promotions')),
}

