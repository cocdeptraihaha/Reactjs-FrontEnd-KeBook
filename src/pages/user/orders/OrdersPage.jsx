import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { cartApi } from '../../../api/cart'
import { ordersApi } from '../../../api/orders'
import { returnRequestsApi } from '../../../api/returnRequests'
import { uploadApi } from '../../../api/upload'
import { Section, SectionSub, SectionTitle } from '../../../components/Section'
import {
  Wrap,
  Tabs,
  TabBtn,
  StateText,
  AlertText,
  List,
  Card,
  CardHead,
  OrderCode,
  StatusChip,
  ItemList,
  ItemRow,
  Cover,
  CoverImg,
  ItemTitle,
  ItemMeta,
  Price,
  MoreText,
  Footer,
  FooterText,
  Actions,
  ActionBtn,
  ReturnPanel,
  ReturnTitle,
  ReturnGrid,
  ReturnField,
  ReturnSelect,
  ReturnInput,
  ReturnTextarea,
  PaginationContainer,
  PaginationInfo,
  PaginationControls,
  PaginationButton,
  DetailContainer,
  DetailHeader,
  HeaderNav,
  HeaderStatus,
  ShopeeTimeline,
  TimelineProgressLine,
  TimelineProgressActive,
  TimelineStep,
  StepIconWrap,
  StepContent,
  AddressBorder,
  InfoSection,
  BlockPanel,
  BlockHeader,
  BlockBody,
  LogisticsRow,
  ShopeeItemCard,
  ShopHeader,
  ShopInfo,
  ShopeeItemRow,
  ShopeeItemImage,
  ShopeeItemDetails,
  ShopeeItemName,
  ShopeeItemQuantity,
  ShopeeItemPrice,
  PricingBreakdown,
  PricingRow,
  HistoryList,
  HistoryRow,
  DetailCard,
  DetailCardTitle,
  ReturnItemCard,
  ReturnItemCardHeader,
  ReturnItemTitle,
  ReturnItemStatus,
  ReturnItemReason,
  ReturnItemRefund,
  DetailFooterActions,
} from './OrdersPage.styles'


const STATUS_LABELS = {
  PENDING: 'Chờ xử lý',
  CONFIRMED: 'Đã xác nhận',
  INPROGRESS: 'Đang chuẩn bị',
  SHIPPED: 'Đang giao',
  DELIVERED: 'Đã giao',
  COMPLETED: 'Hoàn tất',
  CANCELLED: 'Đã hủy',
  CANCEL_REQUESTED: 'Yêu cầu hủy',
  RETURNED: 'Hoàn trả',
}

const STATUS_COLORS = {
  PENDING: '#8a6b2f',
  CONFIRMED: '#2d6c3b',
  INPROGRESS: '#2b5f7e',
  SHIPPED: '#2b5f7e',
  DELIVERED: '#1e4a2a',
  COMPLETED: '#1e4a2a',
  CANCELLED: '#8f2f3c',
  CANCEL_REQUESTED: '#8f2f3c',
  RETURNED: '#8f2f3c',
}

const TAB_CONFIG = [
  { key: 'all', label: 'Tất cả', statusIn: null },
  { key: 'pending', label: 'Chờ xử lý', statusIn: 'PENDING,CONFIRMED' },
  { key: 'shipping', label: 'Đang giao', statusIn: 'INPROGRESS,SHIPPED' },
  { key: 'delivered', label: 'Đã giao', statusIn: 'DELIVERED,COMPLETED' },
  { key: 'cancelled', label: 'Đã hủy', statusIn: 'CANCELLED,CANCEL_REQUESTED,RETURNED' },
]

function normalizeStatus(raw) {
  return String(raw || '').replace('OrderStatus.', '').trim().toUpperCase()
}

function normalizeStatusIn(value) {
  if (!value) return ''
  return String(value).split(',').map((x) => x.trim().toUpperCase()).filter(Boolean).sort().join(',')
}

function tabKeyFromStatusIn(statusIn) {
  const norm = normalizeStatusIn(statusIn)
  if (!norm) return 'all'
  const found = TAB_CONFIG.find((tab) => normalizeStatusIn(tab.statusIn) === norm)
  return found?.key || 'all'
}

