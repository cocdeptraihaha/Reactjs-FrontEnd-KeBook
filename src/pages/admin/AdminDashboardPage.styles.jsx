import styled, { keyframes } from 'styled-components'

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

export const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  animation: ${fadeIn} 0.5s ease-out;
  background-color: #f8fafc;
  min-height: 100vh;

  @media print {
    padding: 0;
    background-color: #ffffff;
    gap: 20px;
    min-height: auto;
  }
`

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 24px;

  @media print {
    border-bottom: none;
    padding-bottom: 0;
    margin-bottom: 10px;
  }
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
  flex-wrap: nowrap;

  > div {
    max-width: 200px;
  }

  @media (max-width: 1024px) {
    flex-wrap: wrap;
    > div {
      max-width: 280px;
    }
  }

  @media print {
    display: none !important;
  }
`

export const ExportPdfButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #059669 0%, #10b981 100%);
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  box-shadow: 0 4px 10px rgba(16, 185, 129, 0.2);
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 14px rgba(16, 185, 129, 0.3);
    filter: brightness(1.05);
  }

  &:active {
    transform: translateY(0);
  }

  @media print {
    display: none !important;
  }
`

export const DateInput = styled.input`
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

  &:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
  }
`

export const GroupBySelect = styled.select`
  padding: 10px 16px;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  font-size: 14px;
  font-weight: 500;
  outline: none;
  background-color: #ffffff;
  color: #334155;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;

  &:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
  }
`

export const ExportButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
  color: #ffffff;
  text-decoration: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  box-shadow: 0 4px 10px rgba(79, 70, 229, 0.2);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 14px rgba(79, 70, 229, 0.3);
    filter: brightness(1.05);
  }

  &:active {
    transform: translateY(0);
  }

  @media print {
    display: none !important;
  }
`

export const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;

  @media print {
    grid-template-columns: repeat(2, 1fr);
  }
`

export const MetricCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -2px rgba(0, 0, 0, 0.02);
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 20px -8px rgba(0, 0, 0, 0.08);
    border-color: #cbd5e1;
  }
`

export const MetricIconWrap = styled.div`
  padding: 16px;
  background-color: ${props => props.$bgColor || '#eff6ff'};
  color: ${props => props.$iconColor || '#3b82f6'};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;

  ${MetricCard}:hover & {
    transform: scale(1.08);
  }
`

export const MetricInfo = styled.div`
  display: flex;
  flex-direction: column;
`

export const MetricLabel = styled.span`
  font-size: 14px;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

export const MetricValue = styled.span`
  font-size: 26px;
  font-weight: 800;
  color: #0f172a;
  margin-top: 6px;
  letter-spacing: -0.02em;
`

export const MainContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 32px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }

  @media print {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
`

export const Panel = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -2px rgba(0, 0, 0, 0.02);
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden; /* Avoid panel content leaking out */

  @media print {
    break-inside: avoid;
    page-break-inside: avoid;
    height: auto;
  }
`

export const PanelTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 14px;
`

export const TopBooksList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

export const TopBookItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-radius: 12px;
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  transition: all 0.2s ease;

  &:hover {
    background: #ffffff;
    border-color: #cbd5e1;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
    transform: translateX(4px);
  }
`

export const BookTitle = styled.span`
  font-weight: 700;
  color: #1e293b;
  font-size: 14px;
  display: block;
`

export const BookMeta = styled.span`
  font-size: 12px;
  color: #64748b;
  margin-top: 4px;
  display: block;
  font-weight: 500;
`

export const BookStat = styled.div`
  text-align: right;
  display: flex;
  flex-direction: column;
`

export const BookStatValue = styled.span`
  font-weight: 800;
  color: #0f172a;
  font-size: 15px;
`

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
`

export const Th = styled.th`
  padding: 14px 16px;
  border-bottom: 2px solid #f1f5f9;
  color: #475569;
  font-weight: 700;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background-color: #f8fafc;
`

export const Td = styled.td`
  padding: 14px 16px;
  border-bottom: 1px solid #f1f5f9;
  color: #334155;
  font-size: 14px;
  font-weight: 500;
`

export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background-color: ${props => {
    switch (props.$status) {
      case 'DELIVERED': return '#ecfdf5'
      case 'CONFIRMED': return '#eff6ff'
      case 'CANCELLED': return '#fef2f2'
      case 'PENDING': return '#fffbeb'
      default: return '#f8fafc'
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'DELIVERED': return '#059669'
      case 'CONFIRMED': return '#2563eb'
      case 'CANCELLED': return '#dc2626'
      case 'PENDING': return '#d97706'
      default: return '#64748b'
    }
  }};
