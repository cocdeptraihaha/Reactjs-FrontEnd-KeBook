import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ArrowRight } from 'react-feather'
import styled from 'styled-components'
import { favoritesApi } from '../../../api/favorites'
import { ProductCard } from '../../../components/product/ProductCard'
import { Section, SectionTitle } from '../../../components/Section'
import { useAsync } from '../../../hooks/useAsync'
import { Alert, Wrap } from '../../WorkflowPages.styles'

const FavoritesHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  border-bottom: 2px solid rgba(185, 170, 150, 0.2);
  padding-bottom: 12px;

  svg {
    color: var(--brand-700);
    fill: var(--brand-700);
  }
`

const FavoritesGrid = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(2, minmax(0, 1fr));

  @media (min-width: 580px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 18px;
  }

  @media (min-width: 860px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 20px;
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 24px;
  }
`

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 48px 16px;
  background: rgba(255, 250, 240, 0.4);
  border: 1px dashed rgba(185, 170, 150, 0.6);
  border-radius: var(--radius-lg);
  gap: 16px;
`

const EmptyTitle = styled.h3`
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.25rem;
  color: var(--text-primary);
`

const EmptyDesc = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-secondary);
  max-width: 320px;
`

const ExploreBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  padding: 10px 20px;
  border-radius: var(--radius-pill);
  background: linear-gradient(145deg, var(--brand-900), var(--brand-700));
  color: #fffaf0;
  font-size: 0.86rem;
  font-weight: 800;
  transition: 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-lift);
  }
`

const LoadingText = styled.p`
  margin: 24px 0;
  text-align: center;
  color: var(--text-secondary);
  font-weight: 500;
`

export function FavoritesPage() {
  const s = useAsync(() => favoritesApi.list(), [])

  return (
    <Wrap>
      <Section>
        <FavoritesHeader>
          <Heart size={28} />
          <SectionTitle style={{ margin: 0 }}>Danh sách yêu thích</SectionTitle>
        </FavoritesHeader>

        {s.loading && <LoadingText>Đang tải danh sách yêu thích...</LoadingText>}
        {s.error && <Alert role="alert">{s.error}</Alert>}

        {!s.loading && !s.error && (s.data || []).length === 0 && (
          <EmptyState>
            <Heart size={48} style={{ color: 'rgba(185, 170, 150, 0.6)', fill: 'none' }} />
            <EmptyTitle>Danh sách trống</EmptyTitle>
            <EmptyDesc>Bạn chưa lưu cuốn sách yêu thích nào. Hãy khám phá và thêm sách vào đây nhé!</EmptyDesc>
            <ExploreBtn to="/app/search">
              Khám phá ngay <ArrowRight size={16} />
            </ExploreBtn>
          </EmptyState>
        )}

        {!s.loading && !s.error && (s.data || []).length > 0 && (
          <FavoritesGrid>
            {(s.data || []).map((b) => (
              <ProductCard book={b} key={b.id} />
            ))}
          </FavoritesGrid>
        )}
      </Section>
    </Wrap>
  )
}
