import { useState, useEffect } from 'react'
import { AdminNavbar } from '../../components/AdminNavbar'
import { DateTimePicker } from '../../components/ui/DateTimePicker'
import { promotionsApi } from '../../api/promotions'
import { usersApi } from '../../api/users'
import { Plus, Trash2, Edit2, BarChart2, Search, Gift } from 'react-feather'
import {
  Container,
  Header,
  Title,
  FilterBar,
  SearchInputWrapper,
  SearchInput,
  AddButton,
  PromoTable,
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
  SearchableSelectContainer,
  SearchableSelectInputWrapper,
  SearchableSelectDropdown,
  SearchableSelectItem,
  SearchableSelectNoResults,
  SearchableSelectUserText,
  SearchableSelectUserSubtext
} from './AdminPromotionsPage.styles'

function SearchableUserSelect({ users, value, onChange, placeholder = 'Tìm kiếm người dùng...' }) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')

  const selectedUser = users.find(u => String(u.id) === String(value))

  const filteredUsers = users.filter(u => {
    const q = search.toLowerCase()
    return (
      String(u.id).includes(q) ||
      (u.full_name || '').toLowerCase().includes(q) ||
      (u.username || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q)
    )
  })

  useEffect(() => {
    const handleOutsideClick = () => {
      setIsOpen(false)
    }
    document.addEventListener('click', handleOutsideClick)
    return () => document.removeEventListener('click', handleOutsideClick)
  }, [])

  return (
    <SearchableSelectContainer onClick={(e) => e.stopPropagation()}>
      <SearchableSelectInputWrapper>
        <FormInput
          type="text"
          placeholder={selectedUser ? `${selectedUser.full_name || selectedUser.username} (@${selectedUser.username})` : placeholder}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          style={{ width: '100%', paddingRight: value ? '50px' : '12px' }}
        />
        {value && (
          <button
            type="button"
            style={{
              position: 'absolute',
              right: '12px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: '#dc2626',
              fontSize: '12px',
              fontWeight: '700'
            }}
            onClick={() => {
              onChange('')
              setSearch('')
            }}
          >
            Xóa
          </button>
        )}
      </SearchableSelectInputWrapper>

      {isOpen && (
        <SearchableSelectDropdown>
          {filteredUsers.length === 0 ? (
            <SearchableSelectNoResults>Không tìm thấy người dùng</SearchableSelectNoResults>
          ) : (
            filteredUsers.map((u) => {
              const selected = String(u.id) === String(value)
              return (
                <SearchableSelectItem
                  key={u.id}
                  $selected={selected}
                  onClick={() => {
                    onChange(String(u.id))
                    setSearch('')
                    setIsOpen(false)
                  }}
                >
                  <SearchableSelectUserText>
                    {u.full_name || u.username} {selected && '✓'}
                  </SearchableSelectUserText>
                  <SearchableSelectUserSubtext>
                    @{u.username} • {u.email || 'Không có email'} (ID: #{u.id})
                  </SearchableSelectUserSubtext>
                </SearchableSelectItem>
              )
            })
          )}
        </SearchableSelectDropdown>
      )}
    </SearchableSelectContainer>
  )
}


