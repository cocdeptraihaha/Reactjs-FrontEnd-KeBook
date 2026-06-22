import { Link, NavLink } from 'react-router-dom'
import styled from 'styled-components'

export const Shell = styled.div`
  min-height: 100dvh;
`

export const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 30;
  margin: 0 auto;
  width: min(var(--container-max), 100%);
  padding: 10px 14px 8px;

  @media (min-width: 760px) {
    padding: 12px 18px 10px;
  }
`

export const HeaderPanel = styled.div`
  border: 1px solid rgba(185, 170, 150, 0.78);
  border-radius: var(--radius-lg);
  background: rgba(255, 252, 247, 0.92);
  backdrop-filter: blur(14px);
  box-shadow: var(--shadow-soft);
  padding: 8px 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: space-between;
  flex-wrap: wrap;

  @media (min-width: 1200px) {
    padding: 12px 14px;
    gap: 14px;
    flex-wrap: nowrap;
  }
`

export const Brand = styled(Link)`
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 800;
  color: var(--brand-900);
  letter-spacing: 0;
  padding: 8px 8px 8px 6px;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  @media (min-width: 760px) {
    font-size: 1.12rem;
  }
`

export const Nav = styled.nav`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 2px;

  &::-webkit-scrollbar {
    display: none;
  }
`

export const NavItem = styled(NavLink)`
  border-radius: var(--radius-pill);
  padding: 9px 12px;
  white-space: nowrap;
  font-size: 0.74rem;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  font-weight: 700;
  color: var(--text-secondary);
  transition: 0.24s ease;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-height: 40px;

  &:hover,
  &:focus-visible {
    background: rgba(46, 106, 59, 0.12);
    color: var(--brand-900);
  }

  &.active {
    background: linear-gradient(140deg, var(--brand-950), var(--brand-700));
    color: #fff;
    box-shadow: 0 8px 20px rgba(30, 74, 42, 0.28);
  }
`

export const Main = styled.main`
  width: ${props => props.$isAdmin ? '100%' : 'min(var(--container-max), 100%)'};
  margin: 0 auto;
  padding: ${props => props.$isAdmin ? '0' : '12px 18px 72px'};

  @media (min-width: 1200px) {
    padding: ${props => props.$isAdmin ? '0' : '16px 18px 88px'};
  }
`

export const RightActions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  margin-left: auto;
  min-width: 0;
`

export const IconWrap = styled.div`
  position: relative;
`

export const IconBtn = styled.button`
  width: 42px;
  height: 42px;
  border-radius: 999px;
  border: 1px solid rgba(30, 74, 42, 0.2);
  background: #fff;
  color: var(--brand-900);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s ease;

  &:hover,
  &:focus-visible {
    border-color: rgba(180, 120, 47, 0.55);
    box-shadow: 0 8px 18px rgba(180, 120, 47, 0.16);
  }
`

export const Badge = styled.span`
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 18px;
  height: 18px;
  border-radius: 999px;
  background: #8f2f3c;
  color: #fff;
  font-size: 0.65rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
`

export const IconLink = styled(Link)`
  width: 42px;
  height: 42px;
  border-radius: 999px;
  border: 1px solid rgba(30, 74, 42, 0.2);
  background: #fff;
  color: var(--brand-900);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s ease;

  &:hover,
  &:focus-visible {
    border-color: rgba(180, 120, 47, 0.55);
    box-shadow: 0 8px 18px rgba(180, 120, 47, 0.16);
  }
`

export const AuthBox = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  min-width: 0;
`

export const AuthText = styled.span`
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.78rem;
  color: var(--text-secondary);
`

export const NavAvatar = styled.img`
  width: 42px;
  height: 42px;
  border-radius: 999px;
  object-fit: cover;
  border: 1px solid rgba(30, 74, 42, 0.25);
  background-color: rgba(185, 170, 150, 0.1);
  flex-shrink: 0;
`

export const NavAvatarFallback = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 999px;
  border: 1px solid rgba(30, 74, 42, 0.25);
  background-color: rgba(46, 106, 59, 0.1);
  color: var(--brand-900);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;
  font-weight: 800;
  flex-shrink: 0;
`

export const AuthButton = styled.button`
  border-radius: var(--radius-pill);
  border: 1px solid rgba(30, 74, 42, 0.2);
  min-height: 42px;
  padding: 8px 13px;
  background: #fff;
  font-weight: 700;
  font-size: 0.74rem;
  text-transform: uppercase;
  letter-spacing: 0.07em;
`

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 60;
  background: rgba(24, 28, 22, 0.38);
  display: flex;
  justify-content: flex-end;
  animation: fadeIn 0.18s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`

export const Modal = styled.div`
  width: min(420px, 100%);
  height: 100%;
  background: #fffdf7;
  border-left: 1px solid rgba(213, 204, 190, 0.8);
  box-shadow: -12px 0 34px rgba(12, 26, 18, 0.2);
  display: grid;
  grid-template-rows: auto 1fr;
  animation: slideIn 0.22s ease-out;

  @keyframes slideIn {
    from { transform: translateX(24px); }
    to { transform: translateX(0); }
  }
