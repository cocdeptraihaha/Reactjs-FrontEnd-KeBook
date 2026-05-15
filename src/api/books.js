import { apiClient } from './client'

const pickBookList = (payload) => payload?.items || payload?.list || payload?.results || payload?.data || []

export const booksApi = {
  list: async (...args) => {
    const res = await apiClient.get('/books', ...args)
    const payload = res?.data ?? res
    return {
      ...res,
      data: pickBookList(payload),
      page: payload,
    }
  },
  detail: (id) => apiClient.get(`/books/${id}`),
  similar: (id) => apiClient.get(`/books/${id}/similar`),
}
