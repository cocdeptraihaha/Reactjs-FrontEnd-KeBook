import { Link } from 'react-router-dom'
import styled from 'styled-components'

export const Bar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 12px;
`

export const Mini = styled(Link)`
  border: 1px solid rgba(30, 74, 42, 0.16);
  border-radius: var(--radius-pill);
  min-height: 38px;
  padding: 8px 12px;
  font-size: 0.74rem;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--text-secondary);
  transition: 0.22s ease;

  &:hover,
  &:focus-visible {
    background: rgba(30, 74, 42, 0.1);
    color: var(--brand-900);
  }
`

