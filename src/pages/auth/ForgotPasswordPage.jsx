import { useState } from 'react'
import { Link } from 'react-router-dom'
import { authApi } from '../../api/auth'
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

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e) {
    e.preventDefault()
    try {
      setLoading(true)
      setError('')
      setMsg('')
      const r = await authApi.forgotPassword({ email: email.trim() })
      setMsg(r?.message || 'Yêu cầu đặt lại mật khẩu đã được gửi! Vui lòng kiểm tra email của bạn.')
    } catch (x) {
      setError(x.message || 'Gửi mã khôi phục thất bại. Vui lòng kiểm tra lại địa chỉ Email.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Wrap>
      <Section>
        <SectionTitle>Quên mật khẩu</SectionTitle>
        <Form onSubmit={submit} aria-label="Forgot password form">
          <Label htmlFor="forgot-email">
            Địa chỉ Email
            <Input
              id="forgot-email"
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Label>
          {msg && <SuccessText role="status">{msg}</SuccessText>}
          {error && <ErrorText role="alert">{error}</ErrorText>}
          <Submit type="submit" disabled={loading} aria-busy={loading}>
            {loading ? 'Đang gửi...' : 'Gửi mã OTP'}
          </Submit>
        </Form>
        <SecondaryButton as={Link} to="/auth/login">
          Quay lại Đăng nhập
        </SecondaryButton>
      </Section>
    </Wrap>
  )
}
