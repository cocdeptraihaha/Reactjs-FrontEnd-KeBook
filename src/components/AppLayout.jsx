import { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom'
import { Bell, BookOpen, Check, Home, ShoppingCart, User, X, Search, Loader } from 'react-feather'
import { notificationsApi } from '../api/notifications'
import { useAuth } from '../auth/auth-store'
import { booksApi, pickPrimaryImage } from '../api/books'
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
  SearchWrapper,
  SearchBox,
  SearchInput,
  DropdownMenu,
  ResultItem,
  BookThumb,
  BookInfo,
  BookTitleText,
  BookAuthorText,
  BookPriceText,
  ResultStatusText,
  NoResultsItem,
  NavAvatar,
  NavAvatarFallback,
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
  const location = useLocation()
  const navigate = useNavigate()
  const isAdminRoute = location.pathname.startsWith('/app/admin')
  const [showNoti, setShowNoti] = useState(false)
  const [loadingNoti, setLoadingNoti] = useState(false)
  const [notiError, setNotiError] = useState('')
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  // Live search bar states
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

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

  // Debounced search fetching
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      setDropdownOpen(false)
      return
    }

    const delayDebounceFn = setTimeout(async () => {
      setSearchLoading(true)
      try {
        const res = await booksApi.list({ q: searchQuery, size: 5 })
        setSearchResults(res?.data || [])
        setDropdownOpen(true)
      } catch (err) {
        console.error('Lỗi tìm kiếm sách:', err)
        setSearchResults([])
      } finally {
        setSearchLoading(false)
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery])

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0)
  }

  const handleSelectBook = (bookId) => {
    setDropdownOpen(false)
    setSearchQuery('')
    navigate(`/app/book/${bookId}`)
  }

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      executeSearch()
    }
  }

  const executeSearch = () => {
    if (searchQuery.trim()) {
      setDropdownOpen(false)
      navigate(`/app/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  async function handleNotificationClick(item) {
    // Mark as read immediately on click
    if (isUnread(item)) {
      try {
        await notificationsApi.markRead(item.id)
        setNotifications((prev) =>
          prev.map((notif) => (notif.id === item.id ? { ...notif, is_read: true, read: true } : notif))
        )
        setUnreadCount((prev) => Math.max(0, prev - 1))
      } catch (err) {
        console.error('Lỗi khi đánh dấu đã đọc:', err)
      }
    }

    setShowNoti(false)

    // Navigate to target path based on notification type and payload
    const p = item.payload || {}
    if (p.url) {
      // Direct custom URL in payload
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
          navigate('/app/admin/dashboard') // Or some admin support route if exists
        } else {
          navigate('/app/profile/support')
        }
        break
      default:
        // Check message body for link-like items if any or generic fallback
        break
    }
  }

  return (
    <Shell>
      {!isAdminRoute && (
        <Header>
          <HeaderPanel>
            <Brand to="/app/home"><BookOpen size={19} /> KeBook</Brand>

            {/* Live book search bar */}
            <SearchWrapper ref={dropdownRef}>
              <SearchBox>
                {searchLoading ? (
                  <Loader size={16} color="#2e6a3b" className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                ) : (
                  <Search size={16} color="#b9aaa6" style={{ cursor: 'pointer' }} onClick={executeSearch} />
                )}
                <SearchInput
                  type="text"
                  placeholder="Tìm sách nhanh..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyPress}
                  onFocus={() => {
                    if (searchResults.length > 0) setDropdownOpen(true)
                  }}
                />
              </SearchBox>

              {dropdownOpen && (
                <DropdownMenu>
                  {searchResults.length === 0 ? (
                    <NoResultsItem>Không tìm thấy sách phù hợp</NoResultsItem>
                  ) : (
                    searchResults.map((book) => {
                      const isOutOfStock = (book.stock_quantity || 0) <= 0
                      return (
                        <ResultItem key={book.id} onClick={() => handleSelectBook(book.id)}>
                          <BookThumb src={pickPrimaryImage(book)} alt={book.title} />
                          <BookInfo>
                            <BookTitleText>{book.title}</BookTitleText>
                            <BookAuthorText>{book.author || 'Chưa rõ tác giả'}</BookAuthorText>
                            <BookPriceText>{formatCurrency(book.selling_price)}</BookPriceText>
                          </BookInfo>
                          <ResultStatusText $isOutOfStock={isOutOfStock}>
                            {isOutOfStock ? 'Hết hàng' : `Còn: ${book.stock_quantity}`}
                          </ResultStatusText>
                        </ResultItem>
                      )
                    })
                  )}
                </DropdownMenu>
              )}
            </SearchWrapper>

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
                    <Link to="/app/profile" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'inherit' }}>
                      {user?.avatar_url ? (
                        <NavAvatar src={user.avatar_url} alt={user.username || 'Avatar'} />
                      ) : (
                        <NavAvatarFallback>{(user?.username || user?.email || 'U').slice(0, 1).toUpperCase()}</NavAvatarFallback>
                      )}
                      <AuthText aria-live="polite">{user?.username || user?.email || 'Cá Nhân'}</AuthText>
                    </Link>
                    <AuthButton type="button" onClick={logout}>Đăng Xuất</AuthButton>
                  </>
                ) : (
                  <NavItem to="/auth/login">Đăng Nhập</NavItem>
                )}
              </AuthBox>
            </RightActions>
          </HeaderPanel>
        </Header>
      )}
      <Main $isAdmin={isAdminRoute}>
        <Outlet />
      </Main>
      {showNoti && (
        <Overlay role="dialog" aria-modal="true" aria-label="Notifications modal" onClick={() => setShowNoti(false)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalHead>
              <ModalTitle>Thông báo</ModalTitle>
              <HeadActions>
                <HeadBtn type="button" onClick={() => void handleMarkAllRead()}>
                  <Check size={14} /> Đọc tất cả
                </HeadBtn>
                <CloseBtn type="button" aria-label="Close notifications" onClick={() => setShowNoti(false)}>
                  <X size={16} />
                </CloseBtn>
              </HeadActions>
            </ModalHead>
            {loadingNoti && <StateText>Đang tải...</StateText>}
            {!loadingNoti && notiError && <StateText role="alert">Lỗi: {notiError}</StateText>}
            {!loadingNoti && !notiError && notifications.length === 0 && <StateText>Không có thông báo mới.</StateText>}
            {!loadingNoti && !notiError && notifications.length > 0 && (
              <NotiList>
                {notifications.map((item, index) => (
                  <NotiCard
                    key={item.id || `${item.title || 'notice'}-${index}`}
                    $unread={isUnread(item)}
                    onClick={() => void handleNotificationClick(item)}
                  >
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

