import { useEffect, useState, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ordersApi } from '../../../api/orders'
import { Section, SectionSub, SectionTitle } from '../../../components/Section'
import { Alert, Btn, Row, SuccessText, Wrap } from '../../WorkflowPages.styles'

export function VNPayCallbackPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [polling, setPolling] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [orderId, setOrderId] = useState('')
  const calledCallback = useRef(false)
  const pollingInterval = useRef(null)
  const pollingTimeout = useRef(null)

  useEffect(() => {
    async function processCallback() {
      if (calledCallback.current) return
      calledCallback.current = true

      const params = Object.fromEntries(searchParams.entries())
      const responseCode = params.vnp_ResponseCode
      const txnRef = params.vnp_TxnRef

      let resolvedOrderId = ''
      if (txnRef) {
        resolvedOrderId = txnRef.includes('_') ? txnRef.split('_')[0] : txnRef
        setOrderId(resolvedOrderId)
      }

      try {
        setLoading(true)
        setError('')

        // Trigger backend verification and status sync
        const res = await ordersApi.vnpayCallback(params)

        if (responseCode === '00') {
          if (res?.status === 'SUCCESS') {
            setSuccess(true)
            setLoading(false)
          } else {
            // Case 2 & 6: Polling status. Gate reports SUCCESS, but Backend hasn't completed Webhook yet
            setPolling(true)
            setLoading(false)
            startPolling(resolvedOrderId)
          }
        } else {
          let msg = 'Thanh toán thất bại.'
          if (responseCode === '24') {
            msg = 'Giao dịch không thành công do khách hàng hủy giao dịch.'
          } else if (responseCode === '11') {
            msg = 'Giao dịch không thành công do hết hạn chờ thanh toán.'
          } else if (params.vnp_Message) {
            msg = params.vnp_Message
          }
          setError(msg)
          setLoading(false)
        }
      } catch (err) {
        // If API fails but gate reported success, still poll to check if webhook succeeded in background
        if (responseCode === '00' && resolvedOrderId) {
          setPolling(true)
          setLoading(false)
          startPolling(resolvedOrderId)
        } else {
          setError(err.message || 'Lỗi khi đồng bộ trạng thái thanh toán VNPay.')
          setLoading(false)
        }
      }
    }

    void processCallback()

    return () => {
      if (pollingInterval.current) clearInterval(pollingInterval.current)
      if (pollingTimeout.current) clearTimeout(pollingTimeout.current)
    }
  }, [searchParams])

  // Polling logic: Check order status every 3s, timeout after 30s
  function startPolling(id) {
    let attempts = 0
    const maxAttempts = 10

    pollingInterval.current = setInterval(async () => {
      attempts++
      try {
        const order = await ordersApi.detail(id)
        const status = String(order?.status || '').replace('OrderStatus.', '').trim().toUpperCase()

        if (status === 'CONFIRMED' || status === 'SHIPPED' || status === 'DELIVERED' || status === 'COMPLETED') {
          setSuccess(true)
          setPolling(false)
          clearInterval(pollingInterval.current)
          if (pollingTimeout.current) clearTimeout(pollingTimeout.current)
        }
      } catch (err) {
        console.error('Lỗi khi kiểm tra trạng thái đơn hàng:', err)
      }

      if (attempts >= maxAttempts) {
        // Timeout reached: Gateway reported SUCCESS, but Webhook didn't reach DB yet
        setError('Chúng tôi đang xác thực giao dịch của bạn. Quá trình này có thể mất vài phút. Vui lòng kiểm tra Lịch sử đơn hàng sau.')
        setPolling(false)
        clearInterval(pollingInterval.current)
      }
    }, 3000)
  }

  if (loading) {
    return (
      <Wrap>
        <Section>
          <SectionTitle>Đang xử lý thanh toán...</SectionTitle>
          <SectionSub>Vui lòng đợi giây lát, chúng tôi đang xác thực giao dịch với cổng thanh toán VNPay.</SectionSub>
        </Section>
      </Wrap>
    )
  }

  if (polling) {
    return (
      <Wrap>
        <Section>
          <SectionTitle>Đang xác nhận giao dịch...</SectionTitle>
          <SectionSub>Giao dịch của bạn đã hoàn tất trên cổng thanh toán. Hệ thống đang đồng bộ hóa trạng thái đơn hàng #{orderId}.</SectionSub>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
            <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid rgba(30,74,42,0.1)', borderTop: '4px solid var(--brand-700)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          </div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </Section>
      </Wrap>
    )
  }

  if (success) {
    return (
      <Wrap>
        <Section>
          <SectionTitle>Thanh toán thành công!</SectionTitle>
          <SectionSub>Giao dịch cho đơn hàng #{orderId} đã hoàn tất thành công qua cổng thanh toán VNPay.</SectionSub>
          <SuccessText style={{ fontSize: '15px', fontWeight: 'bold', margin: '20px 0' }}>
            ✓ Đơn hàng của bạn đã được xác nhận và đang chờ chuẩn bị giao.
          </SuccessText>
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
        <SectionTitle>Kết quả thanh toán</SectionTitle>
        <SectionSub>Có lỗi xảy ra hoặc trạng thái giao dịch chưa được xác nhận hoàn tất.</SectionSub>

        {error && <Alert role="alert" style={{ margin: '20px 0' }}>{error}</Alert>}

        <Row>
          <Btn type="button" onClick={() => navigate('/app/orders')}>Xem Đơn Hàng Của Tôi</Btn>
          <Btn type="button" onClick={() => navigate('/app/home')}>Quay Lại Trang Chủ</Btn>
        </Row>
      </Section>
    </Wrap>
  )
}

export default VNPayCallbackPage
