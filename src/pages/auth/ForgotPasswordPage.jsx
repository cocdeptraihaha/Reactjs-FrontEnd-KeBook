import { useState } from 'react'
import { authApi } from '../../api/auth'
import { Section, SectionTitle } from '../../components/Section'
import { Alert, Btn, Input, P, Wrap } from '../WorkflowPages.styles'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    try {
      setError('')
      setMsg('')
      const r = await authApi.forgotPassword({ email })
      setMsg(r?.message || 'OTP sent')
    } catch (x) {
      setError(x.message || 'Failed')
    }
  }

  return (
    <Wrap><Section><SectionTitle>Forgot Password</SectionTitle><form onSubmit={submit}><Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />{msg && <P>{msg}</P>}{error && <Alert role="alert">{error}</Alert>}<Btn>Send OTP</Btn></form></Section></Wrap>
  )
}
