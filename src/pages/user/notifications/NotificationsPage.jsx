import { useNavigate } from 'react-router-dom'
import { notificationsApi } from '../../../api/notifications'
import { Section, SectionTitle } from '../../../components/Section'
import { useAsync } from '../../../hooks/useAsync'
import { formatDateTime } from '../../../utils/formatters'
import { useAuth } from '../../../auth/auth-store'
import { Alert, NotiCard, NotiHead, NotiList, NotiMeta, NotiMsg, NotiPayload, NotiTitle, NotiType, P, Wrap } from '../../WorkflowPages.styles'

function notiPayloadLine(payload) {
  if (!payload || typeof payload !== 'object') return ''
  const entries = [
    payload.order_id ? `order:${payload.order_id}` : '',
    payload.review_id ? `review:${payload.review_id}` : '',
    payload.book_id ? `book:${payload.book_id}` : '',
    payload.support_id ? `support:${payload.support_id}` : '',
  ].filter(Boolean)
  return entries.join(' / ')
}

export function NotificationsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const s = useAsync(() => notificationsApi.mine(), [])

  async function handleNotificationClick(item) {
    if (!item.is_read) {
      try {
        await notificationsApi.markRead(item.id)
        if (s.data) {
          s.setData(s.data.map((notif) => (notif.id === item.id ? { ...notif, is_read: true, read: true } : notif)))
        }
      } catch (err) {
        console.error('Lỗi khi đánh dấu đã đọc:', err)
      }
    }

    const p = item.payload || {}
    if (p.url) {
      navigate(p.url)
      return
    }

    switch (item.type) {
      case 'ORDER_NEW':
      case 'ORDER_SHIPMENT':
      case 'ORDER_STATUS_PENDING':
      case 'ORDER_STATUS_CONFIRMED':
      case 'ORDER_STATUS_INPROGRESS':
      case 'ORDER_STATUS_SHIPPED':
      case 'ORDER_STATUS_DELIVERED':
      case 'ORDER_STATUS_COMPLETED':
      case 'ORDER_STATUS_CANCELLED':
      case 'ORDER_STATUS_CANCEL_REQUESTED':
      case 'ORDER_STATUS_RETURNED':
        if (p.order_id) {
          navigate(`/app/orders/${p.order_id}`)
        } else {
          navigate('/app/orders')
        }
        break
      case 'REVIEW_NEW':
        if (p.book_id) {
          navigate(`/app/book/${p.book_id}`)
        }
        break
      case 'SUPPORT_NEW':
        if (user?.role === 'ADMIN') {
          navigate('/app/admin/dashboard')
        } else {
          navigate('/app/profile/support')
        }
        break
      default:
        break
    }
  }

  return (
    <Wrap>
      <Section>
        <SectionTitle>Notifications</SectionTitle>
        {s.loading && <P>Loading...</P>}
        {s.error && <Alert role="alert">{s.error}</Alert>}
        {!s.loading && !s.error && (s.data || []).length === 0 && <P>No notifications.</P>}
        <NotiList>
          {(s.data || []).map((n, i) => (
            <NotiCard key={n.id || i} onClick={() => void handleNotificationClick(n)}>
              <NotiHead>
                <NotiTitle>{n.title || 'Notice'}</NotiTitle>
                <NotiType>{n.type_label || n.type || 'SYSTEM'}</NotiType>
              </NotiHead>
              <NotiMsg>{n.message || n.content || ''}</NotiMsg>
              {notiPayloadLine(n.payload) ? <NotiPayload>{notiPayloadLine(n.payload)}</NotiPayload> : null}
              <NotiMeta>{formatDateTime(n.send_date || n.created_at)}</NotiMeta>
            </NotiCard>
          ))}
        </NotiList>
      </Section>
    </Wrap>
  )
}
