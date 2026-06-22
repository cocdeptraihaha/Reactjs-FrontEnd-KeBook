import styled from 'styled-components'

export const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
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
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  background-color: #ffffff;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`

export const SearchInput = styled.input`
  padding: 10px 16px;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  font-size: 14px;
  font-weight: 500;
  outline: none;
  background-color: #ffffff;
  color: #334155;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  min-width: 260px;
  flex: 1;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  }
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

/* NEW: Professional Book Form & Image Manager Elements */
export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 24px;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`

export const FormCard = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

export const FormCardTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
`

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const FormLabel = styled.label`
  font-size: 12px;
  font-weight: 600;
  color: #475569;
`

export const FormInput = styled.input`
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  font-size: 14px;
  outline: none;
  background-color: #ffffff;
  color: #1e293b;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
  }

  &:disabled {
    background-color: #f1f5f9;
    color: #64748b;
    cursor: not-allowed;
  }
`

export const FormButton = styled.button`
  padding: 12px 24px;
  background-color: #3b82f6;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
  width: fit-content;

  &:hover {
    background-color: #2563eb;
  }

  &:disabled {
    background-color: #cbd5e1;
    cursor: not-allowed;
  }
`

export const BookPreviewPanel = styled.div`
  background-color: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
`

export const PreviewTitle = styled.h3`
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
`

export const ImageGallery = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 12px;
  margin-top: 16px;
`

export const ImageThumbnailCard = styled.div`
  position: relative;
  background: #ffffff;
  border: 2px solid ${props => props.$isPrimary ? '#8b5cf6' : '#e2e8f0'};
  border-radius: 8px;
  padding: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: grab;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`

export const GalleryImage = styled.img`
  width: 100%;
  height: 96px;
  object-fit: cover;
  border-radius: 6px;
`

export const ThumbnailBadge = styled.span`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #8b5cf6;
  color: #ffffff;
  font-size: 9px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 9999px;
  text-transform: uppercase;
`

export const CheckboxWrapper = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #475569;
  font-weight: 500;
  cursor: pointer;

  input {
    width: 16px;
    height: 16px;
    accent-color: #3b82f6;
    cursor: pointer;
  }
`

export const UploadDropzone = styled.div`
  border: 2px dashed ${props => props.$error ? '#ef4444' : '#3b82f6'};
  background-color: ${props => props.$error ? '#fef2f2' : '#f0f9ff'};
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.2s, border-color 0.2s;

  &:hover {
    background-color: ${props => props.$error ? '#fee2e2' : '#e0f2fe'};
  }
`

export const UploadIconWrap = styled.div`
  color: ${props => props.$error ? '#ef4444' : '#3b82f6'};
  display: flex;
  align-items: center;
  justify-content: center;
`

export const UploadText = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
`

export const UploadSubtext = styled.span`
  font-size: 11px;
  color: #64748b;
`

export const UploadProgressWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 12px;
  font-size: 13px;
  color: #334155;
`

export const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: #ffffff;
  border-top: 1px solid #e2e8f0;
  border-radius: 0 0 12px 12px;
`

export const PaginationInfo = styled.span`
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
`

export const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const PaginationButton = styled.button`
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 700;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background-color: #ffffff;
  color: #334155;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover:not(:disabled) {
    background-color: #f8fafc;
    border-color: #94a3b8;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

/* Tab Navigation Styles */
export const TabHeader = styled.div`
  display: flex;
  gap: 8px;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 2px;
  margin-bottom: 24px;
`

export const TabButton = styled.button`
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 700;
  color: ${props => props.$active ? '#3b82f6' : '#64748b'};
  background: none;
  border: none;
  border-bottom: 3px solid ${props => props.$active ? '#3b82f6' : 'transparent'};
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;
  margin-bottom: -3px;

  &:hover {
    color: #3b82f6;
  }
`

/* Category Tree Styles */
export const CategoryTreeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 8px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  max-height: 480px;
  overflow-y: auto;
`

export const CategoryRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-bottom: 6px;
  transition: all 0.15s ease;

  &:hover {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
    border-color: #cbd5e1;
  }
`

export const CategoryInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
`

export const CategoryActions = styled.div`
  display: flex;
  gap: 6px;
`

export const CategoryBadge = styled.span`
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  background-color: #eff6ff;
  color: #1d4ed8;
  padding: 2px 6px;
  border-radius: 4px;
`

export const SubCategoryContainer = styled.div`
  margin-left: 24px;
  border-left: 2px dashed #cbd5e1;
  padding-left: 12px;
  margin-top: 4px;
`

export const CompactCheckboxGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 12px;
  background-color: #ffffff;
`
