import { useCallback, useEffect, useMemo, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Bell, BookOpen, Check, Home, ShoppingCart, User, X } from 'react-feather'
import { notificationsApi } from '../api/notifications'
import { useAuth } from '../auth/auth-store'
import {
  Shell,
  Header,
  HeaderPanel,
  Brand,
  Nav,
  NavItem,
  Main,
  RightActions,
  IconWrap,
  IconBtn,
  Badge,
  IconLink,
  AuthBox,
  AuthText,
  AuthButton,
  Overlay,
  Modal,
  ModalHead,
  ModalTitle,
  HeadActions,
  HeadBtn,
  CloseBtn,
  NotiList,
  NotiCard,
  NotiTop,
  NotiTitle,
  TypeChip,
  NotiMsg,
  NotiMeta,
  PayloadMeta,
  StateText,
} from './AppLayout.styles'

function parseNotificationDate(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleString('vi-VN')
}

function isUnread(item) {
  if (typeof item?.is_read === 'boolean') return !item.is_read
  if (typeof item?.read === 'boolean') return !item.read
  if (item?.read_at) return false
  return true
}

function sortedNotifications(rows) {
  const copy = [...(rows || [])]
  copy.sort((a, b) => {
    const tA = new Date(a?.send_date || a?.created_at || 0).getTime() || 0
    const tB = new Date(b?.send_date || b?.created_at || 0).getTime() || 0
    return tB - tA
  })
  return copy
}

function payloadLine(payload) {
  if (!payload || typeof payload !== 'object') return ''
  const entries = [
    payload.order_id ? `order:${payload.order_id}` : '',
    payload.review_id ? `review:${payload.review_id}` : '',
    payload.book_id ? `book:${payload.book_id}` : '',
    payload.support_id ? `support:${payload.support_id}` : '',
  ].filter(Boolean)
  return entries.join(' / ')
}

export function AppLayout() {
  const { isAuthenticated, user, logout } = useAuth()
  const [showNoti, setShowNoti] = useState(false)
  const [loadingNoti, setLoadingNoti] = useState(false)
  const [notiError, setNotiError] = useState('')
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  const loadUnread = useCallback(async () => {
    if (!isAuthenticated) return
    try {
      const count = await notificationsApi.unreadCount()
      setUnreadCount(Number(count || 0))
    } catch {
      setUnreadCount(0)
    }
  }, [isAuthenticated])

  const loadNotifications = useCallback(async () => {
    if (!isAuthenticated) return
    try {
      setLoadingNoti(true)
      setNotiError('')
      const data = await notificationsApi.mine()
      setNotifications(sortedNotifications(data))
      const localUnread = (data || []).filter((item) => isUnread(item)).length
      setUnreadCount(localUnread)
    } catch (e) {
      setNotiError(e.message || 'Failed to load notifications')
    } finally {
      setLoadingNoti(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadUnread()
    }, 0)
    return () => clearTimeout(timer)
  }, [loadUnread])

  useEffect(() => {
    if (!showNoti || !isAuthenticated) return undefined
    const timer = setTimeout(() => {
      void loadNotifications()
    }, 0)
    return () => clearTimeout(timer)
  }, [showNoti, isAuthenticated, loadNotifications])

  useEffect(() => {
    if (!showNoti) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function onKeyDown(event) {
      if (event.key === 'Escape') {
        setShowNoti(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [showNoti])

  const unreadLabel = useMemo(() => (unreadCount > 99 ? '99+' : String(unreadCount)), [unreadCount])

  async function handleMarkAllRead() {
    try {
      await notificationsApi.markReadAll()
      setNotifications((prev) => prev.map((item) => ({ ...item, is_read: true, read: true })))
      setUnreadCount(0)
    } catch (e) {
      setNotiError(e.message || 'Failed to mark all read')
    }
  }

  return (
    <Shell>
      <Header>
        <HeaderPanel>
          <Brand to="/app/home"><BookOpen size={19} /> KeBook Atelier</Brand>
          <Nav aria-label="Primary navigation">
            <NavItem to="/app/home"><Home size={15} /> Home</NavItem>
            <NavItem to="/app/profile"><User size={15} /> Profile</NavItem>
          </Nav>
          <RightActions>
            <IconWrap>
              <IconBtn type="button" aria-label="Open notifications" onClick={() => setShowNoti(true)}>
                <Bell size={16} />
              </IconBtn>
              {isAuthenticated && unreadCount > 0 && <Badge>{unreadLabel}</Badge>}
            </IconWrap>
            <IconLink to="/app/cart" aria-label="Open cart">
              <ShoppingCart size={16} />
            </IconLink>
            <AuthBox>
              {isAuthenticated ? (
                <>
                  <AuthText aria-live="polite">{user?.username || user?.email || 'Signed in'}</AuthText>
                  <AuthButton type="button" onClick={logout}>Logout</AuthButton>
                </>
              ) : (
                <NavItem to="/auth/login">Login</NavItem>
              )}
            </AuthBox>
          </RightActions>
        </HeaderPanel>
      </Header>
      <Main>
        <Outlet />
      </Main>
      {showNoti && (
        <Overlay role="dialog" aria-modal="true" aria-label="Notifications modal" onClick={() => setShowNoti(false)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalHead>
              <ModalTitle>Notifications</ModalTitle>
              <HeadActions>
                <HeadBtn type="button" onClick={() => void handleMarkAllRead()}>
                  <Check size={14} /> Mark all
                </HeadBtn>
                <CloseBtn type="button" aria-label="Close notifications" onClick={() => setShowNoti(false)}>
                  <X size={16} />
                </CloseBtn>
              </HeadActions>
            </ModalHead>
            {loadingNoti && <StateText>Loading...</StateText>}
            {!loadingNoti && notiError && <StateText role="alert">Error: {notiError}</StateText>}
            {!loadingNoti && !notiError && notifications.length === 0 && <StateText>No notifications.</StateText>}
            {!loadingNoti && !notiError && notifications.length > 0 && (
              <NotiList>
                {notifications.map((item, index) => (
                  <NotiCard key={item.id || `${item.title || 'notice'}-${index}`} $unread={isUnread(item)}>
                    <NotiTop>
                      <NotiTitle>{item.title || 'Notice'}</NotiTitle>
                      <TypeChip>{item.type_label || item.type || 'SYSTEM'}</TypeChip>
                    </NotiTop>
                    <NotiMsg>{item.message || item.content || ''}</NotiMsg>
                    {payloadLine(item.payload) ? <PayloadMeta>{payloadLine(item.payload)}</PayloadMeta> : null}
                    <NotiMeta>{parseNotificationDate(item.send_date || item.created_at)}</NotiMeta>
                  </NotiCard>
                ))}
              </NotiList>
            )}
          </Modal>
        </Overlay>
      )}
    </Shell>
  )
}

