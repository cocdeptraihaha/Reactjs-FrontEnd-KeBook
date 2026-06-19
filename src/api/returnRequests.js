import { apiClient } from './client'
import { ensureArray } from './normalize'

export const returnRequestsApi = {
  list: async () => ensureArray(await apiClient.get('/return-requests/')),
  create: (payload) => apiClient.post('/return-requests/', payload),
  adminList: async () => ensureArray(await apiClient.get('/return-requests/admin/all')),
  adminProcess: (reqId, payload) => apiClient.patch(`/return-requests/${reqId}/process`, payload),
}

