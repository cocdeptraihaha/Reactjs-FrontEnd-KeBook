import { useEffect, useMemo, useState } from 'react'
import { booksApi } from '../api/books'
import { categoriesApi } from '../api/categories'
import { Section, SectionSub, SectionTitle } from '../components/Section'
import { ProductCard } from '../components/product/ProductCard'
import {
  Wrap,
  SearchShell,
  Search,
  Grid,
  Books,
  CategoryItem,
  H3,
  P,
  StateText,
  RetryButton
} from './CatalogPage.styles'

export function CatalogPage() {
  const [search, setSearch] = useState('')
  const [books, setBooks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function load() {
    try {
      setLoading(true)
      setError('')
      const [booksRes, categoriesRootsRes] = await Promise.all([
        booksApi.list(),
        categoriesApi.listRoots().catch(() => categoriesApi.list()),
      ])
      setBooks(booksRes?.data || [])
      setCategories(categoriesRootsRes || [])
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

  const filteredBooks = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return books
    return books.filter((book) => `${book.title || ''} ${book.author || ''}`.toLowerCase().includes(term))
  }, [books, search])

  return (
    <Wrap>
      <Section>
        <SectionTitle>Catalog & Search</SectionTitle>
        <SectionSub>Filter by title and author, then jump directly to book detail view.</SectionSub>
        <SearchShell>
          <Search
            placeholder="Search books, authors, keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search books"
          />
        </SearchShell>
      </Section>

      <Section>
        <SectionTitle>Topics</SectionTitle>
        {loading && <StateText>Loading categories...</StateText>}
        {!loading && error && (
          <>
            <StateText role="alert">Error: {error}</StateText>
            <RetryButton type="button" onClick={() => void load()}>Retry</RetryButton>
          </>
        )}
        {!loading && !error && categories.length === 0 && <StateText>No categories available.</StateText>}
        {!loading && !error && categories.length > 0 && (
          <Grid>
            {categories.map((item) => (
              <CategoryItem key={item.id || item.slug || item.name}>
                <H3>{item.name}</H3>
                <P>{item.description || 'Curated category shelf.'}</P>
              </CategoryItem>
            ))}
          </Grid>
        )}
      </Section>

      <Section>
        <SectionTitle>Books</SectionTitle>
        {loading && <StateText>Loading books...</StateText>}
        {!loading && error && (
          <>
            <StateText role="alert">Error: {error}</StateText>
            <RetryButton type="button" onClick={() => void load()}>Retry</RetryButton>
          </>
        )}
        {!loading && !error && filteredBooks.length === 0 && <StateText>No matching books.</StateText>}
        {!loading && !error && filteredBooks.length > 0 && (
          <Books>
            {filteredBooks.map((book, index) => (
              <ProductCard book={book} key={book.id || `${book.title}-${index}`} />
            ))}
          </Books>
        )}
      </Section>
    </Wrap>
  )
}
