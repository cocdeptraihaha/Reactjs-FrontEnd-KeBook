import styled from 'styled-components'

const Item = styled.article`
  display: flex;
  gap: 14px;
  padding-bottom: 16px;
  border-bottom: 1px solid color-mix(in srgb, var(--outline-variant) 34%, transparent);
`

const Cover = styled.img`
  width: 88px;
  aspect-ratio: 3 / 4;
  border-radius: 6px;
  object-fit: cover;
`

const Body = styled.div`
  flex: 1;
`

const Head = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
`

const H3 = styled.h3`
  font-family: var(--font-display);
  font-size: 1.06rem;
`

const Author = styled.p`
  color: var(--on-surface-variant);
  margin-top: 2px;
`

const Chip = styled.span`
  display: inline-block;
  margin-top: 10px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: ${p => (p.$primary ? 'color-mix(in srgb, var(--primary) 15%, transparent)' : 'var(--tertiary-container)')};
  color: ${p => (p.$primary ? 'var(--primary)' : 'var(--on-tertiary-container)')};
`

const Row = styled.div`
  margin-top: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Qty = styled.div`
  border-radius: 999px;
  background: var(--surface-container-high);
  padding: 6px 10px;
  font-size: 0.84rem;
`

const Price = styled.p`
  font-family: var(--font-display);
  font-size: 1.1rem;
  color: var(--primary);
`

export function CartItem({ item }) {
  return (
    <Item>
      <Cover src={item.image} alt={item.title} />
      <Body>
        <Head>
          <div>
            <H3>{item.title}</H3>
            <Author>{item.author}</Author>
          </div>
        </Head>
        <Chip $primary={item.chipTone === 'chip-primary'}>{item.chip}</Chip>
        <Row>
          <Qty>Qty {item.qty}</Qty>
          <Price>${item.price.toFixed(2)}</Price>
        </Row>
      </Body>
    </Item>
  )
}
