import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supportRequestsApi } from '../../../api/supportRequests'
import { useAuth } from '../../../auth/auth-store'
import { Section, SectionSub, SectionTitle } from '../../../components/Section'
import { Alert, Btn, CheckoutGrid, CheckoutPanel, FormStack, Input, List, PanelTitle, PrimaryCheckoutButton, Select, SuccessText, Textarea, Wrap } from '../../WorkflowPages.styles'

export function SupportTicketPage() {
  const { user } = useAuth()
  const [form, setForm] = useState({
    email: user?.email || '',
    type: 'ORDER',
    issue: '',
    description: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [created, setCreated] = useState(null)

  async function submit(event) {
    event.preventDefault()
    if (!form.issue.trim() || !form.description.trim()) {
      setError('Vui lòng nhập đầy đủ tiêu đề và mô tả chi tiết yêu cầu hỗ trợ.')
      return
    }

    try {
      setLoading(true)
      setError('')
      setCreated(null)
      const ticket = await supportRequestsApi.create({
        email: form.email.trim() || undefined,
        type: form.type,
        issue: form.issue.trim(),
        description: form.description.trim(),
      })
      setCreated(ticket)
      setForm((current) => ({ ...current, issue: '', description: '' }))
    } catch (err) {
      setError(err.message || 'Gửi yêu cầu hỗ trợ thất bại. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Wrap>
      <Section>
        <SectionTitle>Hỗ trợ & Gửi yêu cầu</SectionTitle>
        <SectionSub>Gửi yêu cầu hỗ trợ đến đội ngũ KeBook. Quản trị viên sẽ nhận được thông báo ngay sau khi bạn gửi.</SectionSub>

        <CheckoutGrid>
          <CheckoutPanel>
            <PanelTitle>Tạo yêu cầu mới</PanelTitle>
            <form onSubmit={submit}>
              <FormStack>
                <Input
                  type="email"
                  placeholder="Email liên hệ"
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                />
                <Select
                  value={form.type}
                  onChange={(event) => setForm({ ...form, type: event.target.value })}
                >
                  <option value="ORDER">Đơn hàng</option>
                  <option value="PAYMENT">Thanh toán</option>
                  <option value="DELIVERY">Vận chuyển</option>
                  <option value="ACCOUNT">Tài khoản</option>
                  <option value="OTHER">Vấn đề khác</option>
                </Select>
                <Input
                  placeholder="Tiêu đề yêu cầu"
                  value={form.issue}
                  onChange={(event) => setForm({ ...form, issue: event.target.value })}
                />
                <Textarea
                  placeholder="Mô tả chi tiết vấn đề bạn đang gặp phải..."
                  value={form.description}
                  onChange={(event) => setForm({ ...form, description: event.target.value })}
                />
                <PrimaryCheckoutButton type="submit" disabled={loading}>
                  {loading ? 'Đang gửi...' : 'Gửi yêu cầu'}
                </PrimaryCheckoutButton>
              </FormStack>
            </form>
            {error && <Alert role="alert">{error}</Alert>}
            {created && (
              <SuccessText>
                Đã gửi yêu cầu #{created.id} thành công! Trạng thái: {created.status === 'PENDING' ? 'Đang chờ xử lý' : created.status}.
              </SuccessText>
            )}
          </CheckoutPanel>

          <CheckoutPanel>
            <PanelTitle>Lưu ý trước khi gửi</PanelTitle>
            <List>
              <li>Hãy ghi kèm Mã đơn hàng nếu yêu cầu liên quan đến đơn hàng của bạn.</li>
              <li>Mỗi yêu cầu chỉ nên đề cập đến 1 vấn đề cụ thể để chúng tôi hỗ trợ nhanh nhất.</li>
              <li>Phản hồi sẽ được gửi qua trung tâm thông báo hoặc địa chỉ email của bạn.</li>
            </List>
            <Btn type="button" as={Link} to="/app/notifications">Xem thông báo</Btn>
          </CheckoutPanel>
        </CheckoutGrid>
      </Section>
    </Wrap>
  )
}
