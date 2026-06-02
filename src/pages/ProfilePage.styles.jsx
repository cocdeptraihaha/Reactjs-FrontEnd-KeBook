import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { User } from 'react-feather'

export const Shell = styled.div`
  display: grid;
  gap: 16px;
`

export const ProfileCanvas = styled.div`
  display: grid;
  gap: 16px;

  @media (min-width: 1160px) {
    grid-template-columns: minmax(280px, 0.9fr) minmax(360px, 1.12fr) minmax(260px, 0.8fr);
    align-items: start;
  }
`

export const Column = styled.div`
  display: grid;
  gap: 14px;
`

export const Hero = styled.section`
  display: grid;
  gap: 18px;
  padding: 18px;
  border-radius: var(--radius-lg);
  border: 1px solid rgba(185, 170, 150, 0.68);
  background:
    linear-gradient(135deg, rgba(22, 50, 31, 0.94), rgba(31, 77, 46, 0.86)),
    radial-gradient(circle at 12% 16%, rgba(240, 195, 110, 0.22), transparent 36%);
  color: #fffaf0;
  box-shadow: var(--shadow-soft);

  @media (min-width: 760px) {
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    padding: 22px;
  }
`

export const AvatarWrap = styled.div`
  width: 116px;
  height: 116px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  border: 2px solid rgba(255, 250, 240, 0.42);
  background: linear-gradient(145deg, rgba(255, 253, 248, 0.95), rgba(224, 210, 191, 0.92));
  box-shadow: 0 18px 38px rgba(15, 24, 18, 0.22);
  overflow: hidden;
`

export const Avatar = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

export const AvatarFallback = styled(User)`
  color: rgba(31, 77, 46, 0.68);
`

export const HeroText = styled.div`
  display: grid;
  gap: 4px;

  p {
    color: rgba(255, 250, 240, 0.82);
  }
`

export const Name = styled.h1`
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.7rem, 4vw, 2.35rem);
  line-height: 1.05;
  color: #fffaf0;
`

export const Muted = styled.p`
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.94rem;
`

export const StaticTile = styled.div`
  width: 100%;
  min-height: 88px;
  padding: 16px;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: 14px;
  border-radius: var(--radius-lg);
  border: 1px solid rgba(185, 170, 150, 0.72);
  background:
    linear-gradient(168deg, rgba(255, 253, 248, 0.98), rgba(246, 238, 226, 0.94)),
    linear-gradient(90deg, rgba(31, 77, 46, 0.05) 1px, transparent 1px);
  box-shadow: var(--shadow-soft);
  color: var(--text-primary);

  svg {
    color: var(--brand-900);
  }
`

export const TileLabel = styled.span`
  display: block;
  color: var(--text-secondary);
  font-size: 0.85rem;
`

export const TileValue = styled.strong`
  display: block;
  margin-top: 4px;
  font-size: 1.02rem;
  line-height: 1.2;
`

export const OutlineButton = styled.button`
  min-height: 48px;
  padding: 11px 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  border-radius: var(--radius-pill);
  border: 1px solid rgba(31, 77, 46, 0.22);
  background: rgba(255, 253, 248, 0.92);
  color: var(--brand-900);
  font-weight: 800;
  box-shadow: 0 8px 18px rgba(32, 22, 10, 0.05);
  transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease, color 0.18s ease;

  &:hover,
  &:focus-visible {
    background: linear-gradient(145deg, var(--brand-950), var(--brand-700));
    color: #fffaf0;
    box-shadow: var(--shadow-lift);
    transform: translateY(-1px);
  }
`

export const DangerButton = styled(OutlineButton)`
  border-color: rgba(143, 47, 60, 0.5);
  color: var(--danger-700);

  &:hover,
  &:focus-visible {
    background: var(--danger-700);
    color: #fffaf0;
  }
`

export const NavTabs = styled.nav`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  padding: 2px 0;
`

export const NavTab = styled(Link)`
  min-height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-radius: var(--radius-lg);
  border: 1px solid rgba(185, 170, 150, 0.72);
  background:
    linear-gradient(168deg, rgba(255, 253, 248, 0.98), rgba(246, 238, 226, 0.94)),
    radial-gradient(circle at 12% 8%, rgba(180, 120, 47, 0.12), transparent 36%);
  color: var(--brand-900);
  font-weight: 900;
  font-size: 1rem;
  box-shadow: var(--shadow-soft);
  transition: transform 0.18s ease, box-shadow 0.18s ease, color 0.18s ease;

  &:hover,
  &:focus-visible {
    color: var(--berry-700);
    box-shadow: var(--shadow-card);
    transform: translateY(-2px);
  }
`

export const Card = styled.section`
  border-radius: var(--radius-lg);
  border: 1px solid rgba(185, 170, 150, 0.72);
  background:
    linear-gradient(168deg, rgba(255, 253, 248, 0.98), rgba(246, 238, 226, 0.96)),
    linear-gradient(90deg, rgba(31, 77, 46, 0.05) 1px, transparent 1px);
  box-shadow: var(--shadow-soft);
  overflow: hidden;
`

export const CardHeader = styled.div`
  min-height: 72px;
  padding: 16px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-bottom: 1px solid rgba(185, 170, 150, 0.5);
`

export const CardTitle = styled.h2`
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.28rem;
  line-height: 1.12;
  color: var(--text-primary);
`

export const IconButton = styled.button`
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: var(--radius-pill);
  background: rgba(31, 77, 46, 0.08);
  color: var(--brand-900);

  &:hover,
  &:focus-visible {
    background: rgba(180, 120, 47, 0.16);
    color: var(--berry-700);
  }
`

