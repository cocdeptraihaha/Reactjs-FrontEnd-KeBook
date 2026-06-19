import { favoritesApi } from '../../../api/favorites'
import { Link } from 'react-router-dom'
import { Section, SectionTitle } from '../../../components/Section'
import { useAsync } from '../../../hooks/useAsync'
import { Alert, List, P, Wrap } from '../../WorkflowPages.styles'

export function FavoritesPage() {
  const s = useAsync(() => favoritesApi.list(), [])
  return (
    <Wrap>
      <Section>
        <SectionTitle>Favorites</SectionTitle>
        {s.loading && <P>Loading...</P>}
        {s.error && <Alert role="alert">{s.error}</Alert>}
        <List>
          {(s.data || []).map((b) => (
            <li key={b.id}>
              <Link to={`/app/book/${b.id}`}>{b.title}</Link>
            </li>
          ))}
        </List>
      </Section>
    </Wrap>
  )
}
