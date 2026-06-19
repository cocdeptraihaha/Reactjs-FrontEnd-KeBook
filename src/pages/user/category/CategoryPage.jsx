import { useEffect, useState, useMemo } from 'react'
import { booksApi } from '../../../api/books'
import { categoriesApi } from '../../../api/categories'
import { Section, SectionSub, SectionTitle } from '../../../components/Section'
import { ProductCard } from '../../../components/product/ProductCard'
import {
  Container,
  TopicGrid,
  TopicCard,
  ActiveHeader,
  ActiveTitle,
  BooksContainer
} from './CategoryPage.styles'
import { Books, StateText, RetryButton, Pager, PagerBtn, PagerText } from '../home/HomePage.styles'

export function CategoryPage() {
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [booksLoading, setBooksLoading] = useState(false)
  const [error, setError] = useState('')
  const [categoryPage, setCategoryPage] = useState(1)
  const categoryPageSize = 6

  // 1. Initial category list fetch
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        setError('')
        const res = await categoriesApi.listRoots().catch(() => categoriesApi.list())
        setCategories(res || [])
        // Default to first category if available
        if (res && res.length > 0) {
          setSelectedCategory(res[0])
        }
      } catch (err) {
        setError(err.message || 'Failed to load categories')
      } finally {
        setLoading(false)
      }
    }
    void fetchCategories()
  }, [])

  // 2. Fetch books dynamically when selectedCategory updates
  useEffect(() => {
    if (!selectedCategory) return
    const fetchBooks = async () => {
      try {
        setBooksLoading(true)
        const res = await booksApi.list({ category_id: selectedCategory.id, size: 40 })
        setBooks(res?.data || [])
      } catch (err) {
        console.error('Failed to load books for category:', err)
      } finally {
        setBooksLoading(false)
      }
    }
    void fetchBooks()
  }, [selectedCategory])

  // Pagination for Category List
  const totalCategoryPages = Math.max(1, Math.ceil(categories.length / categoryPageSize))
  const displayedCategories = useMemo(() => {
    const startIdx = (categoryPage - 1) * categoryPageSize
    return categories.slice(startIdx, startIdx + categoryPageSize)
  }, [categories, categoryPage])

  return (
    <Container>
      <Section>
        <SectionTitle>Danh mục chủ đề</SectionTitle>
        <div style={{ marginBottom: '8px', fontSize: '0.9rem', color: '#64748b' }}>

        </div>

        {loading && <StateText>Đang tải danh sách danh mục...</StateText>}
        {!loading && error && (
          <StateText role="alert">Lỗi: {error}</StateText>
        )}
        {!loading && categories.length === 0 && (
          <StateText>Không tìm thấy danh mục chủ đề nào.</StateText>
        )}
        {!loading && categories.length > 0 && (
          <>
            <TopicGrid>
              {displayedCategories.map((cat) => (
                <TopicCard
                  key={cat.id}
                  $active={selectedCategory?.id === cat.id}
                  onClick={() => setSelectedCategory(cat)}
                >
                  <h3>{cat.name}</h3>
                </TopicCard>
              ))}
            </TopicGrid>

            {totalCategoryPages > 1 && (
              <Pager style={{ marginTop: '20px', justifyContent: 'center' }}>
                <PagerBtn disabled={categoryPage <= 1} onClick={() => setCategoryPage(p => Math.max(1, p - 1))}>
                  Trước
                </PagerBtn>
                <PagerText>
                  Trang {categoryPage} / {totalCategoryPages}
                </PagerText>
                <PagerBtn disabled={categoryPage >= totalCategoryPages} onClick={() => setCategoryPage(p => Math.min(totalCategoryPages, p + 1))}>
                  Tiếp
                </PagerBtn>
              </Pager>
            )}
          </>
        )}
      </Section>

      {selectedCategory && (
        <BooksContainer>
          <ActiveHeader>
            <div>
              <ActiveTitle>{selectedCategory.name}</ActiveTitle>
            </div>
          
          </ActiveHeader>

          {booksLoading ? (
            <StateText>Đang cập nhật danh mục sách...</StateText>
          ) : books.length === 0 ? (
            <StateText>Hiện chưa có sách nào thuộc danh mục này.</StateText>
          ) : (
            <Books $cols={4}>
              {books.map((book) => (
                <ProductCard key={book.id} book={book} />
              ))}
            </Books>
          )}
        </BooksContainer>
      )}
    </Container>
  )
}
