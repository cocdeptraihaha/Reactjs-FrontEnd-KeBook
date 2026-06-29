import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { addressesApi } from '../../../api/addresses'
import { cartApi } from '../../../api/cart'
import { ordersApi } from '../../../api/orders'
import { promotionsApi } from '../../../api/promotions'
import { Section, SectionSub, SectionTitle } from '../../../components/Section'
import { AddressChoice, AddressChoices, AddressName, Badge, Btn, CheckoutGrid, CheckoutPanel, DiscountLine, Input, List, P, PanelTitle, PrimaryCheckoutButton, Row, SpacedAlert, StackedCheckoutPanel, SuccessText, SummaryItem, SummaryLine, Textarea, TotalLine, Wrap } from '../../WorkflowPages.styles'

export function CheckoutPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [items, setItems] = useState([])
  const [addresses, setAddresses] = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState('')
  const [loading, setLoading] = useState(false)
  const [promotion, setPromotion] = useState('')
  const [promoInfo, setPromoInfo] = useState(null)
  const [availablePromos, setAvailablePromos] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('COD')
  const [form, setForm] = useState({
    note: '',
  })

  async function loadCheckout() {
    try {
      setLoading(true)
      const buyNow = location.state?.buyNowItem
      if (buyNow) {
        const addressRows = await addressesApi.mine().catch(() => [])
        setItems([
          {
            book_id: buyNow.book_id,
            title: buyNow.title,
            price: buyNow.price,
            quantity: buyNow.quantity,
            cart_id: 'buynow-1',
          },
        ])
        setAddresses(addressRows || [])
        setSelectedAddressId((current) => {
          if (current) return current
          const defaultAddress = (addressRows || []).find((address) => address?.is_default)
          return String(defaultAddress?.id || addressRows?.[0]?.id || '')
        })

        // Fetch available promotions
        const currentSubtotal = buyNow.price * buyNow.quantity
        if (currentSubtotal > 0) {
          const promos = await promotionsApi.listAvailable(currentSubtotal).catch(() => [])
          setAvailablePromos(promos || [])
        }
      } else {
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

        // Fetch available promotions
        const currentSubtotal = merged.reduce((acc, item) => acc + Number(item?.price || 0) * Number(item?.quantity || 0), 0)
        if (currentSubtotal > 0) {
          const promos = await promotionsApi.listAvailable(currentSubtotal).catch(() => [])
          setAvailablePromos(promos || [])
        }
      }
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
    if (promoInfo.discount_amount !== undefined) {
      return Number(promoInfo.discount_amount || 0)
    }
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
      setLoading(true)
      setError('')
      const buyNow = location.state?.buyNowItem
      const payload = {
        address_id: selectedAddress.id,
        payment_method: paymentMethod,
        ...(form.note.trim() ? { note: form.note.trim() } : {}),
        ...(promotion.trim() ? { promotion_code: promotion.trim() } : {}),
        ...(buyNow ? { items: [{ book_id: Number(buyNow.book_id), quantity: Number(buyNow.quantity) }] } : {}),
      }
      const resp = await ordersApi.checkout(payload)
      if (resp && resp.payment_url) {
        window.location.href = resp.payment_url
      } else {
        setSuccess(true)
      }
    } catch (x) {
      setError(x.message || 'Checkout failed')
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Wrap>
        <Section>
          <SectionTitle>Đặt hàng thành công!</SectionTitle>
          <SectionSub>Cảm ơn bạn đã mua sắm tại KeBook. Chúng tôi đang chuẩn bị đơn hàng cho bạn.</SectionSub>
          <Row>
            <Btn type="button" onClick={() => navigate('/app/orders')}>Xem Đơn Hàng</Btn>
            <Btn type="button" onClick={() => navigate('/app/home')}>Tiếp Tục Mua Sắm</Btn>
          </Row>
        </Section>
      </Wrap>
    )
  }

  return (
    <Wrap>
      <Section>
        <SectionTitle>Thanh toán</SectionTitle>
        <SectionSub>Chọn địa chỉ giao hàng, áp dụng mã giảm giá và xác nhận đơn hàng.</SectionSub>

        {loading && <P>Đang tải sản phẩm...</P>}

        <CheckoutGrid>
          <CheckoutPanel>
            <PanelTitle>Địa chỉ giao hàng</PanelTitle>
            {addresses.length === 0 && (
              <P>Chưa có địa chỉ giao hàng. Hãy thêm địa chỉ mới trong phần Hồ sơ.</P>
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
                          {address.label || 'Nhà riêng'}
                          {address.is_default && <Badge>Mặc định</Badge>}
                        </AddressName>
                        <P>{address.recipient_name || 'Người nhận'}</P>
                        <P>{fullAddress || 'Chưa có chi tiết địa chỉ'}</P>
                        <P>{address.phone_number || 'Chưa có SĐT'}</P>
                      </span>
                    </AddressChoice>
                  )
                })}
              </AddressChoices>
            )}
            <Btn type="button" onClick={() => navigate('/app/profile')}>Quản lý địa chỉ</Btn>
          </CheckoutPanel>

          <CheckoutPanel>
            <PanelTitle>Thông tin đơn hàng</PanelTitle>
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
            {!loading && items.length === 0 && <P>Giỏ hàng trống.</P>}

            <Row>
              <Input
                placeholder="Mã giảm giá"
                value={promotion}
                onChange={(e) => setPromotion(e.target.value)}
              />
              <Btn type="button" onClick={validatePromo} disabled={!promotion.trim() || subtotal <= 0}>Áp dụng</Btn>
            </Row>

            {availablePromos.length > 0 && (
              <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: 'bold', color: '#475569' }}>Mã khuyến mãi khả thi:</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {availablePromos.map((p) => {
                    const discountLabel = p.discount_percent
                      ? `${p.discount_percent}%`
                      : `${Number(p.discount_amount || 0).toLocaleString('vi-VN')}đ`
                    const isApplied = promotion.toUpperCase() === p.code?.toUpperCase()
                    return (
                      <button
                        key={p.id}
                        type="button"
                        style={{
                          padding: '6px 12px',
                          borderRadius: '16px',
                          border: isApplied ? '1px solid #10b981' : '1px solid #cbd5e1',
                          backgroundColor: isApplied ? '#ecfdf5' : '#fff',
                          color: isApplied ? '#047857' : '#1e293b',
                          fontSize: '12px',
                          cursor: 'pointer',
                          fontWeight: isApplied ? 'bold' : 'normal',
                          transition: 'all 0.2s'
                        }}
                        onClick={() => {
                          setPromotion(p.code || '')
                          // Trigger validate immediately
                          const runValidate = async () => {
                            try {
                              setError('')
                              const info = await promotionsApi.validate(p.code, subtotal)
                              setPromoInfo(info)
                            } catch (x) {
                              setError(x.message || 'Mã giảm giá không hợp lệ')
                              setPromoInfo(null)
                            }
                          }
                          void runValidate()
                        }}
                      >
                        {p.code} (-{discountLabel})
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {promoInfo && (
              <SuccessText>
                Đã áp dụng mã: {promoInfo.name || promoInfo.code} (-{discount.toLocaleString('vi-VN')} đ)
              </SuccessText>
            )}

            <SummaryLine>
              <span>Tạm tính</span>
              <span>{subtotal.toLocaleString('vi-VN')} đ</span>
            </SummaryLine>
            {discount > 0 && (
              <DiscountLine>
                <span>Giảm giá</span>
                <span>-{discount.toLocaleString('vi-VN')} đ</span>
              </DiscountLine>
            )}
            <TotalLine>
              <span>Tổng thanh toán</span>
              <strong>{total.toLocaleString('vi-VN')} đ</strong>
            </TotalLine>
          </CheckoutPanel>
        </CheckoutGrid>

        <StackedCheckoutPanel>
          <PanelTitle>Phương thức thanh toán</PanelTitle>
          <P>Chọn hình thức thanh toán thuận tiện nhất cho bạn.</P>
          <div style={{ display: 'flex', gap: '20px', marginTop: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.95rem' }}>
              <input
                type="radio"
                name="payment-method"
                value="COD"
                checked={paymentMethod === 'COD'}
                onChange={() => setPaymentMethod('COD')}
                style={{ cursor: 'pointer' }}
              />
              Thanh toán khi nhận hàng (COD)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.95rem' }}>
              <input
                type="radio"
                name="payment-method"
                value="VNPAY"
                checked={paymentMethod === 'VNPAY'}
                onChange={() => setPaymentMethod('VNPAY')}
                style={{ cursor: 'pointer' }}
              />
              Thanh toán online qua VNPAY
            </label>
          </div>
        </StackedCheckoutPanel>

        <StackedCheckoutPanel>
          <PanelTitle>Ghi chú đơn hàng</PanelTitle>
          <P>Ghi chú thêm cho người bán hoặc shiper (không bắt buộc).</P>
          <Textarea
            placeholder="Lời nhắn cho cửa hàng..."
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
          Xác Nhận & Đặt Hàng
        </PrimaryCheckoutButton>
      </Section>
    </Wrap>
  )
}
