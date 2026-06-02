import styled from 'styled-components'

export const Wrap = styled.div`
  display: grid;
  gap: 16px;

  @media (min-width: 1200px) {
    gap: 20px;
  }
`

export const SearchShell = styled.div`
  margin-top: 12px;
  position: relative;
`

export const Search = styled.input`
  width: 100%;
  border: 1px solid rgba(185, 170, 150, 0.82);
  border-radius: var(--radius-pill);
  min-height: 48px;
  padding: 13px 16px;
  font-size: 1rem;
  background: rgba(255, 250, 240, 0.82);

  &:focus {
    outline: none;
    border-color: rgba(180, 120, 47, 0.72);
    box-shadow: 0 0 0 4px rgba(180, 120, 47, 0.14);
  }
`

export const Grid = styled.div`
  display: grid;
  gap: 12px;

  @media (min-width: 760px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (min-width: 1080px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (min-width: 1380px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`

export const Books = styled.div`
  display: grid;
  gap: 12px;

  @media (min-width: 700px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (min-width: 1020px) {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
`

export const CategoryItem = styled.article`
  border-radius: var(--radius-md);
  padding: 16px;
  border: 1px solid rgba(185, 170, 150, 0.72);
  background:
    linear-gradient(155deg, rgba(255, 250, 240, 0.96), rgba(236, 226, 210, 0.92)),
    linear-gradient(90deg, rgba(31, 77, 46, 0.08), transparent);
`

export const H3 = styled.h3`
  margin: 0;
  font-family: var(--font-display);
  font-size: 0.98rem;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

export const P = styled.p`
  margin-top: 4px;
  color: var(--text-secondary);
  font-size: 0.86rem;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const StateText = styled.p`
  color: var(--text-secondary);
`

export const RetryButton = styled.button`
  margin-top: 10px;
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
