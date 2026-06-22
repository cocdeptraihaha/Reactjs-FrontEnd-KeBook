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
                      order?.payment_status !== 'SUCCESS' &&
                      order?.payment_status !== 'SUCCESS_MANUAL_REVIEW' &&
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

  const showReturnForm = useMemo(() => {
    const params = new URLSearchParams(location.search)
    return params.get('action') === 'return'
  }, [location.search])

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

  return (
    <Wrap>
      <Section>
        <SectionTitle>Chi tiết đơn hàng #{id}</SectionTitle>
        <SectionSub>Xem thông tin sản phẩm đã đặt và tổng quan vận chuyển/thanh toán.</SectionSub>
      </Section>

      {loading && <StateText>Đang tải chi tiết đơn...</StateText>}
      {!loading && error && <AlertText role="alert">{error}</AlertText>}

      {!loading && !error && order && (
        <Card>
          <CardHead>
            <OrderCode>#{order.id}</OrderCode>
            <StatusChip $color={STATUS_COLORS[status]}>{STATUS_LABELS[status] || status || '-'}</StatusChip>
          </CardHead>
          <Footer>
            <FooterText>Ngày đặt: {formatDateTime(order.order_date)}</FooterText>
            <FooterText>SĐT: {order.phone_number || '-'}</FooterText>
            <FooterText>Địa chỉ: {order.shipping_address || '-'}</FooterText>
            <FooterText>Tổng tiền: {formatMoney(order.total_price || 0)}</FooterText>
          </Footer>
          <ItemList>
            {items.map((item, idx) => (
              <ItemRow key={item.id || `${order.id}-${idx}`}>
                <Cover>{item?.image_url ? <CoverImg src={item.image_url} alt={item.book_title || 'Book'} /> : null}</Cover>
                <div>
                  <ItemTitle>{item?.book_title || `Book #${item?.book_id || '-'}`}</ItemTitle>
                  <ItemMeta>Số lượng: {item?.quantity || 0}</ItemMeta>
                </div>
                <Price>{formatMoney(item?.price || 0)}</Price>
              </ItemRow>
            ))}
          </ItemList>
          {returnAllowed && showReturnForm && (
            <ReturnPanel onSubmit={submitReturnRequest}>
              <ReturnTitle>Yêu cầu hoàn trả</ReturnTitle>
              <ReturnGrid>
                <ReturnField>
                  Sản phẩm
                  <ReturnSelect value={returnItemId} onChange={(event) => {
                    const itemId = event.target.value
                    setReturnItemId(itemId)
                    setReturnQuantity(1)
                  }}>
                    <option value="">Chọn sản phẩm</option>
                    {items.map((item, idx) => (
                      <option key={item.id || item.order_item_id || `${order.id}-return-${idx}`} value={item.id || item.order_item_id}>
                        {item.book_title || `Book #${item.book_id || '-'}`}
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
                <ActionBtn type="submit" disabled={returnBusy || uploadingImage}>Gửi return</ActionBtn>
              </ReturnGrid>
              <ReturnField>
                Lý do
                <ReturnTextarea value={returnReason} onChange={(event) => setReturnReason(event.target.value)} />
              </ReturnField>
              <ReturnField style={{ marginTop: '12px' }}>
                Ảnh minh chứng sản phẩm hỏng/lỗi
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelection}
                  disabled={uploadingImage}
                  style={{ marginTop: '6px', fontSize: '13px' }}
                />
                {uploadingImage && <span style={{ fontSize: '12px', color: '#3b82f6', marginTop: '4px' }}>Đang tải ảnh lên...</span>}
                {localFilePreview && (
                  <div style={{ marginTop: '8px' }}>
                    <img
                      src={localFilePreview}
                      alt="Local preview"
                      style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                )}
              </ReturnField>
            </ReturnPanel>
          )}

          {existingReturns.length > 0 && (
            <div style={{ marginTop: '24px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--brand-900)', marginBottom: '12px' }}>
                Yêu cầu hoàn trả đã gửi
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {existingReturns.map((ret) => {
                  const matchedItem = items.find(it => String(it.id || it.order_item_id) === String(ret.order_item_id))
                  return (
                    <div
                      key={ret.id}
                      style={{
                        padding: '16px',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, fontSize: '14px', color: '#1e293b' }}>
                          Sách: {matchedItem?.book_title || `Sản phẩm #${ret.order_item_id}`} (SL: {ret.quantity})
                        </span>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '4px 8px',
                            borderRadius: '12px',
                            backgroundColor:
                              ret.status === 'APPROVED' ? '#dcfce7' : ret.status === 'REJECTED' ? '#fee2e2' : '#fef3c7',
                            color:
                              ret.status === 'APPROVED' ? '#15803d' : ret.status === 'REJECTED' ? '#b91c1c' : '#b45309',
                          }}
                        >
                          {ret.status === 'APPROVED' ? 'Đã duyệt' : ret.status === 'REJECTED' ? 'Từ chối' : 'Chờ xử lý'}
                        </span>
                      </div>
                      <div style={{ fontSize: '13px', color: '#475569' }}>
                        <strong>Lý do:</strong> {ret.reason || '(Không có)'}
                      </div>
                      {ret.refund_amount > 0 && (
                        <div style={{ fontSize: '13px', color: '#16a34a', fontWeight: 700 }}>
                          <strong>Số tiền hoàn lại:</strong> {formatMoney(ret.refund_amount)}
                        </div>
                      )}
                      {ret.image_url && (
                        <div style={{ marginTop: '6px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                            Ảnh minh chứng:
                          </span>
                          <img
                            src={ret.image_url}
                            alt="Proof"
                            style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                          />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <Actions>
            <ActionBtn as={Link} to="/app/orders">Quay lại danh sách</ActionBtn>
            {order?.payment_method === 'VNPAY' &&
              order?.payment_status !== 'SUCCESS' &&
              order?.payment_status !== 'SUCCESS_MANUAL_REVIEW' &&
              status !== 'CANCELLED' && (
                <ActionBtn
                  type="button"
                  disabled={payBusy}
                  onClick={() => void handlePayAgain()}
                  style={{ backgroundColor: 'var(--brand-700)', color: '#fff' }}
                >
                  Thanh toán lại
                </ActionBtn>
            )}
          </Actions>
        </Card>
      )}
    </Wrap>
  )
}
