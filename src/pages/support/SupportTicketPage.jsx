import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supportRequestsApi } from '../../api/supportRequests'
import { useAuth } from '../../auth/auth-store'
import { Section, SectionSub, SectionTitle } from '../../components/Section'
import { Alert, Btn, CheckoutGrid, CheckoutPanel, FormStack, Input, List, PanelTitle, PrimaryCheckoutButton, Select, SuccessText, Textarea, Wrap } from '../WorkflowPages.styles'

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
      setError('Issue and description are required')
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
      setError(err.message || 'Failed to submit support ticket')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Wrap>
      <Section>
        <SectionTitle>Support ticket</SectionTitle>
        <SectionSub>Send a support request to the KeBook team. Admins receive a notification after submission.</SectionSub>

        <CheckoutGrid>
          <CheckoutPanel>
            <PanelTitle>Create ticket</PanelTitle>
            <form onSubmit={submit}>
              <FormStack>
                <Input
                  type="email"
                  placeholder="Contact email"
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                />
                <Select
                  value={form.type}
                  onChange={(event) => setForm({ ...form, type: event.target.value })}
                >
                  <option value="ORDER">Order</option>
                  <option value="PAYMENT">Payment</option>
                  <option value="DELIVERY">Delivery</option>
                  <option value="ACCOUNT">Account</option>
                  <option value="OTHER">Other</option>
                </Select>
                <Input
                  placeholder="Issue title"
                  value={form.issue}
                  onChange={(event) => setForm({ ...form, issue: event.target.value })}
                />
                <Textarea
                  placeholder="Describe your problem clearly"
                  value={form.description}
                  onChange={(event) => setForm({ ...form, description: event.target.value })}
                />
                <PrimaryCheckoutButton type="submit" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit ticket'}
                </PrimaryCheckoutButton>
              </FormStack>
            </form>
            {error && <Alert role="alert">{error}</Alert>}
            {created && (
              <SuccessText>
                Ticket #{created.id} created. Status: {created.status || 'PENDING'}.
              </SuccessText>
            )}
          </CheckoutPanel>

          <CheckoutPanel>
            <PanelTitle>Before sending</PanelTitle>
            <List>
              <li>Include order ID if ticket relates to an order.</li>
              <li>Use one ticket per issue so support can track status clearly.</li>
              <li>Responses may arrive through notifications or your contact email.</li>
            </List>
            <Btn type="button" as={Link} to="/app/notifications">View notifications</Btn>
          </CheckoutPanel>
        </CheckoutGrid>
      </Section>
    </Wrap>
  )
}
