import { Link } from 'react-router-dom'
import styled from 'styled-components'

const Bar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
`

const Mini = styled(Link)`
  font-size: 0.78rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--on-surface-variant);
`

export function TopBar() {
  return (
    <Bar>
      <Mini to="/catalog">Danh mục</Mini>
      <Mini to="/home">Sanctuary</Mini>
      <Mini to="/book/architecture-of-silence">Chi tiết</Mini>
    </Bar>
  )
}
