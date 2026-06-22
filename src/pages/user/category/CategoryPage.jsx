import { useEffect, useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Filter, ChevronUp, ChevronDown } from 'react-feather'
import { booksApi } from '../../../api/books'
import { categoriesApi } from '../../../api/categories'
import { Section, SectionTitle } from '../../../components/Section'
import { ProductCard } from '../../../components/product/ProductCard'
import {
  Container,
  TopicGrid,
  TopicCard,
  ActiveHeader,
  ActiveTitle,
  BooksContainer,
  FilterToggleBtn,
  FilterContainer,
  FilterGroup,
  FilterLabel,
  FilterInput,
  FilterSelect,
  ClearFilterBtn
} from './CategoryPage.styles'
import { Books, StateText, Pager, PagerBtn, PagerText } from '../home/HomePage.styles'

export function CategoryPage() {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [categoryPage, setCategoryPage] = useState(1)
  const categoryPageSize = 6

  // Filters State
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [minRating, setMinRating] = useState('')
  const [publisher, setPublisher] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // 1. Categories List Query
  const { data: categories = [], isLoading: loading, error: categoriesError } = useQuery({
    queryKey: ['user-root-categories'],
    queryFn: () => categoriesApi.listRoots().catch(() => categoriesApi.list()),
    staleTime: 5 * 60_000, // Categories rarely change
  })

  // Set default selected category
  useEffect(() => {
    if (!selectedCategory && categories.length > 0) {
      setSelectedCategory(categories[0])
    }
  }, [categories, selectedCategory])

  // Debounced filters to prevent excessive queries
  const [debouncedParams, setDebouncedParams] = useState({
    min_price: '',
    max_price: '',
    min_rating: '',
    publisher: '',
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedParams({
        min_price: minPrice,
        max_price: maxPrice,
        min_rating: minRating,
        publisher: publisher,
      })
    }, 400)
    return () => clearTimeout(timer)
  }, [minPrice, maxPrice, minRating, publisher])

  // 2. Category Books Query
  const { data: booksResponse, isLoading: booksLoading } = useQuery({
    queryKey: ['category-books', selectedCategory?.id, debouncedParams],
    queryFn: () =>
      booksApi.list({
        category_id: selectedCategory.id,
        size: 40,
        min_price: debouncedParams.min_price || undefined,
        max_price: debouncedParams.max_price || undefined,
        min_rating: debouncedParams.min_rating || undefined,
        publisher: debouncedParams.publisher || undefined,
      }),
    enabled: !!selectedCategory?.id,
    staleTime: 60_000, // Cache category books for 1 minute
  })

  const books = booksResponse?.data || []
  const error = categoriesError?.message || ''

  // Pagination for Category List
  const totalCategoryPages = Math.max(1, Math.ceil(categories.length / categoryPageSize))
  const displayedCategories = useMemo(() => {
    const startIdx = (categoryPage - 1) * categoryPageSize
    return categories.slice(startIdx, startIdx + categoryPageSize)
  }, [categories, categoryPage])

  const clearFilters = () => {
    setMinPrice('')
    setMaxPrice('')
    setMinRating('')
    setPublisher('')
  }

  return (
    <Container>
      <Section>
        <SectionTitle>Danh mục chủ đề</SectionTitle>
        <div style={{ marginBottom: '8px', fontSize: '0.9rem', color: '#64748b' }}></div>

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
        <BooksContainer style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <ActiveHeader>
            <ActiveTitle>{selectedCategory.name}</ActiveTitle>
            <FilterToggleBtn
              type="button"
              $active={isFilterOpen}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Filter size={16} />
              Bộ lọc nâng cao
              {isFilterOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </FilterToggleBtn>
          </ActiveHeader>

          {isFilterOpen && (
            <FilterContainer>
              <FilterGroup>
                <FilterLabel>Giá tối thiểu (đ)</FilterLabel>
                <FilterInput
                  type="number"
                  placeholder="Ví dụ: 50,000"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
              </FilterGroup>

              <FilterGroup>
                <FilterLabel>Giá tối đa (đ)</FilterLabel>
                <FilterInput
                  type="number"
                  placeholder="Ví dụ: 300,000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </FilterGroup>

              <FilterGroup>
                <FilterLabel>Đánh giá tối thiểu</FilterLabel>
                <FilterSelect
                  value={minRating}
                  onChange={(e) => setMinRating(e.target.value)}
                >
                  <option value="">Tất cả</option>
                  <option value="5">⭐⭐⭐⭐★ 5 sao</option>
                  <option value="4">⭐⭐⭐⭐☆ Từ 4 sao</option>
                  <option value="3">⭐⭐⭐☆☆ Từ 3 sao</option>
                  <option value="2">⭐⭐☆☆☆ Từ 2 sao</option>
                </FilterSelect>
              </FilterGroup>

              <FilterGroup>
                <FilterLabel>Nhà xuất bản</FilterLabel>
                <FilterInput
                  type="text"
                  placeholder="Tên nhà xuất bản..."
                  value={publisher}
                  onChange={(e) => setPublisher(e.target.value)}
                />
              </FilterGroup>

              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <ClearFilterBtn type="button" onClick={clearFilters}>
                  Xóa bộ lọc
                </ClearFilterBtn>
              </div>
            </FilterContainer>
          )}

          {booksLoading ? (
            <StateText>Đang cập nhật danh mục sách...</StateText>
          ) : books.length === 0 ? (
            <StateText>Không tìm thấy sách phù hợp với bộ lọc trong danh mục này.</StateText>
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
