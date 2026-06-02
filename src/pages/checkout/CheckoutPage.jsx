import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addressesApi } from '../../api/addresses'
import { cartApi } from '../../api/cart'
import { ordersApi } from '../../api/orders'
import { promotionsApi } from '../../api/promotions'
import { Section, SectionSub, SectionTitle } from '../../components/Section'
import { AddressChoice, AddressChoices, AddressName, Badge, Btn, CheckoutGrid, CheckoutPanel, DiscountLine, Input, List, P, PanelTitle, PrimaryCheckoutButton, Row, SpacedAlert, StackedCheckoutPanel, SuccessText, SummaryItem, SummaryLine, Textarea, TotalLine, Wrap } from '../WorkflowPages.styles'

export function CheckoutPage() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [addresses, setAddresses] = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState('')
  const [loading, setLoading] = useState(false)
  const [promotion, setPromotion] = useState('')
  const [promoInfo, setPromoInfo] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    note: '',
  })

  async function loadCheckout() {
    try {
      setLoading(true)
      const [cartRows, summaryRows, addressRows] = await Promise.all([
        cartApi.get(),
        cartApi.summary(),
        addressesApi.mine().catch(() => []),
      ])
      const quantityByBookId = new Map()
      const cartIdByBookId = new Map()
      for (const row of cartRows || []) {
        const key = Number(row?.book_id)
        if (Number.isFinite(key)) {
          quantityByBookId.set(key, Number(row?.quantity || 0))
          cartIdByBookId.set(key, row?.id)
        }
      }
      const merged = (summaryRows || []).map((row) => {
        const key = Number(row?.book_id)
        return {
          ...row,
          quantity: quantityByBookId.get(key) ?? Number(row?.quantity || 0),
          cart_id: cartIdByBookId.get(key) ?? row?.id,
        }
      })
      setItems(merged)
      setAddresses(addressRows || [])
      setSelectedAddressId((current) => {
        if (current) return current
        const defaultAddress = (addressRows || []).find((address) => address?.is_default)
        return String(defaultAddress?.id || addressRows?.[0]?.id || '')
      })
    } catch (e) {
      setError(e.message || 'Failed to load checkout')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadCheckout()
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => acc + Number(item?.price || 0) * Number(item?.quantity || 0), 0)
  }, [items])

  const discount = useMemo(() => {
    if (!promoInfo) return 0
    if (promoInfo.discount_type === 'PERCENTAGE') {
      return (subtotal * Number(promoInfo.discount_value || 0)) / 100
    }
    return Number(promoInfo.discount_value || 0)
  }, [promoInfo, subtotal])

  const total = useMemo(() => {
    const val = subtotal - discount
    return val < 0 ? 0 : val
  }, [subtotal, discount])

  async function validatePromo() {
    try {
      setError('')
      const info = await promotionsApi.validate(promotion, subtotal)
      setPromoInfo(info)
    } catch (x) {
      setError(x.message || 'Invalid promotion')
      setPromoInfo(null)
    }
  }

  async function checkout() {
    const selectedAddress = addresses.find((address) => String(address.id) === String(selectedAddressId))

    if (!selectedAddress) {
      setError('Choose a saved address before checkout')
      return
    }

    try {
      setError('')
      const payload = {
        address_id: selectedAddress.id,
        ...(form.note.trim() ? { note: form.note.trim() } : {}),
        ...(promotion.trim() ? { promotion_code: promotion.trim() } : {}),
      }
      await ordersApi.checkout(payload)
      setSuccess(true)
    } catch (x) {
      setError(x.message || 'Checkout failed')
    }
  }

  if (success) {
    return (
      <Wrap>
        <Section>
          <SectionTitle>Order Placed Successfully!</SectionTitle>
          <SectionSub>Thank you for your purchase. We are preparing your order.</SectionSub>
          <Row>
            <Btn type="button" onClick={() => navigate('/app/orders')}>View My Orders</Btn>
            <Btn type="button" onClick={() => navigate('/app/home')}>Continue Shopping</Btn>
          </Row>
        </Section>
      </Wrap>
    )
  }

  return (
    <Wrap>
      <Section>
        <SectionTitle>Checkout</SectionTitle>
        <SectionSub>Choose a saved delivery address from your address book, then review promotion and order total.</SectionSub>

        {loading && <P>Loading order items...</P>}

        <CheckoutGrid>
          <CheckoutPanel>
            <PanelTitle>Delivery address</PanelTitle>
            {addresses.length === 0 && (
              <P>No saved address yet. Enter a delivery address manually or add one in Profile.</P>
            )}
            {addresses.length > 0 && (
              <AddressChoices>
                {addresses.map((address) => {
                  const active = String(address.id) === String(selectedAddressId)
                  const fullAddress = [address.address_detail, address.ward, address.province].filter(Boolean).join(', ')
                  return (
                    <AddressChoice key={address.id} $active={active}>
                      <input
                        type="radio"
                        name="checkout-address"
                        checked={active}
                        onChange={() => setSelectedAddressId(String(address.id))}
                      />
                      <span>
                        <AddressName>
                          {address.label || 'Home'}
                          {address.is_default && <Badge>Default</Badge>}
                        </AddressName>
                        <P>{address.recipient_name || 'Recipient'}</P>
                        <P>{fullAddress || 'No address detail'}</P>
                        <P>{address.phone_number || 'No phone number'}</P>
                      </span>
                    </AddressChoice>
                  )
                })}
              </AddressChoices>
            )}
            <Btn type="button" onClick={() => navigate('/app/profile')}>Manage address book</Btn>
          </CheckoutPanel>

          <CheckoutPanel>
            <PanelTitle>Order summary</PanelTitle>
            {!loading && items.length > 0 && (
              <List>
                {items.map((item, idx) => (
                  <SummaryItem key={item.cart_id || idx}>
                    <span>{item.title} (x{item.quantity})</span>
                    <strong>{Number(item.price * item.quantity).toLocaleString('vi-VN')} đ</strong>
                  </SummaryItem>
                ))}
              </List>
            )}
            {!loading && items.length === 0 && <P>Your cart is empty.</P>}

            <Row>
              <Input
                placeholder="Promotion code"
                value={promotion}
                onChange={(e) => setPromotion(e.target.value)}
              />
              <Btn type="button" onClick={validatePromo} disabled={!promotion.trim() || subtotal <= 0}>Apply</Btn>
            </Row>

            {promoInfo && (
              <SuccessText>
                Promotion applied: {promoInfo.name || promoInfo.code} (-{discount.toLocaleString('vi-VN')} đ)
              </SuccessText>
            )}

            <SummaryLine>
              <span>Subtotal</span>
              <span>{subtotal.toLocaleString('vi-VN')} đ</span>
            </SummaryLine>
            {discount > 0 && (
              <DiscountLine>
                <span>Discount</span>
                <span>-{discount.toLocaleString('vi-VN')} đ</span>
              </DiscountLine>
            )}
            <TotalLine>
              <span>Total</span>
              <strong>{total.toLocaleString('vi-VN')} đ</strong>
            </TotalLine>
          </CheckoutPanel>
        </CheckoutGrid>

        <StackedCheckoutPanel>
          <PanelTitle>Delivery note</PanelTitle>
          <P>Optional note for seller or shipper.</P>
          <Textarea
            placeholder="Note for seller"
            value={form.note}
            onChange={(e) => setForm({ note: e.target.value })}
          />
        </StackedCheckoutPanel>

        {error && <SpacedAlert role="alert">{error}</SpacedAlert>}

        <PrimaryCheckoutButton
          type="button"
          onClick={checkout}
          $spaced
          disabled={loading || items.length === 0}
        >
          Confirm & Place Order
        </PrimaryCheckoutButton>
      </Section>
    </Wrap>
  )
}
