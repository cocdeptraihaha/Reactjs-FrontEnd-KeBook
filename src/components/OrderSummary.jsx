
import { Card, H3, List, Total, CTA } from './OrderSummary.styles'
function formatVnd(value) {
  return `${Number(value || 0).toLocaleString('vi-VN')} đ`
}

export function OrderSummary({ subtotal, shipping, tax, itemCount = 0, disabled = false }) {
  const total = subtotal + shipping + tax

  return (
    <Card>
      <H3>Order Summary</H3>
      <List>
        <div><dt>Items</dt><dd>{itemCount}</dd></div>
        <div><dt>Subtotal</dt><dd>{formatVnd(subtotal)}</dd></div>
        <div><dt>Shipping</dt><dd>{formatVnd(shipping)}</dd></div>
        <div><dt>Tax</dt><dd>{formatVnd(tax)}</dd></div>
      </List>
      <Total>
        <span>Total</span>
        <strong>{formatVnd(total)}</strong>
      </Total>
      <CTA to={disabled ? '/app/cart' : '/app/checkout'} aria-disabled={disabled}>
        {disabled ? 'Cart Empty' : 'Proceed Checkout'}
      </CTA>
    </Card>
  )
}
