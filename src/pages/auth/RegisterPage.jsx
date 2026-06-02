import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../../api/auth'
import { Section, SectionTitle } from '../../components/Section'
import { Alert, Btn, Input, Row, Wrap } from '../WorkflowPages.styles'

export function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', username: '', password: '', full_name: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    try {
      setLoading(true)
      setError('')
      await authApi.register(form)
      navigate('/auth/verify-otp', { state: { email: form.email } })
    } catch (x) {
      setError(x.message || 'Register failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Wrap>
      <Section>
        <SectionTitle>Register</SectionTitle>
        <form onSubmit={submit}>
          <Row><Input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Row>
          <Row><Input placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} /></Row>
          <Row><Input placeholder="Full name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></Row>
          <Row><Input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></Row>
          {error && <Alert role="alert">{error}</Alert>}
          <Btn disabled={loading}>{loading ? 'Submitting...' : 'Register'}</Btn>
        </form>
      </Section>
    </Wrap>
  )
}
