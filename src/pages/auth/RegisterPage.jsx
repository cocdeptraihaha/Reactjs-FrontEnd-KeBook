import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../../api/auth'
import { Section, SectionSub, SectionTitle } from '../../components/Section'
import { DateTimePicker } from '../../components/ui/DateTimePicker'
import {
  Wrap,
  Form,
  Label,
  Input,
  Submit,
  ErrorText,
  SecondaryButton,
  Select
} from '../LoginPage.styles'

export function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    email: '',
    username: '',
    password: '',
    full_name: '',
    date_of_birth: '',
    gender: ''
  })
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const maxDate = (() => {
    const d = new Date()
    d.setFullYear(d.getFullYear() - 12)
    return d.toISOString().split('T')[0]
  })()

  async function submit(e) {
    e.preventDefault()
    if (form.password !== confirmPassword) {
      setError('Mật khẩu nhập lại không khớp')
      return
    }
    if (form.date_of_birth) {
      const birthDate = new Date(form.date_of_birth)
      const twelveYearsAgo = new Date()
      twelveYearsAgo.setFullYear(twelveYearsAgo.getFullYear() - 12)
      if (birthDate > twelveYearsAgo) {
        setError('Bạn phải từ 12 tuổi trở lên để đăng ký')
        return
      }
    }
    try {
      setLoading(true)
      setError('')
      const payload = {
        ...form,
        date_of_birth: form.date_of_birth || undefined,
        gender: form.gender || undefined
      }
      await authApi.register(payload)
      navigate('/auth/verify-otp', { state: { email: form.email } })
    } catch (x) {
      setError(x.message || 'Đăng ký tài khoản thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Wrap>
      <Section>
        <SectionTitle>Đăng ký tài khoản</SectionTitle>
        <SectionSub>Tạo tài khoản mới để trải nghiệm đầy đủ các tính năng tại KeBook.</SectionSub>
        <Form onSubmit={submit} aria-label="Registration form">
          <Label htmlFor="register-email">
            Địa chỉ Email
            <Input
              id="register-email"
              type="email"
              name="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </Label>
          <Label htmlFor="register-username">
            Tên đăng nhập
            <Input
              id="register-username"
              name="username"
              autoComplete="username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </Label>
          <Label htmlFor="register-fullname">
            Họ và tên
            <Input
              id="register-fullname"
              name="full_name"
              autoComplete="name"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              required
            />
          </Label>
          <Label htmlFor="register-dob">
            Ngày sinh
            <div style={{ marginTop: '6px' }}>
              <DateTimePicker
                id="register-dob"
                type="date"
                label=""
                value={form.date_of_birth}
                onChange={(newVal) => setForm({ ...form, date_of_birth: newVal })}
                maxDate={maxDate}
              />
            </div>
          </Label>
          <Label htmlFor="register-gender">
            Giới tính
            <Select
              id="register-gender"
              name="gender"
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
            >
              <option value="">Chọn giới tính</option>
              <option value="MALE">Nam</option>
              <option value="FEMALE">Nữ</option>
              <option value="OTHER">Khác</option>
            </Select>
          </Label>
          <Label htmlFor="register-password">
            Mật khẩu
            <Input
              id="register-password"
              type="password"
              name="password"
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </Label>
          <Label htmlFor="register-confirmpassword">
            Nhập lại mật khẩu
            <Input
              id="register-confirmpassword"
              type="password"
              name="confirmPassword"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </Label>
          {error && <ErrorText role="alert">{error}</ErrorText>}
          <Submit type="submit" disabled={loading} aria-busy={loading}>
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </Submit>
        </Form>
        <SecondaryButton as={Link} to="/auth/login">
          Quay lại Đăng nhập
        </SecondaryButton>
      </Section>
    </Wrap>
  )
}
