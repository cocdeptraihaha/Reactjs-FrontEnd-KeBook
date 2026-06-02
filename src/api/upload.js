import { API_BASE_URL } from '../config/env'

function getAuthToken(explicitToken) {
  if (explicitToken) return explicitToken
  return localStorage.getItem('access_token') || ''
}

async function parseResponse(response) {
  const raw = await response.text()
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return raw
  }
}

async function uploadMultipart(path, file, token) {
  if (!file) throw new Error('File missing')

  const authToken = getAuthToken(token)
  const form = new FormData()
  form.append('file', file)

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
    body: form,
  })

  const payload = await parseResponse(response)

  if (!response.ok) {
    const message = payload?.detail || payload?.message || `HTTP ${response.status}`
    throw new Error(message)
  }

  return payload
}

export const uploadApi = {
  avatar: (file, token) => uploadMultipart('/upload/avatar', file, token),
  bookDetailImage: (bookDetailId, file, token) => uploadMultipart(`/upload/book-detail/${bookDetailId}/image`, file, token),
}
