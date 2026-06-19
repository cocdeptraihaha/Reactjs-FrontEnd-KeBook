import { useMemo, useState, useEffect } from 'react'
import { booksApi } from '../../api/books'
import { ordersApi } from '../../api/orders'
import { uploadApi } from '../../api/upload'
import { categoriesApi } from '../../api/categories'
import { returnRequestsApi } from '../../api/returnRequests'
import { AdminNavbar } from '../../components/AdminNavbar'
import { Dropdown } from '../../components/ui/Dropdown'
import { Section, SectionSub, SectionTitle } from '../../components/Section'
import { useAsync } from '../../hooks/useAsync'
import { Alert, Btn, Input, List, P, Row, Wrap } from '../WorkflowPages.styles'
import {
  Container,
  Header,
  Title,
  FilterBar,
  SearchInput,
  TableContainer,
  AdminTable,
  Th,
  Td,
  StatusBadge,
  ItemsList,
  ItemRow,
  ItemThumbnail,
  ActionGroup,
  ActionSelect,
  ActionButton,
  InputDesc,
  CancelRequestPanel,
  CancelRequestTitle,
  CancelRequestReason,
  QuickActions,
  FormGrid,
  FormCard,
  FormCardTitle,
  FormRow,
  FormGroup,
  FormLabel,
  FormInput,
  FormButton,
  BookPreviewPanel,
  PreviewTitle,
  ImageGallery,
  ImageThumbnailCard,
  GalleryImage,
  ThumbnailBadge,
  CheckboxWrapper,
  UploadDropzone,
  UploadIconWrap,
  UploadText,
  UploadSubtext,
  UploadProgressWrap,
  PaginationContainer,
  PaginationInfo,
  PaginationControls,
  PaginationButton,
  TabHeader,
  TabButton,
  CategoryTreeContainer,
  CategoryRow,
  CategoryInfo,
  CategoryActions,
  CategoryBadge,
  SubCategoryContainer,
  CompactCheckboxGrid
} from './AdminWorkflowPages.styles'
import { Plus, Image as ImageIcon, BookOpen, Trash2, ArrowUp, Upload, Folder, Layers, Edit2, PlusCircle, CheckCircle, Check } from 'react-feather'