function formatMoney(value) {
  return `₫${Number(value || 0).toLocaleString('vi-VN')}`
}

function formatDateTime(value) {
  if (!value) return '-'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '-'
  return d.toLocaleString('vi-VN')
}

function canCancel(status) {
  return status === 'PENDING' || status === 'CONFIRMED'
}

function isDelivered(status) {
  return status === 'DELIVERED'
}

function isTerminalComplete(status) {
  return status === 'DELIVERED' || status === 'COMPLETED'
}

function getReceivedDate(order) {
  return order?.received_at || order?.completed_at || order?.delivered_at || order?.updated_at || order?.order_date
}

function canReturnOrder(order, status) {
  if (status === 'SHIPPED' || status === 'DELIVERED') return true
  if (status !== 'COMPLETED') return false
  const receivedAt = new Date(getReceivedDate(order))
  if (Number.isNaN(receivedAt.getTime())) return false
  const elapsedMs = Date.now() - receivedAt.getTime()
  return elapsedMs >= 0 && elapsedMs <= 14 * 24 * 60 * 60 * 1000
}

export function OrderHistoryPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  const [busyId, setBusyId] = useState(null)

  const activeTab = useMemo(() => {
    const queryStatusIn = new URLSearchParams(location.search).get('statusIn')
    return tabKeyFromStatusIn(queryStatusIn)
  }, [location.search])

  const [page, setPage] = useState(1)
  const limit = 5

  const currentStatusIn = useMemo(() => TAB_CONFIG.find((x) => x.key === activeTab)?.statusIn || null, [activeTab])

  // Reset page when tab changes
  useEffect(() => {
    setPage(1)
  }, [activeTab])

  const { data: paginationResult, isLoading: loading, error: pagingError, refetch } = useQuery({
    queryKey: ['user-orders', currentStatusIn, page],
    queryFn: () => ordersApi.list({ statusIn: currentStatusIn, page, size: limit }),
    staleTime: 10_000,
  })

  const orders = useMemo(() => paginationResult?.items || [], [paginationResult])
  const pagination = useMemo(() => ({
    total: paginationResult?.total || 0,
    page: paginationResult?.page || 1,
    size: paginationResult?.size || limit,
    pages: paginationResult?.pages || 1,
  }), [paginationResult])

  const error = pagingError?.message || ''

  async function handleCancel(orderId) {
    try {
      setBusyId(orderId)
      await ordersApi.cancel(orderId)
      queryClient.invalidateQueries({ queryKey: ['user-orders'] })
    } catch (e) {
      toast.error(e.message || 'Hủy đơn hàng thất bại')
    } finally {
      setBusyId(null)
    }
  }

  async function handleConfirmReceived(orderId) {
    try {
      setBusyId(orderId)
      await ordersApi.confirmReceived(orderId)
      queryClient.invalidateQueries({ queryKey: ['user-orders'] })
    } catch (e) {
      toast.error(e.message || 'Xác nhận thất bại')
    } finally {
      setBusyId(null)
    }
  }

  async function handleRebuy(order) {
    try {
      setBusyId(order.id)
      const items = Array.isArray(order.order_items) ? order.order_items : []
      for (const item of items) {
        if (item?.book_id) {
          await cartApi.add({ book_id: Number(item.book_id), quantity: Number(item.quantity || 1) })
        }
      }
      navigate('/app/cart')
    } catch (e) {
      toast.error(e.message || 'Mua lại thất bại')
    } finally {
      setBusyId(null)
    }
  }

  async function handlePayAgain(orderId) {
    try {
      setBusyId(orderId)
      const res = await ordersApi.getPaymentUrl(orderId)
      if (res && res.payment_url) {
        window.location.href = res.payment_url
      } else {
        toast.error('Không tìm thấy link thanh toán')
      }
    } catch (e) {
      toast.error(e.message || 'Lấy link thanh toán thất bại')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <Wrap>
      <Section>
        <SectionTitle>Lịch sử đơn hàng</SectionTitle>
        <SectionSub>Theo dõi đơn hàng, lọc theo trạng thái và thực hiện các thao tác nhanh.</SectionSub>
        <Tabs>
          {TAB_CONFIG.map((tab) => (
            <TabBtn key={tab.key} type="button" $active={activeTab === tab.key} onClick={() => { const q = tab.statusIn ? `?statusIn=${encodeURIComponent(tab.statusIn)}` : ""; navigate(`/app/orders${q}`) }}>
              {tab.label}
            </TabBtn>
          ))}
          <ActionBtn type="button" onClick={() => void refetch()}>Làm mới</ActionBtn>
        </Tabs>
      </Section>

      {loading && <StateText>Đang tải đơn hàng...</StateText>}
      {!loading && error && <AlertText role="alert">{error}</AlertText>}
      {!loading && !error && orders.length === 0 && <StateText>Không có đơn hàng.</StateText>}

      {!loading && !error && orders.length > 0 && (
        <>
          <List>
            {orders.map((order) => {
              const status = normalizeStatus(order?.status)
              const items = Array.isArray(order?.order_items) ? order.order_items : []
              const showItems = items.slice(0, 2)
              const totalQty = items.reduce((acc, it) => acc + Number(it?.quantity || 0), 0)
              return (
                <Card key={order.id}>
                  <CardHead>
                    <OrderCode>#{order.id}</OrderCode>
                    <StatusChip $color={STATUS_COLORS[status]}>{STATUS_LABELS[status] || status || '-'}</StatusChip>
                  </CardHead>

                  <ItemList>
                    {showItems.length === 0 && <MoreText>(Không có sản phẩm hiển thị)</MoreText>}
                    {showItems.map((item, idx) => (
                      <ItemRow key={item.id || `${order.id}-${idx}`}>
                        <Cover>
                          {item?.image_url ? <CoverImg src={item.image_url} alt={item.book_title || 'Book'} /> : null}
                        </Cover>
                        <div>
                          <ItemTitle>{item?.book_title || `Book #${item?.book_id || '-'}`}</ItemTitle>
                          <ItemMeta>Số lượng: {item?.quantity || 0}</ItemMeta>
                        </div>
                        <Price>{formatMoney(item?.price || 0)}</Price>
                      </ItemRow>
                    ))}
                    {items.length > 2 && <MoreText>và {items.length - 2} sản phẩm khác...</MoreText>}
                  </ItemList>

                  <Footer>
                    <FooterText>Tổng sản phẩm: {totalQty}</FooterText>
                    <FooterText>Tổng tiền: {formatMoney(order?.total_price || 0)}</FooterText>
                    <FooterText>Đặt lúc: {formatDateTime(order?.order_date)}</FooterText>
                  </Footer>

                  <Actions>
                    <ActionBtn type="button" onClick={() => navigate(`/app/orders/${order.id}`)}>Chi tiết</ActionBtn>
                    {order?.payment_method === 'VNPAY' &&
                      order?.payment_status === 'UNPAID' &&
                      status !== 'CANCELLED' && (
                        <ActionBtn
                          type="button"
                          disabled={busyId === order.id}
                          onClick={() => void handlePayAgain(order.id)}
                          style={{ backgroundColor: 'var(--brand-700)', color: '#fff' }}
                        >
                          Thanh toán lại
                        </ActionBtn>
                    )}
                    {canCancel(status) && (
                      <ActionBtn type="button" disabled={busyId === order.id} onClick={() => void handleCancel(order.id)}>Hủy đơn</ActionBtn>
                    )}
                    {isDelivered(status) && (
                      <ActionBtn type="button" disabled={busyId === order.id} onClick={() => void handleConfirmReceived(order.id)}>Đã nhận hàng</ActionBtn>
                    )}
                    {(status === 'SHIPPED' || status === 'DELIVERED' || status === 'COMPLETED') && (
                      <ActionBtn type="button" onClick={() => navigate(`/app/orders/${order.id}?action=return`)}>Trả hàng</ActionBtn>
                    )}
                    {isTerminalComplete(status) && (
                      <ActionBtn type="button" onClick={() => navigate('/app/profile/write-review', { state: { orderId: order.id, items: order.order_items } })}>Đánh giá</ActionBtn>
                    )}
                    {isTerminalComplete(status) && (
                      <ActionBtn type="button" disabled={busyId === order.id} onClick={() => void handleRebuy(order)}>Mua lại</ActionBtn>
                    )}
                  </Actions>
                </Card>
              )
            })}
          </List>

          {pagination.pages > 1 && (
            <PaginationContainer>
              <PaginationInfo>
                Hiển thị trang {pagination.page} / {pagination.pages} (Tổng {pagination.total} đơn hàng)
              </PaginationInfo>
              <PaginationControls>
                <PaginationButton
                  type="button"
                  disabled={pagination.page <= 1}
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                >
                  Trước
                </PaginationButton>
                <PaginationButton
                  type="button"
                  disabled={pagination.page >= pagination.pages}
                  onClick={() => setPage((prev) => Math.min(pagination.pages, prev + 1))}
                >
                  Sau
                </PaginationButton>
              </PaginationControls>
            </PaginationContainer>
          )}
        </>
      )}
    </Wrap>
  )
}

