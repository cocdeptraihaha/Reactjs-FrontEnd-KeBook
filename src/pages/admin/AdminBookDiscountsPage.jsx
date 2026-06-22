import { useState, useEffect } from 'react'
import { AdminNavbar } from '../../components/AdminNavbar'
import { bookDiscountsApi } from '../../api/bookDiscounts'
import { booksApi, pickPrimaryImage } from '../../api/books'
import { Plus, Trash2, Edit2, Search, Percent } from 'react-feather'
import {
  Container,
  Header,
  Title,
  FilterBar,
  SearchInputWrapper,
  SearchInput,
  AddButton,
  DiscountTable,
  Th,
  Td,
  LoadingWrap,
  ErrorWrap,
  Badge,
  ActionButton,
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  FormRow,
  FormLabel,
  FormInput,
  FormSelect,
  BookListContainer,
  BookCheckboxItem,
  BookThumb,
  ModalSearchWrapper,
  ModalSearchInput
} from './AdminBookDiscountsPage.styles'

export function AdminBookDiscountsPage({ isSubTab = false }) {
  const [discounts, setDiscounts] = useState([])
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [bookSearch, setBookSearch] = useState('')

  // Modals state
  const [activeModal, setActiveModal] = useState(null) // 'create' | 'edit'
  const [selectedDiscount, setSelectedPromo] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  // Form states
  const [form, setForm] = useState({
    discount_percent: '',
    start_date: '',
    end_date: '',
    book_ids: []
  })

  const fetchDiscountsAndBooks = async () => {
    try {
      setLoading(true)
      setError(null)
      const [discountData, booksRes] = await Promise.all([
        bookDiscountsApi.list(),
        booksApi.adminList({ limit: 300 }).catch(() => ({ data: [] }))
      ])
      setDiscounts(discountData || [])
      setBooks(booksRes?.data || [])
    } catch (err) {
      setError(err.message || 'Lỗi khi tải dữ liệu giảm giá và sách.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchDiscountsAndBooks()
  }, [])

  const handleOpenCreate = () => {
    setBookSearch('')
    setForm({
      discount_percent: '',
      start_date: '',
      end_date: '',
      book_ids: []
    })
    setActiveModal('create')
  }

  const handleOpenEdit = (discount) => {
    setBookSearch('')
    setSelectedPromo(discount)
    setForm({
      discount_percent: discount.discount_percent || '',
      start_date: discount.start_date ? discount.start_date.substring(0, 16) : '',
      end_date: discount.end_date ? discount.end_date.substring(0, 16) : '',
      book_ids: Array.isArray(discount.books) ? discount.books.map(b => b.id) : []
    })
    setActiveModal('edit')
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa chương trình giảm giá này không?')) return
    try {
      setLoading(true)
      await bookDiscountsApi.delete(id)
      await fetchDiscountsAndBooks()
    } catch (err) {
      setError(err.message || 'Lỗi khi xóa giảm giá.')
    } finally {
      setLoading(false)
    }
  }

  const handleBookCheckboxChange = (bookId) => {
    setForm(prev => {
      const exists = prev.book_ids.includes(bookId)
      if (exists) {
        return { ...prev, book_ids: prev.book_ids.filter(id => id !== bookId) }
      } else {
        return { ...prev, book_ids: [...prev.book_ids, bookId] }
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const payload = {
      discount_percent: parseFloat(form.discount_percent),
      start_date: form.start_date ? new Date(form.start_date).toISOString() : null,
      end_date: form.end_date ? new Date(form.end_date).toISOString() : null,
      book_ids: form.book_ids.map(Number)
    }

    try {
      if (activeModal === 'create') {
        await bookDiscountsApi.create(payload)
      } else {
        await bookDiscountsApi.update(selectedDiscount.id, payload)
      }
      setActiveModal(null)
      await fetchDiscountsAndBooks()
    } catch (err) {
      setError(err.message || 'Lỗi khi lưu chương trình giảm giá.')
    } finally {
      setSubmitting(false)
    }
  }

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0)
  }

  const formatDate = (val) => {
    if (!val) return 'Vô thời hạn'
    return new Date(val).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getDiscountStatus = (discount) => {
    const now = new Date()
    const start = discount.start_date ? new Date(discount.start_date) : null
    const end = discount.end_date ? new Date(discount.end_date) : null

    if (end && now > end) return { label: 'Đã hết hạn', type: 'expired' }
    if (start && now < start) return { label: 'Sắp diễn ra', type: 'scheduled' }
    return { label: 'Đang hoạt động', type: 'active' }
  }

  // Filter discounts based on search (filter by books inside the discount or description)
  const filteredDiscounts = discounts.filter(discount => {
    const q = search.toLowerCase()
    if (!q) return true

    const matchesPercent = String(discount.discount_percent).includes(q)
    const matchesBooks = Array.isArray(discount.books) && discount.books.some(b =>
      (b.title || '').toLowerCase().includes(q) ||
      (b.author || '').toLowerCase().includes(q)
    )

    return matchesPercent || matchesBooks
  })

  const content = (
    <>
      <Header>
        <div>
          <Title>Quản lý Giảm Giá Sách</Title>
        </div>
        <FilterBar>
          <SearchInputWrapper>
            <Search size={16} />
            <SearchInput
              type="text"
              placeholder="Tìm theo % giảm hoặc tên sách..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </SearchInputWrapper>
          <AddButton onClick={handleOpenCreate}>
            <Plus size={16} /> Thêm Giảm Giá
          </AddButton>
        </FilterBar>
      </Header>

      {error && <ErrorWrap>{error}</ErrorWrap>}

      {loading ? (
        <LoadingWrap>Đang tải dữ liệu giảm giá...</LoadingWrap>
      ) : (
        <DiscountTable>
          <thead>
            <tr>
              <Th>Mức Giảm</Th>
              <Th>Danh Sách Sách Áp Dụng</Th>
              <Th>Ngày Bắt Đầu</Th>
              <Th>Ngày Kết Thúc</Th>
              <Th>Trạng Thái</Th>
              <Th style={{ textAlign: 'right' }}>Thao Tác</Th>
            </tr>
          </thead>
          <tbody>
            {filteredDiscounts.length === 0 ? (
              <tr>
                <Td colSpan={6} style={{ textAlign: 'center', color: '#64748b', padding: '30px' }}>
                  Không tìm thấy chương trình giảm giá nào
                </Td>
              </tr>
            ) : (
              filteredDiscounts.map((discount) => {
                const status = getDiscountStatus(discount)
                return (
                  <tr key={discount.id}>
                    <Td style={{ fontWeight: '800', color: '#dc2626', fontSize: '15px' }}>
                      <Percent size={14} style={{ marginRight: '2px', verticalAlign: 'middle' }} />
                      {discount.discount_percent}%
                    </Td>
                    <Td style={{ maxWidth: '400px' }}>
                      {Array.isArray(discount.books) && discount.books.length > 0 ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {discount.books.map(b => (
                            <span
                              key={b.id}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '11px',
                                backgroundColor: '#f1f5f9',
                                border: '1px solid #cbd5e1',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                color: '#334155'
                              }}
                            >
                              {b.title}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Chưa áp dụng cho sách nào</span>
                      )}
                    </Td>
                    <Td>{formatDate(discount.start_date)}</Td>
                    <Td>{formatDate(discount.end_date)}</Td>
                    <Td>
                      <Badge $type={status.type}>{status.label}</Badge>
                    </Td>
                    <Td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <ActionButton onClick={() => handleOpenEdit(discount)}>
                          <Edit2 size={13} /> Sửa
                        </ActionButton>
                        <ActionButton $variant="danger" onClick={() => handleDelete(discount.id)}>
                          <Trash2 size={13} /> Xóa
                        </ActionButton>
                      </div>
                    </Td>
                  </tr>
                )
              })
            )}
          </tbody>
        </DiscountTable>
      )}

      {/* Create/Edit Modal */}
      {activeModal && (
        <ModalOverlay onClick={() => setActiveModal(null)}>
          <ModalContainer $size="large" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSubmit}>
              <ModalHeader>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
                  {activeModal === 'create' ? 'Tạo Chương Trình Giảm Giá' : 'Cập Nhật Chương Trình Giảm Giá'}
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    fontSize: '20px',
                    cursor: 'pointer',
                    color: '#64748b'
                  }}
                >
                  ×
                </button>
              </ModalHeader>

              <ModalBody>
                <FormRow>
                  <FormGroup>
                    <FormLabel>Mức giảm (%) <span style={{ color: '#dc2626' }}>*</span></FormLabel>
                    <FormInput
                      type="number"
                      min="1"
                      max="100"
                      required
                      value={form.discount_percent}
                      onChange={(e) => setForm({ ...form, discount_percent: e.target.value })}
                      placeholder="Ví dụ: 15"
                    />
                  </FormGroup>
                </FormRow>

                <FormRow>
                  <FormGroup>
                    <FormLabel>Thời gian bắt đầu</FormLabel>
                    <FormInput
                      type="datetime-local"
                      value={form.start_date}
                      onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormLabel>Thời gian kết thúc</FormLabel>
                    <FormInput
                      type="datetime-local"
                      value={form.end_date}
                      onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                    />
                  </FormGroup>
                </FormRow>

                <FormGroup>
                  <FormLabel>Chọn sách áp dụng giảm giá</FormLabel>
                  <ModalSearchWrapper>
                    <Search size={14} />
                    <ModalSearchInput
                      type="text"
                      placeholder="Tìm kiếm sách nhanh trong modal..."
                      value={bookSearch}
                      onChange={(e) => setBookSearch(e.target.value)}
                    />
                  </ModalSearchWrapper>
                  <BookListContainer>
                    {(() => {
                      const selectedGroup = books.filter(b => form.book_ids.includes(b.id))
                      const unselectedGroup = books.filter(b => !form.book_ids.includes(b.id))

                      const filteredUnselected = unselectedGroup.filter(b => {
                        const q = bookSearch.toLowerCase()
                        if (!q) return true
                        return (b.title || '').toLowerCase().includes(q) || (b.author || '').toLowerCase().includes(q)
                      })

                      const modalBooksToRender = [...selectedGroup, ...filteredUnselected]

                      if (modalBooksToRender.length === 0) {
                        return (
                          <div style={{ padding: '20px', textAlign: 'center', fontSize: '12px', color: '#64748b' }}>
                            Không tìm thấy sách phù hợp
                          </div>
                        )
                      }

                      return modalBooksToRender.map((b) => {
                        const isChecked = form.book_ids.includes(b.id)
                        return (
                          <BookCheckboxItem key={b.id}>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleBookCheckboxChange(b.id)}
                            />
                            <BookThumb src={pickPrimaryImage(b)} alt={b.title} />
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ fontWeight: 600 }}>
                                {b.title} {isChecked && <span style={{ color: '#059669', fontSize: '11px', marginLeft: '4px' }}>(Đã chọn)</span>}
                              </span>
                              <span style={{ fontSize: '11px', color: '#64748b' }}>
                                {b.author || 'Chưa rõ tác giả'} • Giá: {formatCurrency(b.selling_price)}
                              </span>
                            </div>
                          </BookCheckboxItem>
                        )
                      })
                    })()}
                  </BookListContainer>
                </FormGroup>
              </ModalBody>

              <ModalFooter>
                <ActionButton type="button" onClick={() => setActiveModal(null)}>
                  Hủy
                </ActionButton>
                <ActionButton
                  type="submit"
                  disabled={submitting}
                  style={{ backgroundColor: '#3b82f6', color: '#ffffff', borderColor: '#3b82f6' }}
                >
                  {submitting ? 'Đang lưu...' : 'Lưu'}
                </ActionButton>
              </ModalFooter>
            </form>
          </ModalContainer>
        </ModalOverlay>
      )}
    </>
  )

  if (isSubTab) {
    return <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '16px 0' }}>{content}</div>
  }

  return (
    <>
      <AdminNavbar />
      <Container>{content}</Container>
    </>
  )
}

export default AdminBookDiscountsPage
