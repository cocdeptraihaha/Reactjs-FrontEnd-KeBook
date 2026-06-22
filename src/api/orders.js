import { apiClient } from './client'
import { normalizePage } from './normalize'

function buildOrderListPath({ status, statusIn, page, size } = {}) {
  const query = new URLSearchParams()
  if (statusIn) query.set('status_in', statusIn)
  if (status) query.set('status', status)
  if (page) query.set('page', page)
  if (size) query.set('size', size)
  const q = query.toString()
  return q ? `/orders/?${q}` : '/orders/'
}

export const ordersApi = {
  list: async ({ status, statusIn, page, size } = {}) => normalizePage(await apiClient.get(buildOrderListPath({ status, statusIn, page, size }))),
  detail: (orderId) => apiClient.get(`/orders/${orderId}`),
  checkout: (payload) => apiClient.post('/orders/checkout', payload),
  cancel: (orderId, payload) => apiClient.post(`/orders/${orderId}/cancel`, payload),
  confirmReceived: (orderId) => apiClient.post(`/orders/${orderId}/confirm-received`),
  adminList: async (params) => normalizePage(await apiClient.get('/orders/admin/all', { params })),
  adminUpdateStatus: (orderId, payload) => apiClient.patch(`/orders/admin/${orderId}/status`, payload),
  adminResolveCancel: (orderId, payload) => apiClient.post(`/orders/admin/${orderId}/cancel-decision`, payload),
  vnpayCallback: (params) => apiClient.get('/orders/payment/vnpay-callback', { params }),
  getPaymentUrl: (orderId) => apiClient.post(`/orders/${orderId}/payment-url`),
}
