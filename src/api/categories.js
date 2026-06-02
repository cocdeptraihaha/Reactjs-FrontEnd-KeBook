import { apiClient } from './client'
import { ensureArray } from './normalize'

export const categoriesApi = {
  listRoots: async () => {
    const res = await apiClient.get('/categories/roots')
    return ensureArray(res?.data ?? res)
  },
  list: async () => {
    const res = await apiClient.get('/categories/')
    return ensureArray(res?.data ?? res)
  },
}
