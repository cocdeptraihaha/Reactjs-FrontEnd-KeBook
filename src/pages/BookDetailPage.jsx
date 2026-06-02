import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { booksApi, pickPrimaryImage } from '../api/books'
import { cartApi } from '../api/cart'
import { reviewsApi } from '../api/reviews'
import { useAuth } from '../auth/auth-store'
import { SectionSub, SectionTitle } from '../components/Section'
import { ProductCard } from '../components/product/ProductCard'
import {
  Wrap,
  Hero,
  Cover,
  CoverImg,
  Thumbs,
  Thumb,
  ThumbImg,
  BookTitle,
  Meta,
  Actions,
  PrimaryBtn,
  SecondaryBtn,
  StateText,
  RetryButton,
  ListCard,
  SimilarViewport,
  SimilarGrid,
} from './BookDetailPage.styles'

export function BookDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [book, setBook] = useState(null)
  const [similar, setSimilar] = useState([])
  const [reviews, setReviews] = useState([])
  const [avg, setAvg] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [selectedImage, setSelectedImage] = useState('')
  const similarViewportRef = useRef(null)

  const load = useCallback(async () => {
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
      if (isAuthenticated) {
        void booksApi.recordView(id).catch(() => {})
      }
    } catch (e) {
      setError(e.message || 'Failed to load book data')
    } finally {
      setLoading(false)
    }
  }, [id, isAuthenticated])

  useEffect(() => {
    const timer = setTimeout(() => {
      void load()
    }, 0)
    return () => clearTimeout(timer)
  }, [id, isAuthenticated, load])

  useEffect(() => {
    const viewport = similarViewportRef.current
    if (!viewport || similar.length <= 1) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    let index = 0
    const timer = window.setInterval(() => {
      const firstCard = viewport.querySelector('a')
      if (!firstCard) return

      const track = firstCard.parentElement
      const styles = window.getComputedStyle(track)
      const gap = Number.parseFloat(styles.columnGap || styles.gap || '0') || 0
      const step = firstCard.getBoundingClientRect().width + gap
      const visibleCards = Math.max(1, Math.floor((viewport.clientWidth + gap) / step))
      const maxIndex = Math.max(0, similar.length - visibleCards)
      index = index >= maxIndex ? 0 : index + 1
      viewport.scrollTo({ left: step * index, behavior: 'smooth' })
    }, 5000)

    return () => window.clearInterval(timer)
  }, [similar.length])

  async function handleAddToCart() {
    if (!isAuthenticated) {
      navigate('/auth/login', { state: { from: `/app/book/${id}` } })
      return
    }

    try {
      setActionError('')
      await cartApi.add({ book_id: Number(id), quantity: 1 })
      navigate('/app/cart')
    } catch (e) {
      setActionError(e.message || 'Failed to add to cart')
    }
  }

  const rating = avg?.average || avg?.value || 'N/A'
  const resolvedPrimary = pickPrimaryImage(book)
  const displayImage = selectedImage || resolvedPrimary

  return (
    <Wrap>
      <Hero>
        <div>
          <Cover>
            {displayImage ? <CoverImg src={displayImage} alt={book?.title || 'Book image'} /> : null}
          </Cover>
          {Array.isArray(book?.images) && book.images.length > 0 && (
            <Thumbs>
              {book.images.map((img) => (
                <Thumb key={img.id || img.image_url} type="button" $active={selectedImage === img.image_url} onClick={() => setSelectedImage(img.image_url)}>
                  <ThumbImg src={img.image_url} alt={img.alt_text || 'Book thumbnail'} />
                </Thumb>
              ))}
            </Thumbs>
          )}
        </div>
        <div>
          <SectionTitle>Book Detail</SectionTitle>
          {loading && <StateText>Loading detail...</StateText>}
          {!loading && error && (
            <>
              <StateText role="alert">Error: {error}</StateText>
              <RetryButton type="button" onClick={() => void load()}>Retry</RetryButton>
            </>
          )}
          {!loading && !error && !book && <StateText>Book not found.</StateText>}
          {!loading && !error && book && (
            <>
              <BookTitle>{book.title}</BookTitle>
              <Meta>Author: {book.author || 'Unknown'}</Meta>
              <Meta>Format: {book.format || 'N/A'} | {book.pages || 'N/A'} pages</Meta>
              <Meta>Average rating: {rating}</Meta>
              {actionError && <StateText role="alert">Error: {actionError}</StateText>}
              <Actions>
                <PrimaryBtn type="button" onClick={handleAddToCart}>
                  {isAuthenticated ? 'Add to Cart' : 'Login to Add'}
                </PrimaryBtn>
                <SecondaryBtn to="/app/home">Back to Home</SecondaryBtn>
              </Actions>
            </>
          )}
        </div>
      </Hero>

      <ListCard>
        <SectionTitle>Similar Books</SectionTitle>
        {loading && <StateText>Loading similar books...</StateText>}
        {!loading && !error && similar.length === 0 && <StateText>No similar books.</StateText>}
        {!loading && !error && similar.length > 0 && (
          <SimilarViewport ref={similarViewportRef}>
            <SimilarGrid>
              {similar.map((item, index) => (
                <ProductCard book={item} key={item.id || `${item.title}-${index}`} />
              ))}
            </SimilarGrid>
          </SimilarViewport>
        )}
      </ListCard>

      <ListCard>
        <SectionTitle>Reviews</SectionTitle>
        <SectionSub>Reader notes and highlights.</SectionSub>
        {loading && <StateText>Loading reviews...</StateText>}
        {!loading && !error && reviews.length === 0 && <StateText>No reviews yet.</StateText>}
        {!loading && !error && reviews.length > 0 && (
          <ul>
            {reviews.map((item, index) => (
              <li key={item.id || `${item.user || 'review'}-${index}`}>{item.comment || item.content}</li>
            ))}
          </ul>
        )}
      </ListCard>
    </Wrap>
  )
}
