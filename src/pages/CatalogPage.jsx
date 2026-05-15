import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { booksApi } from '../api/books'
import { categoriesApi } from '../api/categories'
import { Section, SectionSub, SectionTitle } from '../components/Section'

const Wrap = styled.div`
  display: grid;
  gap: 18px;
`

const Search = styled.input`
  width: 100%;
  border: 0;
  border-radius: 14px;
  padding: 14px;
  font-size: 0.98rem;
  background: var(--surface-container-high);
  color: var(--on-surface);
`

const Grid = styled.div`
  display: grid;
  gap: 14px;

  @media (min-width: 760px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`

const Item = styled.article`
  border-radius: 16px;
  background: var(--surface-container-lowest);
  padding: 14px;
`

const H3 = styled.h3`
  margin: 0;
  font-family: var(--font-display);
`

const P = styled.p`
  margin: 6px 0 0;
  color: var(--on-surface-variant);
`

const StateText = styled.p`
  margin: 0;
  color: var(--on-surface-variant);
`

export function CatalogPage() {
  const [search, setSearch] = useState('')
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

  const filteredBooks = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return books
    return books.filter((book) => `${book.title || ''} ${book.author || ''}`.toLowerCase().includes(term))
  }, [books, search])

  return (
    <Wrap>
      <Section>
        <SectionTitle>Danh mục & Tìm kiếm</SectionTitle>
        <SectionSub>Tìm theo chủ đề, tác giả, bộ sưu tập tuyển chọn.</SectionSub>
        <Search placeholder="Tìm sách, tác giả, từ khóa..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </Section>

      <Section>
        <SectionTitle>Chủ đề</SectionTitle>
        {loading && <StateText>Đang tải danh mục...</StateText>}
        {!loading && error && <StateText>Lỗi: {error}</StateText>}
        {!loading && !error && categories.length === 0 && <StateText>Không có danh mục.</StateText>}
        {!loading && !error && (
          <Grid>
            {categories.map((item) => (
              <Item key={item.id || item.slug || item.name}>
                <H3>{item.name}</H3>
                <P>{item.description || 'Danh mục sách.'}</P>
              </Item>
            ))}
          </Grid>
        )}
      </Section>

      <Section>
        <SectionTitle>Kết quả sách</SectionTitle>
        {loading && <StateText>Đang tải sách...</StateText>}
        {!loading && error && <StateText>Lỗi: {error}</StateText>}
        {!loading && !error && filteredBooks.length === 0 && <StateText>Không có sách phù hợp.</StateText>}
        {!loading && !error && filteredBooks.length > 0 && (
          <Grid>
            {filteredBooks.map((book, index) => (
              <Item key={book.id || `${book.title}-${index}`}>
                <H3>{book.title}</H3>
                <P>{book.author}</P>
              </Item>
            ))}
          </Grid>
        )}
      </Section>
    </Wrap>
  )
}
