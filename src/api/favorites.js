import { apiClient } from './client'
import { ensureArray } from './normalize'

export const favoritesApi = {
  list: async () => ensureArray(await apiClient.get('/favorites/')),
  add: (bookId) => apiClient.post(`/favorites/${bookId}`),
  remove: (bookId) => apiClient.delete(`/favorites/${bookId}`),
}

