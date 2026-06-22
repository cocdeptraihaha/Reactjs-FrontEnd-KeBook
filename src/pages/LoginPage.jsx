import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Section, SectionSub, SectionTitle } from '../components/Section'
import { useAuth } from '../auth/auth-store'
import {
  Wrap,
  Form,
  Label,
  Input,
  Submit,
  ErrorText,
  SecondaryButton
} from './LoginPage.styles'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(username.trim(), password)
      const redirectTo = location.state?.from || '/app/home'
      navigate(redirectTo, { replace: true })
    } catch (e) {
      setError(e.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Wrap>
      <Section>
        <SectionTitle>Đăng nhập</SectionTitle>
        <Form onSubmit={onSubmit} aria-label="Login form">
          <Label htmlFor="login-username">
            Email hoặc Tên đăng nhập
            <Input
              id="login-username"
              name="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Label>
          <Label htmlFor="login-password">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Mật khẩu</span>
              <Link to="/auth/forgot-password" style={{ fontSize: '0.8rem', textTransform: 'none', fontWeight: 600, color: 'var(--brand-900)' }}>
                Quên mật khẩu?
              </Link>
            </div>
            <Input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Label>
          {error && <ErrorText role="alert">{error}</ErrorText>}
          <Submit type="submit" disabled={loading} aria-busy={loading}>
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </Submit>
        </Form>
        <SecondaryButton as={Link} to="/auth/register">
          Đăng ký tài khoản mới
        </SecondaryButton>
      </Section>
    </Wrap>
  )
}
