import { apiClient } from './client'
import { normalizePage } from './normalize'

export function pickPrimaryImage(book) {
  const images = Array.isArray(book?.images) ? book.images : []
  const primary = images.find((x) => x?.is_primary) || images[0]
  return primary?.image_url || book?.image_url || ''
}

export const booksApi = {
  list: async (params = {}) => {
    const query = new URLSearchParams()
    if (params.q) query.set('q', params.q)
    if (params.category_id) query.set('category_id', String(params.category_id))
    if (params.page) query.set('page', String(params.page))
    if (params.size) query.set('size', String(params.size))
    if (params.min_price) query.set('min_price', String(params.min_price))
    if (params.max_price) query.set('max_price', String(params.max_price))
    if (params.min_rating) query.set('min_rating', String(params.min_rating))
    if (params.publisher) query.set('publisher', params.publisher)
    const suffix = query.toString() ? `?${query.toString()}` : ''
    const res = await apiClient.get(`/books/${suffix}`)
    const page = normalizePage(res)
    return {
      data: page.items,
      page,
      raw: res,
    }
  },
  topSelling: (limit = 10) => apiClient.get(`/books/top-selling?limit=${limit}`),
  topDiscounted: (limit = 10) => apiClient.get(`/books/top-discounted?limit=${limit}`),
  detail: (id) => apiClient.get(`/books/${id}`),
  similar: (id) => apiClient.get(`/books/${id}/similar`),
  recordView: (id) => apiClient.post(`/books/${id}/view`),
  create: (payload) => apiClient.post('/books/', payload),
  update: (id, payload) => apiClient.patch(`/books/${id}`, payload),
  remove: (id) => apiClient.delete(`/books/${id}`),
  restore: (id) => apiClient.post(`/books/${id}/restore`),
  updateDetail: (detailId, payload) => apiClient.patch(`/book-details/${detailId}`, payload),
  adminList: async (params = {}) => {
    const query = new URLSearchParams()
    if (params.q) query.set('q', params.q)
    if (params.category_id) query.set('category_id', String(params.category_id))
    if (params.page) query.set('page', String(params.page))
    if (params.size) query.set('size', String(params.size))
    if (params.status) query.set('status', params.status)
    if (params.include_deleted !== undefined) query.set('include_deleted', String(params.include_deleted))
    if (params.sort) query.set('sort', params.sort)
    if (params.order) query.set('order', params.order)
    const suffix = query.toString() ? `?${query.toString()}` : ''
    const res = await apiClient.get(`/books/admin/all${suffix}`)
    const page = normalizePage(res)
    return {
      data: page.items,
      page,
      raw: res,
    }
  },
  adminLowStock: async (threshold = 5, limit = 50) => {
    return apiClient.get(`/books/admin/low-stock?threshold=${threshold}&limit=${limit}`)
  },
  categories: {
    update: (bookId, payload) => apiClient.put(`/books/${bookId}/categories`, payload),
  },
  images: {
    list: async (bookId) => {
      const res = await apiClient.get(`/books/${bookId}/images`)
      return Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : [])
    },
    create: (bookId, payload) => apiClient.post(`/books/${bookId}/images`, payload),
    update: (bookId, imageId, payload) => apiClient.patch(`/books/${bookId}/images/${imageId}`, payload),
    remove: (bookId, imageId) => apiClient.delete(`/books/${bookId}/images/${imageId}`),
  },
}
