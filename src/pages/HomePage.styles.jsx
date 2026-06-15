import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Section, SectionSub, SectionTitle } from '../components/Section'

export const Stack = styled.div`
  display: grid;
  gap: 14px;

  @media (min-width: 1200px) {
    gap: 18px;
  }
`

export const Hero = styled(Section)`
  overflow: hidden;
  position: relative;
  background:
    linear-gradient(135deg, rgba(22, 50, 31, 0.92), rgba(130, 51, 77, 0.72)),
    linear-gradient(165deg, #fffdf7, #f4ecdf);
  color: #fffaf0;
  display: grid;
  gap: 18px;

  @media (min-width: 860px) {
    grid-template-columns: minmax(0, 1fr) 320px;
    align-items: center;
  }

  @media (min-width: 1200px) {
    padding: 24px;
    grid-template-columns: minmax(0, 1fr) 390px;
  }
`

export const HeroCopy = styled.div`
  max-width: 680px;

  ${SectionTitle} {
    color: #fffaf0;
  }

  ${SectionSub} {
    color: rgba(255, 250, 240, 0.82);
  }
`

export const HeroMedia = styled.div`
  display: none;
  min-height: 230px;
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid rgba(255, 250, 240, 0.22);
  box-shadow: 0 24px 42px rgba(15, 24, 18, 0.22);

  @media (min-width: 860px) {
    display: block;
  }

  img {
    width: 100%;
    height: 100%;
    min-height: 230px;
    object-fit: cover;
    display: block;
  }
`

export const Kicker = styled.p`
  font-size: 0.68rem;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #f0c36e;
`

export const HeroActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 14px;
  flex-wrap: wrap;
`

export const HeroBtn = styled(Link)`
  border-radius: var(--radius-pill);
  min-height: 44px;
  padding: 11px 16px;
  font-size: 0.76rem;
  font-weight: 800;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  border: 1px solid transparent;

  ${(p) =>
    p.$primary
      ? `
      background: linear-gradient(145deg, var(--brand-900), var(--brand-700));
      color: #fff;
      box-shadow: 0 10px 26px rgba(0, 0, 0, 0.22);
    `
      : `
      background: rgba(255, 250, 240, 0.12);
      border-color: rgba(255, 250, 240, 0.32);
      color: #fffaf0;
    `}

  &:hover,
  &:focus-visible {
    transform: translateY(-1px);
    box-shadow: var(--shadow-lift);
  }
`

export const SectionHead = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 12px;
  flex-wrap: wrap;
`

export const SectionCta = styled(Link)`
  color: var(--brand-900);
  font-size: 0.74rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 800;
`

export const HorizontalScrollSection = styled(Section)`
  width: 100%;
  max-width: 100%;
  min-width: 0;
  overflow: hidden;
`

export const Books = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(2, minmax(0, 1fr));

  @media (min-width: 580px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
  }

  @media (min-width: 860px) {
    grid-template-columns: repeat(${(p) => p.$cols || 5}, minmax(0, 1fr));
    gap: 16px;
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(${(p) => p.$cols || 5}, minmax(0, 1fr));
    gap: 20px;
  }
`

export const SliderViewport = styled.div`
  width: 100%;
  max-width: 100%;
  min-width: 0;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  overscroll-behavior-inline: contain;
  scrollbar-width: thin;
  padding-bottom: 6px;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(84, 79, 69, 0.24);
    border-radius: var(--radius-pill);
  }
`

export const SliderTrack = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(184px, 78%);
  gap: 12px;

  > * {
    scroll-snap-align: start;
  }

  @media (min-width: 700px) {
    grid-auto-columns: minmax(188px, calc((100% - 12px) / 2));
  }

  @media (min-width: 1020px) {
    grid-auto-columns: minmax(190px, calc((100% - 36px) / 4));
  }
`

export const CategoryList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`

export const CategoryChip = styled.button`
  border-radius: var(--radius-pill);
  padding: 7px 12px;
  font-size: 0.76rem;
  background: ${(p) => (p.$active ? 'rgba(30, 74, 42, 0.12)' : 'var(--surface-card)')};
  color: ${(p) => (p.$active ? 'var(--brand-900)' : 'var(--text-secondary)')};
  border: 1px solid ${(p) => (p.$active ? 'var(--brand-700)' : 'rgba(185, 170, 150, 0.56)')};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(30, 74, 42, 0.06);
    border-color: var(--brand-700);
  }
`

export const StateText = styled.p`
  color: var(--text-secondary);
`

export const RetryButton = styled.button`
  margin-top: 10px;
  border: 1px solid rgba(30, 74, 42, 0.2);
  border-radius: var(--radius-pill);
  padding: 8px 12px;
  background: #fff;
  font-size: 0.72rem;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  font-weight: 700;
`

export const GridModeControl = styled.div`
  display: inline-flex;
  gap: 6px;
  align-items: center;
  flex-wrap: wrap;
`

export const GridModeBtn = styled.button`
  border: 1px solid ${(p) => (p.$active ? 'var(--brand-700)' : 'rgba(30, 74, 42, 0.2)')};
  background: ${(p) => (p.$active ? 'rgba(30, 74, 42, 0.12)' : '#fff')};
  color: var(--brand-900);
  border-radius: var(--radius-pill);
  min-height: 38px;
  padding: 8px 12px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
`

export const Pager = styled.div`
  margin-top: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`

export const PagerBtn = styled.button`
  border: 1px solid rgba(30, 74, 42, 0.2);
  background: ${(p) => (p.disabled ? '#f3eee3' : '#fff')};
  color: ${(p) => (p.disabled ? 'var(--text-secondary)' : 'var(--brand-900)')};
  border-radius: var(--radius-pill);
  min-height: 40px;
  padding: 8px 13px;
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
`

export const PagerText = styled.span`
  font-size: 0.74rem;
  color: var(--text-secondary);
`

export const SearchShell = styled.div`
  width: 100%;
  max-width: 580px;
  margin-top: 10px;
  margin-bottom: 6px;
`

export const Search = styled.input`
  width: 100%;
  min-height: 44px;
  border-radius: var(--radius-pill);
  padding: 0 16px;
  font-size: 0.8rem;
  background: #fff;
  border: 1px solid rgba(30, 74, 42, 0.2);
  color: var(--text-primary);
  outline: none;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: var(--brand-700);
    box-shadow: 0 0 0 3px rgba(30, 74, 42, 0.08);
  }
`
