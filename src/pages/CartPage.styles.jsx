import styled from 'styled-components'
import { Link } from 'react-router-dom'

export const Stack = styled.div`
  display: grid;
  gap: 16px;

  @media (min-width: 1200px) {
    gap: 20px;
  }
`

export const Layout = styled.div`
  display: grid;
  gap: 12px;

  @media (min-width: 980px) {
    grid-template-columns: minmax(0, 1fr) 360px;
    align-items: start;
  }

  @media (min-width: 1320px) {
    grid-template-columns: minmax(0, 1fr) 400px;
    gap: 16px;
  }
`

export const CartList = styled.section`
  background: rgba(255, 250, 240, 0.5);
  border: 1px solid rgba(185, 170, 150, 0.72);
  box-shadow: var(--shadow-soft);
  border-radius: var(--radius-lg);
  padding: 12px;
  display: grid;
  gap: 12px;

  @media (min-width: 760px) {
    padding: 16px;
  }
`

export const StateText = styled.p`
  color: var(--text-secondary);
`

export const HeadRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`

export const RetryButton = styled.button`
  border: 1px solid rgba(30, 74, 42, 0.2);
  border-radius: var(--radius-pill);
  min-height: 42px;
  padding: 8px 13px;
  font-size: 0.82rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 700;
  color: var(--brand-900);
  background: rgba(255, 255, 255, 0.9);
`

export const LoginCta = styled(Link)`
  border: 1px solid rgba(30, 74, 42, 0.2);
  border-radius: var(--radius-pill);
  min-height: 42px;
  padding: 8px 13px;
  font-size: 0.84rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 700;
  color: var(--brand-900);
  background: rgba(255, 255, 255, 0.74);
`
