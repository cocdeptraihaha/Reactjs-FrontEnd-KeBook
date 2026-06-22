
import { Card, H3, List, Total, CTA } from './OrderSummary.styles'
function formatVnd(value) {
  return `${Number(value || 0).toLocaleString('vi-VN')} đ`
}

export function OrderSummary({ subtotal, shipping, tax, itemCount = 0, disabled = false }) {
  const total = subtotal + shipping + tax

  return (
    <Card>
      <H3>Tổng quan đơn hàng</H3>
      <List>
        <div><dt>Số lượng</dt><dd>{itemCount}</dd></div>
        <div><dt>Tạm tính</dt><dd>{formatVnd(subtotal)}</dd></div>
        <div><dt>Phí vận chuyển</dt><dd>{formatVnd(shipping)}</dd></div>
        <div><dt>Thuế</dt><dd>{formatVnd(tax)}</dd></div>
      </List>
      <Total>
        <span>Tổng thanh toán</span>
        <strong>{formatVnd(total)}</strong>
      </Total>
      <CTA to={disabled ? '/app/cart' : '/app/checkout'} aria-disabled={disabled}>
        {disabled ? 'Giỏ hàng trống' : 'Tiến hành thanh toán'}
      </CTA>
    </Card>
  )
}
