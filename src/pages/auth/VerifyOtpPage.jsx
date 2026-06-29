import { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { authApi } from '../../api/auth'
import { useAuth } from '../../auth/auth-store'
import { Section, SectionSub, SectionTitle } from '../../components/Section'
import {
  Wrap,
  Form,
  Label,
  Input,
  Submit,
  ErrorText,
  SecondaryButton
} from '../LoginPage.styles'
import styled from 'styled-components'

const SuccessText = styled.p`
  color: #15803d;
  background-color: rgba(22, 163, 74, 0.05);
  border: 1px dashed rgba(22, 163, 74, 0.2);
  border-radius: var(--radius-sm);
  padding: 10px 12px;
  margin: 8px 0;
  font-size: 0.88rem;
  min-height: 40px;
  display: flex;
  align-items: center;
`

const ButtonGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 8px;
`

const ResendButton = styled.button`
  border: 1px solid var(--brand-700);
  border-radius: var(--radius-pill);
  min-height: 48px;
  padding: 12px 16px;
  color: var(--brand-800);
  font-weight: 700;
  background: transparent;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(31, 77, 46, 0.05);
    color: var(--brand-950);
  }
`

export function VerifyOtpPage() {
  const navigate = useNavigate()
  const { setSession } = useAuth()
  const location = useLocation()
  const [email, setEmail] = useState(location.state?.email || '')
  const [otp_code, setOtp] = useState('')
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)

  async function verify(e) {
    e.preventDefault()
    if (!email.trim() || !otp_code.trim()) {
      setError('Vui lòng điền đầy đủ Email và mã OTP')
      return
    }
    try {
      setLoading(true)
      setError('')
      setMsg('')
      const res = await authApi.verifyOtp({ email: email.trim(), otp_code: otp_code.trim() })
      if (res?.access_token && res?.user) {
        setSession(res.access_token, res.user)
      }
      navigate('/app/home', { replace: true })
    } catch (x) {
      setError(x.message || 'Xác thực mã OTP thất bại')
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    if (!email.trim()) {
      setError('Vui lòng nhập địa chỉ Email trước khi yêu cầu gửi lại mã')
      return
    }
    try {
      setResending(true)
      setError('')
      setMsg('')
      const res = await authApi.resendOtp({ email: email.trim() })
      setMsg(res?.message || 'Mã OTP mới đã được gửi thành công!')
    } catch (x) {
      setError(x.message || 'Gửi lại mã OTP thất bại')
    } finally {
      setResending(false)
    }
  }

  return (
    <Wrap>
      <Section>
        <SectionTitle>Xác thực tài khoản</SectionTitle>
        <SectionSub>Nhập mã OTP gồm 6 chữ số được gửi đến Email của bạn để hoàn tất đăng ký.</SectionSub>
        <Form onSubmit={verify} aria-label="Verify OTP form">
          <Label htmlFor="otp-email">
            Địa chỉ Email
            <Input
              id="otp-email"
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Label>
          <Label htmlFor="otp-code">
            Mã xác thực OTP
            <Input
              id="otp-code"
              name="otp_code"
              placeholder="Nhập 6 số"
              maxLength={6}
              value={otp_code}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              required
            />
          </Label>

          {msg && <SuccessText role="status">{msg}</SuccessText>}
          {error && <ErrorText role="alert">{error}</ErrorText>}

          <ButtonGroup>
            <Submit type="submit" disabled={loading} aria-busy={loading}>
              {loading ? 'Đang xác thực...' : 'Xác thực'}
            </Submit>
            <ResendButton type="button" onClick={handleResend} disabled={resending} aria-busy={resending}>
              {resending ? 'Đang gửi...' : 'Gửi lại mã'}
            </ResendButton>
          </ButtonGroup>
        </Form>
        <SecondaryButton as={Link} to="/auth/login">
          Quay lại Đăng nhập
        </SecondaryButton>
      </Section>
    </Wrap>
  )
}
