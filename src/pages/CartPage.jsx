import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { cartApi } from '../api/cart'
import { useAuth } from '../auth/auth-store'
import { CartItem } from '../components/CartItem'
import { OrderSummary } from '../components/OrderSummary'
import { Section, SectionSub, SectionTitle } from '../components/Section'
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
  const [loading, setLoading] = useState(false)
  const [busyItemId, setBusyItemId] = useState(null)
  const [error, setError] = useState('')

  const loadCart = useCallback(async () => {
    if (!isAuthenticated) return
    try {
      setLoading(true)
      setError('')
      const [cartRows, summaryRows] = await Promise.all([cartApi.get(), cartApi.summary()])
      setItems(mergeCartData(cartRows, summaryRows))
    } catch (e) {
      setError(e.message || 'Failed to load cart')
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (!isAuthenticated) return
    const timer = setTimeout(() => {
      void loadCart()
    }, 0)
    return () => clearTimeout(timer)
  }, [isAuthenticated, loadCart])

  async function updateQuantity(item, nextQty) {
    const cartId = item?.cart_id
    if (!cartId || nextQty < 1) return
    const stock = Number(item?.stock_quantity || 0)
    if (stock > 0 && nextQty > stock) {
      const message = `Only ${stock} item${stock === 1 ? '' : 's'} available in stock.`
      setError(message)
      toast.error('Stock limit reached', { description: message })
      return
    }

    try {
      setBusyItemId(cartId)
      setError('')
      await cartApi.update(cartId, { quantity: nextQty })
      await loadCart()
    } catch (e) {
      const message = e.message || 'Failed to update quantity'
      setError(message)
      toast.error('Cart update failed', { description: message })
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
      await loadCart()
    } catch (e) {
      setError(e.message || 'Failed to remove item')
    } finally {
      setBusyItemId(null)
    }
  }

  const summary = useMemo(() => {
    const subtotal = items.reduce((acc, item) => acc + Number(item?.price || 0) * Number(item?.quantity || 0), 0)
    const itemCount = items.reduce((acc, item) => acc + Number(item?.quantity || 0), 0)
    return { subtotal, shipping: 0, tax: 0, itemCount }
  }, [items])

  return (
    <Stack>
      <Section>
        <HeadRow>
          <div>
            <SectionTitle>Cart</SectionTitle>
            <SectionSub>Mapped from `/cart` + `/cart/summary` contracts, with exact stock and price lines.</SectionSub>
          </div>
          <RetryButton type="button" onClick={() => void loadCart()} disabled={!isAuthenticated || loading}>Refresh</RetryButton>
        </HeadRow>
      </Section>

      <Layout>
        <CartList aria-label="Cart items">
          {!isAuthenticated && (
            <>
              <StateText>Please login to manage cart.</StateText>
              <LoginCta to="/auth/login">Login Required</LoginCta>
            </>
          )}
          {loading && <StateText>Loading cart...</StateText>}
          {!loading && error && <StateText role="alert">Error: {error}</StateText>}
          {!loading && !error && isAuthenticated && items.length === 0 && <StateText>Cart is empty.</StateText>}
          {!loading && !error && items.map((item, idx) => (
            <CartItem
              key={item.cart_id || item.id || `item-${idx}`}
              item={item}
              busy={busyItemId === (item.cart_id || item.id)}
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
          disabled={!isAuthenticated || items.length === 0}
        />
      </Layout>
    </Stack>
  )
}
