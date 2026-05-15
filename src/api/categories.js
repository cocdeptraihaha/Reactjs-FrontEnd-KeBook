import { apiClient } from './client'

export const categoriesApi = {
  listRoots: () => apiClient.get('/categories/roots'),
  list: () => apiClient.get('/categories'),
}
