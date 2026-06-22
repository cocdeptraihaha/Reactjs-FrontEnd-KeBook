import styled from 'styled-components'
import { Link } from 'react-router-dom'

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (min-width: 768px) {
    padding: 24px;
    gap: 32px;
  }
`

export const TopicGrid = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(1, minmax(0, 1fr));

  @media (min-width: 580px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (min-width: 960px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 20px;
  }
`

export const TopicCard = styled.button`
  background: ${(p) => (p.$active ? 'linear-gradient(145deg, var(--brand-900), var(--brand-700))' : 'var(--surface-card)')};
  border: 1px solid ${(p) => (p.$active ? 'var(--brand-700)' : 'rgba(185, 170, 150, 0.4)')};
  color: ${(p) => (p.$active ? '#fffaf0' : 'var(--text-primary)')};
  border-radius: var(--radius-lg);
  padding: 20px;
  text-align: left;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: all 0.25s ease;
  display: flex;
  flex-direction: column;
  gap: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lift);
    border-color: var(--brand-700);
  }

  h3 {
    margin: 0;
    font-size: 1.15rem;
    font-weight: 800;
    color: ${(p) => (p.$active ? '#fffaf0' : 'var(--brand-900)')};
  }

  p {
    margin: 0;
    font-size: 0.85rem;
    color: ${(p) => (p.$active ? 'rgba(255, 250, 240, 0.85)' : 'var(--text-secondary)')};
    line-height: 1.4;
  }
`

export const ActiveHeader = styled.div`
  background: linear-gradient(135deg, #f4ecdf 0%, #fffdf7 100%);
  border: 1px solid rgba(185, 170, 150, 0.4);
  border-radius: var(--radius-lg);
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
`

export const ActiveTitle = styled.h2`
  margin: 0;
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--brand-900);
`

export const BooksContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

// Beautiful Styled Filters UI elements
export const FilterToggleBtn = styled.button`
  padding: 10px 18px;
  border-radius: var(--radius-pill);
  border: 1px solid ${(p) => (p.$active ? 'var(--brand-700)' : 'rgba(185, 170, 150, 0.56)')};
  background-color: ${(p) => (p.$active ? 'rgba(30, 74, 42, 0.08)' : '#fff')};
  color: var(--brand-900);
  cursor: pointer;
  font-weight: 800;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(30, 74, 42, 0.04);
    border-color: var(--brand-700);
  }
`

export const FilterContainer = styled.div`
  background: #fffdf7;
  border: 1px solid rgba(185, 170, 150, 0.4);
  border-radius: var(--radius-lg);
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  box-shadow: var(--shadow-sm);
`

export const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const FilterLabel = styled.label`
  font-size: 0.78rem;
  font-weight: 800;
  color: var(--brand-900);
  text-transform: uppercase;
  letter-spacing: 0.04em;
`

export const FilterInput = styled.input`
  padding: 10px 14px;
  border-radius: var(--radius-md);
  border: 1px solid rgba(185, 170, 150, 0.5);
  background: #fff;
  color: var(--text-primary);
  font-size: 0.85rem;
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: var(--brand-700);
    box-shadow: 0 0 0 3px rgba(30, 74, 42, 0.08);
  }
`

export const FilterSelect = styled.select`
  padding: 10px 14px;
  border-radius: var(--radius-md);
  border: 1px solid rgba(185, 170, 150, 0.5);
  background: #fff;
  color: var(--text-primary);
  font-size: 0.85rem;
  outline: none;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    border-color: var(--brand-700);
    box-shadow: 0 0 0 3px rgba(30, 74, 42, 0.08);
  }
`

export const ClearFilterBtn = styled.button`
  padding: 10px 16px;
  border-radius: var(--radius-md);
  border: 1px solid rgba(185, 170, 150, 0.4);
  background-color: #fff;
  color: var(--text-secondary);
  font-size: 0.85rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  width: 100%;
  height: 40px;
  transition: all 0.2s ease;

  &:hover {
    background-color: #fef2f2;
    color: #dc2626;
    border-color: #fca5a5;
  }
`
