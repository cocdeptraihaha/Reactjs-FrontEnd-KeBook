import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', otp_code: '', new_password: '' })
  const [confirmPassword, setConfirmPassword] = useState('')
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e) {
    e.preventDefault()
    if (form.new_password !== confirmPassword) {
      setError('Mật khẩu nhập lại không khớp')
      return
    }
    try {
      setLoading(true)
      setError('')
      setMsg('')
      const r = await authApi.resetPassword({
        email: form.email.trim(),
        otp_code: form.otp_code.trim(),
        new_password: form.new_password
      })
      setMsg(r?.message || 'Đặt lại mật khẩu thành công! Vui lòng quay lại đăng nhập.')
      setTimeout(() => {
        navigate('/auth/login')
      }, 3000)
    } catch (x) {
      setError(x.message || 'Đặt lại mật khẩu thất bại. Vui lòng kiểm tra lại mã OTP.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Wrap>
      <Section>
        <SectionTitle>Đặt lại mật khẩu</SectionTitle>
        <SectionSub>Nhập mã OTP được gửi về email của bạn cùng mật khẩu mới để cập nhật tài khoản.</SectionSub>
        <Form onSubmit={submit} aria-label="Reset password form">
          <Label htmlFor="reset-email">
            Địa chỉ Email
            <Input
              id="reset-email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </Label>
          <Label htmlFor="reset-otp">
            Mã OTP
            <Input
              id="reset-otp"
              value={form.otp_code}
              placeholder="Nhập 6 số"
              onChange={(e) => setForm({ ...form, otp_code: e.target.value.replace(/\D/g, '') })}
              required
            />
          </Label>
          <Label htmlFor="reset-password">
            Mật khẩu mới
            <Input
              id="reset-password"
              type="password"
              value={form.new_password}
              onChange={(e) => setForm({ ...form, new_password: e.target.value })}
              required
            />
          </Label>
          <Label htmlFor="reset-confirm-password">
            Nhập lại mật khẩu mới
            <Input
              id="reset-confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </Label>
          {msg && <SuccessText role="status">{msg}</SuccessText>}
          {error && <ErrorText role="alert">{error}</ErrorText>}
          <Submit type="submit" disabled={loading} aria-busy={loading}>
            {loading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
          </Submit>
        </Form>
        <SecondaryButton as={Link} to="/auth/login">
          Quay lại Đăng nhập
        </SecondaryButton>
      </Section>
    </Wrap>
  )
}
