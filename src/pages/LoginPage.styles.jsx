import styled from 'styled-components'

export const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;

  > * {
    width: 100%;
    max-width: 560px;
  }
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
  font-family: inherit;
  font-size: 0.95rem;

  &[type="date"] {
    color: #1e293b;
    font-family: inherit;
    cursor: pointer;
  }

  &::-webkit-calendar-picker-indicator {
    cursor: pointer;
    filter: invert(0.4) sepia(1) saturate(1.8) hue-rotate(10deg);
  }

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
  background-color: rgba(239, 68, 68, 0.05);
  border: 1px dashed rgba(239, 68, 68, 0.2);
  border-radius: var(--radius-sm);
  padding: 10px 12px;
  margin: 8px 0;
  font-size: 0.88rem;
  min-height: 40px;
  display: flex;
  align-items: center;
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

export const SecondaryButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--brand-700);
  border-radius: var(--radius-pill);
  min-height: 48px;
  padding: 12px 16px;
  color: var(--brand-800);
  font-weight: 700;
  text-decoration: none;
  background: transparent;
  transition: all 0.2s ease;
  margin-top: 16px;

  &:hover {
    background: rgba(31, 77, 46, 0.05);
    color: var(--brand-950);
  }
`

export const Select = styled.select`
  width: 100%;
  margin-top: 6px;
  min-height: 46px;
  border: 1px solid rgba(185, 170, 150, 0.82);
  border-radius: var(--radius-sm);
  padding: 12px;
  background: rgba(255, 250, 240, 0.86);
  color: inherit;
  font-family: inherit;
  font-size: 0.95rem;

  &:focus-visible {
    border-color: rgba(180, 120, 47, 0.72);
    box-shadow: 0 0 0 4px rgba(180, 120, 47, 0.14);
    outline: none;
  }
`
