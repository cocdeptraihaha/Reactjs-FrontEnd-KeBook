import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ordersApi } from '../../../api/orders'
import { returnRequestsApi } from '../../../api/returnRequests'
import { AdminNavbar } from '../../../components/AdminNavbar'
import { Dropdown } from '../../../components/ui/Dropdown'
import { Alert } from '../../WorkflowPages.styles'
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
  const queryClient = useQueryClient()

  const STATUS_LABELS = {
    PENDING: 'Chờ xử lý',
    CONFIRMED: 'Đã xác nhận',
    INPROGRESS: 'Đang chuẩn bị',
    SHIPPED: 'Đang giao',
    DELIVERED: 'Đã giao',
    COMPLETED: 'Hoàn tất',
    CANCELLED: 'Đã hủy',
    CANCEL_REQUESTED: 'Yêu cầu hủy',
    RETURNED: 'Hoàn trả',
    APPROVED: 'Đã duyệt',
    REJECTED: 'Bị từ chối',
  }

  // Filters state
  const [searchTerm, setSearchInput] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [sortBy, setSortBy] = useState('date_desc')

  // Pagination states
  const [ordersPage, setOrdersPage] = useState(1)
  const ordersLimit = 10

  const s = useQuery({
    queryKey: ['admin-orders-list', ordersPage, ordersLimit, statusFilter, searchTerm, sortBy],
    queryFn: () => ordersApi.adminList({
      page: ordersPage,
      size: ordersLimit,
      status: statusFilter !== 'ALL' ? statusFilter : undefined,
      search: searchTerm.trim() || undefined,
      sort_by: sortBy,
    }),
    staleTime: 30_000,
  })

  const r = useQuery({
    queryKey: ['admin-return-requests'],
    queryFn: () => returnRequestsApi.adminList(),
    staleTime: 30_000,
  })

  const [activeTab, setActiveTab] = useState('orders')
  const [selectedStatus, setSelectedStatus] = useState({})
  const [statusDesc, setStatusDesc] = useState({})
  const [updatingId, setUpdatingId] = useState(null)

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
      await queryClient.invalidateQueries({ queryKey: ['admin-return-requests'] })
      await queryClient.invalidateQueries({ queryKey: ['admin-orders-list'] })
    } catch (err) {
      alert(err.message || 'Xử lý yêu cầu trả hàng thất bại')
    } finally {
      setUpdatingId(null)
    }
  }

  async function updateStatus(id) {
    const status = selectedStatus[id]
    if (!status) return
    try {
      setUpdatingId(id)
      await ordersApi.adminUpdateStatus(id, {
        status,
        description: statusDesc[id] || `Admin thay đổi trạng thái sang ${status}`
      })
      await queryClient.invalidateQueries({ queryKey: ['admin-orders-list'] })
      setStatusDesc(prev => ({ ...prev, [id]: '' }))
    } catch (err) {
      alert(err.message || 'Cập nhật trạng thái đơn hàng thất bại')
    } finally {
      setUpdatingId(null)
    }
  }

  async function resolveCancel(id, approve) {
    try {
      setUpdatingId(id)
      const desc = statusDesc[id] || (approve ? 'Admin đã duyệt yêu cầu hủy đơn.' : 'Admin đã từ chối yêu cầu hủy đơn.')
      await ordersApi.adminResolveCancel(id, { approve, description: desc })
      await queryClient.invalidateQueries({ queryKey: ['admin-orders-list'] })
      setStatusDesc(prev => ({ ...prev, [id]: '' }))
    } catch (err) {
      alert(err.message || 'Xử lý quyết định hủy đơn thất bại')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <>
      <AdminNavbar />
      <Container>
        <Header>
          <Title>Phê duyệt đơn hàng Admin</Title>
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
            Danh sách đơn hàng
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
            Yêu cầu hủy đơn
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
            Yêu cầu trả hàng
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
                { value: 'PENDING', label: 'Chờ xử lý' },
                { value: 'CONFIRMED', label: 'Đã xác nhận' },
                { value: 'INPROGRESS', label: 'Đang chuẩn bị' },
                { value: 'SHIPPED', label: 'Đang giao' },
                { value: 'DELIVERED', label: 'Đã giao' },
                { value: 'COMPLETED', label: 'Hoàn tất' },
                { value: 'CANCELLED', label: 'Đã hủy' },
                { value: 'CANCEL_REQUESTED', label: 'Yêu cầu hủy' },
                { value: 'RETURNED', label: 'Hoàn trả' }
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
            const paginatedOrders = s.data?.items || []
            const pagination = {
              total: s.data?.total || 0,
              page: s.data?.page || 1,
              size: s.data?.size || ordersLimit,
              pages: s.data?.pages || 1,
            }

            return (
              <TableContainer>
                <AdminTable>
                  <thead>
                    <tr>
                      <Th>Mã đơn / Ngày đặt</Th>
                      <Th>Khách hàng</Th>
                      <Th>Sách đã đặt</Th>
                      <Th>Tổng tiền / PTTT</Th>
                      <Th>Trạng thái</Th>
                      <Th>Quản lý thao tác</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedOrders.length === 0 ? (
                      <tr>
                        <Td colSpan={6} style={{ textAlign: 'center' }}>Không tìm thấy đơn hàng nào.</Td>
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
                            <div style={{ fontWeight: 600 }}>{order.full_name || 'Không rõ'}</div>
                            <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>
                              {order.phone_number || 'Không có SĐT'}
                            </div>
                            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', maxWidth: '200px', wordBreak: 'break-word' }}>
                              {order.shipping_address || 'Không có địa chỉ giao'}
                            </div>
                            {order.note && (
                              <div style={{ fontSize: '12px', color: '#b45309', marginTop: '4px', fontStyle: 'italic' }}>
                                Ghi chú: {order.note}
                              </div>
                            )}
                          </Td>
                          <Td>
                            <ItemsList>
                              {(order.order_items || []).map((item, index) => (
                                <ItemRow key={item.id || index}>
                                  {item.image_url && <ItemThumbnail src={item.image_url} alt={item.book_title} />}
                                  <div>
                                    <div style={{ fontWeight: 500 }}>{item.book_title || `ID Sách: ${item.book_id}`}</div>
                                    <div style={{ fontSize: '11px', color: '#64748b' }}>
                                      SL: {item.quantity} × {formatCurrency(item.price)}
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
                              PTTT: {order.payment_method || 'Không rõ'}
                            </div>
                            <div style={{ fontSize: '11px', color: order.payment_status === 'PAID' ? '#16a34a' : '#ea580c', fontWeight: 700, marginTop: '4px' }}>
                              Thanh toán: {order.payment_status === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                            </div>
                          </Td>
                          <Td>
                            <StatusBadge $status={currentStatus}>{STATUS_LABELS[currentStatus] || currentStatus}</StatusBadge>
                            {order.tracking_number && (
                              <div style={{ fontSize: '11px', color: '#475569', marginTop: '6px' }}>
                                Vận đơn: {order.tracking_number} ({order.shipping_provider})
                              </div>
                            )}
                          </Td>
                          <Td>
                            {['CANCELLED', 'COMPLETED', 'RETURNED'].includes(currentStatus) ? (
                              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, fontStyle: 'italic', textAlign: 'center', padding: '8px', backgroundColor: '#f1f5f9', borderRadius: '8px' }}>
                                Đơn {STATUS_LABELS[currentStatus] || currentStatus}
                              </div>
                            ) : currentStatus === 'CANCEL_REQUESTED' ? (
                              <div style={{ fontSize: '13px', color: '#d97706', fontWeight: 600, fontStyle: 'italic', textAlign: 'center', padding: '8px', backgroundColor: '#fffbeb', borderRadius: '8px' }}>
                                Hãy chuyển qua tab "Yêu cầu hủy đơn"
                              </div>
                            ) : (
                              <ActionGroup style={{ overflow: 'visible' }}>
                                <Dropdown
                                  value={activeTargetStatus}
                                  onChange={(val) => setSelectedStatus({ ...selectedStatus, [order.id]: val })}
                                  options={[
                                    { value: 'PENDING', label: 'Chờ xử lý' },
                                    { value: 'CONFIRMED', label: 'Đã xác nhận' },
                                    { value: 'INPROGRESS', label: 'Đang chuẩn bị' },
                                    { value: 'SHIPPED', label: 'Đang giao' },
                                    { value: 'DELIVERED', label: 'Đã giao' },
                                    { value: 'COMPLETED', label: 'Hoàn tất' },
                                    { value: 'CANCELLED', label: 'Đã hủy' },
                                    { value: 'RETURNED', label: 'Hoàn trả' }
                                  ]}
                                  width="100%"
                                />
                                <InputDesc
                                  placeholder="Ghi chú thao tác / lý do"
                                  value={statusDesc[order.id] || ''}
                                  onChange={(e) => setStatusDesc({ ...statusDesc, [order.id]: e.target.value })}
                                />
                                <ActionButton
                                  onClick={() => updateStatus(order.id)}
                                  disabled={updatingId === order.id || activeTargetStatus === currentStatus}
                                >
                                  Cập nhật trạng thái
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
              {pagination.total > 0 && (
                <PaginationContainer>
                  <PaginationInfo>
                    Hiển thị {(pagination.page - 1) * pagination.size + 1} - {Math.min(pagination.page * pagination.size, pagination.total)} của {pagination.total} đơn hàng
                  </PaginationInfo>
                  <PaginationControls>
                    <PaginationButton
                      type="button"
                      disabled={pagination.page === 1}
                      onClick={() => setOrdersPage((p) => Math.max(1, p - 1))}
                    >
                      Trước
                    </PaginationButton>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>
                      Trang {pagination.page} / {pagination.pages}
                    </span>
                    <PaginationButton
                      type="button"
                      disabled={pagination.page === pagination.pages}
                      onClick={() => setOrdersPage((p) => Math.min(pagination.pages, p + 1))}
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
          {s.loading && <p>Đang tải yêu cầu hủy đơn...</p>}
          {s.error && <Alert>{s.error.message || 'Lỗi tải đơn hàng'}</Alert>}

          {!s.loading && !s.error && (
            <TableContainer>
              <AdminTable>
                <thead>
                  <tr>
                    <Th>Mã đơn / Ngày đặt</Th>
                    <Th>Khách hàng</Th>
                    <Th>Sách đã đặt</Th>
                    <Th>Tổng tiền</Th>
                    <Th>Trạng thái</Th>
                    <Th>Thao tác</Th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const cancelRequestedOrders = (s.data?.items || []).filter(o => o.status === 'CANCEL_REQUESTED')
                    if (cancelRequestedOrders.length === 0) {
                      return (
                        <tr>
                          <Td colSpan={6} style={{ textAlign: 'center' }}>Không có yêu cầu hủy đơn nào.</Td>
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
                          <div style={{ fontWeight: 600 }}>{order.full_name || 'Không rõ'}</div>
                          <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>
                            {order.phone_number || 'Không có SĐT'}
                          </div>
                        </Td>
                        <Td>
                          <ItemsList>
                            {(order.order_items || []).map((item, index) => (
                              <ItemRow key={item.id || index}>
                                {item.image_url && <ItemThumbnail src={item.image_url} alt={item.book_title} />}
                                <div>
                                  <div style={{ fontWeight: 500 }}>{item.book_title || `ID Sách: ${item.book_id}`}</div>
                                  <div style={{ fontSize: '11px', color: '#64748b' }}>
                                    SL: {item.quantity} × {formatCurrency(item.price)}
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
                          <StatusBadge $status={order.status}>{STATUS_LABELS[order.status] || order.status}</StatusBadge>
                        </Td>
                        <Td>
                          <CancelRequestPanel style={{ marginTop: 0 }}>
                            <CancelRequestReason>
                              Lý do: {order.note || 'Người dùng yêu cầu hủy'}
                            </CancelRequestReason>
                            <InputDesc
                              placeholder="Ghi chú thao tác / lý do"
                              value={statusDesc[order.id] || ''}
                              onChange={(e) => setStatusDesc({ ...statusDesc, [order.id]: e.target.value })}
                            />
                            <QuickActions>
                              <ActionButton
                                $variant="success"
                                onClick={() => resolveCancel(order.id, true)}
                                disabled={updatingId === order.id}
                              >
                                Duyệt
                              </ActionButton>
                              <ActionButton
                                $variant="danger"
                                onClick={() => resolveCancel(order.id, false)}
                                disabled={updatingId === order.id}
                              >
                                Từ chối
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
          {r.loading && <p>Đang tải yêu cầu trả hàng...</p>}
          {r.error && <Alert>{r.error.message || 'Lỗi tải yêu cầu trả hàng'}</Alert>}

          {!r.loading && !r.error && (
            <TableContainer>
              <AdminTable>
                <thead>
                  <tr>
                    <Th>Mã đơn / Ngày đặt</Th>
                    <Th>Khách hàng</Th>
                    <Th>Chi tiết sản phẩm</Th>
                    <Th>Lý do</Th>
                    <Th>Trạng thái</Th>
                    <Th>Thao tác</Th>
                  </tr>
                </thead>
                <tbody>
                  {(r.data || []).length === 0 ? (
                    <tr>
                      <Td colSpan={6} style={{ textAlign: 'center' }}>Không có yêu cầu trả hàng nào.</Td>
                    </tr>
                  ) : (
                    r.data.map((req) => {
                      const currentStatus = req.status || 'PENDING'
                      return (
                        <tr key={req.id}>
                          <Td>
                            <div style={{ fontWeight: 700, color: '#1e293b' }}>#{req.id}</div>
                            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                              Đơn hàng: #{req.order_id}
                            </div>
                            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                              {formatDate(req.request_date)}
                            </div>
                          </Td>
                          <Td>
                            <div style={{ fontWeight: 600 }}>{req.buyer_full_name || 'Không rõ'}</div>
                            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                              {req.buyer_email || 'Không có email'}
                            </div>
                          </Td>
                          <Td>
                            <div style={{ fontWeight: 500 }}>{req.book_title || `Mã sản phẩm: ${req.order_item_id}`}</div>
                            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                              Số lượng: {req.quantity}
                            </div>
                            {req.refund_amount > 0 && (
                              <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: 700, marginTop: '4px' }}>
                                Tiền hoàn: {formatCurrency(req.refund_amount)}
                              </div>
                            )}
                          </Td>
                          <Td style={{ fontStyle: 'italic', color: '#475569' }}>
                            <div>{req.reason || '(Không có lý do chi tiết)'}</div>
                            {req.image_url && (
                              <div style={{ marginTop: '8px' }}>
                                <span style={{ fontSize: '10px', color: '#64748b', display: 'block', fontWeight: 600, fontStyle: 'normal', marginBottom: '2px' }}>Ảnh minh chứng:</span>
                                <a href={req.image_url} target="_blank" rel="noopener noreferrer">
                                  <img
                                    src={req.image_url}
                                    alt="Minh chứng"
                                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #cbd5e1', cursor: 'pointer' }}
                                  />
                                </a>
                              </div>
                            )}
                          </Td>
                          <Td>
                            <StatusBadge $status={currentStatus}>{STATUS_LABELS[currentStatus] || currentStatus}</StatusBadge>
                            {req.processed_date && (
                              <div style={{ fontSize: '11px', color: '#475569', marginTop: '4px' }}>
                                Ngày xử lý: {formatDate(req.processed_date)}
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
                                  Duyệt nhận
                                </ActionButton>
                                <ActionButton
                                  $variant="danger"
                                  onClick={() => resolveReturn(req.id, false)}
                                  disabled={updatingId === req.id}
                                >
                                  Từ chối
                                </ActionButton>
                              </QuickActions>
                            ) : (
                              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, fontStyle: 'italic', padding: '8px', backgroundColor: '#f1f5f9', borderRadius: '8px', textAlign: 'center' }}>
                                Đã xử lý ({currentStatus})
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
