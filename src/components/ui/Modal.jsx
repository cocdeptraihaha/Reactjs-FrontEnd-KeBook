import { X } from 'react-feather'
import { IconButton, ModalDialog, ModalHead, ModalOverlay } from './Modal.styles'

export function Modal({ children, labelledBy, onClose, title }) {
  return (
    <ModalOverlay role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose?.() }}>
      <ModalDialog role="dialog" aria-modal="true" aria-labelledby={labelledBy}>
        <ModalHead>
          {title}
          <IconButton type="button" onClick={onClose} aria-label="Close dialog">
            <X size={22} />
          </IconButton>
        </ModalHead>
        {children}
      </ModalDialog>
    </ModalOverlay>
  )
}
