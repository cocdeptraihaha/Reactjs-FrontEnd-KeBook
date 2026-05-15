import styled from 'styled-components'

export const Section = styled.section`
  background: var(--surface-container-low);
  border-radius: 22px;
  padding: 18px;

  @media (min-width: 720px) {
    padding: 26px;
  }
`

export const SectionTitle = styled.h2`
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.4rem, 2vw + 1rem, 2rem);
  color: var(--on-surface);
`

export const SectionSub = styled.p`
  margin: 8px 0 0;
  color: var(--on-surface-variant);
  max-width: 60ch;
`
