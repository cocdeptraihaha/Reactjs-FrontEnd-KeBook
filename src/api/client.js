import { API_BASE_URL } from '../config/env'

function normalizeError(error, fallbackMessage = 'Request failed') {
  if (error?.normalized) return error

  return {
    normalized: true,
    status: error?.status || 0,
    message: error?.message || fallbackMessage,
    details: error?.details || null,
  }
}

function buildHeaders(customHeaders = {}) {
  const token = localStorage.getItem('access_token')
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...customHeaders,
  }
}

async function request(path, { method = 'GET', body, headers } = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: buildHeaders(headers),
      body: body ? JSON.stringify(body) : undefined,
    })

    const isJson = response.headers.get('content-type')?.includes('application/json')
    const payload = isJson ? await response.json() : null

    if (!response.ok) {
      throw normalizeError({
        status: response.status,
        message: payload?.message || `HTTP ${response.status}`,
        details: payload,
      })
    }

    return payload
  } catch (error) {
    throw normalizeError(error)
  }
}

export const apiClient = {
  get: (path, options) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
  put: (path, body, options) => request(path, { ...options, method: 'PUT', body }),
  patch: (path, body, options) => request(path, { ...options, method: 'PATCH', body }),
  delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
}
