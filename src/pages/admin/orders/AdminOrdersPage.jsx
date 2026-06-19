import { useState } from 'react'
import { ordersApi } from '../../../api/orders'
import { returnRequestsApi } from '../../../api/returnRequests'
import { AdminNavbar } from '../../../components/AdminNavbar'
import { Dropdown } from '../../../components/ui/Dropdown'
import { Alert } from '../../WorkflowPages.styles'
import { useAsync } from '../../../hooks/useAsync'
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
  InputDesc,
  CancelRequestPanel,
  CancelRequestReason,
  QuickActions,
  ActionButton,
  PaginationContainer,
  PaginationInfo,
  PaginationControls,
  PaginationButton,
} from '../AdminWorkflowPages.styles'

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
