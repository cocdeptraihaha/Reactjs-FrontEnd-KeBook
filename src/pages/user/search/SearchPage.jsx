import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { List, Grid, Search as SearchIcon, Filter } from 'react-feather'
import { booksApi, pickPrimaryImage } from '../../../api/books'
import { categoriesApi } from '../../../api/categories'
import { ProductCard } from '../../../components/product/ProductCard'
import { StateText, Pager, PagerBtn, PagerText } from '../home/HomePage.styles'
import {
  SearchWrapper,
  TopBanner,
  MainBar,
  InputGroup,
  InputLabel,
  StyledInput,
  QuickHostSelect,
  OptionBlock,
  OptionTitle,
  ButtonContainer,
  FilterButton,
  SearchFooter,
  LayoutToggle,
  InfiniteCheckboxWrapper,
  ResultsGrid,
  BookRowCard,
  RowCover,
  RowDetails,
  RowTitle,
  RowMeta,
  RowDesc,
  RowBadgeList,
  RowBadge,
  PagerContainer
} from './SearchPage.styles'

export function SearchPage() {
  const [keyword, setKeyword] = useState('')
  const [pageRange, setPageRange] = useState('0')
  const [sort, setSort] = useState('')
  const [type, setType] = useState('')
  const [category, setCategory] = useState('')
  const [isList, setIsList] = useState(false)
  const [isInfinite, setIsInfinite] = useState(false)

  const [categories, setCategories] = useState([])
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const pageSize = 12

  // 1. Initial categories list load (fetch all categories)
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        setLoading(true)
        const categoriesRes = await categoriesApi.list()
        setCategories(categoriesRes || [])
      } catch (err) {
        console.error('Meta fetching failed:', err)
      } finally {
        setLoading(false)
      }
    }
    void fetchMeta()
  }, [])

  // 2. Load books based on search parameters
  useEffect(() => {
    let active = true
    const fetchFilteredBooks = async () => {
      try {
        const params = { size: 100 }
        if (keyword.trim()) params.q = keyword.trim()
        if (category) params.category_id = category

        const res = await booksApi.list(params)
        if (active) {
          setBooks(res?.data || [])
          setPage(1)
        }
      } catch (err) {
        console.error('Failed to load search results:', err)
      }
    }
    const timer = setTimeout(() => {
      void fetchFilteredBooks()
    }, 250)
    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [keyword, category])

  // Frontend filters mapping
  const finalFilteredBooks = useMemo(() => {
    return books.filter((book) => {
      // Page range filter
      const pages = Number(book.book_detail?.pages || book.pages || 250)
      if (pageRange === 'under100' && pages >= 100) return false
      if (pageRange === '100to300' && (pages < 100 || pages > 300)) return false
      if (pageRange === '300to500' && (pages < 300 || pages > 500)) return false
      if (pageRange === 'over500' && pages <= 500) return false

      // Format Type
      const detail = book.book_detail || {}
      const text = `${book.title || ''} ${detail.description || ''} ${detail.publisher || ''}`.toLowerCase()
      const isHardcover = text.includes('bìa cứng') || text.includes('hardcover')

      if (type === 'paperback' && isHardcover) return false
      if (type === 'hardcover' && !isHardcover) return false

      return true
    })
  }, [books, pageRange, type])

  // Sorting
  const sortedBooks = useMemo(() => {
    const arr = [...finalFilteredBooks]
    if (sort === 'new') {
      return arr.sort((a, b) => b.id - a.id)
    }
    if (sort === 'update') {
      return arr.reverse()
    }
    if (sort === 'view') {
      return arr.sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
    }
    return arr
  }, [finalFilteredBooks, sort])

  // Pagination bounds
  const totalPages = Math.max(1, Math.ceil(sortedBooks.length / pageSize))
  const displayedBooks = useMemo(() => {
    if (isInfinite) {
      return sortedBooks
    }
    const start = (page - 1) * pageSize
    return sortedBooks.slice(0, start + pageSize)
  }, [sortedBooks, page, isInfinite])

  // Infinite Scroll Hook
  useEffect(() => {
    if (!isInfinite) return
    const handleScroll = () => {
      const scrollPos = window.innerHeight + window.scrollY
      const limit = document.documentElement.scrollHeight - 200
      if (scrollPos >= limit && page < totalPages) {
        setPage(p => p + 1)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isInfinite, page, totalPages])

  return (
    <SearchWrapper>

      <MainBar>
        <InputGroup>
          <InputLabel>Tìm từ khóa:</InputLabel>
          <StyledInput
            placeholder="Tìm trong tên sách, tên tác giả, nhà xuất bản..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </InputGroup>

        <OptionBlock>
          <OptionTitle>Số trang sách:</OptionTitle>
          <ButtonContainer>
            {[
              { id: '0', label: 'Tất cả' },
              { id: 'under100', label: '< 100 trang' },
              { id: '100to300', label: '100 - 300 trang' },
              { id: '300to500', label: '300 - 500 trang' },
              { id: 'over500', label: '> 500 trang' }
            ].map(btn => (
              <FilterButton
                key={btn.id}
                $active={pageRange === btn.id}
                onClick={() => setPageRange(btn.id)}
              >
                {btn.label}
              </FilterButton>
            ))}
          </ButtonContainer>
        </OptionBlock>

        <OptionBlock>
          <OptionTitle>Sắp xếp:</OptionTitle>
          <ButtonContainer>
            {[
              { id: '', label: 'Không sắp xếp' },
              { id: 'new', label: 'Mới nhập kho' },
              { id: 'update', label: 'Mới cập nhật' },
              { id: 'view', label: 'Lượt đọc nhiều' }
            ].map(btn => (
              <FilterButton
                key={btn.id}
                $active={sort === btn.id}
                onClick={() => setSort(btn.id)}
              >
                {btn.label}
              </FilterButton>
            ))}
          </ButtonContainer>
        </OptionBlock>

        <OptionBlock>
          <OptionTitle>Hình thức sách:</OptionTitle>
          <ButtonContainer>
            {[
              { id: '', label: 'Tất cả' },
              { id: 'paperback', label: 'Sách bìa mềm' },
              { id: 'hardcover', label: 'Sách bìa cứng' }
            ].map(btn => (
              <FilterButton
                key={btn.id}
                $active={type === btn.id}
                onClick={() => setType(btn.id)}
              >
                {btn.label}
              </FilterButton>
            ))}
          </ButtonContainer>
        </OptionBlock>

        <OptionBlock>
          <OptionTitle>Thể loại (Danh mục gốc):</OptionTitle>
          <ButtonContainer>
            <FilterButton $active={category === ''} onClick={() => setCategory('')}>
              Tất cả
            </FilterButton>
            {categories.map(cat => (
              <FilterButton
                key={cat.id}
                $active={category === cat.id}
                onClick={() => setCategory(cat.id)}
              >
                {cat.name}
              </FilterButton>
            ))}
          </ButtonContainer>
        </OptionBlock>
      </MainBar>

      <SearchFooter>
        <LayoutToggle onClick={() => setIsList(!isList)}>
          {isList ? <Grid size={16} /> : <List size={16} />}
          <span>{isList ? 'Dạng lưới' : 'Dạng danh sách'}</span>
        </LayoutToggle>

        <InfiniteCheckboxWrapper>
          <input
            type="checkbox"
            checked={isInfinite}
            onChange={(e) => setIsInfinite(e.target.checked)}
          />
          <span>Cuộn vô cực</span>
        </InfiniteCheckboxWrapper>
      </SearchFooter>

      {loading ? (
        <StateText>Đang xử lý kết quả tìm kiếm...</StateText>
      ) : displayedBooks.length === 0 ? (
        <StateText>Không tìm thấy kết quả phù hợp với các bộ lọc.</StateText>
      ) : (
        <>
          <ResultsGrid $isList={isList}>
            {displayedBooks.map((book) => {
              if (!isList) {
                return <ProductCard book={book} key={book.id} />
              }

              const price = Number(book.selling_price || book.price || 0)
              const originalPrice = Number(book.original_price || book.price || 0)
              const hasDiscount = originalPrice > price

              return (
                <BookRowCard key={book.id}>
                  <Link to={`/app/book/${book.id}`}>
                    <RowCover src={pickPrimaryImage(book)} alt={book.title} />
                  </Link>
                  <RowDetails>
                    <div>
                      <Link to={`/app/book/${book.id}`} style={{ textDecoration: 'none' }}>
                        <RowTitle>{book.title}</RowTitle>
                      </Link>
                      <RowMeta>Tác giả: {book.author || 'Đang cập nhật'}</RowMeta>
                      <RowDesc>{book.book_detail?.description || 'Hiện chưa có phần tóm tắt chi tiết cho tác phẩm sách này.'}</RowDesc>
                    </div>
                    <RowBadgeList>
                      {book.category?.name && <RowBadge $type="genre">{book.category.name}</RowBadge>}
                      <RowBadge>{book.book_detail?.pages || 250} trang</RowBadge>
                      <RowBadge>{book.book_detail?.publisher || 'Atelier'}</RowBadge>
                      {hasDiscount && <RowBadge style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}>Giảm giá</RowBadge>}
                    </RowBadgeList>
                  </RowDetails>
                </BookRowCard>
              )
            })}
          </ResultsGrid>

          {!isInfinite && page < totalPages && (
            <PagerContainer>
              <Pager style={{ justifyContent: 'center' }}>
                <PagerBtn onClick={() => setPage(p => p + 1)} style={{ width: '160px', padding: '10px 20px', borderRadius: '20px' }}>
                  Xem thêm
                </PagerBtn>
              </Pager>
            </PagerContainer>
          )}
        </>
      )}
    </SearchWrapper>
  )
}
