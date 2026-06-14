import { useMemo, useState } from 'react'
import { booksApi } from '../../api/books'
import { ordersApi } from '../../api/orders'
import { Section, SectionSub, SectionTitle } from '../../components/Section'
import { useAsync } from '../../hooks/useAsync'
import { Alert, Btn, Input, List, P, Row, Wrap } from '../WorkflowPages.styles'
import {
  Container,
  PageTitle,
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
  QuickActions
} from './AdminWorkflowPages.styles'

export function AdminOrdersPage() {
  const s = useAsync(() => ordersApi.adminList(), [])
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

  async function updateStatus(id) {
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
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'}/orders/admin/${id}/cancel-decision`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ approve, description: desc })
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.detail || 'Failed to resolve cancel request')
      }
      await s.reload()
      setStatusDesc(prev => ({ ...prev, [id]: '' }))
    } catch (err) {
      alert(err.message || 'Failed to process cancellation decision')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <Container>
      <PageTitle>Admin Order Approvals</PageTitle>
      {s.loading && <p>Loading orders...</p>}
      {s.error && <Alert>{s.error.message || 'Failed to load orders'}</Alert>}

      {!s.loading && !s.error && (
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
              {(s.data || []).length === 0 ? (
                <tr>
                  <Td colSpan={6} style={{ textAlign: 'center' }}>No orders found.</Td>
                </tr>
              ) : (
                s.data.map((order) => {
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
                        {currentStatus === 'CANCEL_REQUESTED' ? (
                          <CancelRequestPanel>
                            <CancelRequestTitle>Cancellation Requested</CancelRequestTitle>
                            <CancelRequestReason>
                              Reason: {order.note || 'User requested cancel'}
                            </CancelRequestReason>
                            <InputDesc
                              placeholder="Optional action note"
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
                        ) : (
                          <ActionGroup>
                            <ActionSelect
                              value={activeTargetStatus}
                              onChange={(e) => setSelectedStatus({ ...selectedStatus, [order.id]: e.target.value })}
                            >
                              <option value="PENDING">PENDING</option>
                              <option value="CONFIRMED">CONFIRMED</option>
                              <option value="INPROGRESS">INPROGRESS</option>
                              <option value="SHIPPED">SHIPPED</option>
                              <option value="DELIVERED">DELIVERED</option>
                              <option value="COMPLETED">COMPLETED</option>
                              <option value="CANCELLED">CANCELLED</option>
                              <option value="RETURNED">RETURNED</option>
                            </ActionSelect>
                            <InputDesc
                              placeholder="Action note / reason"
                              value={statusDesc[order.id] || ''}
                              onChange={(e) => setStatusDesc({ ...statusDesc, [order.id]: e.target.value })}
                            />
                            <ActionButton
                              onClick={() => updateStatus(order.id)}
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
        </TableContainer>
      )}
    </Container>
  )
}


export function AdminAddBookPage() {
  const [form, setForm] = useState({ title: '', author: '', selling_price: '', stock_quantity: '', code: '' })
  const [bookId, setBookId] = useState(null)
  const [images, setImages] = useState([])
  const [dragImageId, setDragImageId] = useState(null)
  const [imageForm, setImageForm] = useState({ image_url: '', sort_order: 0, is_primary: false, alt_text: '' })
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  async function loadImages(targetBookId = bookId) {
    if (!targetBookId) return
    const list = await booksApi.images.list(targetBookId)
    setImages(list)
  }

  async function submit() {
    try {
      setError('')
      const created = await booksApi.create({
        ...form,
        selling_price: Number(form.selling_price),
        stock_quantity: Number(form.stock_quantity),
      })
      const newBookId = created?.id || created?.data?.id || null
      setBookId(newBookId)
      setMsg(`Book created${newBookId ? ` (#${newBookId})` : ''}`)
      if (newBookId) await loadImages(newBookId)
    } catch (x) { setError(x.message || 'Create failed') }
  }

  async function addImage() {
    if (!bookId) return
    try {
      setError('')
      await booksApi.images.create(bookId, {
        image_url: imageForm.image_url,
        sort_order: Number(imageForm.sort_order || 0),
        is_primary: Boolean(imageForm.is_primary),
        alt_text: imageForm.alt_text || null,
      })
      setImageForm({ image_url: '', sort_order: 0, is_primary: false, alt_text: '' })
      await loadImages()
    } catch (x) { setError(x.message || 'Add image failed') }
  }

  async function setPrimary(imageId) {
    if (!bookId) return
    try {
      setError('')
      await booksApi.images.update(bookId, imageId, { is_primary: true })
      await loadImages()
    } catch (x) { setError(x.message || 'Set primary failed') }
  }

  async function syncSortOrders(nextImages) {
    if (!bookId) return
    const updates = nextImages.map((img, idx) => booksApi.images.update(bookId, img.id, { sort_order: idx }))
    await Promise.all(updates)
  }

  async function onDropImage(targetImageId) {
    if (!dragImageId || !targetImageId || dragImageId === targetImageId) return
    try {
      setError('')
      const sourceIndex = images.findIndex((x) => x.id === dragImageId)
      const targetIndex = images.findIndex((x) => x.id === targetImageId)
      if (sourceIndex < 0 || targetIndex < 0) return
      const next = [...images]
      const [moved] = next.splice(sourceIndex, 1)
      next.splice(targetIndex, 0, moved)
      setImages(next)
      await syncSortOrders(next)
      await loadImages()
    } catch (x) { setError(x.message || 'Reorder failed') } finally { setDragImageId(null) }
  }

  async function removeImage(imageId) {
    if (!bookId) return
    try {
      setError('')
      await booksApi.images.remove(bookId, imageId)
      await loadImages()
    } catch (x) { setError(x.message || 'Delete image failed') }
  }

  const preview = useMemo(() => `${form.title || 'Untitled'} - ${form.author || 'Unknown'}`, [form.title, form.author])
  return <Wrap><Section><SectionTitle>Admin Add Book</SectionTitle><SectionSub>{preview}</SectionSub><Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /><Input placeholder="Author" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} /><Input placeholder="Selling price" value={form.selling_price} onChange={(e) => setForm({ ...form, selling_price: e.target.value })} /><Input placeholder="Stock quantity" value={form.stock_quantity} onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })} /><Input placeholder="Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />{msg && <P>{msg}</P>}{error && <Alert role="alert">{error}</Alert>}<Btn type="button" onClick={submit}>Create Book</Btn></Section>
  <Section>
    <SectionTitle>Image Manager</SectionTitle>
    <SectionSub>{bookId ? `Manage images for book #${bookId}` : 'Create book first, then manage multiple images.'}</SectionSub>
    <Input placeholder="Image URL" value={imageForm.image_url} onChange={(e) => setImageForm({ ...imageForm, image_url: e.target.value })} />
    <Row>
      <Input placeholder="Sort order" value={imageForm.sort_order} onChange={(e) => setImageForm({ ...imageForm, sort_order: e.target.value })} />
      <Input placeholder="Alt text" value={imageForm.alt_text} onChange={(e) => setImageForm({ ...imageForm, alt_text: e.target.value })} />
    </Row>
    <label>
      <input type="checkbox" checked={imageForm.is_primary} onChange={(e) => setImageForm({ ...imageForm, is_primary: e.target.checked })} />
      {' '}Set as primary
    </label>
    <Row>
      <Btn type="button" onClick={addImage} disabled={!bookId}>Add Image</Btn>
      <Btn type="button" onClick={() => void loadImages()} disabled={!bookId}>Refresh</Btn>
    </Row>
    <List>
      {images.map((img) => (
        <li
          key={img.id}
          draggable
          onDragStart={() => setDragImageId(img.id)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => void onDropImage(img.id)}
        >
          <P>{img.image_url}</P>
          <P>sort: {img.sort_order} {img.is_primary ? '(primary)' : ''}</P>
          <Row>
            <Btn type="button" onClick={() => setPrimary(img.id)}>Set Primary</Btn>
            <P>Drag to reorder</P>
            <Btn type="button" onClick={() => removeImage(img.id)}>Delete</Btn>
          </Row>
        </li>
      ))}
    </List>
  </Section></Wrap>
}
