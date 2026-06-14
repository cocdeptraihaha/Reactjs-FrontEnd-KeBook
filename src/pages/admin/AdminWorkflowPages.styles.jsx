import styled from 'styled-components'

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`

export const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
`

export const TableContainer = styled.div`
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`

export const AdminTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
`

export const Th = styled.th`
  padding: 16px;
  background-color: #f8fafc;
  border-bottom: 2px solid #e2e8f0;
  color: #475569;
  font-weight: 600;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

export const Td = styled.td`
  padding: 16px;
  border-bottom: 1px solid #f1f5f9;
  color: #334155;
  font-size: 14px;
  vertical-align: top;
`

export const StatusBadge = styled.span`
  display: inline-block;
  padding: 6px 12px;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  background-color: ${props => {
    switch (props.$status) {
      case 'DELIVERED': return '#dcfce7'
      case 'CONFIRMED': return '#dbeafe'
      case 'CANCELLED': return '#fee2e2'
      case 'PENDING': return '#fef9c3'
      case 'CANCEL_REQUESTED': return '#ffedd5'
      case 'INPROGRESS': return '#f3e8ff'
      case 'SHIPPED': return '#e0f2fe'
      case 'COMPLETED': return '#dcfce7'
      default: return '#f1f5f9'
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'DELIVERED': return '#15803d'
      case 'CONFIRMED': return '#1d4ed8'
      case 'CANCELLED': return '#b91c1c'
      case 'PENDING': return '#a16207'
      case 'CANCEL_REQUESTED': return '#c2410c'
      case 'INPROGRESS': return '#7e22ce'
      case 'SHIPPED': return '#0369a1'
      case 'COMPLETED': return '#15803d'
      default: return '#475569'
    }
  }};
`

export const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const ItemRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
`

export const ItemThumbnail = styled.img`
  width: 36px;
  height: 48px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
`

export const ActionGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 240px;
`

export const ActionSelect = styled.select`
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  font-size: 13px;
  outline: none;
  background-color: #ffffff;
  color: #334155;
  cursor: pointer;
  width: 100%;

  &:focus {
    border-color: #3b82f6;
  }
`

export const ActionButton = styled.button`
  padding: 8px 16px;
  background-color: ${props => props.$variant === 'danger' ? '#ef4444' : props.$variant === 'success' ? '#10b981' : '#3b82f6'};
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    background-color: #cbd5e1;
    cursor: not-allowed;
    opacity: 1;
  }
`

export const InputDesc = styled.input`
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  font-size: 13px;
  outline: none;
  width: 100%;

  &:focus {
    border-color: #3b82f6;
  }
`

export const SectionCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

export const CancelRequestPanel = styled.div`
  background-color: #fff7ed;
  border: 1px solid #ffedd5;
  border-radius: 8px;
  padding: 12px;
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const CancelRequestTitle = styled.h4`
  margin: 0;
  font-size: 13px;
  color: #c2410c;
  font-weight: 600;
`

export const CancelRequestReason = styled.p`
  margin: 0;
  font-size: 13px;
  color: #7c2d12;
  font-style: italic;
`

export const QuickActions = styled.div`
  display: flex;
  gap: 8px;
`
