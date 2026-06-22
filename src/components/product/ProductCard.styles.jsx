import { Link } from 'react-router-dom'
import styled from 'styled-components'

export const Card = styled(Link)`
  aspect-ratio: 3 / 4;
  border-radius: var(--radius-md);
  border: 1px solid rgba(185, 170, 150, 0.72);
  background: var(--surface-elevated);
  overflow: hidden;
  box-shadow: var(--shadow-soft);
  display: flex;
  flex-direction: column;
  min-height: 0;
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;

  &:hover,
  &:focus-visible {
    border-color: rgba(180, 120, 47, 0.55);
    box-shadow: var(--shadow-card);
    transform: translateY(-3px);
  }
`

export const Cover = styled.div`
  position: relative;
  width: 100%;
  flex: 0 0 52%;
  background:
    linear-gradient(145deg, rgba(31, 77, 46, 0.14), rgba(164, 72, 97, 0.11)),
    #ece4d6;
  overflow: hidden;
`

export const CoverImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  transition: transform 0.42s ease;

  ${Card}:hover &,
  ${Card}:focus-visible & {
    transform: scale(1.045);
  }
`

export const Badge = styled.span`
  position: absolute;
  top: 9px;
  left: 9px;
  border-radius: var(--radius-pill);
  padding: 5px 8px;
  background: ${(p) => (p.$tone === 'sale' ? 'var(--berry-700)' : 'var(--brand-950)')};
  color: #fffaf0;
  font-size: 0.68rem;
  font-weight: 900;
  letter-spacing: 0.03em;
  box-shadow: 0 8px 18px rgba(15, 24, 18, 0.18);
`

export const Body = styled.div`
  min-height: 0;
  padding: 8px 10px 9px;
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 3px;
`

export const Title = styled.h3`
  margin: 0;
  font-family: var(--font-display);
  font-size: 0.88rem;
  line-height: 1.24;
  font-weight: 800;
  color: var(--text-primary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

export const Meta = styled.p`
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.72rem;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const Rating = styled.p`
  margin: 0;
  font-size: 0.72rem;
  color: #d97706;
  font-weight: 700;
  line-height: 1.2;
  display: flex;
  align-items: center;
  gap: 4px;
`

export const Price = styled.p`
  margin: auto 0 0;
  font-size: 0.86rem;
  font-weight: 800;
  color: var(--berry-700);
  font-variant-numeric: tabular-nums;
  padding-top: 4px;
`
