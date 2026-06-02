import { useMemo, useState } from 'react'
import { booksApi } from '../../api/books'
import { ordersApi } from '../../api/orders'
import { Section, SectionSub, SectionTitle } from '../../components/Section'
import { useAsync } from '../../hooks/useAsync'
import { Alert, Btn, Input, List, P, Row, Wrap } from '../WorkflowPages.styles'

export function AdminOrdersPage() {
  const s = useAsync(() => ordersApi.adminList(), [])
  const [statusById, setStatusById] = useState({})
  async function update(id) { await ordersApi.adminUpdateStatus(id, { status: statusById[id] || 'CONFIRMED' }); await s.reload() }
  return <Wrap><Section><SectionTitle>Admin Orders</SectionTitle><List>{(s.data || []).map((o) => <li key={o.id}>#{o.id} - {o.status}<Row><Input placeholder="Status" value={statusById[o.id] || ''} onChange={(e) => setStatusById({ ...statusById, [o.id]: e.target.value })} /><Btn type="button" onClick={() => update(o.id)}>Update</Btn></Row></li>)}</List></Section></Wrap>
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
