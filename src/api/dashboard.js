import { apiClient } from './client'
import { API_BASE_URL } from '../config/env'

export const dashboardApi = {
  getSummary: (params) => apiClient.get('/admin/dashboard/summary', { params }),
  getTopBooks: (params) => apiClient.get('/admin/dashboard/top-books', { params }),
  getByCategory: (params) => apiClient.get('/admin/dashboard/by-category', { params }),
  getUserTimeseries: (params) => apiClient.get('/admin/dashboard/user-timeseries', { params }),
  getRevenueTimeseries: (params) => apiClient.get('/admin/dashboard/revenue-timeseries', { params }),
  getTopCustomers: (params) => apiClient.get('/admin/dashboard/top-customers', { params }),
  getOrderStatusBreakdown: (params) => apiClient.get('/admin/dashboard/order-status-breakdown', { params }),
  getCancellationTimeseries: (params) => apiClient.get('/admin/dashboard/cancellation-timeseries', { params }),
  getRevenueCsvUrl: (params) => {
    const query = new URLSearchParams()
    if (params?.from) query.append('from', params.from)
    if (params?.to) query.append('to', params.to)
    if (params?.group_by) query.append('group_by', params.group_by)
    return `${API_BASE_URL}/admin/dashboard/revenue.csv?${query.toString()}`
  }
}
