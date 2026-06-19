import { apiClient } from './client'
import { ensureArray } from './normalize'

export const reviewsApi = {
  listByBook: async (bookId) => ensureArray(await apiClient.get(`/reviews/book/${bookId}`)),
  averageByBook: (bookId) => apiClient.get(`/reviews/book/${bookId}/avg`),
  create: (payload) => apiClient.post('/reviews/', payload),
  getMyReviewByBook: async (bookId) => {
    try {
      return await apiClient.get(`/reviews/me/by-book/${bookId}`)
    } catch (e) {
      if (e.status === 404) return null
      throw e
    }
  },
  update: (reviewId, payload) => apiClient.patch(`/reviews/${reviewId}`, payload),
}
