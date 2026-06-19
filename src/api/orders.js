import { apiClient } from './client'
import { ensureArray } from './normalize'

function buildOrderListPath({ status, statusIn } = {}) {
  const query = new URLSearchParams()
  if (statusIn) query.set('status_in', statusIn)
  if (status) query.set('status', status)
  const q = query.toString()
  return q ? `/orders/?${q}` : '/orders/'
}

export const ordersApi = {
  list: async ({ status, statusIn } = {}) => ensureArray(await apiClient.get(buildOrderListPath({ status, statusIn }))),
  detail: (orderId) => apiClient.get(`/orders/${orderId}`),
  checkout: (payload) => apiClient.post('/orders/checkout', payload),
  cancel: (orderId, payload) => apiClient.post(`/orders/${orderId}/cancel`, payload),
  confirmReceived: (orderId) => apiClient.post(`/orders/${orderId}/confirm-received`),
  adminList: async (params) => ensureArray(await apiClient.get('/orders/admin/all', { params })),
  adminUpdateStatus: (orderId, payload) => apiClient.patch(`/orders/admin/${orderId}/status`, payload),
  adminResolveCancel: (orderId, payload) => apiClient.post(`/orders/admin/${orderId}/cancel-decision`, payload),
}
