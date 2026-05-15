import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { cartApi } from '../api/cart'
import { CartItem } from '../components/CartItem'
import { OrderSummary } from '../components/OrderSummary'
import { Section, SectionSub, SectionTitle } from '../components/Section'
import { TopBar } from '../components/TopBar'

const Stack = styled.div`
  display: grid;
  gap: 18px;
`

const Layout = styled.div`
  display: grid;
  gap: 18px;

  @media (min-width: 980px) {
    grid-template-columns: minmax(0, 1fr) 340px;
    align-items: start;
  }
`

const CartList = styled.section`
  background: var(--surface-container-low);
  border-radius: 20px;
  padding: 16px;
  display: grid;
  gap: 14px;
`

const StateText = styled.p`
  margin: 0;
  color: var(--on-surface-variant);
`

const Actions = styled.div`
  display: flex;
  gap: 8px;
`

const Button = styled.button`
  border: 0;
  border-radius: 999px;
  padding: 10px 14px;
  background: var(--surface-container-high);
`

export function CartPage() {
  const [items, setItems] = useState([])
  const [summary, setSummary] = useState({ subtotal: 0, shipping: 0, tax: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadCart() {
    try {
      setLoading(true)
      setError('')
      const [cartRes, summaryRes] = await Promise.all([cartApi.get(), cartApi.summary()])
      setItems(cartRes?.data?.items || cartRes?.items || cartRes?.data || cartRes || [])
      const sum = summaryRes?.data || summaryRes || {}
      setSummary({
        subtotal: Number(sum.subtotal || 0),
        shipping: Number(sum.shipping || 0),
        tax: Number(sum.tax || 0),
      })
    } catch (e) {
      setError(e.message || 'Không tải được giỏ hàng')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadCart()
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  async function handleAdd() {
    await cartApi.add({ book_id: 1, qty: 1 })
    await loadCart()
  }

  async function handleUpdate() {
    if (!items[0]?.id) return
    await cartApi.update(items[0].id, { qty: (items[0].qty || 1) + 1 })
    await loadCart()
  }

  async function handleDelete() {
    if (!items[0]?.id) return
    await cartApi.remove(items[0].id)
    await loadCart()
  }

  return (
    <Stack>
      <Section>
        <TopBar />
        <SectionTitle>Giỏ hàng</SectionTitle>
        <SectionSub>Chọn sách yêu thích, kiểm tra tổng chi phí trước khi thanh toán.</SectionSub>
        <Actions>
          <Button onClick={handleAdd}>Add</Button>
          <Button onClick={handleUpdate}>Update</Button>
          <Button onClick={handleDelete}>Delete</Button>
        </Actions>
      </Section>

      <Layout>
        <CartList aria-label="Cart items">
          {loading && <StateText>Đang tải giỏ hàng...</StateText>}
          {!loading && error && <StateText>Lỗi: {error}</StateText>}
          {!loading && !error && items.length === 0 && <StateText>Giỏ hàng trống.</StateText>}
          {!loading && !error && items.map((item) => <CartItem key={item.id} item={item} />)}
        </CartList>
        <OrderSummary subtotal={summary.subtotal} shipping={summary.shipping} tax={summary.tax} />
      </Layout>
    </Stack>
  )
}
