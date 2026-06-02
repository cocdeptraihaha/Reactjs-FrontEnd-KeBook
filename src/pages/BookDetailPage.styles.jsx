import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Section } from '../components/Section'

export const Wrap = styled.div`
  display: grid;
  gap: 16px;

  @media (min-width: 1200px) {
    gap: 20px;
  }
`

export const Hero = styled(Section)`
  display: grid;
  gap: 14px;
  align-items: start;

  @media (min-width: 860px) {
    grid-template-columns: 250px minmax(0, 1fr);
    gap: 18px;
  }

  @media (min-width: 1280px) {
    grid-template-columns: 310px minmax(0, 1fr);
    gap: 24px;
  }
`

export const Cover = styled.div`
  border-radius: var(--radius-md);
  min-height: 300px;
  background:
    linear-gradient(145deg, rgba(31, 77, 46, 0.14), rgba(164, 72, 97, 0.12)),
    #e9e3d8;
  border: 1px solid rgba(185, 170, 150, 0.78);
  overflow: hidden;
  box-shadow: var(--shadow-card);

  @media (min-width: 1280px) {
    min-height: 380px;
  }
`

export const CoverImg = styled.img`
  width: 100%;
  height: 100%;
  min-height: inherit;
  object-fit: cover;
  display: block;
`

export const Thumbs = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
  flex-wrap: wrap;
`

export const Thumb = styled.button`
  width: 62px;
  height: 78px;
  border-radius: 8px;
  border: 2px solid ${(p) => (p.$active ? 'var(--gold-600)' : 'rgba(0,0,0,0.08)')};
  background: #f3eee3;
  padding: 0;
  overflow: hidden;
`

export const ThumbImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`

export const BookTitle = styled.h3`
  margin-top: 8px;
  font-family: var(--font-display);
  font-size: 1.65rem;
  line-height: 1.08;

  @media (min-width: 760px) {
    font-size: 2rem;
  }
`

export const Meta = styled.p`
  margin-top: 6px;
  color: var(--text-secondary);
  font-size: 0.95rem;
`

export const Actions = styled.div`
  margin-top: 12px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`

export const PrimaryBtn = styled.button`
  border: 0;
  border-radius: var(--radius-pill);
  min-height: 46px;
  padding: 11px 17px;
  color: #fff;
  background: linear-gradient(140deg, var(--brand-950), var(--brand-700));
  font-weight: 700;
  box-shadow: 0 12px 24px rgba(31, 77, 46, 0.18);
`

export const SecondaryBtn = styled(Link)`
  border-radius: var(--radius-pill);
  min-height: 46px;
  padding: 11px 17px;
  border: 1px solid rgba(30, 74, 42, 0.25);
  color: var(--brand-900);
  font-size: 0.9rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
`

export const StateText = styled.p`
  color: var(--text-secondary);
`

export const RetryButton = styled.button`
  border: 1px solid rgba(30, 74, 42, 0.2);
  border-radius: var(--radius-pill);
  min-height: 40px;
  padding: 8px 13px;
  background: #fff;
  font-size: 0.82rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 700;
`

export const ListCard = styled(Section)`
  min-width: 0;
  overflow: hidden;

  ul {
    margin: 8px 0 0;
    padding-left: 18px;
    display: grid;
    gap: 8px;
    color: var(--text-secondary);
  }
`

export const SimilarViewport = styled.div`
  margin-top: 10px;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  overscroll-behavior-inline: contain;
  scrollbar-width: thin;
  padding-bottom: 8px;
  mask-image: linear-gradient(90deg, transparent 0, #000 18px, #000 calc(100% - 18px), transparent 100%);

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(84, 79, 69, 0.25);
    border-radius: 999px;
  }
`

export const SimilarGrid = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(158px, 74vw);
  gap: 12px;

  > * {
    scroll-snap-align: start;
    scroll-snap-stop: always;
  }

  @media (min-width: 760px) {
    grid-auto-columns: 206px;
    gap: 14px;
  }

  @media (min-width: 1200px) {
    grid-auto-columns: 220px;
    gap: 16px;
  }
`

