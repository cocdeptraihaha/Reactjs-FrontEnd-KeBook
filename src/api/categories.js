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
  create: async (payload) => {
    const res = await apiClient.post('/categories/', payload)
    return res?.data ?? res
  },
  update: async (id, payload) => {
    const res = await apiClient.patch(`/categories/${id}`, payload)
    return res?.data ?? res
  },
  remove: async (id) => {
    const res = await apiClient.delete(`/categories/${id}`)
    return res?.data ?? res
  }
}
