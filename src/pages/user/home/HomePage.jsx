import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { booksApi } from '../../../api/books'
import { categoriesApi } from '../../../api/categories'
import heroArt from '../../../assets/hero.png'
import { Section, SectionSub, SectionTitle } from '../../../components/Section'
import { ProductCard } from '../../../components/product/ProductCard'
import {
  Stack,
  Hero,
  HeroCopy,
  HeroMedia,
  Kicker,
  HeroActions,
  HeroBtn,
  SectionHead,
  SectionCta,
  HorizontalScrollSection,
  Books,
  SliderViewport,
  SliderTrack,
  CategoryList,
  CategoryChip,
  StateText,
  RetryButton,
  GridModeControl,
  GridModeBtn,
  Pager,
  PagerBtn,
  PagerText,
  SearchShell,
  Search
} from './HomePage.styles'

function asNumber(value, fallback = 0) {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

function getOriginalPrice(book) {
  return asNumber(book?.original_price ?? book?.selling_price ?? book?.price)
}

function getFinalPrice(book) {
  return asNumber(book?.final_price ?? book?.selling_price ?? book?.price)
}

function getDiscountPercent(book) {
  const explicit = asNumber(book?.discount_percent, 0)
  if (explicit > 0) return Math.round(explicit)

  const original = getOriginalPrice(book)
  const amount = asNumber(book?.discount_amount, 0)
  if (original > 0 && amount > 0) return Math.round((amount / original) * 100)

  const final = getFinalPrice(book)
  if (original > final && original > 0) return Math.round(((original - final) / original) * 100)
  return 0
}

function getSalesScore(book) {
  return asNumber(book?.buyer_count ?? book?.quantity_sold ?? book?.sold_quantity ?? book?.total_sold)
}

function fallbackTopDiscounted(rows) {
  return [...rows]
    .filter((book) => book?.has_discount || getDiscountPercent(book) > 0)
    .sort((a, b) => getDiscountPercent(b) - getDiscountPercent(a))
    .slice(0, 8)
}

function fallbackTopSelling(rows) {
  return [...rows]
    .sort((a, b) => {
      const bySales = getSalesScore(b) - getSalesScore(a)
      if (bySales !== 0) return bySales
      const byReviews = asNumber(b?.review_count) - asNumber(a?.review_count)
      if (byReviews !== 0) return byReviews
      return asNumber(b?.view_count) - asNumber(a?.view_count)
    })
    .slice(0, 8)
}

function AutoBookSlider({ books, getBadge, badgeTone }) {
  const viewportRef = useRef(null)
  const indexRef = useRef(0)

  useEffect(() => {
    indexRef.current = 0
    if (books.length <= 1) return undefined

    const timer = window.setInterval(() => {
      const viewport = viewportRef.current
      const firstCard = viewport?.querySelector('a')
      if (!viewport || !firstCard) return

      const track = firstCard.parentElement
      const styles = window.getComputedStyle(track)
      const gap = Number.parseFloat(styles.columnGap || styles.gap || '0') || 0
      const step = firstCard.getBoundingClientRect().width + gap
      const visibleCards = Math.max(1, Math.floor((viewport.clientWidth + gap) / step))
      const maxIndex = Math.max(0, books.length - visibleCards)
      const nextIndex = indexRef.current >= maxIndex ? 0 : indexRef.current + 1
      indexRef.current = nextIndex
      viewport.scrollTo({ left: step * nextIndex, behavior: 'smooth' })
    }, 5000)

    return () => window.clearInterval(timer)
  }, [books.length])

  return (
    <SliderViewport ref={viewportRef}>
      <SliderTrack>
        {books.map((book, index) => (
          <ProductCard
            key={book.id || `${book.title}-slider-${index}`}
            book={book}
            badge={getBadge?.(book)}
            badgeTone={badgeTone}
          />
        ))}
      </SliderTrack>
    </SliderViewport>
  )
}

export function HomePage() {
  const [books, setBooks] = useState([])
  const [discountBooks, setDiscountBooks] = useState([])
  const [bestSellerBooks, setBestSellerBooks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [gridMode, setGridMode] = useState('medium')
  const [page, setPage] = useState(1)
  const pageSize = gridMode === 'medium' ? 25 : 24

  const colsByMode = {
    small: 6,
    medium: 5,
    big: 4,
  }
  const totalPages = Math.max(1, Math.ceil(books.length / pageSize))
  const start = (page - 1) * pageSize
  const currentBooks = books.slice(start, start + pageSize)

  async function load() {
    try {
      setLoading(true)
      setError('')
      const [booksRes, categoriesRootsRes, topDiscountedRes, topSellingRes] = await Promise.all([
        booksApi.list({ size: 60 }),
        categoriesApi.listRoots().catch(() => categoriesApi.list()),
        booksApi.topDiscounted(8).catch(() => []),
        booksApi.topSelling(8).catch(() => []),
      ])
      const allBooks = booksRes?.data || []
      setBooks(allBooks)
      setPage(1)
      setCategories(categoriesRootsRes || [])
      setDiscountBooks(Array.isArray(topDiscountedRes) && topDiscountedRes.length > 0 ? topDiscountedRes : fallbackTopDiscounted(allBooks))
      setBestSellerBooks(Array.isArray(topSellingRes) && topSellingRes.length > 0 ? topSellingRes : fallbackTopSelling(allBooks))
    } catch (e) {
      setError(e.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      void load()
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  return (
    <Stack>
      <Hero>
        <HeroCopy>
          <Kicker>Curated bookstore</Kicker>
          <SectionTitle>Find your next shelf-worthy read.</SectionTitle>
          <SectionSub>
            Browse fresh arrivals, trusted categories, and reader favorites in a quieter bookstore interface built for discovery.
          </SectionSub>
          <HeroActions>
            <HeroBtn to="/app/search" $primary>Search Books</HeroBtn>
            <HeroBtn to="/app/cart">Open Cart</HeroBtn>
          </HeroActions>
        </HeroCopy>
        <HeroMedia aria-hidden="true">
          <img src={heroArt} alt="" />
        </HeroMedia>
      </Hero>

      <Section>
        <SectionHead>
          <SectionTitle>Categories</SectionTitle>
          <SectionCta to="/app/home">See all</SectionCta>
        </SectionHead>
        {loading && <StateText>Loading categories...</StateText>}
        {!loading && error && (
          <>
            <StateText role="alert">Error: {error}</StateText>
            <RetryButton type="button" onClick={() => void load()}>Retry</RetryButton>
          </>
        )}
        {!loading && !error && categories.length === 0 && <StateText>No categories available.</StateText>}
        {!loading && !error && categories.length > 0 && (
          <CategoryList>
            {categories.map((item) => (
              <CategoryChip
                as={Link}
                to="/app/categories"
                key={item.id || item.slug || item.name}
              >
                {item.name}
              </CategoryChip>
            ))}
          </CategoryList>
        )}
      </Section>

      <Section>
        <SectionHead>
          <div>
            <SectionTitle>Giảm giá nhiều</SectionTitle>
            <SectionSub>Sách có ưu đãi cao nhất từ chương trình giảm giá đang hoạt động.</SectionSub>
          </div>
          <SectionCta to="/app/catalog">View catalog</SectionCta>
        </SectionHead>
        {loading && <StateText>Loading deals...</StateText>}
        {!loading && !error && discountBooks.length === 0 && <StateText>No discounted books available.</StateText>}
        {!loading && !error && discountBooks.length > 0 && (
          <AutoBookSlider
            books={discountBooks}
            getBadge={(book) => `-${getDiscountPercent(book)}%`}
            badgeTone="sale"
          />
        )}
      </Section>

      <HorizontalScrollSection>
        <SectionHead>
          <div>
            <SectionTitle>Sách bán chạy</SectionTitle>
            <SectionSub>Ưu tiên theo số người mua, sau đó tới đánh giá và lượt xem.</SectionSub>
          </div>
          <SectionCta to="/app/catalog">View catalog</SectionCta>
        </SectionHead>
        {loading && <StateText>Loading best sellers...</StateText>}
        {!loading && !error && bestSellerBooks.length === 0 && <StateText>No best sellers available.</StateText>}
        {!loading && !error && bestSellerBooks.length > 0 && (
          <AutoBookSlider
            books={bestSellerBooks}
            getBadge={(book) => {
              const sold = getSalesScore(book)
              return sold > 0 ? `${sold} sold` : 'Popular'
            }}
          />
        )}
      </HorizontalScrollSection>

      <Section>
        <SectionHead>
          <SectionTitle>Books</SectionTitle>
          <GridModeControl>
            <GridModeBtn type="button" $active={gridMode === 'small'} onClick={() => setGridMode('small')}>Small</GridModeBtn>
            <GridModeBtn type="button" $active={gridMode === 'medium'} onClick={() => setGridMode('medium')}>Medium</GridModeBtn>
            <GridModeBtn type="button" $active={gridMode === 'big'} onClick={() => setGridMode('big')}>Big</GridModeBtn>
            <SectionCta to="/app/home">View list</SectionCta>
          </GridModeControl>
        </SectionHead>
        {loading && <StateText>Loading books...</StateText>}
        {!loading && error && (
          <>
            <StateText role="alert">Error: {error}</StateText>
            <RetryButton type="button" onClick={() => void load()}>Retry</RetryButton>
          </>
        )}
        {!loading && !error && books.length === 0 && <StateText>No books available.</StateText>}
        {!loading && !error && books.length > 0 && (
          <>
            <Books $cols={colsByMode[gridMode]}>
              {currentBooks.map((book, index) => (
                <ProductCard book={book} key={book.id || `${book.title}-${index}`} />
              ))}
            </Books>
            <Pager>
              <PagerBtn type="button" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</PagerBtn>
              <PagerText>Page {page} / {totalPages}</PagerText>
              <PagerBtn type="button" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</PagerBtn>
            </Pager>
          </>
        )}
      </Section>
    </Stack>
  )
}
