import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { booksApi } from '../api/books'
import { reviewsApi } from '../api/reviews'
import { Section, SectionSub, SectionTitle } from '../components/Section'

const Wrap = styled.div`
  display: grid;
  gap: 18px;
`

const Hero = styled(Section)`
  display: grid;
  gap: 16px;

  @media (min-width: 860px) {
    grid-template-columns: 240px minmax(0, 1fr);
  }
`

const Cover = styled.div`
  border-radius: 10px;
  min-height: 320px;
  background: linear-gradient(170deg, #49614f, #2d3f33);
`

const CTA = styled.button`
  border: 0;
  border-radius: 999px;
  padding: 12px 18px;
  color: var(--on-primary);
  background: linear-gradient(140deg, var(--primary), var(--primary-container));
  font-weight: 700;
`

const StateText = styled.p`
  margin: 0;
  color: var(--on-surface-variant);
`

const List = styled.ul`
  margin: 0;
  padding-left: 18px;
  display: grid;
  gap: 6px;
`

export function BookDetailPage() {
  const { id } = useParams()
  const [book, setBook] = useState(null)
  const [similar, setSimilar] = useState([])
  const [reviews, setReviews] = useState([])
  const [avg, setAvg] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        setError('')
        const [detailRes, similarRes, reviewsRes, avgRes] = await Promise.all([
          booksApi.detail(id),
          booksApi.similar(id),
          reviewsApi.listByBook(id),
          reviewsApi.averageByBook(id),
        ])
        setBook(detailRes?.data || detailRes || null)
        setSimilar(similarRes?.data || similarRes || [])
        setReviews(reviewsRes?.data || reviewsRes || [])
        setAvg(avgRes?.data || avgRes || null)
      } catch (e) {
        setError(e.message || 'Không tải được dữ liệu sách')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  return (
    <Wrap>
      <Hero>
        <Cover />
        <div>
          <SectionTitle>Chi tiết Sách</SectionTitle>
          {loading && <StateText>Đang tải chi tiết...</StateText>}
          {!loading && error && <StateText>Lỗi: {error}</StateText>}
          {!loading && !error && !book && <StateText>Không tìm thấy sách.</StateText>}
          {!loading && !error && book && (
            <>
              <SectionSub>{book.title}</SectionSub>
              <p>Tác giả: {book.author}</p>
              <p>Định dạng: {book.format || 'N/A'} • {book.pages || 'N/A'} trang</p>
              <p>Đánh giá trung bình: {avg?.average || avg?.value || 'N/A'}</p>
              <CTA>Thêm vào giỏ</CTA>
            </>
          )}
        </div>
      </Hero>

      <Section>
        <SectionTitle>Sách tương tự</SectionTitle>
        {loading && <StateText>Đang tải sách tương tự...</StateText>}
        {!loading && !error && similar.length === 0 && <StateText>Không có sách tương tự.</StateText>}
        {!loading && !error && similar.length > 0 && (
          <List>
            {similar.map((item, index) => (
              <li key={item.id || `${item.title}-${index}`}>{item.title}</li>
            ))}
          </List>
        )}
      </Section>

      <Section>
        <SectionTitle>Đánh giá</SectionTitle>
        {loading && <StateText>Đang tải đánh giá...</StateText>}
        {!loading && !error && reviews.length === 0 && <StateText>Chưa có đánh giá.</StateText>}
        {!loading && !error && reviews.length > 0 && (
          <List>
            {reviews.map((item, index) => (
              <li key={item.id || `${item.user || 'review'}-${index}`}>{item.comment || item.content}</li>
            ))}
          </List>
        )}
      </Section>
    </Wrap>
  )
}
