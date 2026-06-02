import { Link } from 'react-router-dom'
import styled from 'styled-components'

export const Card = styled.aside`
  background:
    linear-gradient(167deg, rgba(255, 250, 240, 0.98), rgba(232, 220, 202, 0.94)),
    linear-gradient(90deg, rgba(31, 77, 46, 0.08), transparent);
  border-radius: var(--radius-lg);
  border: 1px solid rgba(185, 170, 150, 0.78);
  box-shadow: var(--shadow-card);
  padding: 16px;
  position: sticky;
  top: 104px;
`

export const H3 = styled.h3`
  font-family: var(--font-display);
  font-size: 1.28rem;
`

export const List = styled.dl`
  margin: 14px 0 0;
  display: grid;
  gap: 8px;

  > div {
    display: flex;
    justify-content: space-between;
    color: var(--text-secondary);
    font-size: 0.95rem;
  }

  dd {
    margin: 0;
    color: var(--text-primary);
    font-weight: 700;
  }
`

export const Total = styled.div`
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid rgba(84, 79, 69, 0.3);
  display: flex;
  justify-content: space-between;
  align-items: baseline;

  strong {
    font-family: var(--font-display);
    color: var(--brand-900);
    font-size: 1.48rem;
  }
`

export const CTA = styled(Link)`
  margin-top: 14px;
  width: 100%;
  border: 0;
  border-radius: var(--radius-pill);
  min-height: 48px;
  padding: 13px 16px;
  color: #fff;
  background: linear-gradient(145deg, var(--brand-950), var(--brand-700));
  font-weight: 700;
  text-align: center;
  display: block;
  box-shadow: 0 12px 24px rgba(31, 77, 46, 0.18);
`

