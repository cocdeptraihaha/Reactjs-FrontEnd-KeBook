import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import styled from 'styled-components'
import { AlertTriangle, X, Heart } from 'react-feather'
import { booksApi, pickPrimaryImage } from '../../../api/books'
import { cartApi } from '../../../api/cart'
import { reviewsApi } from '../../../api/reviews'
import { favoritesApi } from '../../../api/favorites'
import { useAuth } from '../../../auth/auth-store'
import { SectionSub, SectionTitle } from '../../../components/Section'
import { ProductCard } from '../../../components/product/ProductCard'
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
  PriceRow,
  CurrentPrice,
  OriginalPrice,
  DiscountBadge,
  StockBadge,
  Actions,
  PrimaryBtn,
  StateText,
  RetryButton,
  ListCard,
  SimilarViewport,
  SimilarGrid,
  SpecsTable,
  SpecsRow,
  SpecLabel,
  SpecValue,
  DescriptionBox,
  RatingSummaryContainer,
  AvgScoreBox,
  AvgScore,
  AvgStars,
  TotalReviewsCount,
  RatingBars,
  RatingRow,
  StarLabel,
  ProgressBarContainer,
  ProgressBar,
  PercentLabel,
  ReviewList,
  ReviewItem,
  ReviewHeader,
  Avatar,
  ReviewMetaInfo,
  ReviewAuthor,
  ReviewStars,
  ReviewDate,
  ReviewContent,
  HeartBtn,
} from './BookDetailPage.styles'

function asNumber(value, fallback = 0) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function formatVnd(value) {
  return `${Number(value || 0).toLocaleString('vi-VN')} đ`
}