export function OrderDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [returnItemId, setReturnItemId] = useState('')
  const [returnQuantity, setReturnQuantity] = useState(1)
  const [returnReason, setReturnReason] = useState('')
  const [localFile, setLocalFile] = useState(null)
  const [localFilePreview, setLocalFilePreview] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [returnBusy, setReturnBusy] = useState(false)
  const [existingReturns, setExistingReturns] = useState([])
  const [payBusy, setPayBusy] = useState(false)
  const [cancelBusy, setCancelBusy] = useState(false)

  const showReturnForm = useMemo(() => {
    const params = new URLSearchParams(location.search)
    return params.get('action') === 'return'
  }, [location.search])

  async function handleCancel() {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) return
    try {
      setCancelBusy(true)
      await ordersApi.cancel(id)
      toast.success('Hủy đơn hàng thành công')
      void load()
    } catch (e) {
      toast.error(e.message || 'Hủy đơn hàng thất bại')
    } finally {
      setCancelBusy(false)
    }
  }

  async function handlePayAgain() {
    try {
      setPayBusy(true)
      const res = await ordersApi.getPaymentUrl(order.id)
      if (res && res.payment_url) {
        window.location.href = res.payment_url
      } else {
        toast.error('Không tìm thấy link thanh toán')
      }
    } catch (e) {
      toast.error(e.message || 'Lấy link thanh toán thất bại')
    } finally {
      setPayBusy(false)
    }
  }

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const [orderData, returnsData] = await Promise.all([
        ordersApi.detail(id),
        returnRequestsApi.list().catch(() => [])
      ])
      setOrder(orderData || null)
      // Filter returns for this order
      const filtered = (returnsData || []).filter(r => String(r.order_id) === String(id))
      setExistingReturns(filtered)
    } catch (e) {
      setError(e.message || 'Load order detail failed')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    const timer = setTimeout(() => { void load() }, 0)
    return () => clearTimeout(timer)
  }, [load])

  const status = normalizeStatus(order?.status)
  const items = Array.isArray(order?.order_items) ? order.order_items : []
  const returnAllowed = canReturnOrder(order, status)
  const selectedReturnItem = items.find((item) => String(item.id || item.order_item_id) === String(returnItemId))

  function handleImageSelection(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setLocalFile(file)
    const previewUrl = URL.createObjectURL(file)
    setLocalFilePreview(previewUrl)
  }

  async function submitReturnRequest(event) {
    event.preventDefault()
    if (!selectedReturnItem) {
      toast.error('Chọn sản phẩm cần hoàn trả')
      return
    }
    if (!returnReason.trim()) {
      toast.error('Nhập lý do hoàn trả')
      return
    }

    try {
      setReturnBusy(true)
      let finalImageUrl = undefined

      if (localFile) {
        setUploadingImage(true)
        const res = await uploadApi.generalImage(localFile)
        if (res && res.url) {
          finalImageUrl = res.url
        }
        setUploadingImage(false)
      }

      await returnRequestsApi.create({
        order_id: Number(order.id),
        order_item_id: Number(selectedReturnItem.id || selectedReturnItem.order_item_id),
        quantity: Number(returnQuantity || 1),
        reason: returnReason.trim(),
        image_url: finalImageUrl || undefined,
      })
      setReturnItemId('')
      setReturnQuantity(1)
      setReturnReason('')
      setLocalFile(null)
      setLocalFilePreview('')
      toast.success('Đã gửi yêu cầu hoàn trả')
      await load()
    } catch (e) {
      toast.error('Gửi yêu cầu hoàn trả thất bại', { description: e.message || 'Vui lòng thử lại' })
    } finally {
      setReturnBusy(false)
      setUploadingImage(false)
    }
  }

  // Calculate timeline progress
  const timelineProgressPercentage = useMemo(() => {
    switch (status) {
      case 'PENDING': return '0%'
      case 'CONFIRMED': return '25%'
      case 'INPROGRESS': return '50%'
      case 'SHIPPED': return '75%'
      case 'DELIVERED':
      case 'COMPLETED': return '100%'
      default: return '0%'
    }
  }, [status])

  // Find dynamic history dates
  const historyDates = useMemo(() => {
    const dates = {
      PENDING: null,
      CONFIRMED: null,
      INPROGRESS: null,
      SHIPPED: null,
      DELIVERED: null,
      COMPLETED: null,
      CANCELLED: null,
    }
    if (order?.status_history) {
      order.status_history.forEach(h => {
        if (h.status) {
          dates[normalizeStatus(h.status)] = h.status_change_date
        }
      })
    }
    // Fallbacks
    if (!dates.PENDING && order?.order_date) dates.PENDING = order.order_date
    return dates
  }, [order])

  const itemsSubtotal = useMemo(() => {
    return items.reduce((acc, it) => acc + (Number(it.price || 0) * Number(it.quantity || 1)), 0)
  }, [items])

  return (
    <DetailContainer>
      <DetailHeader>
        <HeaderNav>
          <Link to="/app/orders">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            TRỞ VỀ
          </Link>
        </HeaderNav>
        <HeaderStatus>
          <span className="code">MÃ ĐƠN HÀNG: #{id}</span>
          <span className="divider">|</span>
          <span className="status">{STATUS_LABELS[status] || status || '-'}</span>
        </HeaderStatus>
      </DetailHeader>

      {loading && <StateText style={{ textAlign: 'center', padding: '40px' }}>Đang tải chi tiết đơn hàng...</StateText>}
      {!loading && error && <AlertText role="alert" style={{ textAlign: 'center', padding: '40px' }}>{error}</AlertText>}

      {!loading && !error && order && (
        <>
          {/* Visual Timeline (inspired by Shopee) */}
          {status !== 'CANCELLED' && status !== 'CANCEL_REQUESTED' && status !== 'RETURNED' && (
            <ShopeeTimeline>
              <TimelineProgressLine>
                <TimelineProgressActive $percentage={timelineProgressPercentage} />
              </TimelineProgressLine>

              <TimelineStep>
                <StepIconWrap $active={true}>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </StepIconWrap>
                <StepContent $active={true}>
                  <div className="title">Đơn Hàng Đã Đặt</div>
                  <div className="time">{formatDateTime(historyDates.PENDING)}</div>
                </StepContent>
              </TimelineStep>

              <TimelineStep>
                <StepIconWrap $active={['CONFIRMED', 'INPROGRESS', 'SHIPPED', 'DELIVERED', 'COMPLETED'].includes(status)}>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </StepIconWrap>
                <StepContent $active={['CONFIRMED', 'INPROGRESS', 'SHIPPED', 'DELIVERED', 'COMPLETED'].includes(status)}>
                  <div className="title">Đã Xác Nhận</div>
                  <div className="time">{formatDateTime(historyDates.CONFIRMED)}</div>
                </StepContent>
              </TimelineStep>

              <TimelineStep>
                <StepIconWrap $active={['INPROGRESS', 'SHIPPED', 'DELIVERED', 'COMPLETED'].includes(status)}>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </StepIconWrap>
                <StepContent $active={['INPROGRESS', 'SHIPPED', 'DELIVERED', 'COMPLETED'].includes(status)}>
                  <div className="title">Đang Chuẩn Bị</div>
                  <div className="time">{formatDateTime(historyDates.INPROGRESS)}</div>
                </StepContent>
              </TimelineStep>

              <TimelineStep>
                <StepIconWrap $active={['SHIPPED', 'DELIVERED', 'COMPLETED'].includes(status)}>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                  </svg>
                </StepIconWrap>
                <StepContent $active={['SHIPPED', 'DELIVERED', 'COMPLETED'].includes(status)}>
                  <div className="title">Đang Giao Hàng</div>
                  <div className="time">{formatDateTime(historyDates.SHIPPED)}</div>
                </StepContent>
              </TimelineStep>

              <TimelineStep>
                <StepIconWrap $active={['DELIVERED', 'COMPLETED'].includes(status)}>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </StepIconWrap>
                <StepContent $active={['DELIVERED', 'COMPLETED'].includes(status)}>
                  <div className="title">Đơn Hoàn Thành</div>
                  <div className="time">{formatDateTime(historyDates.DELIVERED || historyDates.COMPLETED)}</div>
                </StepContent>
              </TimelineStep>
            </ShopeeTimeline>
          )}

          {/* Customer Address & Delivery Carrier section */}
          <div>
            <AddressBorder />
            <InfoSection>
              <BlockPanel $borderRight={true}>
                <BlockHeader>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Địa Chỉ Nhận Hàng
                </BlockHeader>
                <BlockBody>
                  <div className="name">{order.full_name || 'Khách nhận'}</div>
                  <div className="phone">{order.phone_number || '-'}</div>
                  <div className="address">{order.shipping_address || 'Chưa cập nhật địa chỉ'}</div>
                  {order.note && <div className="note"><strong>Ghi chú:</strong> {order.note}</div>}
                </BlockBody>
              </BlockPanel>

              <BlockPanel>
                <BlockHeader>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Thông Tin Giao Nhận & Thanh Toán
                </BlockHeader>
                <BlockBody>
                  <LogisticsRow>
                    <span>Hình thức vận chuyển:</span>
                    <span>{order.shipping_provider || 'Standard Shipping'}</span>
                  </LogisticsRow>
                  {order.tracking_number && (
                    <LogisticsRow>
                      <span>Mã vận đơn:</span>
                      <span style={{ color: 'var(--brand-700)' }}>{order.tracking_number}</span>
                    </LogisticsRow>
                  )}
                  <LogisticsRow>
                    <span>Phương thức thanh toán:</span>
                    <span>
                      {order.payment_method === 'COD' ? 'Thanh toán khi nhận hàng (COD)' :
                       order.payment_method === 'VNPAY' ? 'Ví điện tử VNPAY' :
                       order.payment_method === 'BANK_TRANSFER' ? 'Chuyển khoản ngân hàng' :
                       order.payment_method || 'Chưa xác định'}
                    </span>
                  </LogisticsRow>
                  <LogisticsRow>
                    <span>Trạng thái thanh toán:</span>
                    <span style={{ color: order.payment_status === 'PAID' ? '#16a34a' : '#ea580c' }}>
                      {order.payment_status === 'PAID' ? 'Đã thanh toán thành công' : 'Chưa thanh toán'}
                    </span>
                  </LogisticsRow>
                </BlockBody>
              </BlockPanel>
            </InfoSection>
          </div>

          {/* Product Items Details Card */}
          <ShopeeItemCard>

            <div>
              {items.map((item, idx) => (
                <ShopeeItemRow key={item.id || `${order.id}-${idx}`}>
                  <ShopeeItemImage>
                    {item?.image_url ? (
                      <img src={item.image_url} alt={item.book_title || 'Sách'} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: '11px' }}>Sách</div>
                    )}
                  </ShopeeItemImage>
                  <ShopeeItemDetails>
                    <ShopeeItemName>{item?.book_title || `Sách #${item?.book_id || '-'}`}</ShopeeItemName>
                    <ShopeeItemQuantity>Số lượng: x{item?.quantity || 0}</ShopeeItemQuantity>
                  </ShopeeItemDetails>
                  <ShopeeItemPrice>
                    <span className="price">{formatMoney(item?.price || 0)}</span>
                  </ShopeeItemPrice>
                </ShopeeItemRow>
              ))}
            </div>
          </ShopeeItemCard>

          {/* Detailed Pricing Breakdown Block */}
          <PricingBreakdown>
            <PricingRow>
              <div className="label">Tổng tiền hàng</div>
              <div className="value">{formatMoney(itemsSubtotal)}</div>
            </PricingRow>
            {order.shipping_fee > 0 && (
              <PricingRow>
                <div className="label">Phí vận chuyển</div>
                <div className="value">{formatMoney(order.shipping_fee)}</div>
              </PricingRow>
            )}
            {order.discount_amount > 0 && (
              <PricingRow className="discount">
                <div className="label">Giảm giá voucher</div>
                <div className="value">-{formatMoney(order.discount_amount)}</div>
              </PricingRow>
            )}
            {order.points_discount > 0 && (
              <PricingRow className="discount">
                <div className="label">Loyalty points giảm</div>
                <div className="value">-{formatMoney(order.points_discount)}</div>
              </PricingRow>
            )}
            <PricingRow className="grand-total">
              <div className="label">Thành tiền</div>
              <div className="value">{formatMoney(order.total_price || 0)}</div>
            </PricingRow>
          </PricingBreakdown>

          {/* Order Transition Status History (Shopee style timeline listing) */}
          {order.status_history && order.status_history.length > 0 && (
            <DetailCard>
              <DetailCardTitle>Lịch Sử Hành Trình Đơn Hàng</DetailCardTitle>
              <HistoryList>
                {order.status_history.map((h, index) => {
                  const s = normalizeStatus(h.status)
                  const isActive = index === 0 // Most recent is active
                  return (
                    <HistoryRow key={h.id || index} className={isActive ? 'active' : ''}>
                      <div className="date">{formatDateTime(h.status_change_date)}</div>
                      <div className="desc">
                        <strong>[{STATUS_LABELS[s] || s}]</strong> {h.description || 'Cập nhật trạng thái đơn hàng'}
                      </div>
                    </HistoryRow>
                  )
                })}
              </HistoryList>
            </DetailCard>
          )}

          {/* Return panel form */}
          {returnAllowed && showReturnForm && (
            <ReturnPanel onSubmit={submitReturnRequest}>
              <ReturnTitle>Yêu cầu hoàn trả sản phẩm</ReturnTitle>
              <ReturnGrid>
                <ReturnField>
                  Sản phẩm hoàn trả
                  <ReturnSelect value={returnItemId} onChange={(event) => {
                    const itemId = event.target.value
                    setReturnItemId(itemId)
                    setReturnQuantity(1)
                  }}>
                    <option value="">Chọn sản phẩm</option>
                    {items.map((item, idx) => (
                      <option key={item.id || item.order_item_id || `${order.id}-return-${idx}`} value={item.id || item.order_item_id}>
                        {item.book_title || `Sách #${item.book_id || '-'}`}
                      </option>
                    ))}
                  </ReturnSelect>
                </ReturnField>
                <ReturnField>
                  Số lượng
                  <ReturnInput
                    type="number"
                    min="1"
                    max={selectedReturnItem?.quantity || 1}
                    value={returnQuantity}
                    onChange={(event) => setReturnQuantity(event.target.value)}
                  />
                </ReturnField>
                <ActionBtn type="submit" disabled={returnBusy || uploadingImage} style={{ background: 'var(--berry-700)', color: '#fff', borderColor: 'var(--berry-700)' }}>Gửi yêu cầu</ActionBtn>
              </ReturnGrid>
              <ReturnField style={{ marginTop: '12.5px' }}>
                Lý do hoàn trả chi tiết
                <ReturnTextarea value={returnReason} onChange={(event) => setReturnReason(event.target.value)} placeholder="Vui lòng nhập lý do cụ thể..." />
              </ReturnField>
              <ReturnField style={{ marginTop: '12.5px' }}>
                Ảnh minh chứng sản phẩm lỗi (tải lên tối đa 1 ảnh)
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelection}
                  disabled={uploadingImage}
                  style={{ marginTop: '6px', fontSize: '13px' }}
                />
                {uploadingImage && <span style={{ fontSize: '12px', color: 'var(--blue-700)', marginTop: '4px' }}>Đang tải ảnh lên...</span>}
                {localFilePreview && (
                  <div style={{ marginTop: '8px' }}>
                    <img
                      src={localFilePreview}
                      alt="Local preview"
                      style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--line)' }}
                    />
                  </div>
                )}
              </ReturnField>
            </ReturnPanel>
          )}

          {existingReturns.length > 0 && (
            <DetailCard>
              <DetailCardTitle>Yêu Cầu Hoàn Trả Đã Gửi</DetailCardTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {existingReturns.map((ret) => {
                  const matchedItem = items.find(it => String(it.id || it.order_item_id) === String(ret.order_item_id))
                  return (
                    <ReturnItemCard key={ret.id}>
                      <ReturnItemCardHeader>
                        <ReturnItemTitle>
                          Sách: {matchedItem?.book_title || `Sản phẩm #${ret.order_item_id}`} (SL: {ret.quantity})
                        </ReturnItemTitle>
                        <ReturnItemStatus
                          $approved={ret.status === 'APPROVED'}
                          $rejected={ret.status === 'REJECTED'}
                        >
                          {ret.status === 'APPROVED' ? 'Đã duyệt' : ret.status === 'REJECTED' ? 'Từ chối' : 'Chờ xử lý'}
                        </ReturnItemStatus>
                      </ReturnItemCardHeader>
                      <ReturnItemReason>
                        <strong>Lý do:</strong> {ret.reason || '(Không có)'}
                      </ReturnItemReason>
                      {ret.refund_amount > 0 && (
                        <ReturnItemRefund>
                          <strong>Số tiền hoàn lại:</strong> {formatMoney(ret.refund_amount)}
                        </ReturnItemRefund>
                      )}
                      {ret.image_url && (
                        <div style={{ marginTop: '6px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                            Ảnh minh chứng:
                          </span>
                          <img
                            src={ret.image_url}
                            alt="Proof"
                            style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--line)' }}
                          />
                        </div>
                      )}
                    </ReturnItemCard>
                  )
                })}
              </div>
            </DetailCard>
          )}

          {/* Action buttons (inspired by Shopee details actions list) */}
          <DetailFooterActions>
            <ActionBtn as={Link} to="/app/orders">Quay lại danh sách</ActionBtn>

            {canCancel(status) && (
              <ActionBtn
                type="button"
                disabled={cancelBusy}
                onClick={handleCancel}
                style={{ backgroundColor: 'var(--danger-700)', color: '#fff', borderColor: 'var(--danger-700)' }}
              >
                {cancelBusy ? 'Đang hủy...' : 'Hủy đơn'}
              </ActionBtn>
            )}

            {order?.payment_method === 'VNPAY' &&
              order?.payment_status === 'UNPAID' &&
              status !== 'CANCELLED' && (
                <ActionBtn
                  type="button"
                  disabled={payBusy}
                  onClick={() => void handlePayAgain()}
                  style={{ backgroundColor: 'var(--berry-700)', color: '#fff', borderColor: 'var(--berry-700)' }}
                >
                  Thanh toán ngay
                </ActionBtn>
            )}

            {(status === 'SHIPPED' || status === 'DELIVERED' || status === 'COMPLETED') && !showReturnForm && (
              <ActionBtn type="button" onClick={() => navigate(`/app/orders/${order.id}?action=return`)}>Yêu cầu Trả hàng</ActionBtn>
            )}
          </DetailFooterActions>
        </>
      )}
    </DetailContainer>
  )
}