`

export const ModalHead = styled.div`
  padding: 12px 14px;
  border-bottom: 1px solid rgba(213, 204, 190, 0.85);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
`

export const ModalTitle = styled.h3`
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 800;
`

export const HeadActions = styled.div`
  display: inline-flex;
  gap: 6px;
  align-items: center;
`

export const HeadBtn = styled.button`
  border: 1px solid rgba(30, 74, 42, 0.2);
  background: #fff;
  color: var(--brand-900);
  border-radius: var(--radius-pill);
  padding: 6px 10px;
  min-height: 36px;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  gap: 5px;
`

export const CloseBtn = styled.button`
  width: 34px;
  height: 34px;
  border-radius: 999px;
  border: 1px solid rgba(30, 74, 42, 0.2);
  background: #fff;
  color: var(--brand-900);
  display: inline-flex;
  align-items: center;
  justify-content: center;
`

export const NotiList = styled.ul`
  margin: 0;
  padding: 12px;
  list-style: none;
  display: grid;
  gap: 10px;
  overflow: auto;
`

export const NotiCard = styled.li`
  border: 1px solid rgba(213, 204, 190, 0.76);
  border-radius: 12px;
  background: ${(p) => (p.$unread ? '#fff' : '#f8f3ea')};
  padding: 12px;
  display: grid;
  gap: 4px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--brand-700);
    background: ${(p) => (p.$unread ? '#fdfbf7' : '#f4eee0')};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(30, 74, 42, 0.05);
  }
`

export const NotiTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 10px;
`

export const NotiTitle = styled.p`
  margin: 0;
  font-size: 0.84rem;
  font-weight: 800;
  color: var(--text-primary);
`

export const TypeChip = styled.span`
  border-radius: 999px;
  padding: 2px 7px;
  font-size: 0.66rem;
  font-weight: 800;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  background: rgba(30, 74, 42, 0.1);
  color: var(--brand-900);
`

export const NotiMsg = styled.p`
  margin: 0;
  font-size: 0.84rem;
  color: var(--text-secondary);
`

export const NotiMeta = styled.p`
  margin: 2px 0 0;
  font-size: 0.74rem;
  color: var(--text-secondary);
`

export const PayloadMeta = styled.p`
  margin: 0;
  font-size: 0.74rem;
  color: var(--text-secondary);
`

export const StateText = styled.p`
  margin: 0;
  padding: 12px;
  color: var(--text-secondary);
`

/* Search bar inside user navbar styling */
export const SearchWrapper = styled.div`
  position: relative;
  width: 260px;
  max-width: 100%;

  @media (max-width: 1024px) {
    width: 200px;
  }

  @media (max-width: 760px) {
    display: none; /* Hide on mobile to keep compact, let search page handle it */
  }
`

export const SearchBox = styled.div`
  display: flex;
  align-items: center;
  background-color: rgba(185, 170, 150, 0.08);
  border: 1px solid rgba(185, 170, 150, 0.4);
  border-radius: var(--radius-pill);
  padding: 6px 12px;
  gap: 8px;
  transition: all 0.2s ease;

  &:focus-within {
    background-color: #ffffff;
    border-color: var(--brand-700);
    box-shadow: 0 0 0 3px rgba(30, 74, 42, 0.12);
  }
`

export const SearchInput = styled.input`
  border: none;
  background: transparent;
  outline: none;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--text-primary);
  width: 100%;

  &::placeholder {
    color: var(--text-secondary);
    opacity: 0.65;
  }
`

export const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  width: 320px;
  background-color: #ffffff;
  border: 1px solid rgba(185, 170, 150, 0.4);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-soft);
  overflow: hidden;
  z-index: 110;
`

export const ResultItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  cursor: pointer;
  border-bottom: 1px solid rgba(185, 170, 150, 0.15);
  transition: background-color 0.15s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: rgba(46, 106, 59, 0.05);
  }
`

export const BookThumb = styled.img`
  width: 32px;
  height: 44px;
  object-fit: cover;
  border-radius: var(--radius-xs);
  background-color: rgba(185, 170, 150, 0.1);
  border: 1px solid rgba(185, 170, 150, 0.2);
  flex-shrink: 0;
`

export const BookInfo = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
`

export const BookTitleText = styled.span`
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const BookAuthorText = styled.span`
  font-size: 0.72rem;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 1px;
`

export const BookPriceText = styled.span`
  font-size: 0.74rem;
  font-weight: 800;
  color: var(--brand-900);
  margin-top: 1px;
`

export const ResultStatusText = styled.span`
  font-size: 0.65rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: var(--radius-pill);
  background-color: ${props => props.$isOutOfStock ? '#fee2e2' : '#dcfce7'};
  color: ${props => props.$isOutOfStock ? '#be123c' : '#15803d'};
  flex-shrink: 0;
`

export const NoResultsItem = styled.div`
  padding: 14px;
  font-size: 0.78rem;
  color: var(--text-secondary);
  text-align: center;
  font-weight: 500;
`