export function AdminOrdersPage() {
  const s = useAsync(() => ordersApi.adminList(), [])
  const r = useAsync(() => returnRequestsApi.adminList(), [])
  const [activeTab, setActiveTab] = useState('orders')
  const [selectedStatus, setSelectedStatus] = useState({})
  const [statusDesc, setStatusDesc] = useState({})
  const [updatingId, setUpdatingId] = useState(null)

  // Filters state
  const [searchTerm, setSearchInput] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [sortBy, setSortBy] = useState('date_desc')

  // Pagination states
  const [ordersPage, setOrdersPage] = useState(1)
  const ordersLimit = 10

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0)
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleString('vi-VN')
  }

  async function resolveReturn(id, approve) {
    try {
      setUpdatingId(id)
      await returnRequestsApi.adminProcess(id, {
        status: approve ? 'APPROVED' : 'REJECTED'
      })
      await r.reload()
      await s.reload()
    } catch (err) {
      alert(err.message || 'Failed to process return request')
    } finally {
      setUpdatingId(null)
    }
  }

  async function updateStatus(id, currentStatus) {
    const status = selectedStatus[id]
    if (!status) return
    try {
      setUpdatingId(id)
      await ordersApi.adminUpdateStatus(id, {
        status,
        description: statusDesc[id] || `Admin changed status to ${status}`
      })
      await s.reload()
      setStatusDesc(prev => ({ ...prev, [id]: '' }))
    } catch (err) {
      alert(err.message || 'Failed to update order status')
    } finally {
      setUpdatingId(null)
    }
  }

  async function resolveCancel(id, approve) {
    try {
      setUpdatingId(id)
      const desc = statusDesc[id] || (approve ? 'Admin approved cancellation request.' : 'Admin rejected cancellation request.')
      await ordersApi.adminResolveCancel(id, { approve, description: desc })
      await s.reload()
      setStatusDesc(prev => ({ ...prev, [id]: '' }))
    } catch (err) {
      alert(err.message || 'Failed to process cancellation decision')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <>
      <AdminNavbar />
      <Container>
        <Header>
          <Title>Admin Order Approvals</Title>
        </Header>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '8px' }}>
          <button
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: activeTab === 'orders' ? '2px solid #3b82f6' : '1px solid #cbd5e1',
              backgroundColor: activeTab === 'orders' ? '#eff6ff' : '#ffffff',
              color: activeTab === 'orders' ? '#1d4ed8' : '#475569',
              fontWeight: 700,
              cursor: 'pointer'
            }}
            onClick={() => setActiveTab('orders')}
          >
            Orders List
          </button>
          <button
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: activeTab === 'cancels' ? '2px solid #3b82f6' : '1px solid #cbd5e1',
              backgroundColor: activeTab === 'cancels' ? '#eff6ff' : '#ffffff',
              color: activeTab === 'cancels' ? '#1d4ed8' : '#475569',
              fontWeight: 700,
              cursor: 'pointer'
            }}
            onClick={() => setActiveTab('cancels')}
          >
            Cancellation Requests
          </button>
          <button
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: activeTab === 'returns' ? '2px solid #3b82f6' : '1px solid #cbd5e1',
              backgroundColor: activeTab === 'returns' ? '#eff6ff' : '#ffffff',
              color: activeTab === 'returns' ? '#1d4ed8' : '#475569',
              fontWeight: 700,
              cursor: 'pointer'
            }}
            onClick={() => setActiveTab('returns')}
          >
            Return Requests
          </button>
        </div>

      {activeTab === 'orders' && (
        <>
          <FilterBar style={{ marginBottom: '16px', marginTop: '8px' }}>
            <SearchInput
              type="text"
              placeholder="Tìm theo tên khách hàng, số điện thoại, ID đơn hàng..."
              value={searchTerm}
              onChange={(e) => {
                setSearchInput(e.target.value)
                setOrdersPage(1)
              }}
            />
            <Dropdown
              value={statusFilter}
              onChange={(val) => {
                setStatusFilter(val)
                setOrdersPage(1)
              }}
              options={[
                { value: 'ALL', label: 'Tất cả trạng thái' },
                { value: 'PENDING', label: 'PENDING' },
                { value: 'CONFIRMED', label: 'CONFIRMED' },
                { value: 'INPROGRESS', label: 'INPROGRESS' },
                { value: 'SHIPPED', label: 'SHIPPED' },
                { value: 'DELIVERED', label: 'DELIVERED' },
                { value: 'COMPLETED', label: 'COMPLETED' },
                { value: 'CANCELLED', label: 'CANCELLED' },
                { value: 'CANCEL_REQUESTED', label: 'CANCEL_REQUESTED' },
                { value: 'RETURNED', label: 'RETURNED' }
              ]}
              width="200px"
            />
            <Dropdown
              value={sortBy}
              onChange={(val) => {
                setSortBy(val)
                setOrdersPage(1)
              }}
              options={[
                { value: 'date_desc', label: 'Mới nhất trước' },
                { value: 'date_asc', label: 'Cũ nhất trước' },
                { value: 'total_desc', label: 'Tổng giá trị giảm dần' },
                { value: 'total_asc', label: 'Tổng giá trị tăng dần' }
              ]}
              width="220px"
            />
          </FilterBar>

          {s.loading && <p>Loading orders...</p>}
          {s.error && <Alert>{s.error.message || 'Failed to load orders'}</Alert>}

          {!s.loading && !s.error && (() => {
            let allOrders = s.data || []

            // Search by name, phone, order ID
            if (searchTerm.trim()) {
              const term = searchTerm.toLowerCase().trim()
              allOrders = allOrders.filter(o =>
                String(o.id).toLowerCase().includes(term) ||
                (o.full_name || '').toLowerCase().includes(term) ||
                (o.phone_number || '').toLowerCase().includes(term)
              )
            }

            // Filter by order status
            if (statusFilter !== 'ALL') {
              allOrders = allOrders.filter(o => (o.status || 'PENDING') === statusFilter)
            }

            // Sort logic
            allOrders = [...allOrders].sort((a, b) => {
              if (sortBy === 'date_desc') {
                return new Date(b.order_date).getTime() - new Date(a.order_date).getTime()
              }
              if (sortBy === 'date_asc') {
                return new Date(a.order_date).getTime() - new Date(b.order_date).getTime()
              }
              if (sortBy === 'total_desc') {
                return (b.total_price || 0) - (a.total_price || 0)
              }
              if (sortBy === 'total_asc') {
                return (a.total_price || 0) - (b.total_price || 0)
              }
              return 0
            })

            const totalOrders = allOrders.length
            const totalPages = Math.max(1, Math.ceil(totalOrders / ordersLimit))

            // Adjust ordersPage if it exceeds totalPages
            const currentPage = Math.min(ordersPage, totalPages)
            const paginatedOrders = allOrders.slice((currentPage - 1) * ordersLimit, currentPage * ordersLimit)

            return (
              <TableContainer>
                <AdminTable>
                  <thead>
                    <tr>
                      <Th>ID / Date</Th>
                      <Th>Customer</Th>
                      <Th>Items Ordered</Th>
                      <Th>Total / Method</Th>
                      <Th>Status</Th>
                      <Th>Management Action</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedOrders.length === 0 ? (
                      <tr>
                        <Td colSpan={6} style={{ textAlign: 'center' }}>No orders found.</Td>
                      </tr>
                    ) : (
                      paginatedOrders.map((order) => {
                        const currentStatus = order.status || 'PENDING'
                        const activeTargetStatus = selectedStatus[order.id] || currentStatus

                      return (
                        <tr key={order.id}>
                          <Td>
                            <div style={{ fontWeight: 700, color: '#1e293b' }}>#{order.id}</div>
                            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                              {formatDate(order.order_date)}
                            </div>
                          </Td>
                          <Td>
                            <div style={{ fontWeight: 600 }}>{order.full_name || 'N/A'}</div>
                            <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>
                              {order.phone_number || 'No phone'}
                            </div>
                            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', maxWidth: '200px', wordBreak: 'break-word' }}>
                              {order.shipping_address || 'No shipping address'}
                            </div>
                            {order.note && (
                              <div style={{ fontSize: '12px', color: '#b45309', marginTop: '4px', fontStyle: 'italic' }}>
                                Note: {order.note}
                              </div>
                            )}
                          </Td>
                          <Td>
                            <ItemsList>
                              {(order.order_items || []).map((item, index) => (
                                <ItemRow key={item.id || index}>
                                  {item.image_url && <ItemThumbnail src={item.image_url} alt={item.book_title} />}
                                  <div>
                                    <div style={{ fontWeight: 500 }}>{item.book_title || `Book ID: ${item.book_id}`}</div>
                                    <div style={{ fontSize: '11px', color: '#64748b' }}>
                                      Qty: {item.quantity} × {formatCurrency(item.price)}
                                    </div>
                                  </div>
                                </ItemRow>
                              ))}
                            </ItemsList>
                          </Td>
                          <Td>
                            <div style={{ fontWeight: 700, color: '#0f172a' }}>
                              {formatCurrency(order.total_price)}
                            </div>
                            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                              Payment ID: {order.payment_id}
                            </div>
                          </Td>
                          <Td>
                            <StatusBadge $status={currentStatus}>{currentStatus}</StatusBadge>
                            {order.tracking_number && (
                              <div style={{ fontSize: '11px', color: '#475569', marginTop: '6px' }}>
                                Track: {order.tracking_number} ({order.shipping_provider})
                              </div>
                            )}
                          </Td>
                          <Td>
                            {['CANCELLED', 'COMPLETED', 'RETURNED'].includes(currentStatus) ? (
                              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, fontStyle: 'italic', textAlign: 'center', padding: '8px', backgroundColor: '#f1f5f9', borderRadius: '8px' }}>
                                Order {currentStatus} (No actions available)
                              </div>
                            ) : currentStatus === 'CANCEL_REQUESTED' ? (
                              <div style={{ fontSize: '13px', color: '#d97706', fontWeight: 600, fontStyle: 'italic', textAlign: 'center', padding: '8px', backgroundColor: '#fffbeb', borderRadius: '8px' }}>
                                Go to Cancellation Requests tab
                              </div>
                            ) : (
                              <ActionGroup style={{ overflow: 'visible' }}>
                                <Dropdown
                                  value={activeTargetStatus}
                                  onChange={(val) => setSelectedStatus({ ...selectedStatus, [order.id]: val })}
                                  options={[
                                    { value: 'PENDING', label: 'PENDING' },
                                    { value: 'CONFIRMED', label: 'CONFIRMED' },
                                    { value: 'INPROGRESS', label: 'INPROGRESS' },
                                    { value: 'SHIPPED', label: 'SHIPPED' },
                                    { value: 'DELIVERED', label: 'DELIVERED' },
                                    { value: 'COMPLETED', label: 'COMPLETED' },
                                    { value: 'CANCELLED', label: 'CANCELLED' },
                                    { value: 'RETURNED', label: 'RETURNED' }
                                  ]}
                                  width="100%"
                                />
                                <InputDesc
                                  placeholder="Action note / reason"
                                  value={statusDesc[order.id] || ''}
                                  onChange={(e) => setStatusDesc({ ...statusDesc, [order.id]: e.target.value })}
                                />
                                <ActionButton
                                  onClick={() => updateStatus(order.id, currentStatus)}
                                  disabled={updatingId === order.id || activeTargetStatus === currentStatus}
                                >
                                  Update Status
                                </ActionButton>
                              </ActionGroup>
                            )}
                          </Td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </AdminTable>
              {totalOrders > 0 && (
                <PaginationContainer>
                  <PaginationInfo>
                    Hiển thị {(currentPage - 1) * ordersLimit + 1} - {Math.min(currentPage * ordersLimit, totalOrders)} của {totalOrders} đơn hàng
                  </PaginationInfo>
                  <PaginationControls>
                    <PaginationButton
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => setOrdersPage((p) => Math.max(1, p - 1))}
                    >
                      Trước
                    </PaginationButton>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>
                      Trang {currentPage} / {totalPages}
                    </span>
                    <PaginationButton
                      type="button"
                      disabled={currentPage === totalPages}
                      onClick={() => setOrdersPage((p) => Math.min(totalPages, p + 1))}
                    >
                      Sau
                    </PaginationButton>
                  </PaginationControls>
                </PaginationContainer>
              )}
            </TableContainer>
          )
        })()}
        </>
      )}

      {activeTab === 'cancels' && (
        <>
          {s.loading && <p>Loading cancellation requests...</p>}
          {s.error && <Alert>{s.error.message || 'Failed to load orders'}</Alert>}

          {!s.loading && !s.error && (
            <TableContainer>
              <AdminTable>
                <thead>
                  <tr>
                    <Th>ID / Date</Th>
                    <Th>Customer</Th>
                    <Th>Items Ordered</Th>
                    <Th>Total Price</Th>
                    <Th>Status</Th>
                    <Th>Action</Th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const cancelRequestedOrders = (s.data || []).filter(o => o.status === 'CANCEL_REQUESTED')
                    if (cancelRequestedOrders.length === 0) {
                      return (
                        <tr>
                          <Td colSpan={6} style={{ textAlign: 'center' }}>No cancellation requests found.</Td>
                        </tr>
                      )
                    }
                    return cancelRequestedOrders.map((order) => (
                      <tr key={order.id}>
                        <Td>
                          <div style={{ fontWeight: 700, color: '#1e293b' }}>#{order.id}</div>
                          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                            {formatDate(order.order_date)}
                          </div>
                        </Td>
                        <Td>
                          <div style={{ fontWeight: 600 }}>{order.full_name || 'N/A'}</div>
                          <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>
                            {order.phone_number || 'No phone'}
                          </div>
                        </Td>
                        <Td>
                          <ItemsList>
                            {(order.order_items || []).map((item, index) => (
                              <ItemRow key={item.id || index}>
                                {item.image_url && <ItemThumbnail src={item.image_url} alt={item.book_title} />}
                                <div>
                                  <div style={{ fontWeight: 500 }}>{item.book_title || `Book ID: ${item.book_id}`}</div>
                                  <div style={{ fontSize: '11px', color: '#64748b' }}>
                                    Qty: {item.quantity} × {formatCurrency(item.price)}
                                  </div>
                                </div>
                              </ItemRow>
                            ))}
                          </ItemsList>
                        </Td>
                        <Td style={{ fontWeight: 700, color: '#0f172a' }}>
                          {formatCurrency(order.total_price)}
                        </Td>
                        <Td>
                          <StatusBadge $status={order.status}>{order.status}</StatusBadge>
                        </Td>
                        <Td>
                          <CancelRequestPanel style={{ marginTop: 0 }}>
                            <CancelRequestReason>
                              Reason: {order.note || 'User requested cancel'}
                            </CancelRequestReason>
                            <InputDesc
                              placeholder="Action note / reason"
                              value={statusDesc[order.id] || ''}
                              onChange={(e) => setStatusDesc({ ...statusDesc, [order.id]: e.target.value })}
                            />
                            <QuickActions>
                              <ActionButton
                                $variant="success"
                                onClick={() => resolveCancel(order.id, true)}
                                disabled={updatingId === order.id}
                              >
                                Approve Cancel
                              </ActionButton>
                              <ActionButton
                                $variant="danger"
                                onClick={() => resolveCancel(order.id, false)}
                                disabled={updatingId === order.id}
                              >
                                Reject Request
                              </ActionButton>
                            </QuickActions>
                          </CancelRequestPanel>
                        </Td>
                      </tr>
                    ))
                  })()}
                </tbody>
              </AdminTable>
            </TableContainer>
          )}
        </>
      )}

      {activeTab === 'returns' && (
        <>
          {r.loading && <p>Loading return requests...</p>}
          {r.error && <Alert>{r.error.message || 'Failed to load return requests'}</Alert>}

          {!r.loading && !r.error && (
            <TableContainer>
              <AdminTable>
                <thead>
                  <tr>
                    <Th>ID / Date</Th>
                    <Th>Customer</Th>
                    <Th>Item Details</Th>
                    <Th>Reason</Th>
                    <Th>Status</Th>
                    <Th>Action</Th>
                  </tr>
                </thead>
                <tbody>
                  {(r.data || []).length === 0 ? (
                    <tr>
                      <Td colSpan={6} style={{ textAlign: 'center' }}>No return requests found.</Td>
                    </tr>
                  ) : (
                    r.data.map((req) => {
                      const currentStatus = req.status || 'PENDING'
                      return (
                        <tr key={req.id}>
                          <Td>
                            <div style={{ fontWeight: 700, color: '#1e293b' }}>#{req.id}</div>
                            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                              Order ID: #{req.order_id}
                            </div>
                            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                              {formatDate(req.request_date)}
                            </div>
                          </Td>
                          <Td>
                            <div style={{ fontWeight: 600 }}>{req.buyer_full_name || 'N/A'}</div>
                            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                              {req.buyer_email || 'No email'}
                            </div>
                          </Td>
                          <Td>
                            <div style={{ fontWeight: 500 }}>{req.book_title || `Item ID: ${req.order_item_id}`}</div>
                            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                              Quantity: {req.quantity}
                            </div>
                          </Td>
                          <Td style={{ fontStyle: 'italic', color: '#475569' }}>
                            {req.reason || '(No reason specified)'}
                          </Td>
                          <Td>
                            <StatusBadge $status={currentStatus}>{currentStatus}</StatusBadge>
                            {req.processed_date && (
                              <div style={{ fontSize: '11px', color: '#475569', marginTop: '4px' }}>
                                Processed: {formatDate(req.processed_date)}
                              </div>
                            )}
                          </Td>
                          <Td>
                            {currentStatus === 'PENDING' ? (
                              <QuickActions>
                                <ActionButton
                                  $variant="success"
                                  onClick={() => resolveReturn(req.id, true)}
                                  disabled={updatingId === req.id}
                                >
                                  Approve
                                </ActionButton>
                                <ActionButton
                                  $variant="danger"
                                  onClick={() => resolveReturn(req.id, false)}
                                  disabled={updatingId === req.id}
                                >
                                  Reject
                                </ActionButton>
                              </QuickActions>
                            ) : (
                              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, fontStyle: 'italic', padding: '8px', backgroundColor: '#f1f5f9', borderRadius: '8px', textAlign: 'center' }}>
                                Handled ({currentStatus})
                              </div>
                            )}
                          </Td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </AdminTable>
            </TableContainer>
          )}
        </>
      )}
    </Container>
    </>
  )
}


export function AdminAddBookPage() {
  const [activeSubTab, setActiveSubTab] = useState('book-directory') // 'book-directory', 'book-form', or 'categories-crud'
  const [editingBookId, setEditingBookId] = useState(null)

  // Book Form State
  const [form, setForm] = useState({
    title: '',
    author: '',
    selling_price: '',
    stock_quantity: '',
    code: '',
    edition: '1',
    publication_date: new Date().toISOString().split('T')[0],
    book_detail: {
      description: '',
      height: '',
      length: '',
      pages: '',
      publisher: '',
      supplier: '',
      weight: '',
      width: ''
    }
  })

  // Directory List Filter States
  const [directoryBooks, setDirectoryBooks] = useState([])
  const [dirPage, setDirPage] = useState(1)
  const [dirTotalPages, setDirTotalPages] = useState(1)
  const [dirSearch, setDirSearch] = useState('')
  const [dirStatus, setDirStatus] = useState('ALL') // 'ALL', 'ACTIVE', 'DELETED'
  const [dirCategory, setDirCategory] = useState('')
  const [dirSort, setDirSort] = useState('id')
  const [dirOrder, setDirOrder] = useState('desc')
  const [dirLoading, setDirLoading] = useState(false)

  // Local Category Checklist & General Category List State
  const [categoriesList, setCategoriesList] = useState([])
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([])

  // Local Images Draft Queue State
  const [localImages, setLocalImages] = useState([])
  const [dragImageId, setDragImageId] = useState(null)

  // Image Input Draft State
  const [imageInputForm, setImageInputForm] = useState({
    image_url: '',
    sort_order: 0,
    is_primary: false,
    alt_text: ''
  })

  // Category CRUD Form State
  const [categoryForm, setCategoryForm] = useState({ name: '', parent_id: '' })
  const [editingCategoryId, setEditingCategoryId] = useState(null)

  // Status indicators
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Format currency & dates
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0)
  }

  // Load categories list on mount
  async function loadCategories() {
    try {
      const res = await categoriesApi.list()
      setCategoriesList(res)
    } catch (err) {
      console.error('Failed to load categories', err)
    }
  }

  // Load Directory Books List with full admin filtering
  async function loadDirectoryBooks() {
    try {
      setDirLoading(true)
      const params = {
        page: dirPage,
        size: 10,
        q: dirSearch || undefined,
        category_id: dirCategory ? Number(dirCategory) : undefined,
        sort: dirSort,
        order: dirOrder,
        include_deleted: true
      }
      if (dirStatus === 'ACTIVE') {
        params.status = 'active'
      } else if (dirStatus === 'DELETED') {
        params.status = 'deleted'
      }
      const res = await booksApi.adminList(params)
      setDirectoryBooks(res.data || [])
      setDirTotalPages(res.page?.pages || 1)
    } catch (err) {
      console.error('Failed to load directory books', err)
    } finally {
      setDirLoading(false)
    }
  }

  // Reset Form attributes back to default
  function resetForm() {
    setForm({
      title: '',
      author: '',
      selling_price: '',
      stock_quantity: '',
      code: '',
      edition: '1',
      publication_date: new Date().toISOString().split('T')[0],
      book_detail: {
        description: '',
        height: '',
        length: '',
        pages: '',
        publisher: '',
        supplier: '',
        weight: '',
        width: ''
      }
    })
    setSelectedCategoryIds([])
    setLocalImages([])
    setEditingBookId(null)
    setError('')
    setMsg('')
  }

  // Soft Delete a book listing
  async function handleSoftDelete(bookId) {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tạm thời sách này? Sách sẽ bị ẩn khỏi cửa hàng.')) return
    try {
      setLoading(true)
      await booksApi.remove(bookId)
      setMsg('Đã xóa sách thành công!')
      await loadDirectoryBooks()
    } catch (err) {
      setError(err.message || 'Xóa sách thất bại')
    } finally {
      setLoading(false)
    }
  }

  // Restore a deleted book listing
  async function handleRestore(bookId) {
    try {
      setLoading(true)
      await booksApi.restore(bookId)
      setMsg('Đã khôi phục sách thành công!')
      await loadDirectoryBooks()
    } catch (err) {
      setError(err.message || 'Khôi phục thất bại')
    } finally {
      setLoading(false)
    }
  }

  // Pre-fill book info & detail to edit
  async function startEditBook(book) {
    try {
      setLoading(true)
      setError('')
      setMsg('Đang tải thông tin chi tiết sách...')

      const detail = await booksApi.detail(book.id)

      setEditingBookId(book.id)
      setForm({
        title: detail.title || '',
        author: detail.author || '',
        selling_price: String(detail.selling_price || ''),
        stock_quantity: String(detail.stock_quantity || '0'),
        code: detail.code || '',
        edition: String(detail.edition || '1'),
        publication_date: detail.publication_date || new Date().toISOString().split('T')[0],
        book_detail: {
          description: detail.book_detail?.description || '',
          height: String(detail.book_detail?.height || ''),
          length: String(detail.book_detail?.length || ''),
          pages: String(detail.book_detail?.pages || ''),
          publisher: detail.book_detail?.publisher || '',
          supplier: detail.book_detail?.supplier || '',
          weight: String(detail.book_detail?.weight || ''),
          width: String(detail.book_detail?.width || '')
        }
      })

      const selectedCats = (detail.categories || []).map(c => c.id)
      setSelectedCategoryIds(selectedCats)

      const imgList = (detail.images || []).map(img => ({
        id: `cdn-${img.id}`,
        file: null,
        image_url: img.image_url,
        sort_order: img.sort_order,
        is_primary: img.is_primary,
        alt_text: img.alt_text || 'Product image'
      }))
      setLocalImages(imgList)

      setActiveSubTab('book-form')
      setMsg('Đã tải thông tin sách lên form chỉnh sửa!')
    } catch (err) {
      setError(err.message || 'Không thể tải thông tin sách')
    } finally {
      setLoading(false)
    }
  }

  // Load lists on mounting
  useEffect(() => {
    loadCategories()
  }, [])

  // Auto query directory when parameters change (debounced search input)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadDirectoryBooks()
    }, 300)
    return () => clearTimeout(delayDebounceFn)
  }, [dirPage, dirSearch, dirStatus, dirCategory, dirSort, dirOrder])

  // Build recursive mapping tree helper
  const categoryTree = useMemo(() => {
    const map = {}
    const roots = []

    categoriesList.forEach(c => {
      map[c.id] = { ...c, children: [] }
    })

    categoriesList.forEach(c => {
      if (c.parent_id && map[c.parent_id]) {
        map[c.parent_id].children.push(map[c.id])
      } else if (!c.parent_id) {
        roots.push(map[c.id])
      }
    })
    return roots
  }, [categoriesList])

  // Category Selection Toggle Helper
  function toggleCategorySelection(catId) {
    setSelectedCategoryIds(prev =>
      prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
    )
  }

  // Helper to pick main primary cover image url
  const pickPrimaryImage = (book) => {
    const images = Array.isArray(book?.images) ? book.images : []
    const primary = images.find((x) => x?.is_primary) || images[0]
    return primary?.image_url || book?.image_url || ''
  }

  // Handle image selector input locally (Reads using FileReader & pushes to draft queue)
  function handleLocalFileSelect(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')

    const localUrl = URL.createObjectURL(file)
    const newLocalImg = {
      id: `local-${Date.now()}-${Math.random()}`,
      file: file,
      image_url: localUrl,
      sort_order: localImages.length,
      is_primary: localImages.length === 0, // Make primary if first image
      alt_text: file.name.split('.')[0]
    }

    setLocalImages(prev => [...prev, newLocalImg])
    setMsg('Image added to draft queue!')
  }

  // Handle manual imageUrl entries locally
  function handleManualImageUrlAdd() {
    if (!imageInputForm.image_url.trim()) {
      setError('Please provide a valid image URL')
      return
    }
    setError('')
    const newLocalImg = {
      id: `manual-${Date.now()}-${Math.random()}`,
      file: null,
      image_url: imageInputForm.image_url,
      sort_order: Number(imageInputForm.sort_order || localImages.length),
      is_primary: Boolean(imageInputForm.is_primary) || localImages.length === 0,
      alt_text: imageInputForm.alt_text || 'Product image'
    }

    // If marked primary, uncheck others
    if (newLocalImg.is_primary) {
      setLocalImages(prev => prev.map(img => ({ ...img, is_primary: false })).concat(newLocalImg))
    } else {
      setLocalImages(prev => [...prev, newLocalImg])
    }

    setImageInputForm({ image_url: '', sort_order: 0, is_primary: false, alt_text: '' })
    setMsg('Custom Image link added to draft queue!')
  }

  // Set cover/primary local image draft
  function setPrimaryLocalImage(targetId) {
    setLocalImages(prev => prev.map(img => ({
      ...img,
      is_primary: img.id === targetId
    })))
  }

  // Remove local image draft
  function removeLocalImage(targetId) {
    setLocalImages(prev => prev.filter(img => img.id !== targetId))
  }

  // Drag and drop sorting inside local image drafts
  function onDropLocalImage(targetImageId) {
    if (!dragImageId || !targetImageId || dragImageId === targetImageId) return
    const sourceIndex = localImages.findIndex(x => x.id === dragImageId)
    const targetIndex = localImages.findIndex(x => x.id === targetImageId)
    if (sourceIndex < 0 || targetIndex < 0) return

    const next = [...localImages]
    const [moved] = next.splice(sourceIndex, 1)
    next.splice(targetIndex, 0, moved)

    // Recalculate sort orders based on new index positions
    const sorted = next.map((img, idx) => ({ ...img, sort_order: idx }))
    setLocalImages(sorted)
    setDragImageId(null)
  }

  // Unified Save Book creation & modification workflow
  async function handleBookPublish() {
    if (!form.title.trim()) {
      setError('Book Title is required')
      return
    }
    if (!form.author.trim()) {
      setError('Author is required')
      return
    }
    if (!form.selling_price) {
      setError('Selling Price is required')
      return
    }

    try {
      setLoading(true)
      setError('')
      const isEditing = editingBookId !== null

      setMsg(isEditing ? 'Đang thực hiện giao dịch cập nhật sách...' : 'Starting book registration transaction...')

      // 1. Upload all local files sequentially to Cloudinary CDN
      const token = localStorage.getItem('access_token')
      const uploadedImages = []

      for (let i = 0; i < localImages.length; i++) {
        const item = localImages[i]

        let finalRemoteUrl = item.image_url
        if (item.file) {
          setMsg(`Uploading product image ${i + 1}/${localImages.length}...`)
          const cdnResult = await uploadApi.generalImage(item.file, token)
          if (cdnResult?.url) {
            finalRemoteUrl = cdnResult.url
          } else {
            throw new Error(`CDN upload failed for image ${i + 1}`)
          }
        }

        uploadedImages.push({
          id: item.id.startsWith('cdn-') ? Number(item.id.replace('cdn-', '')) : null,
          image_url: finalRemoteUrl,
          sort_order: i,
          is_primary: item.is_primary,
          alt_text: item.alt_text,
          isNew: !item.id.startsWith('cdn-')
        })
      }

      // 2. Format detailed physical metrics
      const bookDetailPayload = {
        description: form.book_detail.description || null,
        height: form.book_detail.height ? Number(form.book_detail.height) : null,
        length: form.book_detail.length ? Number(form.book_detail.length) : null,
        width: form.book_detail.width ? Number(form.book_detail.width) : null,
        weight: form.book_detail.weight ? Number(form.book_detail.weight) : null,
        pages: form.book_detail.pages ? Number(form.book_detail.pages) : null,
        publisher: form.book_detail.publisher || null,
        supplier: form.book_detail.supplier || null
      }

      const bookPayload = {
        title: form.title,
        author: form.author,
        selling_price: Number(form.selling_price),
        stock_quantity: Number(form.stock_quantity || 0),
        code: form.code || null,
        edition: form.edition ? Number(form.edition) : 1,
        publication_date: form.publication_date || null
      }

      let savedBookId = editingBookId

      if (isEditing) {
        setMsg('Đang cập nhật thông tin và thông số vật lý...')

        const currentDetail = await booksApi.detail(editingBookId)
        const detailId = currentDetail?.book_detail_id || currentDetail?.book_detail?.id

        if (detailId) {
          await booksApi.updateDetail(detailId, bookDetailPayload)
        }

        await booksApi.update(editingBookId, bookPayload)

        // Sync categories
        setMsg('Đang cập nhật liên kết danh mục...')
        await booksApi.categories.update(editingBookId, { category_ids: selectedCategoryIds })

        // Sync image links
        setMsg('Đang đồng bộ hóa hình ảnh sản phẩm...')
        const existingImages = currentDetail?.images || []

        // Remove deleted images
        const keptIds = uploadedImages.filter(x => !x.isNew).map(x => x.id)
        const toDelete = existingImages.filter(x => !keptIds.includes(x.id))

        for (const img of toDelete) {
          await booksApi.images.remove(editingBookId, img.id)
        }

        // Create new or update order
        for (const img of uploadedImages) {
          if (img.isNew) {
            await booksApi.images.create(editingBookId, {
              image_url: img.image_url,
              sort_order: img.sort_order,
              is_primary: img.is_primary,
              alt_text: img.alt_text
            })
          } else {
            await booksApi.images.update(editingBookId, img.id, {
              sort_order: img.sort_order,
              is_primary: img.is_primary,
              alt_text: img.alt_text
            })
          }
        }

        setMsg(`Thành công! Đã lưu thay đổi cho sách "${form.title}"!`)
      } else {
        setMsg('Registering book and product details into database...')
        const bookCreatePayload = {
          ...bookPayload,
          book_detail: bookDetailPayload
        }

        const createdBook = await booksApi.create(bookCreatePayload)
        savedBookId = createdBook?.id || createdBook?.data?.id

        if (!savedBookId) {
          throw new Error('Registration failed, could not obtain Book ID')
        }

        // Update and bind categories
        if (selectedCategoryIds.length > 0) {
          setMsg('Associating selected categories with book...')
          await booksApi.categories.update(savedBookId, { category_ids: selectedCategoryIds })
        }

        // Create backend book images links
        if (uploadedImages.length > 0) {
          setMsg('Linking product images to database...')
          for (const img of uploadedImages) {
            await booksApi.images.create(savedBookId, {
              image_url: img.image_url,
              sort_order: img.sort_order,
              is_primary: img.is_primary,
              alt_text: img.alt_text
            })
          }
        }

        setMsg(`Success! Book "${form.title}" published successfully with ID #${savedBookId}!`)
      }

      // Clear form and reload directory
      resetForm()
      setActiveSubTab('book-directory')
      await loadDirectoryBooks()
    } catch (err) {
      console.error(err)
      setError(err.message || 'Workflow submission failed')
    } finally {
      setLoading(false)
    }
  }

  // CATEGORY CRUD HANDLERS
  async function submitCategoryForm(e) {
    e.preventDefault()
    if (!categoryForm.name.trim()) return
    try {
      setLoading(true)
      setError('')
      const payload = {
        name: categoryForm.name.trim(),
        parent_id: categoryForm.parent_id ? Number(categoryForm.parent_id) : null
      }
      if (editingCategoryId) {
        await categoriesApi.update(editingCategoryId, payload)
        setMsg('Category updated successfully!')
      } else {
        await categoriesApi.create(payload)
        setMsg('Category created successfully!')
      }
      setCategoryForm({ name: '', parent_id: '' })
      setEditingCategoryId(null)
      await loadCategories()
    } catch (err) {
      setError(err.message || 'Category modification failed')
    } finally {
      setLoading(false)
    }
  }

  function startEditCategory(cat) {
    setEditingCategoryId(cat.id)
    setCategoryForm({
      name: cat.name || '',
      parent_id: cat.parent_id ? String(cat.parent_id) : ''
    })
    setMsg('')
    setError('')
  }

  async function handleDeleteCategory(id) {
    if (!window.confirm('Are you sure you want to delete this category? (Child categories will lose their parent binding)')) return
    try {
      setLoading(true)
      setError('')
      await categoriesApi.remove(id)
      setMsg('Category deleted successfully!')
      await loadCategories()
    } catch (err) {
      setError(err.message || 'Deletion failed')
    } finally {
      setLoading(false)
    }
  }

  // Recursive Category List Renderer helper
  function renderCategoryNodes(nodes) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {nodes.map(node => (
          <div key={node.id}>
            <CategoryRow>
              <CategoryInfo>
                <Folder size={16} style={{ color: '#8b5cf6' }} />
                <span>{node.name}</span>
                {node.parent_id && <CategoryBadge>Sub-category</CategoryBadge>}
              </CategoryInfo>
              <CategoryActions>
                <ActionButton
                  style={{ padding: '4px 8px', fontSize: '11px', backgroundColor: '#8b5cf6' }}
                  onClick={() => startEditCategory(node)}
                >
                  <Edit2 size={12} /> Edit
                </ActionButton>
                <ActionButton
                  style={{ padding: '4px 8px', fontSize: '11px', backgroundColor: '#ef4444' }}
                  onClick={() => handleDeleteCategory(node.id)}
                >
                  <Trash2 size={12} /> Delete
                </ActionButton>
              </CategoryActions>
            </CategoryRow>
            {node.children && node.children.length > 0 && (
              <SubCategoryContainer>
                {renderCategoryNodes(node.children)}
              </SubCategoryContainer>
            )}
          </div>
        ))}
      </div>
    )
  }

  // Recursive Category Checklist Selector for Book Creator
  function renderCategoryCheckboxes(nodes) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginLeft: '4px' }}>
        {nodes.map(node => (
          <div key={node.id} style={{ marginLeft: node.parent_id ? '16px' : '0px' }}>
            <CheckboxWrapper>
              <input
                type="checkbox"
                checked={selectedCategoryIds.includes(node.id)}
                onChange={() => toggleCategorySelection(node.id)}
              />
              <span style={{ fontWeight: node.parent_id ? 500 : 700, fontSize: '13px' }}>
                {node.name}
              </span>
            </CheckboxWrapper>
            {node.children && node.children.length > 0 && (
              <div style={{ borderLeft: '1px dotted #cbd5e1', marginLeft: '6px', paddingLeft: '8px' }}>
                {renderCategoryCheckboxes(node.children)}
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      <AdminNavbar />
      <Container>
        <Header>
          <Title>Book & Category Catalog Hub</Title>
        </Header>

        {/* Tab switch panel */}
        <TabHeader>
          <TabButton
            $active={activeSubTab === 'book-directory'}
            onClick={() => { setActiveSubTab('book-directory'); setMsg(''); setError(''); }}
          >
            <Layers size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            Book Directory
          </TabButton>
          <TabButton
            $active={activeSubTab === 'book-form'}
            onClick={() => { setActiveSubTab('book-form'); setMsg(''); setError(''); }}
          >
            <BookOpen size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            {editingBookId ? 'Modify Book Entry' : 'Book Creator'}
          </TabButton>
          <TabButton
            $active={activeSubTab === 'categories-crud'}
            onClick={() => { setActiveSubTab('categories-crud'); setMsg(''); setError(''); }}
          >
            <Folder size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            Category Management
          </TabButton>
        </TabHeader>

        {/* Tab 1: Book Directory Table */}
        {activeSubTab === 'book-directory' && (
          <>
            <FilterBar style={{ marginBottom: '16px', marginTop: '8px' }}>
              <SearchInput
                type="text"
                placeholder="Search books by title, author or sku..."
                value={dirSearch}
                onChange={(e) => { setDirSearch(e.target.value); setDirPage(1); }}
              />

              <select
                style={{
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '14px',
                  fontWeight: 500,
                  outline: 'none',
                  cursor: 'pointer',
                  minWidth: '150px'
                }}
                value={dirStatus}
                onChange={(e) => { setDirStatus(e.target.value); setDirPage(1); }}
              >
                <option value="ALL">All Listings</option>
                <option value="ACTIVE">Active Only</option>
                <option value="DELETED">Deleted Only</option>
              </select>

              <select
                style={{
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '14px',
                  fontWeight: 500,
                  outline: 'none',
                  cursor: 'pointer',
                  minWidth: '180px'
                }}
                value={dirCategory}
                onChange={(e) => { setDirCategory(e.target.value); setDirPage(1); }}
              >
                <option value="">All Categories</option>
                {categoriesList.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              <select
                style={{
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '14px',
                  fontWeight: 500,
                  outline: 'none',
                  cursor: 'pointer',
                  minWidth: '150px'
                }}
                value={dirSort}
                onChange={(e) => { setDirSort(e.target.value); setDirPage(1); }}
              >
                <option value="id">Sort: ID</option>
                <option value="title">Sort: Title</option>
                <option value="selling_price">Sort: Price</option>
                <option value="stock_quantity">Sort: Stock</option>
              </select>

              <select
                style={{
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '14px',
                  fontWeight: 500,
                  outline: 'none',
                  cursor: 'pointer'
                }}
                value={dirOrder}
                onChange={(e) => { setDirOrder(e.target.value); setDirPage(1); }}
              >
                <option value="desc">Desc</option>
                <option value="asc">Asc</option>
              </select>

              <ActionButton
                style={{ marginLeft: 'auto', backgroundColor: '#10b981' }}
                onClick={() => { resetForm(); setActiveSubTab('book-form'); }}
              >
                <Plus size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                New Entry
              </ActionButton>
            </FilterBar>

            {msg && <p style={{ color: '#10b981', fontWeight: 600, fontSize: '13px', margin: '8px 0' }}>{msg}</p>}
            {error && <p style={{ color: '#ef4444', fontWeight: 600, fontSize: '13px', margin: '8px 0' }}>{error}</p>}

            {dirLoading && <P>Loading books directory...</P>}
            {!dirLoading && (
              <TableContainer>
                <AdminTable>
                  <thead>
                    <tr>
                      <Th style={{ width: '80px' }}>ID</Th>
                      <Th>Book Info</Th>
                      <Th>Author</Th>
                      <Th style={{ width: '150px' }}>Selling Price</Th>
                      <Th style={{ width: '100px' }}>Stock</Th>
                      <Th style={{ width: '120px' }}>Status</Th>
                      <Th style={{ width: '220px', textAlign: 'right' }}>Actions</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {directoryBooks.length === 0 ? (
                      <tr>
                        <Td colSpan={7} style={{ textAlign: 'center', padding: '32px' }}>
                          No books found in catalogue.
                        </Td>
                      </tr>
                    ) : (
                      directoryBooks.map((book) => {
                        const primaryImg = pickPrimaryImage(book)
                        const isDeleted = book.deleted_at !== null
                        return (
                          <tr key={book.id} style={{ opacity: isDeleted ? 0.6 : 1 }}>
                            <Td style={{ fontWeight: 700 }}>#{book.id}</Td>
                            <Td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                {primaryImg ? (
                                  <img
                                    src={primaryImg}
                                    alt={book.title}
                                    style={{ width: '40px', height: '56px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                                  />
                                ) : (
                                  <div style={{ width: '40px', height: '56px', backgroundColor: '#e2e8f0', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <BookOpen size={16} style={{ color: '#94a3b8' }} />
                                  </div>
                                )}
                                <div>
                                  <div style={{ fontWeight: 700, color: '#1e293b' }}>{book.title}</div>
                                  {book.code && (
                                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                                      SKU: {book.code}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </Td>
                            <Td style={{ fontWeight: 500 }}>{book.author}</Td>
                            <Td style={{ fontWeight: 700, color: '#1e293b' }}>
                              {formatCurrency(book.selling_price)}
                            </Td>
                            <Td style={{ fontWeight: 600 }}>
                              {book.stock_quantity || 0}
                            </Td>
                            <Td>
                              <span style={{
                                display: 'inline-block',
                                padding: '4px 8px',
                                borderRadius: '9999px',
                                fontSize: '11px',
                                fontWeight: 700,
                                backgroundColor: isDeleted ? '#fee2e2' : '#dcfce7',
                                color: isDeleted ? '#991b1b' : '#166534'
                              }}>
                                {isDeleted ? 'Deleted' : 'Active'}
                              </span>
                            </Td>
                            <Td style={{ textAlign: 'right' }}>
                              <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                                <ActionButton
                                  style={{ padding: '6px 12px', fontSize: '12px', backgroundColor: '#3b82f6' }}
                                  onClick={() => startEditBook(book)}
                                >
                                  Edit
                                </ActionButton>
                                {isDeleted ? (
                                  <ActionButton
                                    style={{ padding: '6px 12px', fontSize: '12px', backgroundColor: '#10b981' }}
                                    onClick={() => handleRestore(book.id)}
                                  >
                                    Restore
                                  </ActionButton>
                                ) : (
                                  <ActionButton
                                    style={{ padding: '6px 12px', fontSize: '12px', backgroundColor: '#ef4444' }}
                                    onClick={() => handleSoftDelete(book.id)}
                                  >
                                    Delete
                                  </ActionButton>
                                )}
                              </div>
                            </Td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </AdminTable>

                {dirTotalPages > 1 && (
                  <PaginationContainer>
                    <PaginationInfo>Page {dirPage} of {dirTotalPages}</PaginationInfo>
                    <PaginationControls>
                      <PaginationButton
                        disabled={dirPage === 1}
                        onClick={() => setDirPage(prev => prev - 1)}
                      >
                        Previous
                      </PaginationButton>
                      <PaginationButton
                        disabled={dirPage === dirTotalPages}
                        onClick={() => setDirPage(prev => prev + 1)}
                      >
                        Next
                      </PaginationButton>
                    </PaginationControls>
                  </PaginationContainer>
                )}
              </TableContainer>
            )}
          </>
        )}

        {/* Tab 2: Book Registration & Editor Form */}
        {activeSubTab === 'book-form' && (
          <FormGrid>
            {/* Left Column - Specifications */}
            <FormCard>
              <FormCardTitle>
                <BookOpen size={20} />
                {editingBookId ? `Chỉnh sửa thông số sách: ID #${editingBookId}` : 'Register Detailed Book Attributes'}
              </FormCardTitle>

              {/* SECTION: BASIC INFO */}
              <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Basic Identifiers</h4>
                <FormGroup>
                  <FormLabel>Book Title *</FormLabel>
                  <FormInput
                    placeholder="e.g. Harry Potter and the Philosopher's Stone"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </FormGroup>

                <FormRow style={{ marginTop: '12px' }}>
                  <FormGroup>
                    <FormLabel>Author *</FormLabel>
                    <FormInput
                      placeholder="e.g. J. K. Rowling"
                      value={form.author}
                      onChange={(e) => setForm({ ...form, author: e.target.value })}
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormLabel>Unique SKU Code</FormLabel>
                    <FormInput
                      placeholder="e.g. HP-001"
                      value={form.code}
                      onChange={(e) => setForm({ ...form, code: e.target.value })}
                    />
                  </FormGroup>
                </FormRow>

                <FormRow style={{ marginTop: '12px' }}>
                  <FormGroup>
                    <FormLabel>Selling Price (VND) *</FormLabel>
                    <FormInput
                      type="number"
                      placeholder="e.g. 150000"
                      value={form.selling_price}
                      onChange={(e) => setForm({ ...form, selling_price: e.target.value })}
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormLabel>Initial Stock Quantity</FormLabel>
                    <FormInput
                      type="number"
                      placeholder="e.g. 50"
                      value={form.stock_quantity}
                      onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })}
                    />
                  </FormGroup>
                </FormRow>
              </div>

              {/* SECTION: EDITION & DATES */}
              <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Edition & Dates</h4>
                <FormRow>
                  <FormGroup>
                    <FormLabel>Book Edition (No.)</FormLabel>
                    <FormInput
                      type="number"
                      placeholder="e.g. 1"
                      value={form.edition}
                      onChange={(e) => setForm({ ...form, edition: e.target.value })}
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormLabel>Publication Date</FormLabel>
                    <FormInput
                      type="date"
                      value={form.publication_date}
                      onChange={(e) => setForm({ ...form, publication_date: e.target.value })}
                    />
                  </FormGroup>
                </FormRow>
              </div>

              {/* SECTION: DETAILED SPECIFICATIONS (Book Details) */}
              <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Catalog & Publisher Details</h4>
                <FormRow>
                  <FormGroup>
                    <FormLabel>Publisher Name</FormLabel>
                    <FormInput
                      placeholder="e.g. Bloomsbury Publishing"
                      value={form.book_detail.publisher}
                      onChange={(e) => setForm({
                        ...form,
                        book_detail: { ...form.book_detail, publisher: e.target.value }
                      })}
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormLabel>Supplier Name</FormLabel>
                    <FormInput
                      placeholder="e.g. Fahasa Distributor"
                      value={form.book_detail.supplier}
                      onChange={(e) => setForm({
                        ...form,
                        book_detail: { ...form.book_detail, supplier: e.target.value }
                      })}
                    />
                  </FormGroup>
                </FormRow>

                <FormRow style={{ marginTop: '12px' }}>
                  <FormGroup>
                    <FormLabel>Total Page Counts</FormLabel>
                    <FormInput
                      type="number"
                      placeholder="e.g. 320"
                      value={form.book_detail.pages}
                      onChange={(e) => setForm({
                        ...form,
                        book_detail: { ...form.book_detail, pages: e.target.value }
                      })}
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormLabel>Weight (g)</FormLabel>
                    <FormInput
                      type="number"
                      placeholder="e.g. 350"
                      value={form.book_detail.weight}
                      onChange={(e) => setForm({
                        ...form,
                        book_detail: { ...form.book_detail, weight: e.target.value }
                      })}
                    />
                  </FormGroup>
                </FormRow>

                <FormRow style={{ marginTop: '12px' }}>
                  <FormGroup>
                    <FormLabel>Width (cm)</FormLabel>
                    <FormInput
                      type="number"
                      step="0.1"
                      placeholder="e.g. 14.5"
                      value={form.book_detail.width}
                      onChange={(e) => setForm({
                        ...form,
                        book_detail: { ...form.book_detail, width: e.target.value }
                      })}
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormLabel>Height (cm)</FormLabel>
                    <FormInput
                      type="number"
                      step="0.1"
                      placeholder="e.g. 20.5"
                      value={form.book_detail.height}
                      onChange={(e) => setForm({
                        ...form,
                        book_detail: { ...form.book_detail, height: e.target.value }
                      })}
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormLabel>Thickness (cm)</FormLabel>
                    <FormInput
                      type="number"
                      step="0.1"
                      placeholder="e.g. 2.1"
                      value={form.book_detail.length}
                      onChange={(e) => setForm({
                        ...form,
                        book_detail: { ...form.book_detail, length: e.target.value }
                      })}
                    />
                  </FormGroup>
                </FormRow>

                <FormGroup style={{ marginTop: '12px' }}>
                  <FormLabel>Book Description</FormLabel>
                  <textarea
                    placeholder="Provide a comprehensive summary or overview..."
                    style={{
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '14px',
                      minHeight: '120px',
                      resize: 'vertical',
                      outline: 'none',
                      fontFamily: 'inherit'
                    }}
                    value={form.book_detail.description}
                    onChange={(e) => setForm({
                      ...form,
                      book_detail: { ...form.book_detail, description: e.target.value }
                    })}
                  />
                </FormGroup>
              </div>

              {/* SECTION: ASSOCIATE HIERARCHICAL CATEGORIES */}
              <div>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Associate Categories</h4>
                <div style={{
                  maxHeight: '260px',
                  overflowY: 'auto',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                  padding: '16px',
                  backgroundColor: '#f8fafc'
                }}>
                  {categoryTree.length === 0 ? (
                    <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>No categories registered. Please add categories in the management tab first.</p>
                  ) : (
                    renderCategoryCheckboxes(categoryTree)
                  )}
                </div>
              </div>

              {/* Feedback messages */}
              {msg && <p style={{ color: '#10b981', fontWeight: 600, fontSize: '13px', margin: 0 }}>{msg}</p>}
              {error && <p style={{ color: '#ef4444', fontWeight: 600, fontSize: '13px', margin: 0 }}>{error}</p>}

              <div style={{ display: 'flex', gap: '12px' }}>
                <FormButton
                  type="button"
                  onClick={handleBookPublish}
                  disabled={loading || !form.title || !form.author || !form.selling_price}
                >
                  {loading ? 'Executing Transaction...' : (editingBookId ? 'Save Book Changes' : 'Publish Book Entry')}
                </FormButton>

                <ActionButton
                  type="button"
                  style={{ backgroundColor: '#64748b' }}
                  onClick={() => { resetForm(); setActiveSubTab('book-directory'); }}
                >
                  Quay lại Directory
                </ActionButton>
              </div>
            </FormCard>

            {/* Right Column - Images local drafter */}
            <FormCard>
              <FormCardTitle><ImageIcon size={20} /> Local Images Queue</FormCardTitle>
              <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
                All selected files and references are held locally. No backend storage is impacted until you press &apos;Publish Book Entry&apos;.
              </p>

              <FormGroup>
                <FormLabel>Cover Image Upload</FormLabel>
                <label htmlFor="local-image-uploader">
                  <UploadDropzone>
                    <UploadIconWrap>
                      <Upload size={24} />
                    </UploadIconWrap>
                    <UploadText>Select file to enqueue</UploadText>
                    <UploadSubtext>PNG, JPG, WEBP locally cached</UploadSubtext>
                    <input
                      type="file"
                      id="local-image-uploader"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleLocalFileSelect}
                    />
                  </UploadDropzone>
                </label>
              </FormGroup>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '4px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                <FormLabel style={{ margin: 0 }}>Or add image link (URL)</FormLabel>
                <FormInput
                  placeholder="https://example.com/cover.png"
                  value={imageInputForm.image_url}
                  onChange={(e) => setImageInputForm({ ...imageInputForm, image_url: e.target.value })}
                />

                <FormRow>
                  <FormGroup>
                    <FormLabel>Alt Description</FormLabel>
                    <FormInput
                      placeholder="e.g. Front Cover"
                      value={imageInputForm.alt_text}
                      onChange={(e) => setImageInputForm({ ...imageInputForm, alt_text: e.target.value })}
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormLabel>Order</FormLabel>
                    <FormInput
                      type="number"
                      value={imageInputForm.sort_order}
                      onChange={(e) => setImageInputForm({ ...imageInputForm, sort_order: Number(e.target.value) })}
                    />
                  </FormGroup>
                </FormRow>

                <CheckboxWrapper>
                  <input
                    type="checkbox"
                    checked={imageInputForm.is_primary}
                    onChange={(e) => setImageInputForm({ ...imageInputForm, is_primary: e.target.checked })}
                  />
                  Mark as Primary Cover
                </CheckboxWrapper>

                <ActionButton style={{ width: '100%' }} onClick={handleManualImageUrlAdd}>
                  Enqueue Image URL
                </ActionButton>
              </div>

              {/* Local Images List Display */}
              <div style={{ marginTop: '16px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                <FormLabel>Staged Local Images ({localImages.length})</FormLabel>
                {localImages.length === 0 ? (
                  <p style={{ fontSize: '12px', color: '#94a3b8', margin: '8px 0 0 0', textAlign: 'center' }}>
                    No media enqueued.
                  </p>
                ) : (
                  <ImageGallery>
                    {localImages.map((img) => (
                      <ImageThumbnailCard
                        key={img.id}
                        $isPrimary={img.is_primary}
                        draggable
                        onDragStart={() => setDragImageId(img.id)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => onDropLocalImage(img.id)}
                      >
                        {img.is_primary && <ThumbnailBadge>Cover</ThumbnailBadge>}
                        <GalleryImage src={img.image_url} alt={img.alt_text} />
                        <div style={{ display: 'flex', gap: '4px', width: '100%' }}>
                          <ActionButton
                            style={{ padding: '4px', fontSize: '10px', flex: 1, backgroundColor: '#8b5cf6' }}
                            title="Set Primary"
                            onClick={() => setPrimaryLocalImage(img.id)}
                          >
                            <ArrowUp size={12} />
                          </ActionButton>
                          <ActionButton
                            style={{ padding: '4px', fontSize: '10px', backgroundColor: '#ef4444' }}
                            title="Delete"
                            onClick={() => removeLocalImage(img.id)}
                          >
                            <Trash2 size={12} />
                          </ActionButton>
                        </div>
                      </ImageThumbnailCard>
                    ))}
                  </ImageGallery>
                )}
              </div>
            </FormCard>
          </FormGrid>
        )}

        {/* Tab Content 3: Category CRUD Manager */}
        {activeSubTab === 'categories-crud' && (
          <FormGrid>
            {/* Left side: Category registration / modification */}
            <FormCard>
              <FormCardTitle>
                <Layers size={20} />
                {editingCategoryId ? 'Modify Category' : 'Register New Category'}
              </FormCardTitle>

              <form onSubmit={submitCategoryForm} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <FormGroup>
                  <FormLabel>Category Name *</FormLabel>
                  <FormInput
                    placeholder="e.g. Science Fiction"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <FormLabel>Parent Category</FormLabel>
                  <select
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: '#ffffff',
                      color: '#1e293b',
                      cursor: 'pointer'
                    }}
                    value={categoryForm.parent_id}
                    onChange={(e) => setCategoryForm({ ...categoryForm, parent_id: e.target.value })}
                  >
                    <option value="">-- No Parent (Root Category) --</option>
                    {categoriesList
                      .filter(c => c.id !== editingCategoryId) // Prevent self parent loop
                      .map(c => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                  </select>
                </FormGroup>

                {msg && <p style={{ color: '#10b981', fontWeight: 600, fontSize: '13px', margin: 0 }}>{msg}</p>}
                {error && <p style={{ color: '#ef4444', fontWeight: 600, fontSize: '13px', margin: 0 }}>{error}</p>}

                <div style={{ display: 'flex', gap: '10px' }}>
                  <FormButton type="submit" disabled={loading}>
                    {editingCategoryId ? 'Update Category' : 'Create Category'}
                  </FormButton>
                  {editingCategoryId && (
                    <ActionButton
                      type="button"
                      style={{ backgroundColor: '#64748b' }}
                      onClick={() => {
                        setEditingCategoryId(null)
                        setCategoryForm({ name: '', parent_id: '' })
                      }}
                    >
                      Cancel Edit
                    </ActionButton>
                  )}
                </div>
              </form>
            </FormCard>

            {/* Right side: Categories tree display hierarchy */}
            <FormCard>
              <FormCardTitle><Folder size={20} /> Categories Hierarchy Tree</FormCardTitle>
              {categoryTree.length === 0 ? (
                <p style={{ fontSize: '13px', color: '#64748b', textAlign: 'center', padding: '20px' }}>
                  No categories found. Start by registering a category on the left side!
                </p>
              ) : (
                <CategoryTreeContainer>
                  {renderCategoryNodes(categoryTree)}
                </CategoryTreeContainer>
              )}
            </FormCard>
          </FormGrid>
        )}
      </Container>
    </>
  )
}
