import { notificationsApi } from '../../api/notifications'
import { Section, SectionTitle } from '../../components/Section'
import { useAsync } from '../../hooks/useAsync'
import { formatDateTime } from '../../utils/formatters'
import { Alert, NotiCard, NotiHead, NotiList, NotiMeta, NotiMsg, NotiPayload, NotiTitle, NotiType, P, Wrap } from '../WorkflowPages.styles'

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
  const s = useAsync(() => notificationsApi.mine(), [])
  return <Wrap><Section><SectionTitle>Notifications</SectionTitle>{s.loading && <P>Loading...</P>}{s.error && <Alert role="alert">{s.error}</Alert>}{!s.loading && !s.error && (s.data || []).length === 0 && <P>No notifications.</P>}<NotiList>{(s.data || []).map((n, i) => <NotiCard key={n.id || i}><NotiHead><NotiTitle>{n.title || 'Notice'}</NotiTitle><NotiType>{n.type_label || n.type || 'SYSTEM'}</NotiType></NotiHead><NotiMsg>{n.message || n.content || ''}</NotiMsg>{notiPayloadLine(n.payload) ? <NotiPayload>{notiPayloadLine(n.payload)}</NotiPayload> : null}<NotiMeta>{formatDateTime(n.send_date || n.created_at)}</NotiMeta></NotiCard>)}</NotiList></Section></Wrap>
}
