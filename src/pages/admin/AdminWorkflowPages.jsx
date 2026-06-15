import { useMemo, useState } from 'react'
import { booksApi } from '../../api/books'
import { ordersApi } from '../../api/orders'
import { uploadApi } from '../../api/upload'
import { AdminNavbar } from '../../components/AdminNavbar'
import { Dropdown } from '../../components/ui/Dropdown'
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
  UploadProgressWrap
} from './AdminWorkflowPages.styles'
import { Plus, Image as ImageIcon, BookOpen, Trash2, ArrowUp, Upload } from 'react-feather'

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
    <>
      <AdminNavbar />
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
    </>
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
  const [uploading, setUploading] = useState(false)

  async function handleFileUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setUploading(true)
      setError('')
      const token = localStorage.getItem('token')
      const result = await uploadApi.generalImage(file, token)
      if (result?.url) {
        setImageForm(prev => ({
          ...prev,
          image_url: result.url,
          alt_text: file.name.split('.')[0]
        }))
        setMsg('Image uploaded to Cloudinary successfully!')
      }
    } catch (err) {
      setError(err.message || 'Image upload failed')
    } finally {
      setUploading(false)
    }
  }

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
      setMsg(`Book created (#${newBookId}) successfully!`)
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

  return (
    <>
      <AdminNavbar />
      <Container>
        <PageTitle>Book Inventory Management</PageTitle>

      <FormGrid>
        {/* Left Side: Parameters card */}
        <FormCard>
          <FormCardTitle><BookOpen size={20} /> Create New Book Parameters</FormCardTitle>

          <FormGroup>
            <FormLabel>Book Title</FormLabel>
            <FormInput
              placeholder="e.g. Harry Potter and the Philosopher's Stone"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </FormGroup>

          <FormRow>
            <FormGroup>
              <FormLabel>Author</FormLabel>
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

          <FormRow>
            <FormGroup>
              <FormLabel>Selling Price (VND)</FormLabel>
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

          {msg && <p style={{ color: '#10b981', fontWeight: 600, fontSize: '13px', margin: 0 }}>{msg}</p>}
          {error && <p style={{ color: '#ef4444', fontWeight: 600, fontSize: '13px', margin: 0 }}>{error}</p>}

          <FormButton type="button" onClick={submit} disabled={!form.title || !form.author}>
            Create Book Entry
          </FormButton>
        </FormCard>

        {/* Right Side: Image manager */}
        <FormCard>
          <FormCardTitle><ImageIcon size={20} /> Product Media Manager</FormCardTitle>
          {!bookId ? (
            <BookPreviewPanel>
              <PreviewTitle>No Book Registered Yet</PreviewTitle>
              <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
                Please fill in and create the book entry on the left side before adding images.
              </p>
            </BookPreviewPanel>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '10px' }}>
                <p style={{ fontSize: '12px', color: '#166534', margin: 0, fontWeight: 600 }}>
                  Active Book ID: #{bookId}
                </p>
                <p style={{ fontSize: '11px', color: '#15803d', margin: '4px 0 0 0' }}>
                  Title: {form.title}
                </p>
              </div>

              <FormGroup>
                <FormLabel>Book Cover Image</FormLabel>
                {uploading ? (
                  <UploadProgressWrap>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid #3b82f6',
                      borderTopColor: 'transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    <span>Uploading your image to Cloudinary...</span>
                  </UploadProgressWrap>
                ) : (
                  <label htmlFor="book-image-file">
                    <UploadDropzone>
                      <UploadIconWrap>
                        <Upload size={24} />
                      </UploadIconWrap>
                      <UploadText>Click or drag image here to upload</UploadText>
                      <UploadSubtext>Supports PNG, JPG, JPEG, WEBP up to 5MB</UploadSubtext>
                      <input
                        type="file"
                        id="book-image-file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleFileUpload}
                      />
                    </UploadDropzone>
                  </label>
                )}
              </FormGroup>

              {imageForm.image_url && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '10px'
                }}>
                  <img
                    src={imageForm.image_url}
                    alt="Uploaded thumbnail preview"
                    style={{
                      width: '40px',
                      height: '52px',
                      objectFit: 'cover',
                      borderRadius: '4px',
                      border: '1px solid #cbd5e1'
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: '#334155', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      Ready to add:
                    </p>
                    <p style={{ margin: 0, fontSize: '11px', color: '#64748b', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {imageForm.image_url}
                    </p>
                  </div>
                  <ActionButton
                    style={{ padding: '6px 10px', fontSize: '11px', backgroundColor: '#ef4444' }}
                    onClick={() => setImageForm(prev => ({ ...prev, image_url: '' }))}
                  >
                    Clear
                  </ActionButton>
                </div>
              )}

              <FormGroup>
                <FormLabel>Or enter Image Link (URL)</FormLabel>
                <FormInput
                  placeholder="https://example.com/image.png"
                  value={imageForm.image_url}
                  onChange={(e) => setImageForm({ ...imageForm, image_url: e.target.value })}
                />
              </FormGroup>

              <FormRow>
                <FormGroup>
                  <FormLabel>Alt Text</FormLabel>
                  <FormInput
                    placeholder="e.g. Cover design"
                    value={imageForm.alt_text}
                    onChange={(e) => setImageForm({ ...imageForm, alt_text: e.target.value })}
                  />
                </FormGroup>
                <FormGroup>
                  <FormLabel>Sort Order</FormLabel>
                  <FormInput
                    type="number"
                    value={imageForm.sort_order}
                    onChange={(e) => setImageForm({ ...imageForm, sort_order: e.target.value })}
                  />
                </FormGroup>
              </FormRow>

              <CheckboxWrapper>
                <input
                  type="checkbox"
                  checked={imageForm.is_primary}
                  onChange={(e) => setImageForm({ ...imageForm, is_primary: e.target.checked })}
                />
                Mark as Primary Book Cover
              </CheckboxWrapper>

              <div style={{ display: 'flex', gap: '8px' }}>
                <ActionButton style={{ flex: 1 }} onClick={addImage}>
                  Add Media
                </ActionButton>
                <ActionButton style={{ backgroundColor: '#475569' }} onClick={() => loadImages()}>
                  Sync
                </ActionButton>
              </div>

              <ImageGallery>
                {images.map((img) => (
                  <ImageThumbnailCard
                    key={img.id}
                    $isPrimary={img.is_primary}
                    draggable
                    onDragStart={() => setDragImageId(img.id)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => onDropImage(img.id)}
                  >
                    {img.is_primary && <ThumbnailBadge>Cover</ThumbnailBadge>}
                    <GalleryImage src={img.image_url} alt={img.alt_text || 'book image'} />
                    <div style={{ display: 'flex', gap: '4px', width: '100%' }}>
                      <ActionButton
                        style={{ padding: '4px', fontSize: '10px', flex: 1, backgroundColor: '#8b5cf6' }}
                        title="Set Primary"
                        onClick={() => setPrimary(img.id)}
                      >
                        <ArrowUp size={12} />
                      </ActionButton>
                      <ActionButton
                        style={{ padding: '4px', fontSize: '10px', backgroundColor: '#ef4444' }}
                        title="Delete"
                        onClick={() => removeImage(img.id)}
                      >
                        <Trash2 size={12} />
                      </ActionButton>
                    </div>
                  </ImageThumbnailCard>
                ))}
              </ImageGallery>
            </div>
          )}
        </FormCard>
      </FormGrid>
    </Container>
    </>
  )
}
