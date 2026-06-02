import { API_BASE_URL } from '../config/env'

const DEFAULT_TIMEOUT_MS = 12000
const MAX_RETRIES = 1

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function safeParseJson(text) {
  if (!text || typeof text !== 'string') return null
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

function normalizeError(error, fallbackMessage = 'Request failed') {
  if (error?.normalized) return error

  return {
    normalized: true,
    status: error?.status || 0,
    code: error?.code || null,
    message: error?.message || fallbackMessage,
    details: error?.details || null,
    retryable: Boolean(error?.retryable),
  }
}

function buildHeaders(customHeaders = {}) {
  const token = localStorage.getItem('access_token')
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    'Content-Type': 'application/json',
    ...customHeaders,
  }
}

function shouldRetry(error) {
  return error?.name === 'AbortError' || error?.status === 0 || error?.retryable === true
}

async function request(path, { method = 'GET', body, headers, timeoutMs = DEFAULT_TIMEOUT_MS, retry = MAX_RETRIES, rawBody = false } = {}) {
  let attempt = 0
  let lastError = null

  while (attempt <= retry) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort('timeout'), timeoutMs)

  try {
      const response = await fetch(`${API_BASE_URL}${path}`, {
        method,
        headers: buildHeaders(headers),
        body: body ? (rawBody ? body : JSON.stringify(body)) : undefined,
        signal: controller.signal,
      })
      clearTimeout(timeout)

      const raw = await response.text()
      const payload = safeParseJson(raw)

      if (!response.ok) {
        const detailMessage = payload?.detail || payload?.message
        throw normalizeError({
          status: response.status,
          code: response.status,
          message: detailMessage || `HTTP ${response.status}`,
          details: payload || raw || null,
          retryable: response.status >= 500,
        })
      }

      return payload
    } catch (error) {
      clearTimeout(timeout)
      const normalized = normalizeError(
        error?.name === 'AbortError'
          ? { status: 0, message: 'Request timeout', retryable: true, code: 'TIMEOUT' }
          : error,
      )

      lastError = normalized
      if (attempt < retry && shouldRetry(normalized)) {
        await wait(200 * (attempt + 1))
        attempt += 1
        continue
      }
      throw lastError
    }
  }

  throw lastError || normalizeError(null)
}

export const apiClient = {
  get: (path, options) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
  put: (path, body, options) => request(path, { ...options, method: 'PUT', body }),
  patch: (path, body, options) => request(path, { ...options, method: 'PATCH', body }),
  delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
}
