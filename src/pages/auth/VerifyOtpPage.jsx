import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { authApi } from '../../api/auth'
import { useAuth } from '../../auth/auth-store'
import { Section, SectionTitle } from '../../components/Section'
import { Alert, Btn, Input, Row } from '../WorkflowPages.styles'
import { Wrap } from '../LoginPage.styles'

export function VerifyOtpPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const location = useLocation()
  const [email, setEmail] = useState(location.state?.email || '')
  const [otp_code, setOtp] = useState('')
  const [error, setError] = useState('')

  async function verify(e) {
    e.preventDefault()
    try {
      setError('')
      const res = await authApi.verifyOtp({ email, otp_code })
      if (res?.access_token && res?.user) {
        localStorage.setItem('access_token', res.access_token)
        localStorage.setItem('auth_user', JSON.stringify(res.user))
        await login(email, '')
      }
      navigate('/app/home', { replace: true })
    } catch (x) {
      setError(x.message || 'Verify failed')
    }
  }

  return (
    <Wrap>
      <Section>
        <SectionTitle>Xác thực mã OTP</SectionTitle>
        <form onSubmit={verify}>
          <Row><Input placeholder="Địa chỉ Email" value={email} onChange={(e) => setEmail(e.target.value)} /></Row>
          <Row><Input placeholder="Nhập mã OTP (6 số)" value={otp_code} onChange={(e) => setOtp(e.target.value)} /></Row>
          {error && <Alert role="alert">{error}</Alert>}
          <Row><Btn type="submit">Xác thực</Btn><Btn type="button" onClick={() => authApi.resendOtp({ email })}>Gửi lại mã</Btn></Row>
        </form>
      </Section>
    </Wrap>
  )
}
