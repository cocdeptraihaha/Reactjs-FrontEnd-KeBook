import { useState } from 'react'
import { Link } from 'react-router-dom'
import { favoritesApi } from '../../api/favorites'
import { returnRequestsApi } from '../../api/returnRequests'
import { reviewsApi } from '../../api/reviews'
import { usersApi } from '../../api/users'
import { Section, SectionTitle } from '../../components/Section'
import { useAsync } from '../../hooks/useAsync'
import { Alert, Btn, Input, List, P, Row, Textarea, Wrap } from '../WorkflowPages.styles'

export function FavoritesPage() {
  const s = useAsync(() => favoritesApi.list(), [])
  return <Wrap><Section><SectionTitle>Favorites</SectionTitle>{s.loading && <P>Loading...</P>}{s.error && <Alert role="alert">{s.error}</Alert>}<List>{(s.data || []).map((b) => <li key={b.id}><Link to={`/app/book/${b.id}`}>{b.title}</Link></li>)}</List></Section></Wrap>
}


export function PointsHistoryPage() {
  const s = useAsync(() => usersApi.pointTransactions(), [])
  const points = useAsync(() => usersApi.myPoints(), [])
  return <Wrap><Section><SectionTitle>Points History</SectionTitle>{points.data && <P>Balance: {points.data.points || 0}</P>}{s.loading && <P>Loading...</P>}{s.error && <Alert role="alert">{s.error}</Alert>}<List>{(s.data || []).map((t, i) => <li key={t.id || i}>{t.type || 'tx'}: {t.amount || 0}</li>)}</List></Section></Wrap>
}


export function MyVouchersPage() {
  const s = useAsync(() => usersApi.myPromotions(), [])
  return <Wrap><Section><SectionTitle>My Vouchers</SectionTitle>{s.loading && <P>Loading...</P>}{s.error && <Alert role="alert">{s.error}</Alert>}<List>{(s.data || []).map((p, i) => <li key={p.id || i}>{p.code || p.name || 'Voucher'}</li>)}</List></Section></Wrap>
}


export function ReturnRequestsPage() {
  const s = useAsync(() => returnRequestsApi.list(), [])
  const [form, setForm] = useState({ order_id: '', order_item_id: '', quantity: 1, reason: '' })
  async function submit() { await returnRequestsApi.create({ ...form, order_id: Number(form.order_id), order_item_id: Number(form.order_item_id), quantity: Number(form.quantity) }); await s.reload() }
  return <Wrap><Section><SectionTitle>Return Requests</SectionTitle><Row><Input placeholder="Order ID" value={form.order_id} onChange={(e) => setForm({ ...form, order_id: e.target.value })} /><Input placeholder="Order Item ID" value={form.order_item_id} onChange={(e) => setForm({ ...form, order_item_id: e.target.value })} /></Row><Input placeholder="Quantity" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} /><Textarea placeholder="Reason" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} /><Btn type="button" onClick={submit}>Create Request</Btn><List>{(s.data || []).map((r) => <li key={r.id}>#{r.id} - {r.status}</li>)}</List></Section></Wrap>
}


export function WriteReviewPage() {
  const [form, setForm] = useState({ book_id: '', rate: 5, content: '' })
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  async function submit() {
    try {
      setError('')
      await reviewsApi.create({ book_id: Number(form.book_id), rate: Number(form.rate), content: form.content })
      setMsg('Review submitted')
    } catch (x) { setError(x.message || 'Submit failed') }
  }
  return <Wrap><Section><SectionTitle>Write Review</SectionTitle><Input placeholder="Book ID" value={form.book_id} onChange={(e) => setForm({ ...form, book_id: e.target.value })} /><Input placeholder="Rate 1-5" value={form.rate} onChange={(e) => setForm({ ...form, rate: e.target.value })} /><Textarea placeholder="Content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />{msg && <P>{msg}</P>}{error && <Alert role="alert">{error}</Alert>}<Btn type="button" onClick={submit}>Submit</Btn></Section></Wrap>
}
