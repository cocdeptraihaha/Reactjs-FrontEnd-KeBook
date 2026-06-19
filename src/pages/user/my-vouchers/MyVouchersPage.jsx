import { usersApi } from '../../../api/users'
import { Section, SectionTitle } from '../../../components/Section'
import { useAsync } from '../../../hooks/useAsync'
import { Alert, List, P, Wrap } from '../../WorkflowPages.styles'

export function MyVouchersPage() {
  const s = useAsync(() => usersApi.myPromotions(), [])
  return (
    <Wrap>
      <Section>
        <SectionTitle>My Vouchers</SectionTitle>
        {s.loading && <P>Loading...</P>}
        {s.error && <Alert role="alert">{s.error}</Alert>}
        <List>
          {(s.data || []).map((p, i) => (
            <li key={p.id || i}>
              {p.code || p.name || 'Voucher'}
            </li>
          ))}
        </List>
      </Section>
    </Wrap>
  )
}