function renderStars(rating) {
  const score = Math.round(Number(rating || 0))
  const stars = []
  for (let i = 1; i <= 5; i++) {
    stars.push(i <= score ? '★' : '☆')
  }
  return stars.join('')
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })
  } catch (e) {
    return dateStr
  }
}

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
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const similarViewportRef = useRef(null)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const [detailRes, similarRes, reviewsRes, avgRes, favsRes] = await Promise.all([
        booksApi.detail(id),
        booksApi.similar(id),
        reviewsApi.listByBook(id),
        reviewsApi.averageByBook(id),
        isAuthenticated ? favoritesApi.list().catch(() => []) : Promise.resolve([]),
      ])
      setBook(detailRes?.data || detailRes || null)
      setSimilar(similarRes?.data || similarRes || [])
      setReviews(reviewsRes?.data || reviewsRes || [])
      setAvg(avgRes?.data || avgRes || null)
      const favs = favsRes?.data || favsRes || []
      setIsFavorite(favs.some((f) => Number(f.id) === Number(id) || Number(f.book_id) === Number(id)))
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
      setShowAuthModal(true)
      return
    }

    try {
      setActionError('')
      await cartApi.add({ book_id: Number(id), quantity: 1 })
      toast.success('Đã thêm sản phẩm vào giỏ hàng thành công!')
    } catch (e) {
      const message = e.message || 'Không thể thêm quá số lượng tồn kho'
      setActionError(message)
      toast.error('Vượt quá số lượng tồn kho', { description: message })
    }
  }

  async function handleBuyNow() {
    if (!isAuthenticated) {
      setShowAuthModal(true)
      return
    }

    try {
      setActionError('')
      // Validate stock availability first by making sure we don't violate stock boundaries
      const qty = 1
      if (book?.stock_quantity !== undefined && book.stock_quantity < qty) {
        toast.error('Sản phẩm đã hết hàng hoặc không đủ số lượng tồn kho')
        return
      }

      navigate('/app/checkout', {
        state: {
          buyNowItem: {
            book_id: Number(id),
            title: book?.title || 'Sách',
            price: finalPrice,
            quantity: qty,
          },
        },
      })
    } catch (e) {
      toast.error(e.message || 'Không thể tiến hành mua ngay')
    }
  }

  async function handleToggleFavorite() {
    if (!isAuthenticated) {
      setShowAuthModal(true)
      return
    }

    try {
      if (isFavorite) {
        await favoritesApi.remove(Number(id))
        setIsFavorite(false)
        toast.success('Đã xóa khỏi danh sách yêu thích')
      } else {
        await favoritesApi.add(Number(id))
        setIsFavorite(true)
        toast.success('Đã thêm vào danh sách yêu thích')
      }
    } catch (e) {
      toast.error(e.message || 'Thao tác thất bại')
    }
  }

  const rating = avg?.average || avg?.value || avg?.avg_rate || 0
  const totalReviews = avg?.total_reviews || reviews.length
  const resolvedPrimary = pickPrimaryImage(book)
  const displayImage = selectedImage || resolvedPrimary
  const finalPrice = asNumber(book?.final_price ?? book?.selling_price ?? book?.price)
  const originalPrice = asNumber(book?.original_price ?? book?.selling_price ?? book?.price)
  const showOriginalPrice = originalPrice > finalPrice && finalPrice > 0
  const discountPercent = book?.discount_percent || (showOriginalPrice ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100) : 0)
  const inStock = book?.stock_quantity !== undefined ? book.stock_quantity > 0 : true

  // Compute star distribution percentages
  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  reviews.forEach((r) => {
    const rate = Math.round(Number(r.rate || 0))
    if (rate >= 1 && rate <= 5) {
      ratingCounts[rate]++
    }
  })

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
          <SectionTitle>Chi tiết sách</SectionTitle>
          {loading && <StateText>Đang tải chi tiết...</StateText>}
          {!loading && error && (
            <>
              <StateText role="alert">Lỗi: {error}</StateText>
              <RetryButton type="button" onClick={() => void load()}>Thử lại</RetryButton>
            </>
          )}
          {!loading && !error && !book && <StateText>Không tìm thấy sách.</StateText>}
          {!loading && !error && book && (
            <>
              <BookTitle>{book.title}</BookTitle>
              <Meta style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--brand-900)' }}>
                Tác giả: {book.author || 'Chưa rõ'}
              </Meta>

              <div>
                <StockBadge $inStock={inStock}>
                  {inStock ? `Còn hàng (SL: ${book.stock_quantity ?? 0})` : 'Hết hàng'}
                </StockBadge>
              </div>

              <PriceRow>
                <CurrentPrice>{formatVnd(finalPrice)}</CurrentPrice>
                {showOriginalPrice && (
                  <>
                    <OriginalPrice>{formatVnd(originalPrice)}</OriginalPrice>
                    <DiscountBadge>-{discountPercent}%</DiscountBadge>
                  </>
                )}
              </PriceRow>

              {actionError && <StateText role="alert">Lỗi: {actionError}</StateText>}
              <Actions>
                <PrimaryBtn type="button" onClick={handleAddToCart} disabled={!inStock}>
                  {inStock ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
                </PrimaryBtn>
                <PrimaryBtn
                  type="button"
                  onClick={handleBuyNow}
                  disabled={!inStock}
                  style={{
                    background: 'linear-gradient(140deg, var(--berry-800, #a44861), var(--berry-600, #b25870))',
                    boxShadow: '0 12px 24px rgba(164, 72, 97, 0.18)',
                  }}
                >
                  {inStock ? 'Mua ngay' : 'Hết hàng'}
                </PrimaryBtn>
                <HeartBtn type="button" $active={isFavorite} onClick={handleToggleFavorite} aria-label="Yêu thích">
                  <Heart size={20} />
                </HeartBtn>
              </Actions>
            </>
          )}
        </div>
      </Hero>

      {!loading && book && (
        <>
          <ListCard>
            <SectionTitle>Thông số chi tiết</SectionTitle>
            <SpecsTable>
              <tbody>
                <SpecsRow>
                  <SpecLabel>Nhà xuất bản</SpecLabel>
                  <SpecValue>{book.book_detail?.publisher || 'N/A'}</SpecValue>
                </SpecsRow>
                <SpecsRow>
                  <SpecLabel>Nhà cung cấp</SpecLabel>
                  <SpecValue>{book.book_detail?.supplier || 'N/A'}</SpecValue>
                </SpecsRow>
                <SpecsRow>
                  <SpecLabel>Định dạng</SpecLabel>
                  <SpecValue>{book.format || 'N/A'}</SpecValue>
                </SpecsRow>
                <SpecsRow>
                  <SpecLabel>Số trang</SpecLabel>
                  <SpecValue>{book.pages || book.book_detail?.pages || 'N/A'}</SpecValue>
                </SpecsRow>
                <SpecsRow>
                  <SpecLabel>Kích thước</SpecLabel>
                  <SpecValue>
                    {book.book_detail?.length && book.book_detail?.width
                      ? `${book.book_detail.length} x ${book.book_detail.width}${
                          book.book_detail.height ? ` x ${book.book_detail.height}` : ''
                        } cm`
                      : 'N/A'}
                  </SpecValue>
                </SpecsRow>
                <SpecsRow>
                  <SpecLabel>Trọng lượng</SpecLabel>
                  <SpecValue>{book.book_detail?.weight ? `${book.book_detail.weight} g` : 'N/A'}</SpecValue>
                </SpecsRow>
                <SpecsRow>
                  <SpecLabel>Mã sản phẩm / ISBN</SpecLabel>
                  <SpecValue>{book.code || 'N/A'}</SpecValue>
                </SpecsRow>
                <SpecsRow>
                  <SpecLabel>Phiên bản</SpecLabel>
                  <SpecValue>{book.edition ? `Phiên bản ${book.edition}` : 'N/A'}</SpecValue>
                </SpecsRow>
              </tbody>
            </SpecsTable>
          </ListCard>

          <ListCard>
            <SectionTitle>Mô tả sản phẩm</SectionTitle>
            <DescriptionBox>
              {book.book_detail?.description ? (
                <p>{book.book_detail.description}</p>
              ) : (
                <p>Thông tin mô tả đang được cập nhật.</p>
              )}
            </DescriptionBox>
          </ListCard>
        </>
      )}

      <ListCard>
        <SectionTitle>Sách tương tự</SectionTitle>
        {loading && <StateText>Đang tải sách tương tự...</StateText>}
        {!loading && !error && similar.length === 0 && <StateText>Không có sách tương tự.</StateText>}
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
        <SectionTitle>Đánh giá & Nhận xét</SectionTitle>
        {loading && <StateText>Đang tải đánh giá...</StateText>}
        {!loading && !error && (
          <>
            <RatingSummaryContainer>
              <AvgScoreBox>
                <AvgScore>{Number(rating).toFixed(1)}</AvgScore>
                <AvgStars>{renderStars(rating)}</AvgStars>
                <TotalReviewsCount>{totalReviews} đánh giá</TotalReviewsCount>
              </AvgScoreBox>

              <RatingBars>
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = ratingCounts[star] || 0
                  const percent = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0
                  return (
                    <RatingRow key={star}>
                      <StarLabel>{star} ★</StarLabel>
                      <ProgressBarContainer>
                        <ProgressBar $percentage={percent} />
                      </ProgressBarContainer>
                      <PercentLabel>{percent}%</PercentLabel>
                    </RatingRow>
                  )
                })}
              </RatingBars>
            </RatingSummaryContainer>

            {reviews.length === 0 ? (
              <StateText style={{ textAlign: 'center', padding: '12px 0' }}>
                Chưa có đánh giá nào cho sản phẩm này.
              </StateText>
            ) : (
              <ReviewList>
                {reviews.map((item, index) => {
                  const reviewerName = item.user?.full_name || item.user?.username || 'Khách hàng'
                  const initial = reviewerName.charAt(0).toUpperCase()
                  return (
                    <ReviewItem key={item.id || `${reviewerName}-${index}`}>
                      <ReviewHeader>
                        <Avatar>{initial}</Avatar>
                        <ReviewMetaInfo>
                          <ReviewAuthor>{reviewerName}</ReviewAuthor>
                          <ReviewStars>{renderStars(item.rate || 5)}</ReviewStars>
                        </ReviewMetaInfo>
                        <ReviewDate>{formatDate(item.create_at)}</ReviewDate>
                      </ReviewHeader>
                      <ReviewContent>{item.comment || item.content || 'Đánh giá không có nội dung.'}</ReviewContent>
                    </ReviewItem>
                  )
                })}
              </ReviewList>
            )}
          </>
        )}
      </ListCard>

      {showAuthModal && (
        <AuthModalOverlay onClick={() => setShowAuthModal(false)}>
          <AuthModalCard onClick={(e) => e.stopPropagation()}>
            <AuthModalClose onClick={() => setShowAuthModal(false)}>
              <X size={18} />
            </AuthModalClose>
            <AuthModalIconWrap>
              <AlertTriangle size={36} color="#b4782f" />
            </AuthModalIconWrap>
            <AuthModalTitle>Yêu cầu tài khoản</AuthModalTitle>
            <AuthModalText>
              Vui lòng tạo tài khoản mới hoặc đăng nhập vào hệ thống để mua hàng và trải nghiệm các tính năng đầy đủ của KeBook.
            </AuthModalText>
            <AuthModalActions>
              <AuthModalBtn className="primary" onClick={() => navigate('/auth/register', { state: { from: `/app/book/${id}` } })}>
                Đăng ký ngay
              </AuthModalBtn>
              <AuthModalBtn className="secondary" onClick={() => navigate('/auth/login', { state: { from: `/app/book/${id}` } })}>
                Đăng nhập
              </AuthModalBtn>
            </AuthModalActions>
          </AuthModalCard>
        </AuthModalOverlay>
      )}
    </Wrap>
  )
}

