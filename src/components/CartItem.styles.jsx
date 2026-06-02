import styled from 'styled-components'

export const Item = styled.article`
  display: grid;
  grid-template-columns: 82px minmax(0, 1fr);
  gap: 12px;
  padding: 12px;
  border: 1px solid rgba(185, 170, 150, 0.58);
  border-radius: var(--radius-md);
  background: rgba(255, 250, 240, 0.72);

  @media (min-width: 760px) {
    grid-template-columns: 96px minmax(0, 1fr);
  }
`

export const Cover = styled.img`
  width: 82px;
  aspect-ratio: 3 / 4;
  border-radius: var(--radius-sm);
  object-fit: cover;
  background: linear-gradient(155deg, #5f7f67, #32463a);

  @media (min-width: 760px) {
    width: 96px;
  }
`

export const Body = styled.div`
  min-width: 0;
  display: grid;
  gap: 6px;
`

export const Head = styled.div`
  display: grid;
  gap: 2px;
`

export const H3 = styled.h3`
  font-family: var(--font-display);
  font-size: 1rem;
  line-height: 1.35;
`

export const Meta = styled.p`
  color: var(--text-secondary);
  font-size: 0.86rem;
`

export const Stock = styled.p`
  color: ${(p) => (p.$low ? '#8f2f3c' : 'var(--text-secondary)')};
  font-size: 0.82rem;
`

export const Row = styled.div`
  margin-top: 2px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`

export const QtyGroup = styled.div`
  display: inline-flex;
  align-items: center;
  border: 1px solid rgba(30, 74, 42, 0.2);
  border-radius: var(--radius-pill);
  overflow: hidden;
`

export const QtyBtn = styled.button`
  border: 0;
  background: #fff;
  width: 36px;
  height: 36px;
  color: var(--brand-900);
  font-weight: 700;
`

export const QtyText = styled.span`
  min-width: 38px;
  text-align: center;
  font-size: 0.9rem;
  color: var(--text-primary);
`

export const PriceBlock = styled.div`
  text-align: right;
`

export const UnitPrice = styled.p`
  color: var(--text-secondary);
  font-size: 0.82rem;
`

export const LinePrice = styled.p`
  font-family: var(--font-display);
  font-size: 1.12rem;
  color: var(--brand-900);
`

export const RemoveBtn = styled.button`
  border: 0;
  background: transparent;
  color: #8f2f3c;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
`

