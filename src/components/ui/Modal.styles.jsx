import styled from 'styled-components'

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 40;
  display: grid;
  place-items: center;
  padding: 18px;
  background: rgba(15, 24, 18, 0.46);
  backdrop-filter: blur(4px);
`

export const ModalDialog = styled.div`
  width: min(720px, 100%);
  max-height: min(86vh, 780px);
  overflow-y: auto;
  border-radius: var(--radius-lg);
  border: 1px solid rgba(185, 170, 150, 0.78);
  background:
    linear-gradient(168deg, rgba(255, 253, 248, 0.99), rgba(246, 238, 226, 0.98)),
    radial-gradient(circle at 100% 0%, rgba(96, 149, 101, 0.12), transparent 32%);
  box-shadow: 0 28px 70px rgba(15, 24, 18, 0.26);
  padding: 18px;
`

export const ModalHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
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
