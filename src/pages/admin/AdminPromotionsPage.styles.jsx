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

export const PromoTable = styled.table`
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
    if (p.$type === 'expired') return '#fef2f2'
    if (p.$type === 'personal') return '#f5f3ff'
    return '#f1f5f9'
  }};

  color: ${(p) => {
    if (p.$type === 'active') return '#059669'
    if (p.$type === 'expired') return '#dc2626'
    if (p.$type === 'personal') return '#7c3aed'
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
    p.$variant === 'warning' &&
    `
    color: #b45309;
    border-color: #fde68a;
    &:hover {
      background-color: #fffbeb;
      border-color: #d97706;
      color: #78350f;
    }
  `}

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

  ${(p) =>
    p.$variant === 'success' &&
    `
    color: #16a34a;
    border-color: #dcfce7;
    &:hover {
      background-color: #f0fdf4;
      border-color: #15803d;
      color: #14532d;
    }
  `}
`

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`

export const ModalContainer = styled.div`
  background: #ffffff;
  border-radius: 16px;
  width: ${props => props.$wide ? '640px' : '480px'};
  max-width: 95%;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  animation: slideUp 0.2s cubic-bezier(0.16, 1, 0.3, 1);

  @keyframes slideUp {
    from {
      transform: translateY(10px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`

export const ModalHeader = styled.div`
  padding: 16px 24px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 16px;
  font-weight: 800;
  color: #0f172a;
`

export const ModalBody = styled.div`
  padding: 24px;
  max-height: 70vh;
  overflow-y: auto;
`

export const ModalFooter = styled.div`
  padding: 16px 24px;
  border-top: 1px solid #f1f5f9;
  background-color: #fafaf9;
  display: flex;
  justify-content: flex-end;
  gap: 10px;

  button {
    padding: 8px 16px;
    font-size: 13px;
    font-weight: 700;
    border-radius: 10px;
    cursor: pointer;
    border: none;
    transition: all 0.15s ease;
  }

  .btn-secondary {
    background-color: #ffffff;
    border: 1px solid #e2e8f0;
    color: #475569;
    &:hover {
      background-color: #f8fafc;
      border-color: #cbd5e1;
    }
  }

  .btn-primary {
    background-color: #3b82f6;
    color: #ffffff;
    &:hover {
      background-color: #2563eb;
    }
  }
`

export const FormGroup = styled.div`
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`

export const FormLabel = styled.label`
  font-size: 12px;
  font-weight: 700;
  color: #334155;
`

export const FormInput = styled.input`
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  font-size: 13px;
  outline: none;
  background-color: #ffffff;
  color: #1e293b;
  transition: all 0.2s ease;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  }
`

export const FormSelect = styled.select`
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  font-size: 13px;
  outline: none;
  background-color: #ffffff;
  color: #1e293b;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  }
`

export const SearchableSelectContainer = styled.div`
  position: relative;
  width: 100%;
`

export const SearchableSelectInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`

export const SearchableSelectDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  margin-top: 4px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1010;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
`

export const SearchableSelectItem = styled.div`
  padding: 10px 12px;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 2px;
  border-bottom: 1px solid #f1f5f9;
  background-color: ${props => props.$selected ? '#f1f5f9' : 'transparent'};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f1f5f9;
  }
`

export const SearchableSelectNoResults = styled.div`
  padding: 12px;
  font-size: 13px;
  color: #64748b;
  text-align: center;
`

export const SearchableSelectUserText = styled.span`
  font-weight: 600;
  color: #1e293b;
`

export const SearchableSelectUserSubtext = styled.span`
  font-size: 11px;
  color: #64748b;
`

