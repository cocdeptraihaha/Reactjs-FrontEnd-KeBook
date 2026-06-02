import { useState } from 'react'
import { authApi } from '../../api/auth'
import { Section, SectionTitle } from '../../components/Section'
import { Alert, Btn, Input, P, Wrap } from '../WorkflowPages.styles'

export function ResetPasswordPage() {
  const [form, setForm] = useState({ email: '', otp_code: '', new_password: '' })
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    try {
      setError('')
      const r = await authApi.resetPassword(form)
      setMsg(r?.message || 'Password reset done')
    } catch (x) {
      setError(x.message || 'Failed')
    }
  }

  return (
    <Wrap><Section><SectionTitle>Reset Password</SectionTitle><form onSubmit={submit}><Input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /><Input placeholder="OTP code" value={form.otp_code} onChange={(e) => setForm({ ...form, otp_code: e.target.value })} /><Input type="password" placeholder="New password" value={form.new_password} onChange={(e) => setForm({ ...form, new_password: e.target.value })} />{msg && <P>{msg}</P>}{error && <Alert role="alert">{error}</Alert>}<Btn>Reset</Btn></form></Section></Wrap>
  )
}
