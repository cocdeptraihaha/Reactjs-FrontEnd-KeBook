import { apiClient } from './client'
import { ensureArray } from './normalize'

export const pointsApi = {
  rewards: async () => ensureArray(await apiClient.get('/points/rewards')),
  redeem: (rewardId) => apiClient.post(`/points/rewards/${rewardId}/redeem`),
}

