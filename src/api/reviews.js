import { apiClient } from './client'

export const reviewsApi = {
  listByBook: (bookId) => apiClient.get(`/reviews/book/${bookId}`),
  averageByBook: (bookId) => apiClient.get(`/reviews/book/${bookId}/avg`),
}
