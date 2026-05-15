import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { booksApi } from '../api/books'
import { categoriesApi } from '../api/categories'
import { Section, SectionSub, SectionTitle } from '../components/Section'

const Stack = styled.div`
  display: grid;
  gap: 18px;
`

const Hero = styled(Section)`
  display: grid;
  gap: 14px;
  background: linear-gradient(160deg, var(--surface-container-lowest), var(--surface-container-low));
`

const Kicker = styled.p`
  margin: 0;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.13em;
  color: var(--primary);
`

const Books = styled.div`
  display: grid;
  gap: 12px;

  @media (min-width: 760px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`

const Card = styled.article`
  border-radius: 14px;
  overflow: hidden;
  background: var(--surface-container-lowest);
`

const Cover = styled.div`
  aspect-ratio: 3 / 4;
  background: ${props => props.$bg};
`

const Body = styled.div`
  padding: 12px;
`

const Title = styled.h3`
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.05rem;
`

const Meta = styled.p`
  margin: 4px 0 0;
  color: var(--on-surface-variant);
  font-size: 0.9rem;
`

const StateText = styled.p`
  margin: 0;
  color: var(--on-surface-variant);
`

const CategoryList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`

const CategoryChip = styled.span`
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 0.75rem;
  background: var(--surface-container-high);
`

const gradients = [
  'linear-gradient(160deg,#556b5a,#2f4034)',
  'linear-gradient(160deg,#a46f49,#6f4029)',
  'linear-gradient(160deg,#5a6f7b,#2f444f)',
]

export function HomePage() {
  const [books, setBooks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        setError('')
        const [booksRes, categoriesRootsRes] = await Promise.all([
          booksApi.list(),
          categoriesApi.listRoots().catch(() => categoriesApi.list()),
        ])
        setBooks(booksRes?.data || booksRes || [])
        setCategories(categoriesRootsRes?.data || categoriesRootsRes || [])
      } catch (e) {
        setError(e.message || 'Không tải được dữ liệu')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <Stack>
      <Hero>
        <Kicker>Curated Reading</Kicker>
        <SectionTitle>Trang chủ</SectionTitle>
        <SectionSub>Khám phá tuyển tập sách thủ công, giao diện mang cảm giác giấy mộc và nhịp đọc chậm.</SectionSub>
      </Hero>

      <Section>
        <SectionTitle>Danh mục nổi bật</SectionTitle>
        {loading && <StateText>Đang tải danh mục...</StateText>}
        {!loading && error && <StateText>Lỗi: {error}</StateText>}
        {!loading && !error && categories.length === 0 && <StateText>Không có danh mục.</StateText>}
        {!loading && !error && categories.length > 0 && (
          <CategoryList>
            {categories.map((item) => (
              <CategoryChip key={item.id || item.slug || item.name}>{item.name}</CategoryChip>
            ))}
          </CategoryList>
        )}
      </Section>

      <Section>
        <SectionTitle>Featured Shelves</SectionTitle>
        <SectionSub>Bộ sưu tập nổi bật theo gu biên tập viên tuần này.</SectionSub>
        {loading && <StateText>Đang tải sách...</StateText>}
        {!loading && error && <StateText>Lỗi: {error}</StateText>}
        {!loading && !error && books.length === 0 && <StateText>Không có sách.</StateText>}
        {!loading && !error && books.length > 0 && (
          <Books>
            {books.slice(0, 6).map((book, index) => (
              <Card key={book.id || `${book.title}-${index}`}>
                <Cover $bg={gradients[index % gradients.length]} />
                <Body>
                  <Title>{book.title}</Title>
                  <Meta>{book.author}</Meta>
                </Body>
              </Card>
            ))}
          </Books>
        )}
      </Section>
    </Stack>
  )
}
