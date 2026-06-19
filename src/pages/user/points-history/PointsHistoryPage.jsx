import { usersApi } from '../../../api/users'
import { Section, SectionTitle } from '../../../components/Section'
import { useAsync } from '../../../hooks/useAsync'
import { Alert, List, P, Wrap } from '../../WorkflowPages.styles'

export function PointsHistoryPage() {
  const s = useAsync(() => usersApi.pointTransactions(), [])
  const points = useAsync(() => usersApi.myPoints(), [])
  return (
    <Wrap>
      <Section>
        <SectionTitle>Points History</SectionTitle>
        {points.data && <P>Balance: {points.data.points || 0}</P>}
        {s.loading && <P>Loading...</P>}
        {s.error && <Alert role="alert">{s.error}</Alert>}
        <List>
          {(s.data || []).map((t, i) => (
            <li key={t.id || i}>
              {t.type || 'tx'}: {t.amount || 0}
            </li>
          ))}
        </List>
      </Section>
    </Wrap>
  )
}
