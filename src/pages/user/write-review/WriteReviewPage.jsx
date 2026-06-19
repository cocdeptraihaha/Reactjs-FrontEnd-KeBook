import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { toast } from 'sonner'
import { reviewsApi } from '../../../api/reviews'
import { Section, SectionTitle, SectionSub } from '../../../components/Section'
import { Alert, Btn, Input, P, Textarea, Wrap } from '../../WorkflowPages.styles'

const ReviewContainer = styled.div`
  background: #fff;
  border-radius: var(--radius-md, 12px);
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(185, 170, 150, 0.2);
  margin-top: 14px;
`

const BookSelectorGrid = styled.div`
  display: grid;
  gap: 12px;
  margin-top: 14px;
`

const BookSelectorCard = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 16px;
  border-radius: 8px;
  border: 2px solid ${(p) => (p.$selected ? 'var(--brand-900)' : 'rgba(0,0,0,0.06)')};
  background: ${(p) => (p.$selected ? '#fcf9f4' : '#fff')};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--brand-700);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  }
`

const SelectorBookCover = styled.img`
  width: 48px;
  height: 64px;
  object-fit: cover;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
`

const SelectorBookInfo = styled.div`
  flex: 1;
`

const SelectorBookTitle = styled.h4`
  margin: 0 0 4px 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-primary, #2c3e50);
`

const StarRatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 16px 0;
`

const StarButton = styled.button`
  background: none;
  border: none;
  font-size: 2.5rem;
  color: ${(p) => (p.$active ? '#f1c40f' : 'rgba(0, 0, 0, 0.12)')};
  cursor: pointer;
  padding: 0;
  line-height: 1;
  transition: transform 0.12s ease;

  &:hover {
    transform: scale(1.15);
  }
`

const RatingLabel = styled.span`
  font-size: 1rem;
  font-weight: 700;
  color: var(--brand-900);
  margin-left: 12px;
`

const ReviewFormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;
`

const FormLabel = styled.label`
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--text-secondary);
`

const ActionButtonsRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`

const SubmitBtn = styled.button`
  background: linear-gradient(140deg, var(--brand-950), var(--brand-700));
  color: white;
  border: none;
  font-weight: 700;
  font-size: 0.95rem;
  padding: 12px 24px;
  border-radius: var(--radius-pill);
  cursor: pointer;
  box-shadow: 0 8px 16px rgba(31, 77, 46, 0.15);
  transition: opacity 0.2s;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const BackBtn = styled.button`
  background: white;
  color: var(--brand-900);
  border: 1px solid rgba(31, 77, 46, 0.25);
  font-weight: 700;
  font-size: 0.95rem;
  padding: 12px 24px;
  border-radius: var(--radius-pill);
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #faf7f2;
  }
`

const SuccessBox = styled.div`
  text-align: center;
  padding: 32px 16px;
`

const SuccessIcon = styled.div`
  font-size: 3.5rem;
  color: #2ecc71;
  margin-bottom: 16px;
