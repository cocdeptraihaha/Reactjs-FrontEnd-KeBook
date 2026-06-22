import styled from 'styled-components'

export const Section = styled.section`
  border-radius: var(--radius-lg);
  background:
    linear-gradient(168deg, rgba(255, 253, 248, 0.98), rgba(246, 238, 226, 0.96)),
    linear-gradient(90deg, rgba(31, 77, 46, 0.05) 1px, transparent 1px);
  border: 1px solid rgba(185, 170, 150, 0.72);
  box-shadow: var(--shadow-soft);
  padding: 16px;

  @media (min-width: 760px) {
    padding: 22px;
  }
`

export const SectionTitle = styled.h2`
  font-family: var(--font-display);
  color: var(--text-primary);
  font-size: 1.32rem;
  letter-spacing: 0.005em;
  line-height: 1.12;
  font-weight: 800;
  padding-bottom: 7px;

  @media (min-width: 760px) {
    font-size: 1.55rem;
  }
`

export const SectionSub = styled.p`
  margin-top: 8px;
  color: var(--text-secondary);
  max-width: 62ch;
  font-size: 0.9rem;
  line-height: 1.45;
`