export const PointsCard = styled(Card)`
  padding: 18px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 14px;
  background:
    linear-gradient(135deg, rgba(255, 253, 248, 0.98), rgba(243, 234, 220, 0.94)),
    radial-gradient(circle at 15% 0%, rgba(180, 120, 47, 0.16), transparent 36%);
`

export const PointValue = styled.strong`
  display: block;
  margin-top: 4px;
  font-size: 1.9rem;
  line-height: 1;
  color: var(--brand-900);
`

export const AddressList = styled.div`
  display: grid;
`

export const AddressItem = styled.article`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 14px;
  padding: 18px;
  transition: background 0.18s ease;

  &:hover {
    background: rgba(255, 250, 240, 0.58);
  }

  & + & {
    border-top: 1px solid rgba(185, 170, 150, 0.42);
  }
`

export const AddressIcon = styled.div`
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: var(--radius-pill);
  background: rgba(31, 77, 46, 0.09);
  color: var(--brand-900);
`

export const AddressMain = styled.div`
  display: grid;
  gap: 5px;
  min-width: 0;
`

export const AddressTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  font-weight: 900;
  font-size: 1.02rem;
`

export const Badge = styled.span`
  border-radius: var(--radius-sm);
  padding: 3px 7px;
  background: rgba(180, 120, 47, 0.16);
  color: var(--brand-900);
  font-size: 0.72rem;
  font-weight: 800;
`

export const AddressText = styled.p`
  margin: 0;
  color: var(--text-primary);
  line-height: 1.45;
`

export const Menu = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 4px;
`

export const SmallAction = styled.button`
  min-height: 34px;
  padding: 6px 9px;
  border: 1px solid rgba(185, 170, 150, 0.72);
  border-radius: var(--radius-pill);
  background: #fffdf8;
  color: var(--brand-900);
  font-size: 0.72rem;
  font-weight: 800;

  &:hover,
  &:focus-visible {
    border-color: rgba(180, 120, 47, 0.58);
    background: rgba(180, 120, 47, 0.1);
  }
`

export const SidePanel = styled(Card)`
  display: grid;
`

export const SideLink = styled(Link)`
  min-height: 82px;
  padding: 18px;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 14px;
  color: var(--text-primary);
  font-weight: 800;
  transition: background 0.18s ease, color 0.18s ease;

  svg {
    color: var(--brand-900);
  }

  & + & {
    border-top: 1px solid rgba(185, 170, 150, 0.42);
  }

  &:hover,
  &:focus-visible {
    background: rgba(31, 77, 46, 0.06);
    color: var(--brand-900);
  }
`

export const FormPanel = styled(Card)`
  padding: 18px;
  display: grid;
  gap: 14px;
  border-style: dashed;
  background:
    linear-gradient(168deg, rgba(255, 253, 248, 0.99), rgba(243, 234, 220, 0.96)),
    radial-gradient(circle at 100% 0%, rgba(96, 149, 101, 0.12), transparent 32%);
`

export const FormTitle = styled.h3`
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.08rem;
  color: var(--brand-900);
`

export const FormGrid = styled.div`
  display: grid;
  gap: 12px;

  @media (min-width: 700px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`

export const Field = styled.label`
  display: grid;
  gap: 7px;
`

export const WideField = styled(Field)`
  @media (min-width: 700px) {
    grid-column: 1 / -1;
  }
`

export const Label = styled.span`
  color: var(--text-secondary);
  font-size: 0.74rem;
  font-weight: 900;
  letter-spacing: 0.07em;
  text-transform: uppercase;
`

export const Input = styled.input`
  width: 100%;
  min-height: 44px;
  padding: 10px 12px;
  border-radius: var(--radius-md);
  border: 1px solid rgba(185, 170, 150, 0.82);
  background: rgba(255, 253, 248, 0.92);
  color: var(--text-primary);
  transition: border-color 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;

  &:focus {
    outline: none;
    border-color: rgba(31, 77, 46, 0.52);
    background: #fffdf8;
    box-shadow: 0 0 0 4px rgba(31, 77, 46, 0.1);
  }

  &:disabled {
    color: var(--text-secondary);
    background: rgba(243, 234, 220, 0.72);
  }
`

export const Select = styled.select`
  width: 100%;
  min-height: 44px;
  padding: 10px 12px;
  border-radius: var(--radius-md);
  border: 1px solid rgba(185, 170, 150, 0.82);
  background: rgba(255, 253, 248, 0.92);

  &:focus {
    outline: none;
    border-color: rgba(31, 77, 46, 0.52);
    box-shadow: 0 0 0 4px rgba(31, 77, 46, 0.1);
  }
`

export const CheckboxRow = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  font-weight: 800;

  input {
    accent-color: var(--brand-700);
  }
`

export const Actions = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`

export const ErrorText = styled.p`
  margin: 0;
  color: var(--danger-700);
  font-size: 0.82rem;
`

export const StatusText = styled.p`
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.88rem;
`

export const HiddenInput = styled.input`
  display: none;
`

export const EmptyState = styled.div`
  padding: 18px;
  display: grid;
  gap: 8px;
  color: var(--text-secondary);
  background: rgba(255, 250, 240, 0.46);
`

export const AccountShell = styled.div`
  display: grid;
  gap: 16px;
`

export const AccountGrid = styled.div`
  display: grid;
  gap: 16px;

  @media (min-width: 980px) {
    grid-template-columns: minmax(0, 1fr) minmax(300px, 0.72fr);
    align-items: start;
  }
`
