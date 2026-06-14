import styled from 'styled-components'

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
`

export const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
`

export const FilterBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`

export const DateInput = styled.input`
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  font-size: 14px;
  outline: none;
  background-color: #ffffff;
  color: #334155;
  transition: border-color 0.2s;

  &:focus {
    border-color: #3b82f6;
  }
`

export const GroupBySelect = styled.select`
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  font-size: 14px;
  outline: none;
  background-color: #ffffff;
  color: #334155;
  cursor: pointer;
  transition: border-color 0.2s;

  &:focus {
    border-color: #3b82f6;
  }
`


export const ExportButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: #3b82f6;
  color: #ffffff;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2563eb;
  }
`

export const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
`

export const MetricCard = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  gap: 16px;
`

export const MetricIconWrap = styled.div`
  padding: 12px;
  background-color: ${props => props.$bgColor || '#eff6ff'};
  color: ${props => props.$iconColor || '#3b82f6'};
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const MetricInfo = styled.div`
  display: flex;
  flex-direction: column;
`

export const MetricLabel = styled.span`
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
`

export const MetricValue = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin-top: 4px;
`

export const MainContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`

export const Panel = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #f1f5f9;
`

export const PanelTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`

export const TopBooksList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const TopBookItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  background: #f8fafc;
  border: 1px solid #f1f5f9;
`

export const BookTitle = styled.span`
  font-weight: 600;
  color: #334155;
  font-size: 14px;
`

export const BookMeta = styled.span`
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
  display: block;
`

export const BookStat = styled.div`
  text-align: right;
  display: flex;
  flex-direction: column;
`

export const BookStatValue = styled.span`
  font-weight: 700;
  color: #0f172a;
  font-size: 14px;
`

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
`

export const Th = styled.th`
  padding: 12px;
  border-bottom: 2px solid #e2e8f0;
  color: #475569;
  font-weight: 600;
  font-size: 13px;
`

export const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #e2e8f0;
  color: #334155;
  font-size: 14px;
`

export const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  background-color: ${props => {
    switch (props.$status) {
      case 'DELIVERED': return '#dcfce7'
      case 'CONFIRMED': return '#dbeafe'
      case 'CANCELLED': return '#fee2e2'
      case 'PENDING': return '#fef9c3'
      default: return '#f1f5f9'
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'DELIVERED': return '#166534'
      case 'CONFIRMED': return '#1e40af'
      case 'CANCELLED': return '#991b1b'
      case 'PENDING': return '#854d0e'
      default: return '#475569'
    }
  }};
`

export const SecondaryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`

export const CategoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px dashed #e2e8f0;

  &:last-child {
    border-bottom: none;
  }
`

export const CustomerRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-radius: 8px;
  background-color: #f8fafc;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
`

export const CustomerInfo = styled.div`
  display: flex;
  flex-direction: column;
`

export const CustomerName = styled.span`
  font-weight: 600;
  color: #334155;
  font-size: 14px;
`

export const CustomerEmail = styled.span`
  font-size: 12px;
  color: #64748b;
`

export const CustomerValue = styled.div`
  text-align: right;
  font-weight: 700;
  color: #1e293b;
  font-size: 14px;
`

export const LoadingWrap = styled.div`
  padding: 40px;
  text-align: center;
  color: #64748b;
  font-size: 16px;
`

export const ErrorWrap = styled.div`
  padding: 24px;
  background-color: #fee2e2;
  border: 1px solid #fca5a5;
  color: #991b1b;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
`

export const ChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
`

export const ChartRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`

export const ChartLabel = styled.div`
  width: 100px;
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`

export const ChartBarContainer = styled.div`
  flex: 1;
  height: 24px;
  background-color: #f1f5f9;
  border-radius: 6px;
  overflow: hidden;
  position: relative;
`

export const ChartBarFill = styled.div`
  height: 100%;
  background-color: ${props => props.$color || '#3b82f6'};
  width: ${props => props.$width || '0%'};
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 6px;
`

export const ChartValue = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #1e293b;
  min-width: 80px;
  text-align: right;
`

/* NEW: Vertical Column Chart Components */
export const VerticalChartContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 240px;
  padding: 16px 8px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #f1f5f9;
  margin-top: 16px;
  gap: 8px;
`

export const VerticalChartColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  height: 100%;
  justify-content: flex-end;
  position: relative;
  group: hover;
`

export const VerticalBarFill = styled.div`
  width: 100%;
  max-width: 32px;
  height: ${props => props.$height || '0%'};
  background-color: ${props => props.$color || '#10b981'};
  border-radius: 6px 6px 0 0;
  transition: height 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;

  &:hover {
    filter: brightness(0.9);
  }
`

export const VerticalBarLabel = styled.div`
  font-size: 10px;
  color: #64748b;
  font-weight: 600;
  margin-top: 8px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 100%;
  text-align: center;
`

export const VerticalTooltip = styled.div`
  position: absolute;
  bottom: calc(${props => props.$height || '0%'} + 12px);
  background: #0f172a;
  color: #ffffff;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 600;
  white-space: nowrap;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  z-index: 10;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease-in-out;

  ${VerticalChartColumn}:hover & {
    opacity: 1;
  }
`

/* NEW: Radial/Ring Progress Charts (Donut display) */
export const DonutChartGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px;
  margin-top: 16px;
`

export const DonutCard = styled.div`
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
`

export const DonutRingSvg = styled.svg`
  width: 80px;
  height: 80px;
  transform: rotate(-90deg);
`

export const DonutCircleBg = styled.circle`
  fill: none;
  stroke: #e2e8f0;
  stroke-width: 8;
`

export const DonutCircleFill = styled.circle`
  fill: none;
  stroke: ${props => props.$color || '#8b5cf6'};
  stroke-width: 8;
  stroke-linecap: round;
  stroke-dasharray: 226; /* 2 * PI * r (where r is 36: 2 * 3.14159 * 36 = 226.19) */
  stroke-dashoffset: ${props => props.$offset || '226'};
  transition: stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1);
`

export const DonutText = styled.div`
  position: absolute;
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
`

export const RingWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`


