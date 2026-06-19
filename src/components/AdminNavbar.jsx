import { NavLink, Link } from 'react-router-dom'
import styled from 'styled-components'
import { BarChart2, Package, PlusCircle, Shield, ArrowLeft, Users, Bell, Tag } from 'react-feather'

const HeaderContainer = styled.header`
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  padding: 16px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -2px rgba(0, 0, 0, 0.02);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

  @media print {
    display: none !important;
  }
`

const BrandingGroup = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
`

const LogoIconWrap = styled.div`
  background: linear-gradient(135deg, #4f46e5 0%, #311042 100%);
  color: #ffffff;
  padding: 10px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
`

const BrandingText = styled.div`
  display: flex;
  flex-direction: column;
`

const BrandTitle = styled.h2`
  margin: 0;
  font-size: 16px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.02e;
`

const BrandSubtitle = styled.span`
  font-size: 10px;
  color: #8b5cf6;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-top: 2px;
`

const NavMenu = styled.nav`
  display: flex;
  align-items: center;
  gap: 8px;
`

const StyledLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  color: #475569;
  text-decoration: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  svg {
    transition: transform 0.2s ease;
  }

  &:hover {
    color: #4f46e5;
    background-color: #f5f3ff;

    svg {
      transform: translateY(-1px);
    }
  }

  &.active {
    color: #4f46e5;
    background-color: #ede9fe;
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.05);

    svg {
      color: #6366f1;
    }
  }
`

const BackBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  font-size: 13px;
  font-weight: 700;
  color: #64748b;
  text-decoration: none;
  background-color: #ffffff;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f8fafc;
    border-color: #cbd5e1;
    color: #334155;
  }
`

export function AdminNavbar() {
  return (
    <HeaderContainer>
      <BrandingGroup to="/app/admin/dashboard">
        <LogoIconWrap>
          <Shield size={20} />
        </LogoIconWrap>
        <BrandingText>
          <BrandTitle>KeBook Atelier</BrandTitle>
          <BrandSubtitle>Admin Console</BrandSubtitle>
        </BrandingText>
      </BrandingGroup>

      <NavMenu>
        <StyledLink to="/app/admin/dashboard">
          <BarChart2 size={16} />
          Dashboard
        </StyledLink>
        <StyledLink to="/app/admin/orders">
          <Package size={16} />
          Orders
        </StyledLink>
        <StyledLink to="/app/admin/books/new">
          <PlusCircle size={16} />
          Books
        </StyledLink>
        <StyledLink to="/app/admin/users">
          <Users size={16} />
          Users
        </StyledLink>
        <StyledLink to="/app/admin/promotions">
          <Tag size={16} />
          Promotions
        </StyledLink>
        <StyledLink to="/app/admin/notifications">
          <Bell size={16} />
          Notifications
        </StyledLink>
      </NavMenu>

      <BackBtn to="/app/profile">
        <ArrowLeft size={14} /> Back to Store
      </BackBtn>
    </HeaderContainer>
  )
}

export default AdminNavbar
