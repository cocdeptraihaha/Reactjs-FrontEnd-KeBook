import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import styled from 'styled-components'

const Shell = styled.div`
  min-height: 100dvh;
  background: var(--surface);
`

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  background: color-mix(in srgb, var(--surface) 78%, transparent);
  backdrop-filter: blur(18px);
  border-bottom: 1px solid color-mix(in srgb, var(--outline-variant) 25%, transparent);
`

const Brand = styled(Link)`
  font-family: var(--font-display);
  font-size: 1rem;
  letter-spacing: 0.02em;
  color: var(--primary);
`

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 6px;
`

const NavItem = styled(NavLink)`
  border-radius: 999px;
  padding: 8px 12px;
  font-size: 0.76rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.09em;
  color: var(--on-surface-variant);

  &.active {
    color: var(--on-primary);
    background: linear-gradient(140deg, var(--primary), var(--primary-container));
  }
`

const Main = styled.main`
  width: min(1160px, 100%);
  margin: 0 auto;
  padding: 20px 16px 70px;
`

export function AppLayout() {
  const { pathname } = useLocation()

  return (
    <Shell>
      <Header>
        <Brand to="/home">Editorial Sanctuary</Brand>
        <Nav aria-label="Primary navigation">
          <NavItem to="/home">Home</NavItem>
          <NavItem to="/catalog">Catalog</NavItem>
          <NavItem to="/book/architecture-of-silence">Book</NavItem>
          <NavItem to="/cart" className={pathname === '/cart' ? 'active' : ''}>
            Cart
          </NavItem>
        </Nav>
      </Header>
      <Main>
        <Outlet />
      </Main>
    </Shell>
  )
}