// Styled Components for Auth Requirement Modal
const AuthModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(22, 17, 15, 0.45);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`

const AuthModalCard = styled.div`
  background-color: #ffffff;
  border-radius: var(--radius-lg);
  border: 1px solid rgba(185, 170, 150, 0.3);
  padding: 32px 24px;
  width: 100%;
  max-width: 420px;
  position: relative;
  box-shadow: var(--shadow-card);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  font-family: var(--font-body);
  animation: modalPopIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);

  @keyframes modalPopIn {
    from {
      opacity: 0;
      transform: translateY(12px) scale(0.97);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`

const AuthModalClose = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.15s ease;

  &:hover {
    background-color: #f1f5f9;
    color: var(--text-primary);
  }
`

const AuthModalIconWrap = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: rgba(180, 120, 47, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`

const AuthModalTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 8px;
`

const AuthModalText = styled.p`
  font-size: 0.92rem;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 24px;
`

const AuthModalActions = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
`

const AuthModalBtn = styled.button`
  flex: 1;
  padding: 12px;
  border-radius: var(--radius-pill);
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  border: none;
  transition: all 0.15s ease;

  &.primary {
    background: linear-gradient(140deg, var(--brand-950), var(--brand-700));
    color: #ffffff;
    box-shadow: 0 4px 12px rgba(31, 77, 46, 0.15);

    &:hover {
      opacity: 0.95;
    }
  }

  &.secondary {
    background-color: #f1f5f9;
    color: var(--text-secondary);
    border: 1px solid #cbd5e1;

    &:hover {
      background-color: #e2e8f0;
      color: var(--text-primary);
    }
  }
`
