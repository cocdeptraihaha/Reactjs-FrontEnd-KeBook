import { apiClient } from './client'
import { ensureArray } from './normalize'

export const reviewsApi = {
  listByBook: async (bookId) => ensureArray(await apiClient.get(`/reviews/book/${bookId}`)),
  averageByBook: (bookId) => apiClient.get(`/reviews/book/${bookId}/avg`),
  create: (payload) => apiClient.post('/reviews/', payload),
}