`

const STAR_LABELS = {
  1: 'Rất không hài lòng',
  2: 'Không hài lòng',
  3: 'Bình thường',
  4: 'Hài lòng',
  5: 'Cực kỳ hài lòng',
}

export function WriteReviewPage() {
  const location = useLocation()
  const navigate = useNavigate()

  // Passed items from OrdersPage: { orderId, items }
  const stateItems = location.state?.items || []
  const orderId = location.state?.orderId

  const [selectedBook, setSelectedBook] = useState(null)
  const [form, setForm] = useState({ book_id: '', rate: 5, content: '' })
  const [existingReview, setExistingReview] = useState(null)
  const [loadingReview, setLoadingReview] = useState(false)
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Auto-select if there is exactly 1 item
  useEffect(() => {
    if (stateItems.length === 1) {
      setSelectedBook(stateItems[0])
    }
  }, [stateItems])

  // Fetch existing review on book selection or manual book ID change
  useEffect(() => {
    const bookId = selectedBook?.book_id || form.book_id
    if (!bookId) {
      setExistingReview(null)
      return
    }

    let active = true
    async function fetchPreviousReview() {
      try {
        setLoadingReview(true)
        setError('')
        const prev = await reviewsApi.getMyReviewByBook(Number(bookId))
        if (!active) return
        if (prev) {
          setExistingReview(prev)
          setForm((prevForm) => ({ ...prevForm, rate: prev.rate || 5, content: prev.content || '' }))
        } else {
          setExistingReview(null)
          setForm((prevForm) => ({ ...prevForm, rate: 5, content: '' }))
        }
      } catch (err) {
        // Silent error or fallback
      } finally {
        if (active) setLoadingReview(false)
      }
    }
    void fetchPreviousReview()
    return () => {
      active = false
    }
  }, [selectedBook?.book_id, form.book_id])

  async function handleBookSelect(item) {
    setSelectedBook(item)
    setMsg('')
    setError('')
  }

  async function submit() {
    const bookId = selectedBook?.book_id || form.book_id
    if (!bookId) {
      toast.error('Vui lòng chọn hoặc nhập mã sách cần đánh giá')
      return
    }
    if (!form.content.trim()) {
      toast.error('Vui lòng nhập nội dung đánh giá')
      return
    }

    try {
      setSubmitting(true)
      setError('')

      if (existingReview) {
        await reviewsApi.update(existingReview.id, {
          rate: Number(form.rate),
          content: form.content.trim(),
        })
        toast.success('Cập nhật đánh giá thành công!')
        setMsg('Đánh giá của bạn đã được cập nhật thành công. Cảm ơn bạn đã phản hồi!')
      } else {
        await reviewsApi.create({
          book_id: Number(bookId),
          rate: Number(form.rate),
          content: form.content.trim(),
        })
        toast.success('Đánh giá sản phẩm thành công!')
        setMsg('Đánh giá của bạn đã được gửi thành công. Cảm ơn bạn đã phản hồi!')
      }
    } catch (x) {
      const errMsg = x.message || 'Gửi đánh giá thất bại. Vui lòng thử lại.'
      setError(errMsg)
      toast.error(errMsg)
    } finally {
      setSubmitting(false)
    }
  }

  const hasMultipleItems = stateItems.length > 1

  return (
    <Wrap>
      <Section>
        <SectionTitle>{existingReview ? 'Chỉnh sửa đánh giá' : 'Đánh giá sản phẩm'}</SectionTitle>
        {orderId && <SectionSub>Đơn hàng #{orderId}</SectionSub>}

        {msg ? (
          <ReviewContainer>
            <SuccessBox>
              <SuccessIcon>✓</SuccessIcon>
              <P style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--brand-900)', marginBottom: '16px' }}>
                {msg}
              </P>
              <ActionButtonsRow style={{ justifyContent: 'center' }}>
                <BackBtn type="button" onClick={() => navigate(-1)}>
                  Quay lại đơn hàng
                </BackBtn>
                {(selectedBook?.book_id || form.book_id) && (
                  <SubmitBtn type="button" onClick={() => navigate(`/app/book/${selectedBook?.book_id || form.book_id}`)}>
                    Xem trang sản phẩm
                  </SubmitBtn>
                )}
              </ActionButtonsRow>
            </SuccessBox>
          </ReviewContainer>
        ) : (
          <>
            {/* 1. Selection step if multiple items in order */}
            {hasMultipleItems && !selectedBook && (
              <>
                <P style={{ fontWeight: 600, marginTop: '10px' }}>Chọn sản phẩm bạn muốn đánh giá hoặc chỉnh sửa:</P>
                <BookSelectorGrid>
                  {stateItems.map((item, index) => (
                    <BookSelectorCard
                      key={item.id || item.book_id || index}
                      onClick={() => handleBookSelect(item)}
                    >
                      {item.image_url && (
                        <SelectorBookCover src={item.image_url} alt={item.book_title} />
                      )}
                      <SelectorBookInfo>
                        <SelectorBookTitle>{item.book_title || `Sản phẩm #${item.book_id}`}</SelectorBookTitle>
                        <P style={{ fontSize: '0.82rem' }}>Số lượng: {item.quantity || 1}</P>
                      </SelectorBookInfo>
                    </BookSelectorCard>
                  ))}
                </BookSelectorGrid>
              </>
            )}

            {/* 2. Review Form */}
            {(!hasMultipleItems || selectedBook) && (
              <ReviewContainer>
                {selectedBook && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', paddingBottom: '16px', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                    {selectedBook.image_url && (
                      <SelectorBookCover src={selectedBook.image_url} alt={selectedBook.book_title} style={{ width: '40px', height: '54px' }} />
                    )}
                    <div style={{ flex: 1 }}>
                      <P style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {existingReview ? 'Đang chỉnh sửa đánh giá cho:' : 'Đang viết đánh giá cho:'}
                      </P>
                      <h4 style={{ margin: '2px 0 0 0', fontSize: '0.98rem', fontWeight: 700 }}>
                        {selectedBook.book_title || `Sản phẩm #${selectedBook.book_id}`}
                      </h4>
                    </div>
                    {hasMultipleItems && (
                      <Btn type="button" style={{ minHeight: '34px', padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => setSelectedBook(null)}>
                        Thay đổi
                      </Btn>
                    )}
                  </div>
                )}

                {/* Legacy Fallback if accessed without order state */}
                {!selectedBook && stateItems.length === 0 && (
                  <ReviewFormGroup>
                    <FormLabel>Mã sách (Book ID)</FormLabel>
                    <Input
                      type="number"
                      placeholder="Nhập mã sách bạn muốn đánh giá"
                      value={form.book_id}
                      onChange={(e) => setForm({ ...form, book_id: e.target.value })}
                    />
                  </ReviewFormGroup>
                )}

                {loadingReview && (
                  <P style={{ fontStyle: 'italic', fontSize: '0.85rem', color: 'var(--brand-900)', marginTop: '12px' }}>
                    Đang kiểm tra lịch sử đánh giá...
                  </P>
                )}

                {existingReview && !loadingReview && (
                  <div style={{ background: '#eef6ff', border: '1px solid #dbecfd', color: '#1d6cd0', padding: '10px 14px', borderRadius: '6px', marginTop: '14px', fontSize: '0.85rem', fontWeight: 500 }}>
                    ℹ Bạn đã đánh giá sản phẩm này trước đó. Bạn có thể chỉnh sửa nội dung và điểm số dưới đây.
                  </div>
                )}

                <ReviewFormGroup style={{ marginTop: '20px' }}>
                  <FormLabel>Vui lòng đánh giá điểm sản phẩm:</FormLabel>
                  <StarRatingRow>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarButton
                        key={star}
                        type="button"
                        $active={form.rate >= star}
                        onClick={() => setForm({ ...form, rate: star })}
                      >
                        ★
                      </StarButton>
                    ))}
                    <RatingLabel>{STAR_LABELS[form.rate]}</RatingLabel>
                  </StarRatingRow>
                </ReviewFormGroup>

                <ReviewFormGroup>
                  <FormLabel>Nhập nội dung nhận xét chi tiết:</FormLabel>
                  <Textarea
                    placeholder="Hãy chia sẻ trải nghiệm thực tế của bạn về chất lượng sách, nội dung, đóng gói, dịch vụ vận chuyển... để giúp những người mua khác lựa chọn nhé."
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span>Đóng góp đánh giá có tâm sẽ giúp cải thiện chất lượng cửa hàng</span>
                    <span>{form.content?.length || 0} ký tự</span>
                  </div>
                </ReviewFormGroup>

                {error && (
                  <Alert role="alert" style={{ marginTop: '14px', background: '#fdf2f2', padding: '10px 14px', borderRadius: '4px', border: '1px solid #fde8e8' }}>
                    Lỗi: {error}
                  </Alert>
                )}

                <ActionButtonsRow>
                  <BackBtn type="button" onClick={() => navigate(-1)}>
                    Quay lại
                  </BackBtn>
                  <SubmitBtn type="button" onClick={submit} disabled={submitting || loadingReview}>
                    {submitting ? 'Đang gửi...' : (existingReview ? 'Cập nhật nhận xét' : 'Gửi nhận xét')}
                  </SubmitBtn>
                </ActionButtonsRow>
              </ReviewContainer>
            )}
          </>
        )}
      </Section>
    </Wrap>
  )
}
