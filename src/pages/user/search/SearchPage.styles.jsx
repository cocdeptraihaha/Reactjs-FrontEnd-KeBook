import styled from 'styled-components'

export const SearchWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
  background: var(--background);
  color: var(--text-primary);
  font-family: inherit;
  font-size: 14px;
`

export const TopBanner = styled.div`
  background: #fffdf7;
  border-left: 4px solid #ef4444;
  padding: 10px 16px;
  font-size: 0.85rem;
  color: #64748b;
  margin-bottom: 16px;
  border-radius: 4px;
  box-shadow: var(--shadow-sm);

  a {
    color: #ef4444;
    font-weight: 700;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`

export const MainBar = styled.div`
  background: var(--surface-card);
  border: 1px solid rgba(185, 170, 150, 0.4);
  border-radius: var(--radius-lg);
  padding: 16px;
  box-shadow: var(--shadow-sm);
  margin-bottom: 16px;
`

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
`

export const InputLabel = styled.span`
  font-weight: 700;
  min-width: 110px;
  font-size: 0.9rem;
  color: var(--brand-900);
`

export const StyledInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid rgba(185, 170, 150, 0.5);
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  outline: none;
  background: #fff;
  transition: border-color 0.2s;

  &:focus {
    border-color: var(--brand-700);
  }
`

export const QuickHostSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid rgba(185, 170, 150, 0.5);
  border-radius: var(--radius-md);
  background: #fff;
  font-size: 0.9rem;
  outline: none;
  min-width: 180px;
`

export const OptionBlock = styled.div`
  margin-bottom: 16px;
`

export const OptionTitle = styled.div`
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--brand-900);
  margin-bottom: 8px;
`

export const ButtonContainer = styled.div`
  background: #f1ebd9;
  border-radius: 8px;
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`

export const FilterButton = styled.button`
  background: ${(p) => (p.$active ? 'var(--brand-900)' : '#ffffff')};
  color: ${(p) => (p.$active ? '#ffffff' : 'var(--text-primary)')};
  border: 1px solid ${(p) => (p.$active ? 'var(--brand-900)' : 'rgba(185, 170, 150, 0.4)')};
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease-in-out;

  &:hover {
    background: ${(p) => (p.$active ? 'var(--brand-900)' : '#f8f4eb')};
    border-color: var(--brand-700);
  }
`

export const SearchFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--surface-card);
  border: 1px solid rgba(185, 170, 150, 0.4);
  border-radius: var(--radius-lg);
  padding: 12px 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
`

export const LayoutToggle = styled.button`
  background: transparent;
  border: 1px solid rgba(185, 170, 150, 0.4);
  border-radius: 6px;
  padding: 6px 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  font-size: 0.82rem;
  color: var(--text-primary);

  &:hover {
    background: #fcfbfa;
  }
`

export const InfiniteCheckboxWrapper = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;

  input {
    accent-color: var(--brand-900);
    transform: scale(1.2);
  }
`

export const ResultsGrid = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: ${(p) =>
    p.$isList ? '1fr' : 'repeat(2, minmax(0, 1fr))'};

  @media (min-width: 640px) {
    grid-template-columns: ${(p) =>
      p.$isList ? '1fr' : 'repeat(3, minmax(0, 1fr))'};
  }

  @media (min-width: 1024px) {
    grid-template-columns: ${(p) =>
      p.$isList ? '1fr' : 'repeat(4, minmax(0, 1fr))'};
  }
`

export const BookRowCard = styled.div`
  display: flex;
  gap: 16px;
  background: var(--surface-card);
  border: 1px solid rgba(185, 170, 150, 0.35);
  border-radius: var(--radius-lg);
  padding: 16px;
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
`

export const RowCover = styled.img`
  width: 90px;
  height: 120px;
  object-fit: cover;
  border-radius: var(--radius-md);
  border: 1px solid rgba(0, 0, 0, 0.08);
`

export const RowDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;
`

export const RowTitle = styled.h3`
  margin: 0 0 4px 0;
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--brand-900);
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`

export const RowMeta = styled.div`
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-bottom: 6px;
`

export const RowDesc = styled.p`
  margin: 0 0 10px 0;
  font-size: 0.82rem;
  color: #475569;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

export const RowBadgeList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`

export const RowBadge = styled.span`
  background: ${(p) => (p.$type === 'genre' ? '#eff6ff' : '#f1f5f9')};
  color: ${(p) => (p.$type === 'genre' ? '#1d4ed8' : '#475569')};
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 0.72rem;
  font-weight: 700;
`

export const PagerContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
`

export const TagSearchBox = styled.input`
  width: 150px;
  padding: 4px 8px;
  border: 1px solid rgba(185, 170, 150, 0.4);
  border-radius: 4px;
  font-size: 0.8rem;
  outline: none;
`

export const SearchBarContainer = styled.div`
  background: var(--surface-card);
  border: 1px solid rgba(185, 170, 150, 0.4);
  border-radius: var(--radius-lg);
  padding: 16px;
  box-shadow: var(--shadow-sm);
  margin-bottom: 16px;
  display: flex;
  gap: 12px;
  align-items: center;
`

export const SearchActionButton = styled.button`
  background: var(--brand-900);
  color: #fff;
  border: none;
  border-radius: var(--radius-md);
  padding: 8px 16px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background 0.15s ease-in-out;

  &:hover {
    background: var(--brand-800);
  }
`

export const AdvancedToggleBtn = styled.button`
  background: ${(p) => (p.$active ? 'rgba(185, 170, 150, 0.25)' : 'transparent')};
  color: var(--brand-900);
  border: 1px solid rgba(185, 170, 150, 0.4);
  border-radius: var(--radius-md);
  padding: 8px 16px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.15s ease-in-out;

  &:hover {
    background: rgba(185, 170, 150, 0.15);
  }
`
