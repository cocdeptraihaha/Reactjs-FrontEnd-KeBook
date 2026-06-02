import { apiClient } from './client'
import { ensureArray } from './normalize'

const NotificationType = {
  GENERIC: 'GENERIC',
  ORDER_NEW: 'ORDER_NEW',
  ORDER_SHIPMENT: 'ORDER_SHIPMENT',
  ORDER_STATUS_PENDING: 'ORDER_STATUS_PENDING',
  ORDER_STATUS_CONFIRMED: 'ORDER_STATUS_CONFIRMED',
  ORDER_STATUS_INPROGRESS: 'ORDER_STATUS_INPROGRESS',
  ORDER_STATUS_SHIPPED: 'ORDER_STATUS_SHIPPED',
  ORDER_STATUS_DELIVERED: 'ORDER_STATUS_DELIVERED',
  ORDER_STATUS_COMPLETED: 'ORDER_STATUS_COMPLETED',
  ORDER_STATUS_CANCELLED: 'ORDER_STATUS_CANCELLED',
  ORDER_STATUS_CANCEL_REQUESTED: 'ORDER_STATUS_CANCEL_REQUESTED',
  ORDER_STATUS_RETURNED: 'ORDER_STATUS_RETURNED',
  REVIEW_NEW: 'REVIEW_NEW',
  SUPPORT_NEW: 'SUPPORT_NEW',
}

function toText(value) {
  if (typeof value === 'string') return value.trim()
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (value && typeof value === 'object') {
    try {
      const text = JSON.stringify(value)
      return text === '{}' ? '' : text
    } catch {
      return ''
    }
  }
  return ''
}

function pickFirstText(values) {
  for (const value of values) {
    const text = toText(value)
    if (text) return text
  }
  return ''
}

function parseJsonObject(text) {
  if (typeof text !== 'string' || !text.trim()) return null
  try {
    const parsed = JSON.parse(text)
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed
    return null
  } catch {
    return null
  }
}

function parseLegacyPayload(text) {
  if (typeof text !== 'string' || !text.includes(':')) return null
  const out = {}
  const lines = text.split(/\r?\n/)
  for (const line of lines) {
    const idx = line.indexOf(':')
    if (idx <= 0) continue
    const key = line.slice(0, idx).trim()
    const raw = line.slice(idx + 1).trim()
    if (!key) continue
    const n = Number(raw)
    out[key] = Number.isFinite(n) && raw !== '' ? n : raw
  }
  return Object.keys(out).length > 0 ? out : null
}

function normalizePayload(item, nested, rawMessage) {
  const fromNewContract = nested?.payload && typeof nested.payload === 'object' ? nested.payload : null
  const fromWS = item?.payload && typeof item.payload === 'object' ? item.payload : null
  const fromJson = parseJsonObject(rawMessage)
  const fromLegacy = parseLegacyPayload(rawMessage)

  return fromNewContract || fromWS || fromJson || fromLegacy || {}
}

function labelFromType(type) {
  return {
    [NotificationType.ORDER_NEW]: 'Đơn hàng mới',
    [NotificationType.ORDER_SHIPMENT]: 'Vận chuyển',
    [NotificationType.ORDER_STATUS_PENDING]: 'Đơn chờ xử lý',
    [NotificationType.ORDER_STATUS_CONFIRMED]: 'Đơn đã xác nhận',
    [NotificationType.ORDER_STATUS_INPROGRESS]: 'Đơn đang xử lý',
    [NotificationType.ORDER_STATUS_SHIPPED]: 'Đơn đang giao',
    [NotificationType.ORDER_STATUS_DELIVERED]: 'Đơn đã giao',
    [NotificationType.ORDER_STATUS_COMPLETED]: 'Đơn hoàn tất',
    [NotificationType.ORDER_STATUS_CANCELLED]: 'Đơn đã hủy',
    [NotificationType.ORDER_STATUS_CANCEL_REQUESTED]: 'Yêu cầu hủy đơn',
    [NotificationType.ORDER_STATUS_RETURNED]: 'Đơn hoàn trả',
    [NotificationType.REVIEW_NEW]: 'Đánh giá mới',
    [NotificationType.SUPPORT_NEW]: 'Hỗ trợ mới',
    [NotificationType.GENERIC]: 'Thông báo',
  }[type] || type || 'Thông báo'
}

