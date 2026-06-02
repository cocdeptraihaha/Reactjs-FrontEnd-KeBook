import styled from 'styled-components'

export const Wrap = styled.div`
  display: grid;
  gap: 16px;
  max-width: 560px;
  margin: 0 auto;
`

export const Form = styled.form`
  display: grid;
  gap: 12px;
`

export const Label = styled.label`
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-secondary);
`

export const Input = styled.input`
  width: 100%;
  margin-top: 6px;
  min-height: 46px;
  border: 1px solid rgba(185, 170, 150, 0.82);
  border-radius: var(--radius-sm);
  padding: 12px;
  background: rgba(255, 250, 240, 0.86);

  &:focus-visible {
    border-color: rgba(180, 120, 47, 0.72);
    box-shadow: 0 0 0 4px rgba(180, 120, 47, 0.14);
    outline: none;
  }
`

export const Submit = styled.button`
  border: 0;
  border-radius: var(--radius-pill);
  min-height: 48px;
  padding: 12px 16px;
  color: #fff;
  font-weight: 700;
  background: linear-gradient(140deg, var(--brand-950), var(--brand-700));
  box-shadow: 0 12px 24px rgba(31, 77, 46, 0.18);
`

export const ErrorText = styled.p`
  color: #8f2f3c;
`

export const Inline = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
  color: var(--text-secondary);

  a {
    color: var(--brand-900);
    font-weight: 700;
  }
`
