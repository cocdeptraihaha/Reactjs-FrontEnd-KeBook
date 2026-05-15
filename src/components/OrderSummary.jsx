import styled from 'styled-components'

const Card = styled.aside`
  background: var(--surface-container-low);
  border-radius: 18px;
  padding: 16px;
`

const H3 = styled.h3`
  font-family: var(--font-display);
  font-size: 1.35rem;
`

const List = styled.dl`
  margin: 14px 0 0;
  display: grid;
  gap: 8px;

  > div {
    display: flex;
    justify-content: space-between;
    color: var(--on-surface-variant);
  }

  dd {
    margin: 0;
    color: var(--on-surface);
    font-weight: 700;
  }
`

const Total = styled.div`
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid color-mix(in srgb, var(--outline-variant) 40%, transparent);
  display: flex;
  justify-content: space-between;

  strong {
    font-family: var(--font-display);
    color: var(--primary);
    font-size: 1.6rem;
  }
`

const CTA = styled.button`
  margin-top: 14px;
  width: 100%;
  border: 0;
  border-radius: 999px;
  padding: 12px 14px;
  color: var(--on-primary);
  background: linear-gradient(145deg, var(--primary), var(--primary-container));
  font-weight: 700;
`

export function OrderSummary({ subtotal, shipping, tax }) {
  const total = subtotal + shipping + tax

  return (
    <Card>
      <H3>Order Summary</H3>
      <List>
        <div><dt>Subtotal</dt><dd>${subtotal.toFixed(2)}</dd></div>
        <div><dt>Shipping</dt><dd>${shipping.toFixed(2)}</dd></div>
        <div><dt>Tax</dt><dd>${tax.toFixed(2)}</dd></div>
      </List>
      <Total>
        <span>Total</span>
        <strong>${total.toFixed(2)}</strong>
      </Total>
      <CTA>Checkout</CTA>
    </Card>
  )
}