function buildDisplay(type, payload, fallbackTitle, fallbackMessage) {
  const orderId = payload?.order_id
  const reviewId = payload?.review_id
  const bookId = payload?.book_id
  const supportId = payload?.support_id

  switch (type) {
    case NotificationType.ORDER_NEW:
      return {
        title: fallbackTitle || `Đơn hàng #${orderId || ''}`.trim(),
        message: orderId ? `Đơn hàng #${orderId} vừa được tạo.` : (fallbackMessage || 'Có đơn hàng mới.'),
      }
    case NotificationType.ORDER_SHIPMENT:
      return {
        title: fallbackTitle || `Vận chuyển đơn #${orderId || ''}`.trim(),
        message: `Đơn #${orderId || '-'}: ${payload?.shipping_provider || 'N/A'} - ${payload?.tracking_number || 'N/A'}`,
      }
    case NotificationType.REVIEW_NEW:
      return {
        title: fallbackTitle || 'Đánh giá mới',
        message: `Review #${reviewId || '-'} cho sách #${bookId || '-'}`,
      }
    case NotificationType.SUPPORT_NEW:
      return {
        title: fallbackTitle || 'Yêu cầu hỗ trợ mới',
        message: `Support ticket #${supportId || '-'}`,
      }
    case NotificationType.ORDER_STATUS_PENDING:
    case NotificationType.ORDER_STATUS_CONFIRMED:
    case NotificationType.ORDER_STATUS_INPROGRESS:
    case NotificationType.ORDER_STATUS_SHIPPED:
    case NotificationType.ORDER_STATUS_DELIVERED:
    case NotificationType.ORDER_STATUS_COMPLETED:
    case NotificationType.ORDER_STATUS_CANCELLED:
    case NotificationType.ORDER_STATUS_CANCEL_REQUESTED:
    case NotificationType.ORDER_STATUS_RETURNED:
      return {
        title: fallbackTitle || `Đơn hàng #${orderId || ''}`.trim(),
        message: `Đơn #${orderId || '-'} cập nhật trạng thái ${payload?.status || type.replace('ORDER_STATUS_', '')}.`,
      }
    default:
      return {
        title: fallbackTitle || 'Thông báo',
        message: fallbackMessage || 'Bạn có thông báo mới.',
      }
  }
}

function normalizeNotificationItem(item) {
  const nested = item?.notification || {}
  const id = item?.notification_id ?? item?.id ?? nested?.id

  const rawType = pickFirstText([
    nested?.type,
    item?.notif_type,
    item?.type,
    item?.category,
    item?.data?.type,
    item?.payload?.type,
  ])

  const rawTitle = pickFirstText([
    nested?.title,
    item?.title,
    item?.subject,
    item?.data?.title,
    item?.payload?.title,
  ])

  const rawMessage = pickFirstText([
    nested?.message,
    nested?.content,
    item?.message,
    item?.content,
    item?.body,
    item?.description,
    item?.data?.message,
    item?.data?.content,
    item?.payload?.message,
    item?.payload?.content,
    item?.detail,
    item?.meta,
    item?.extra,
    item?.data,
    item?.payload,
  ])

  const payload = normalizePayload(item, nested, rawMessage)
  const type = rawType || NotificationType.GENERIC
  const display = buildDisplay(type, payload, rawTitle, rawMessage)

  return {
    ...item,
    id,
    type,
    type_label: labelFromType(type),
    title: display.title || `Notice${id ? ` #${id}` : ''}`,
    message: display.message || 'No message content from backend',
    raw_message: rawMessage,
    payload,
    send_date: nested?.send_date || item?.send_date || item?.created_at || null,
    is_read: typeof item?.is_read === 'boolean' ? item.is_read : item?.read ?? false,
  }
}

function normalizeNotifications(payload) {
  let rows = []
  if (Array.isArray(payload)) rows = payload
  else if (Array.isArray(payload?.items)) rows = payload.items
  else if (Array.isArray(payload?.data)) rows = payload.data
  else if (Array.isArray(payload?.notifications)) rows = payload.notifications
  else if (Array.isArray(payload?.results)) rows = payload.results
  else if (payload && typeof payload === 'object') rows = [payload]

  return rows.map(normalizeNotificationItem)
}

async function getFirstAvailable(paths, normalizer) {
  let lastError = null
  for (const path of paths) {
    try {
      return normalizer(await apiClient.get(path))
    } catch (error) {
      lastError = error
    }
  }
  throw lastError
}

function normalizeUnreadCount(payload) {
  if (typeof payload === 'number') return payload
  if (typeof payload === 'string') {
    const parsed = Number(payload)
    return Number.isFinite(parsed) ? parsed : 0
  }
  if (typeof payload?.unread_count === 'number') return payload.unread_count
  if (typeof payload?.count === 'number') return payload.count
  if (typeof payload?.total === 'number') return payload.total
  return 0
}

export { NotificationType }

export const notificationsApi = {
  list: async () => ensureArray(await apiClient.get('/notifications/')).map(normalizeNotificationItem),
  mine: async () => getFirstAvailable(['/notifications/me', '/notifications/'], normalizeNotifications),
  unreadCount: async () => getFirstAvailable(['/notifications/me/unread-count', '/notifications/me', '/notifications/'], (payload) => {
    const explicit = normalizeUnreadCount(payload)
    if (explicit > 0) return explicit
    return normalizeNotifications(payload).filter((item) => !item.is_read).length
  }),
  markRead: (id) => apiClient.post(`/notifications/${id}/read`),
  markReadAll: () => apiClient.post('/notifications/me/read-all'),
}

