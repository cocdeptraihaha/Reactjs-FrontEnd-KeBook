import { apiClient } from './client'
import { ensureArray } from './normalize'

export const addressesApi = {
  provinces: async () => ensureArray(await apiClient.get('/addresses/provinces')),
  wards: async (provinceId) => ensureArray(await apiClient.get(`/addresses/wards?province_id=${provinceId}`)),
  mine: async () => ensureArray(await apiClient.get('/addresses/me')),
  create: (payload) => apiClient.post('/addresses/me', payload),
  update: (addressId, payload) => apiClient.patch(`/addresses/me/${addressId}`, payload),
  setDefault: (addressId) => apiClient.patch(`/addresses/me/${addressId}/default`, {}),
  remove: (addressId) => apiClient.delete(`/addresses/me/${addressId}`),
}