export function AdminPromotionsPage() {
  const [promotions, setPromotions] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')

  // Modals state
  const [activeModal, setActiveModal] = useState(null) // 'create' | 'edit' | 'stats' | 'issue'
  const [selectedPromo, setSelectedPromo] = useState(null)
  const [statsData, setStatsData] = useState(null)
  const [loadingStats, setLoadingStats] = useState(false)

  // Form states
  const [form, setForm] = useState({
    code: '',
    name: '',
    promotion_type: 'GLOBAL',
    owner_user_id: '',
    cost_points: '',
    discount_percent: '',
    discount_amount: '',
    free_shipping: false,
    max_discount: '',
    min_order_amount: '',
    usage_limit: '',
    start_date: '',
    end_date: '',
  })

  const [issueForm, setIssueForm] = useState({
    user_id: '',
  })
  const [submitting, setSubmitting] = useState(false)

  const fetchPromotions = async () => {
    try {
      setLoading(true)
      setError(null)
      const [data, usersData] = await Promise.all([
        promotionsApi.list(),
        usersApi.listAll({ limit: 200 }).catch(() => [])
      ])
      setPromotions(data || [])
      setUsers(usersData || [])
    } catch (err) {
      setError(err.message || 'Lỗi khi tải danh sách khuyến mãi.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchPromotions()
  }, [])

  const handleOpenCreate = () => {
    setForm({
      code: '',
      name: '',
      promotion_type: 'GLOBAL',
      owner_user_id: '',
      cost_points: '',
      discount_percent: '',
      discount_amount: '',
      free_shipping: false,
      max_discount: '',
      min_order_amount: '',
      usage_limit: '',
      start_date: '',
      end_date: '',
    })
    setSelectedPromo(null)
    setActiveModal('create')
  }

  const handleOpenEdit = (promo) => {
    setSelectedPromo(promo)
    setForm({
      code: promo.code || '',
      name: promo.name || '',
      promotion_type: promo.promotion_type || 'GLOBAL',
      owner_user_id: promo.owner_user_id !== null && promo.owner_user_id !== undefined ? String(promo.owner_user_id) : '',
      cost_points: promo.cost_points !== null && promo.cost_points !== undefined ? String(promo.cost_points) : '',
      discount_percent: promo.discount_percent !== null && promo.discount_percent !== undefined ? String(promo.discount_percent) : '',
      discount_amount: promo.discount_amount !== null && promo.discount_amount !== undefined ? String(promo.discount_amount) : '',
      free_shipping: Boolean(promo.free_shipping),
      max_discount: promo.max_discount !== null && promo.max_discount !== undefined ? String(promo.max_discount) : '',
      min_order_amount: promo.min_order_amount !== null && promo.min_order_amount !== undefined ? String(promo.min_order_amount) : '',
      usage_limit: promo.usage_limit !== null && promo.usage_limit !== undefined ? String(promo.usage_limit) : '',
      start_date: promo.start_date ? promo.start_date.substring(0, 16) : '',
      end_date: promo.end_date ? promo.end_date.substring(0, 16) : '',
    })
    setActiveModal('edit')
  }

  const handleOpenStats = async (promo) => {
    setSelectedPromo(promo)
    setActiveModal('stats')
    setLoadingStats(true)
    try {
      const stats = await promotionsApi.getStats(promo.id)
      setStatsData(stats)
    } catch (err) {
      alert(err.message || 'Không thể tải thống kê khuyến mãi')
    } finally {
      setLoadingStats(false)
    }
  }

  const handleOpenIssue = (promo) => {
    setSelectedPromo(promo)
    setIssueForm({ user_id: '' })
    setActiveModal('issue')
  }

  const handleDelete = async (promo) => {
    if (!window.confirm(`Xác nhận xóa mã khuyến mãi ${promo.code}?`)) return
    try {
      await promotionsApi.delete(promo.id)
      setPromotions((prev) => prev.filter((p) => p.id !== promo.id))
    } catch (err) {
      alert(err.message || 'Lỗi khi xóa khuyến mãi.')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      const payload = {
        code: form.code.trim().toUpperCase(),
        name: form.name.trim(),
        promotion_type: form.promotion_type,
        owner_user_id: form.promotion_type === 'PERSONAL' ? Number(form.owner_user_id || 0) : null,
        cost_points: form.promotion_type === 'POINT_EXCHANGE' ? Number(form.cost_points || 0) : null,
        free_shipping: form.free_shipping,
        discount_percent: form.discount_percent ? Number(form.discount_percent) : null,
        discount_amount: form.discount_amount ? Number(form.discount_amount) : null,
        max_discount: form.max_discount ? Number(form.max_discount) : null,
        min_order_amount: form.min_order_amount ? Number(form.min_order_amount) : null,
        usage_limit: form.usage_limit ? Number(form.usage_limit) : null,
        start_date: form.start_date ? new Date(form.start_date).toISOString() : null,
        end_date: form.end_date ? new Date(form.end_date).toISOString() : null,
      }

      if (activeModal === 'create') {
        const newPromo = await promotionsApi.create(payload)
        setPromotions((prev) => [newPromo, ...prev])
      } else if (activeModal === 'edit') {
        const updated = await promotionsApi.update(selectedPromo.id, payload)
        setPromotions((prev) => prev.map((p) => (p.id === selectedPromo.id ? updated : p)))
      }

      setActiveModal(null)
    } catch (err) {
      alert(err.message || 'Gửi biểu mẫu thất bại.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleIssueSubmit = async (e) => {
    e.preventDefault()
    if (!issueForm.user_id) return
    try {
      setSubmitting(true)
      await promotionsApi.issuePersonal({
        user_id: Number(issueForm.user_id),
        promotion_id: selectedPromo.id,
      })
      alert('Đã cấp mã khuyến mãi cá nhân thành công!')
      setActiveModal(null)
    } catch (err) {
      alert(err.message || 'Cấp mã thất bại.')
    } finally {
      setSubmitting(false)
    }
  }

  const filtered = promotions.filter((p) => {
    const q = search.toLowerCase()
    return (p.code || '').toLowerCase().includes(q) || (p.name || '').toLowerCase().includes(q)
  })

  const isExpired = (promo) => {
    if (!promo.end_date) return false
    return new Date(promo.end_date) < new Date()
  }

  return (
    <>
      <AdminNavbar />
      <Container>
        <Header>
          <Title>Quản Lý Khuyến Mãi</Title>
          <FilterBar>
            <SearchInputWrapper>
              <Search size={16} />
              <SearchInput
                type="text"
                placeholder="Tìm mã, tên khuyến mãi..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </SearchInputWrapper>
            <AddButton onClick={handleOpenCreate}>
              <Plus size={16} /> Tạo Khuyến Mãi
            </AddButton>
          </FilterBar>
        </Header>

        {error && <ErrorWrap>{error}</ErrorWrap>}

        {loading ? (
          <LoadingWrap>Đang tải danh sách khuyến mãi...</LoadingWrap>
        ) : filtered.length === 0 ? (
          <LoadingWrap>Không tìm thấy mã khuyến mãi nào.</LoadingWrap>
        ) : (
          <PromoTable>
            <thead>
              <tr>
                <Th>ID</Th>
                <Th>Mã code</Th>
                <Th>Tên chương trình</Th>
                <Th>Mức giảm</Th>
                <Th>Giá trị tối thiểu</Th>
                <Th>Lượt dùng (Đã dùng/Tổng)</Th>
                <Th>Thời hạn</Th>
                <Th>Loại</Th>
                <Th style={{ textAlign: 'right' }}>Hành động</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((promo) => {
                const expired = isExpired(promo)
                let discountLabel = '-'
                if (promo.discount_percent) {
                  discountLabel = `${promo.discount_percent}% (Tối đa ${Number(promo.max_discount || 0).toLocaleString('vi-VN')}đ)`
                } else if (promo.discount_amount) {
                  discountLabel = `${Number(promo.discount_amount).toLocaleString('vi-VN')} đ`
                } else if (promo.free_shipping) {
                  discountLabel = 'Free Shipping'
                }

                return (
                  <tr key={promo.id}>
                    <Td>#{promo.id}</Td>
                    <Td>
                      <strong style={{ color: 'var(--brand-900)' }}>{promo.code}</strong>
                    </Td>
                    <Td>{promo.name || 'Không có tên'}</Td>
                    <Td>{discountLabel}</Td>
                    <Td>{promo.min_order_amount ? `${Number(promo.min_order_amount).toLocaleString('vi-VN')} đ` : '0đ'}</Td>
                    <Td>
                      {promo.used_count || 0} / {promo.usage_limit || '∞'}
                    </Td>
                    <Td>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>
                        Bắt đầu: {promo.start_date ? new Date(promo.start_date).toLocaleDateString('vi-VN') : 'N/A'}
                        <br />
                        Kết thúc: {promo.end_date ? new Date(promo.end_date).toLocaleDateString('vi-VN') : 'N/A'}
                      </div>
                    </Td>
                    <Td>
                      {promo.promotion_type === 'PERSONAL' || promo.owner_user_id ? (
                        <Badge $type="personal">Cá nhân {promo.owner_user_id ? `(User #${promo.owner_user_id})` : ''}</Badge>
                      ) : promo.promotion_type === 'POINT_EXCHANGE' ? (
                        <Badge $type="personal" style={{ backgroundColor: '#fffbeb', color: '#d97706' }}>Đổi điểm ({promo.cost_points || 0}đ)</Badge>
                      ) : expired ? (
                        <Badge $type="expired">Hết hạn</Badge>
                      ) : (
                        <Badge $type="active">Công khai</Badge>
                      )}
                    </Td>
                    <Td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        {!promo.owner_user_id && (
                          <ActionButton title="Cấp mã cho User" onClick={() => handleOpenIssue(promo)}>
                            <Gift size={14} /> Cấp mã
                          </ActionButton>
                        )}
                        <ActionButton title="Thống kê sử dụng" onClick={() => handleOpenStats(promo)}>
                          <BarChart2 size={14} /> Thống kê
                        </ActionButton>
                        <ActionButton $variant="warning" title="Sửa" onClick={() => handleOpenEdit(promo)}>
                          <Edit2 size={14} />
                        </ActionButton>
                        <ActionButton $variant="danger" title="Xóa" onClick={() => handleDelete(promo)}>
                          <Trash2 size={14} />
                        </ActionButton>
                      </div>
                    </Td>
                  </tr>
                )
              })}
            </tbody>
          </PromoTable>
        )}

        {/* Create/Edit Modal */}
        {(activeModal === 'create' || activeModal === 'edit') && (
          <ModalOverlay onClick={() => setActiveModal(null)}>
            <ModalContainer $wide onClick={(e) => e.stopPropagation()}>
              <form onSubmit={handleSubmit}>
                <ModalHeader>{activeModal === 'create' ? 'Tạo Khuyến Mãi Mới' : 'Sửa Khuyến Mãi'}</ModalHeader>
                <ModalBody>
                  <FormRow style={{ overflow: 'visible' }}>
                    <FormGroup style={{ overflow: 'visible' }}>
                      <FormLabel>Loại khuyến mãi:</FormLabel>
                      <FormSelect
                        value={form.promotion_type}
                        onChange={(e) => setForm({ ...form, promotion_type: e.target.value })}
                      >
                        <option value="GLOBAL">Toàn sàn</option>
                        <option value="PERSONAL">Cá nhân</option>
                        <option value="POINT_EXCHANGE">Đổi điểm</option>
                      </FormSelect>
                    </FormGroup>
                    {form.promotion_type === 'POINT_EXCHANGE' && (
                      <FormGroup>
                        <FormLabel>Số điểm cần đổi:</FormLabel>
                        <FormInput
                          type="number"
                          placeholder="Ví dụ: 100"
                          value={form.cost_points}
                          onChange={(e) => setForm({ ...form, cost_points: e.target.value })}
                          required
                        />
                      </FormGroup>
                    )}
                    {form.promotion_type === 'PERSONAL' && (
                      <FormGroup style={{ overflow: 'visible' }}>
                        <FormLabel>Chọn người nhận:</FormLabel>
                        <SearchableUserSelect
                          users={users}
                          value={form.owner_user_id}
                          onChange={(val) => setForm({ ...form, owner_user_id: val })}
                        />
                      </FormGroup>
                    )}
                  </FormRow>

                  <FormRow>
                    <FormGroup>
                      <FormLabel>Mã code (Viết liền, không dấu):</FormLabel>
                      <FormInput
                        type="text"
                        required
                        placeholder="VÍ DỤ: BANMOI10"
                        value={form.code}
                        onChange={(e) => setForm({ ...form, code: e.target.value })}
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormLabel>Tên chương trình:</FormLabel>
                      <FormInput
                        type="text"
                        required
                        placeholder="Khuyến mãi thành viên mới"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                      />
                    </FormGroup>
                  </FormRow>

                  <FormRow>
                    <FormGroup>
                      <FormLabel>Phần trăm giảm (%):</FormLabel>
                      <FormInput
                        type="number"
                        placeholder="Ví dụ: 10"
                        value={form.discount_percent}
                        disabled={!!form.discount_amount}
                        onChange={(e) => setForm({ ...form, discount_percent: e.target.value })}
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormLabel>Số tiền giảm cố định (đ):</FormLabel>
                      <FormInput
                        type="number"
                        placeholder="Ví dụ: 50000"
                        value={form.discount_amount}
                        disabled={!!form.discount_percent}
                        onChange={(e) => setForm({ ...form, discount_amount: e.target.value })}
                      />
                    </FormGroup>
                  </FormRow>

                  <FormRow>
                    <FormGroup>
                      <FormLabel>Giảm tối đa (đ) (Dành cho giảm %):</FormLabel>
                      <FormInput
                        type="number"
                        placeholder="Ví dụ: 30000"
                        value={form.max_discount}
                        disabled={!!form.discount_amount}
                        onChange={(e) => setForm({ ...form, max_discount: e.target.value })}
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormLabel>Giá trị đơn hàng tối thiểu (đ):</FormLabel>
                      <FormInput
                        type="number"
                        placeholder="Ví dụ: 150000"
                        value={form.min_order_amount}
                        onChange={(e) => setForm({ ...form, min_order_amount: e.target.value })}
                      />
                    </FormGroup>
                  </FormRow>

                  <FormRow>
                    <FormGroup>
                      <FormLabel>Giới hạn lượt dùng (Tổng):</FormLabel>
                      <FormInput
                        type="number"
                        placeholder="Để trống nếu không giới hạn"
                        value={form.usage_limit}
                        onChange={(e) => setForm({ ...form, usage_limit: e.target.value })}
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormLabel>Miễn phí vận chuyển:</FormLabel>
                      <FormSelect
                        value={form.free_shipping ? 'true' : 'false'}
                        onChange={(e) => setForm({ ...form, free_shipping: e.target.value === 'true' })}
                      >
                        <option value="false">Không</option>
                        <option value="true">Có</option>
                      </FormSelect>
                    </FormGroup>
                  </FormRow>

                  <FormRow style={{ overflow: 'visible' }}>
                    <FormGroup style={{ overflow: 'visible' }}>
                      <FormLabel>Ngày bắt đầu:</FormLabel>
                      <DateTimePicker
                        label="Bắt đầu"
                        type="datetime-local"
                        value={form.start_date}
                        onChange={(val) => setForm({ ...form, start_date: val })}
                        brandColor="#3b82f6"
                        brandColorHover="#2563eb"
                        brandColorBorder="#93c5fd"
                      />
                    </FormGroup>
                    <FormGroup style={{ overflow: 'visible' }}>
                      <FormLabel>Ngày kết thúc:</FormLabel>
                      <DateTimePicker
                        label="Kết thúc"
                        type="datetime-local"
                        value={form.end_date}
                        onChange={(val) => setForm({ ...form, end_date: val })}
                        brandColor="#3b82f6"
                        brandColorHover="#2563eb"
                        brandColorBorder="#93c5fd"
                      />
                    </FormGroup>
                  </FormRow>
                </ModalBody>
                <ModalFooter>
                  <button type="button" className="btn-secondary" onClick={() => setActiveModal(null)}>Hủy</button>
                  <button type="submit" className="btn-primary" disabled={submitting}>
                    {submitting ? 'Đang lưu...' : 'Xác nhận'}
                  </button>
                </ModalFooter>
              </form>
            </ModalContainer>
          </ModalOverlay>
        )}

        {/* Stats Modal */}
        {activeModal === 'stats' && selectedPromo && (
          <ModalOverlay onClick={() => setActiveModal(null)}>
            <ModalContainer onClick={(e) => e.stopPropagation()}>
              <ModalHeader>Thống kê sử dụng: {selectedPromo.code}</ModalHeader>
              <ModalBody>
                {loadingStats ? (
                  <LoadingWrap>Đang tải dữ liệu thống kê...</LoadingWrap>
                ) : statsData ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <span style={{ fontSize: '13px', color: '#64748b' }}>Tên chương trình:</span>
                      <p style={{ margin: '4px 0 0', fontWeight: 'bold', fontSize: '15px' }}>{selectedPromo.name}</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px' }}>
                        <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Số lượt đã dùng</span>
                        <p style={{ margin: '8px 0 0', fontSize: '24px', fontWeight: '800', color: 'var(--brand-900)' }}>
                          {statsData.usage_count || 0}
                        </p>
                      </div>
                      <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px' }}>
                        <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Tổng số tiền giảm</span>
                        <p style={{ margin: '8px 0 0', fontSize: '20px', fontWeight: '800', color: '#059669' }}>
                          {Number(statsData.total_discount || 0).toLocaleString('vi-VN')} đ
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <ErrorWrap>Lỗi khi lấy thông tin thống kê.</ErrorWrap>
                )}
              </ModalBody>
              <ModalFooter>
                <button type="button" className="btn-secondary" onClick={() => setActiveModal(null)}>Đóng</button>
              </ModalFooter>
            </ModalContainer>
          </ModalOverlay>
        )}

        {/* Issue Personal Modal */}
        {activeModal === 'issue' && selectedPromo && (
          <ModalOverlay onClick={() => setActiveModal(null)}>
            <ModalContainer onClick={(e) => e.stopPropagation()}>
              <form onSubmit={handleIssueSubmit}>
                <ModalHeader>Cấp mã cho User: {selectedPromo.code}</ModalHeader>
                <ModalBody>
                  <p style={{ marginBottom: '16px', fontSize: '13px', color: '#64748b' }}>
                    Hệ thống sẽ nhân bản Voucher mẫu này thành Voucher cá nhân (chỉ User đó có quyền sử dụng).
                  </p>
                  <FormGroup style={{ overflow: 'visible' }}>
                    <FormLabel>Tìm và chọn người dùng:</FormLabel>
                    <SearchableUserSelect
                      users={users}
                      value={issueForm.user_id}
                      onChange={(val) => setIssueForm({ user_id: val })}
                    />
                  </FormGroup>
                </ModalBody>
                <ModalFooter>
                  <button type="button" className="btn-secondary" onClick={() => setActiveModal(null)}>Hủy</button>
                  <button type="submit" className="btn-primary" disabled={submitting}>
                    {submitting ? 'Đang cấp...' : 'Xác nhận cấp'}
                  </button>
                </ModalFooter>
              </form>
            </ModalContainer>
          </ModalOverlay>
        )}
      </Container>
    </>
  )
}

export default AdminPromotionsPage