`

export const SecondaryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }

  @media print {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
`

export const CategoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px dashed #e2e8f0;
  transition: all 0.2s ease;

  &:hover {
    padding-left: 6px;
  }

  &:last-child {
    border-bottom: none;
  }
`

export const CustomerRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-radius: 12px;
  background-color: #f8fafc;
  margin-bottom: 12px;
  border: 1px solid transparent;
  transition: all 0.2s ease;

  &:hover {
    background-color: #ffffff;
    border-color: #e2e8f0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
    transform: translateY(-1px);
  }

  &:last-child {
    margin-bottom: 0;
  }
`

export const CustomerInfo = styled.div`
  display: flex;
  flex-direction: column;
`

export const CustomerName = styled.span`
  font-weight: 700;
  color: #1e293b;
  font-size: 14px;
`

export const CustomerEmail = styled.span`
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
  font-weight: 500;
`

export const CustomerValue = styled.div`
  text-align: right;
  font-weight: 800;
  color: #0f172a;
  font-size: 14px;
`

export const LoadingWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: #64748b;
  font-size: 16px;
  font-weight: 600;
  gap: 12px;
`

export const ErrorWrap = styled.div`
  padding: 16px 20px;
  background-color: #fef2f2;
  border: 1px solid #fca5a5;
  color: #991b1b;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 24px;
`

export const ChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
  max-height: 320px;
  overflow-y: auto;
  padding-right: 8px;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
`

export const ChartRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`

export const ChartLabel = styled.div`
  width: 110px;
  font-size: 13px;
  color: #475569;
  font-weight: 600;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`

export const ChartBarContainer = styled.div`
  flex: 1;
  height: 28px;
  background-color: #f1f5f9;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
`

export const ChartBarFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #f43f5e 0%, #fda4af 100%);
  width: ${props => props.$width || '0%'};
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 8px;
`

export const ChartValue = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
  min-width: 90px;
  text-align: right;
`

export const VerticalChartContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  height: 280px;
  padding: 24px 16px;
  background: #f8fafc;
  border-radius: 16px;
  border: 1px solid #f1f5f9;
  margin-top: 20px;
  gap: 16px;
  overflow-x: auto;
  max-width: 100%;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
`

export const VerticalChartColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 50px;
  flex-shrink: 0;
  height: 100%;
  justify-content: flex-end;
  position: relative;
`

export const VerticalBarFill = styled.div`
  width: 100%;
  max-width: 40px;
  height: ${props => props.$height || '0%'};
  background: linear-gradient(180deg, #10b981 0%, #34d399 100%);
  border-radius: 8px 8px 0 0;
  transition: height 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;

  &:hover {
    filter: brightness(0.95);
  }
`

export const VerticalBarLabel = styled.div`
  font-size: 11px;
  color: #475569;
  font-weight: 600;
  margin-top: 12px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 100%;
  text-align: center;
`

export const VerticalTooltip = styled.div`
  position: absolute;
  bottom: calc(${props => props.$height || '0%'} + 16px);
  background: #0f172a;
  color: #ffffff;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  z-index: 10;
  opacity: 0;
  pointer-events: none;
  transform: translateY(4px);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  ${VerticalChartColumn}:hover & {
    opacity: 1;
    transform: translateY(0);
  }
`

export const DonutChartGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 20px;
  margin-top: 20px;
`

export const DonutCard = styled.div`
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  text-align: center;
  transition: all 0.2s ease;

  &:hover {
    background-color: #ffffff;
    border-color: #cbd5e1;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  }
`

export const DonutRingSvg = styled.svg`
  width: 90px;
  height: 90px;
  transform: rotate(-90deg);
`

export const DonutCircleBg = styled.circle`
  fill: none;
  stroke: #f1f5f9;
  stroke-width: 8;
`

export const DonutCircleFill = styled.circle`
  fill: none;
  stroke: ${props => props.$color || '#8b5cf6'};
  stroke-width: 8;
  stroke-linecap: round;
  stroke-dasharray: 226;
  stroke-dashoffset: ${props => props.$offset || '226'};
  transition: stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1);
`

export const DonutText = styled.div`
  position: absolute;
  font-size: 15px;
  font-weight: 800;
  color: #0f172a;
`

export const RingWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const PieChartWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 24px;
  flex-wrap: wrap;
  margin-top: 20px;
`

export const PieLegend = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 150px;
`

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 8px;
  background-color: #f8fafc;
  border: 1px solid #f1f5f9;
  font-size: 13px;
  font-weight: 600;
`

export const LegendColor = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.$color || '#cbd5e1'};
`

export const LegendTextWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

