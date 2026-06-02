import { apiClient } from './client'
import { ensureArray } from './normalize'

export const promotionsApi = {
  validate: (code, orderTotal = 0) => apiClient.get(`/promotions/validate?code=${encodeURIComponent(code)}&order_total=${orderTotal}`),
  list: async () => ensureArray(await apiClient.get('/promotions/')),
}

