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
