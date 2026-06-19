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

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }
`

export const Panel = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
`

export const PanelTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 20px 0;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 12px;
`

export const FormGroup = styled.div`
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
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

export const FormTextarea = styled.textarea`
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  font-size: 13px;
  outline: none;
  resize: none;
  font-family: inherit;
  background-color: #ffffff;
  color: #1e293b;
  transition: all 0.2s ease;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  }
`

export const RadioGroup = styled.div`
  display: flex;
  gap: 16px;
`

export const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;

  input {
    accent-color: #3b82f6;
  }
`

export const SubmitButton = styled.button`
  background-color: #3b82f6;
  color: #ffffff;
  border: none;
  padding: 12px 24px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: #2563eb;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`

export const MultiSelectWrapper = styled.div`
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  background: #ffffff;
  overflow: hidden;
`

export const SelectAllCheckbox = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  font-size: 12px;
  font-weight: 700;
  color: #475569;
  cursor: pointer;

  input {
    accent-color: #3b82f6;
  }
`

export const UserCheckList = styled.div`
  max-height: 180px;
  overflow-y: auto;
  padding: 6px;
`

export const UserCheckItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.1s;

  &:hover {
    background-color: #f1f5f9;
  }

  input {
    accent-color: #3b82f6;
  }
`

export const NotificationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 550px;
  overflow-y: auto;
  padding-right: 4px;
`

export const NotificationItem = styled.div`
  display: flex;
  gap: 12px;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background-color: #ffffff;
`

export const IconWrap = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  background-color: ${(p) => {
    if (p.$type === 'ORDER_NEW') return '#ecfdf5'
    if (p.$type === 'SUPPORT_NEW') return '#fff1f2'
    return '#f5f3ff'
  }};

  color: ${(p) => {
    if (p.$type === 'ORDER_NEW') return '#10b981'
    if (p.$type === 'SUPPORT_NEW') return '#f43f5e'
    return '#8b5cf6'
  }};
`

export const NotifContent = styled.div`
  flex: 1;
  min-width: 0;
`

export const NotifTitle = styled.h4`
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
`

export const NotifMessage = styled.p`
  margin: 4px 0 0 0;
  font-size: 12px;
  color: #475569;
  line-height: 1.4;
`

export const NotifMeta = styled.div`
  display: flex;
  gap: 6px;
  font-size: 10px;
  font-weight: 600;
  color: #94a3b8;
  margin-top: 6px;
  text-transform: uppercase;
  letter-spacing: 0.02em;
`
