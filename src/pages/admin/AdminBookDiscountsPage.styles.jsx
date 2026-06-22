import styled from 'styled-components'

export const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #f8fafc;
  min-height: 100vh;
`

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 24px;
`

export const Title = styled.h1`
  font-size: 32px;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
  letter-spacing: -0.025em;
`

export const FilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
`

export const SearchInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  padding: 8px 12px;
  width: 280px;
  color: #64748b;

  &:focus-within {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  }
`

export const SearchInput = styled.input`
  border: none;
  outline: none;
  font-size: 13px;
  width: 100%;
  color: var(--text-primary);
  background: transparent;
`

export const AddButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background-color: #3b82f6;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background-color: #2563eb;
  }
`

export const DiscountTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`

export const Th = styled.th`
  background-color: #f8fafc;
  padding: 14px 20px;
  text-align: left;
  font-size: 12px;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #e2e8f0;
`

export const Td = styled.td`
  padding: 14px 20px;
  font-size: 13px;
  border-bottom: 1px solid #f1f5f9;
  color: #334155;
  vertical-align: middle;
`

export const LoadingWrap = styled.div`
  text-align: center;
  padding: 60px;
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
`

export const ErrorWrap = styled.div`
  background: #fef2f2;
  border: 1px solid #fee2e2;
  border-radius: 8px;
  padding: 12px 16px;
  color: #dc2626;
  font-size: 13px;
  margin-bottom: 20px;
  font-weight: 500;
`

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.02em;

  background-color: ${(p) => {
    if (p.$type === 'active') return '#ecfdf5'
    if (p.$type === 'scheduled') return '#fef3c7'
    if (p.$type === 'expired') return '#fef2f2'
    return '#f1f5f9'
  }};

  color: ${(p) => {
    if (p.$type === 'active') return '#059669'
    if (p.$type === 'scheduled') return '#d97706'
    if (p.$type === 'expired') return '#dc2626'
    return '#475569'
  }};
`

export const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 700;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  background-color: #ffffff;
  color: #334155;
  transition: all 0.15s ease-in-out;

  &:hover {
    background-color: #f8fafc;
    border-color: #3b82f6;
    color: #1d4ed8;
  }

  ${(p) =>
    p.$variant === 'danger' &&
    `
    color: #dc2626;
    border-color: #fee2e2;
    &:hover {
      background-color: #fef2f2;
      border-color: #b91c1c;
      color: #7f1d1d;
    }
  `}
`

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`

export const ModalContainer = styled.div`
  background: #ffffff;
  border-radius: 16px;
  width: 100%;
  max-width: ${(p) => p.$size === 'large' ? '800px' : '550px'};
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 40px);
  overflow: hidden;
`

export const ModalHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f8fafc;
`

export const ModalBody = styled.div`
  padding: 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
`

export const ModalFooter = styled.div`
  padding: 16px 24px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background-color: #f8fafc;
`

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
`

export const FormLabel = styled.label`
  font-size: 13px;
  font-weight: 700;
  color: #334155;
`

export const FormInput = styled.input`
  padding: 10px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  color: #1e293b;
  outline: none;
  transition: all 0.15s ease;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &:disabled {
    background-color: #f1f5f9;
    color: #64748b;
    cursor: not-allowed;
  }
`

export const FormSelect = styled.select`
  padding: 10px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  color: #1e293b;
  outline: none;
  background-color: #ffffff;
  transition: all 0.15s ease;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`

export const BookListContainer = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  max-height: 200px;
  overflow-y: auto;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  background-color: #f8fafc;
`

export const ModalSearchWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 6px 12px;
  margin-bottom: 8px;
  color: #64748b;

  &:focus-within {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`

export const ModalSearchInput = styled.input`
  border: none;
  outline: none;
  font-size: 13px;
  width: 100%;
  color: var(--text-primary);
  background: transparent;
`

export const BookCheckboxItem = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.1s ease;
  font-size: 13px;

  &:hover {
    background-color: #f1f5f9;
  }
`

export const BookThumb = styled.img`
  width: 24px;
  height: 32px;
  object-fit: cover;
  border-radius: 3px;
  background-color: #e2e8f0;
`
