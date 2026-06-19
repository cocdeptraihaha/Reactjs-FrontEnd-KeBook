import styled from 'styled-components'

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
  background: ${(p) => (p.$active ? 'linear-gradient(135deg, #1e1b4b 0%, #311042 100%)' : 'var(--surface-card)')};
  border: 1px solid ${(p) => (p.$active ? 'var(--brand-700)' : 'rgba(185, 170, 150, 0.4)')};
  color: ${(p) => (p.$active ? '#ffffff' : 'var(--text-primary)')};
  border-radius: var(--radius-lg);
  padding: 20px;
  text-align: left;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease-in-out;
  display: flex;
  flex-direction: column;
  gap: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
    border-color: var(--brand-700);
  }

  h3 {
    margin: 0;
    font-size: 1.15rem;
    font-weight: 800;
    color: ${(p) => (p.$active ? '#f5f3ff' : 'var(--brand-900)')};
  }

  p {
    margin: 0;
    font-size: 0.85rem;
    color: ${(p) => (p.$active ? 'rgba(255, 250, 240, 0.8)' : 'var(--text-secondary)')};
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
