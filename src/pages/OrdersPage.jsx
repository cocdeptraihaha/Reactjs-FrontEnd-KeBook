import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { cartApi } from '../api/cart'
import { ordersApi } from '../api/orders'
import { returnRequestsApi } from '../api/returnRequests'
import { Section, SectionSub, SectionTitle } from '../components/Section'
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
  if (status !== 'COMPLETED') return false
  const receivedAt = new Date(getReceivedDate(order))
  if (Number.isNaN(receivedAt.getTime())) return false
  const elapsedMs = Date.now() - receivedAt.getTime()
  return elapsedMs >= 0 && elapsedMs <= 14 * 24 * 60 * 60 * 1000
}

export function OrderHistoryPage() {
  const navigate = useNavigate()
  const location = useLocation()
    const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState(null)

  const activeTab = useMemo(() => {
    const queryStatusIn = new URLSearchParams(location.search).get('statusIn')
    return tabKeyFromStatusIn(queryStatusIn)
  }, [location.search])

  const currentStatusIn = useMemo(() => TAB_CONFIG.find((x) => x.key === activeTab)?.statusIn || null, [activeTab])

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const data = await ordersApi.list({ statusIn: currentStatusIn })
      setOrders(data || [])
    } catch (e) {
      setError(e.message || 'Load orders failed')
    } finally {
      setLoading(false)
    }
  }, [currentStatusIn])

  useEffect(() => {
    const timer = setTimeout(() => { void load() }, 0)
    return () => clearTimeout(timer)
  }, [load])

  async function handleCancel(orderId) {
    try {
      setBusyId(orderId)
      await ordersApi.cancel(orderId)
      await load()
    } catch (e) {
      setError(e.message || 'Cancel order failed')
    } finally {
      setBusyId(null)
    }
  }

  async function handleConfirmReceived(orderId) {
    try {
      setBusyId(orderId)
      await ordersApi.confirmReceived(orderId)
      await load()
    } catch (e) {
      setError(e.message || 'Confirm received failed')
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
      setError(e.message || 'Rebuy failed')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <Wrap>
      <Section>
        <SectionTitle>Order History</SectionTitle>
        <SectionSub>Track orders, filter by status, handle quick actions.</SectionSub>
        <Tabs>
          {TAB_CONFIG.map((tab) => (
            <TabBtn key={tab.key} type="button" $active={activeTab === tab.key} onClick={() => { const q = tab.statusIn ? `?statusIn=${encodeURIComponent(tab.statusIn)}` : ""; navigate(`/app/orders${q}`) }}>
              {tab.label}
            </TabBtn>
          ))}
          <ActionBtn type="button" onClick={() => void load()}>Làm mới</ActionBtn>
        </Tabs>
      </Section>

      {loading && <StateText>Đang tải đơn hàng...</StateText>}
      {!loading && error && <AlertText role="alert">{error}</AlertText>}
      {!loading && !error && orders.length === 0 && <StateText>Không có đơn hàng.</StateText>}

      {!loading && !error && orders.length > 0 && (
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
                  {canCancel(status) && (
                    <ActionBtn type="button" disabled={busyId === order.id} onClick={() => void handleCancel(order.id)}>Hủy đơn</ActionBtn>
                  )}
                  {isDelivered(status) && (
                    <ActionBtn type="button" disabled={busyId === order.id} onClick={() => void handleConfirmReceived(order.id)}>Đã nhận hàng</ActionBtn>
                  )}
                  {isTerminalComplete(status) && (
                    <ActionBtn type="button" onClick={() => navigate('/app/profile/write-review')}>Đánh giá</ActionBtn>
                  )}
                  {isTerminalComplete(status) && (
                    <ActionBtn type="button" disabled={busyId === order.id} onClick={() => void handleRebuy(order)}>Mua lại</ActionBtn>
                  )}
                </Actions>
              </Card>
            )
          })}
        </List>
      )}
    </Wrap>
  )
}

export function OrderDetailPage() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [returnItemId, setReturnItemId] = useState('')
  const [returnQuantity, setReturnQuantity] = useState(1)
  const [returnReason, setReturnReason] = useState('')
  const [returnBusy, setReturnBusy] = useState(false)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const data = await ordersApi.detail(id)
      setOrder(data || null)
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
      await returnRequestsApi.create({
        order_id: Number(order.id),
        order_item_id: Number(selectedReturnItem.id || selectedReturnItem.order_item_id),
        quantity: Number(returnQuantity || 1),
        reason: returnReason.trim(),
      })
      setReturnItemId('')
      setReturnQuantity(1)
      setReturnReason('')
      toast.success('Đã gửi yêu cầu hoàn trả')
    } catch (e) {
      toast.error('Gửi yêu cầu hoàn trả thất bại', { description: e.message || 'Vui lòng thử lại' })
    } finally {
      setReturnBusy(false)
    }
  }

  return (
    <Wrap>
      <Section>
        <SectionTitle>Order Detail #{id}</SectionTitle>
        <SectionSub>Detailed items and shipping/payment summary.</SectionSub>
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
          {returnAllowed && (
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
                <ActionBtn type="submit" disabled={returnBusy}>Gửi return</ActionBtn>
              </ReturnGrid>
              <ReturnField>
                Lý do
                <ReturnTextarea value={returnReason} onChange={(event) => setReturnReason(event.target.value)} />
              </ReturnField>
            </ReturnPanel>
          )}
          <Actions>
            <ActionBtn as={Link} to="/app/orders">Quay lại danh sách</ActionBtn>
          </Actions>
        </Card>
      )}
    </Wrap>
  )
}
