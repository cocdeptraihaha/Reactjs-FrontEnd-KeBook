import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { cartApi } from '../../../api/cart'
import { useAuth } from '../../../auth/auth-store'
import { CartItem } from '../../../components/CartItem'
import { OrderSummary } from '../../../components/OrderSummary'
import { Section, SectionSub, SectionTitle } from '../../../components/Section'
import {
  Stack,
  Layout,
  CartList,
  StateText,
  HeadRow,
  RetryButton,
  LoginCta
} from './CartPage.styles'

function mergeCartData(cartRows, summaryRows) {
  const quantityByBookId = new Map()
  const cartIdByBookId = new Map()

  for (const row of cartRows || []) {
    const key = Number(row?.book_id)
    if (!Number.isFinite(key)) continue
    quantityByBookId.set(key, Number(row?.quantity || 0))
    cartIdByBookId.set(key, row?.id)
  }

  return (summaryRows || []).map((row) => {
    const key = Number(row?.book_id)
    const quantity = quantityByBookId.get(key) ?? Number(row?.quantity || 0)
    return {
      ...row,
      quantity,
      cart_id: cartIdByBookId.get(key) ?? row?.id,
    }
  })
}

export function CartPage() {
  const { isAuthenticated } = useAuth()
  const [items, setItems] = useState([])
  const [selectedIds, setSelectedIds] = useState([])
  const [loading, setLoading] = useState(false)
  const [busyItemId, setBusyItemId] = useState(null)
  const [error, setError] = useState('')

  const loadCart = useCallback(async (silent = false) => {
    if (!isAuthenticated) return
    try {
      if (!silent) setLoading(true)
      setError('')
      const [cartRows, summaryRows] = await Promise.all([cartApi.get(), cartApi.summary()])
      const merged = mergeCartData(cartRows, summaryRows)
      setItems(merged)
      setSelectedIds(prev => {
        if (prev.length === 0) {
          return merged.map(item => item.cart_id).filter(Boolean)
        }
        const currentIds = new Set(merged.map(item => item.cart_id))
        return prev.filter(id => currentIds.has(id))
      })
    } catch (e) {
      setError(e.message || 'Failed to load cart')
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (!isAuthenticated) return
    const timer = setTimeout(() => {
      void loadCart(false)
    }, 0)
    return () => clearTimeout(timer)
  }, [isAuthenticated, loadCart])

  async function updateQuantity(item, nextQty) {
    const cartId = item?.cart_id
    if (!cartId || nextQty < 1) return
    const stock = Number(item?.stock_quantity || 0)
    if (stock > 0 && nextQty > stock) {
      const message = `Chỉ còn ${stock} sản phẩm trong kho.`
      setError(message)
      toast.error('Vượt quá số lượng trong kho', { description: message })
      return
    }

    try {
      setBusyItemId(cartId)
      setError('')
      await cartApi.update(cartId, { quantity: nextQty })
      await loadCart(true)
    } catch (e) {
      const message = e.message || 'Cập nhật số lượng thất bại'
      setError(message)
      toast.error('Thất bại', { description: message })
    } finally {
      setBusyItemId(null)
    }
  }

  async function removeItem(item) {
    const cartId = item?.cart_id
    if (!cartId) return

    try {
      setBusyItemId(cartId)
      setError('')
      await cartApi.remove(cartId)
      await loadCart(true)
    } catch (e) {
      setError(e.message || 'Xóa sản phẩm thất bại')
    } finally {
      setBusyItemId(null)
    }
  }

  function handleToggleSelect(item) {
    const id = item.cart_id
    if (!id) return
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const allSelected = items.length > 0 && selectedIds.length === items.length
  function handleToggleSelectAll() {
    if (allSelected) {
      setSelectedIds([])
    } else {
      setSelectedIds(items.map(item => item.cart_id).filter(Boolean))
    }
  }

  const selectedItems = useMemo(() => {
    return items.filter(item => selectedIds.includes(item.cart_id))
  }, [items, selectedIds])

  const summary = useMemo(() => {
    const subtotal = selectedItems.reduce((acc, item) => acc + Number(item?.price || 0) * Number(item?.quantity || 0), 0)
    const itemCount = selectedItems.reduce((acc, item) => acc + Number(item?.quantity || 0), 0)
    return { subtotal, shipping: 0, tax: 0, itemCount }
  }, [selectedItems])

  return (
    <Stack>
      <Section>
        <HeadRow>
          <div>
            <SectionTitle>Giỏ hàng</SectionTitle>
          </div>
          <RetryButton type="button" onClick={() => void loadCart()} disabled={!isAuthenticated || loading}>Tải lại</RetryButton>
        </HeadRow>
      </Section>

      <Layout>
        <CartList aria-label="Cart items">
          {!isAuthenticated && (
            <>
              <StateText>Vui lòng đăng nhập để xem giỏ hàng.</StateText>
              <LoginCta to="/auth/login">Đăng nhập ngay</LoginCta>
            </>
          )}
          {loading && <StateText>Đang tải giỏ hàng...</StateText>}
          {!loading && error && <StateText role="alert">Lỗi: {error}</StateText>}
          {!loading && !error && isAuthenticated && items.length === 0 && <StateText>Giỏ hàng trống.</StateText>}
          {!loading && !error && isAuthenticated && items.length > 0 && (
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 12px 12px', borderBottom: '1px solid rgba(185,170,150,0.3)', cursor: 'pointer', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
              <input
                type="checkbox"
                checked={allSelected}
                onChange={handleToggleSelectAll}
                style={{ width: '18px', height: '18px', accentColor: 'var(--brand-700)', cursor: 'pointer' }}
              />
              <span>Chọn tất cả ({items.length} sản phẩm)</span>
            </label>
          )}
          {!loading && !error && items.map((item, idx) => (
            <CartItem
              key={item.cart_id || item.id || `item-${idx}`}
              item={item}
              busy={busyItemId === (item.cart_id || item.id)}
              selected={selectedIds.includes(item.cart_id)}
              onToggleSelect={handleToggleSelect}
              onIncrease={(row) => void updateQuantity(row, Number(row.quantity || 0) + 1)}
              onDecrease={(row) => void updateQuantity(row, Number(row.quantity || 0) - 1)}
              onRemove={(row) => void removeItem(row)}
            />
          ))}
        </CartList>
        <OrderSummary
          subtotal={summary.subtotal}
          shipping={summary.shipping}
          tax={summary.tax}
          itemCount={summary.itemCount}
          disabled={!isAuthenticated || selectedItems.length === 0}
          checkoutItems={selectedItems}
        />
      </Layout>
    </Stack>
  )
}
