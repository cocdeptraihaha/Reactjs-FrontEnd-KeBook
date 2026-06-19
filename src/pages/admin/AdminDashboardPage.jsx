import { useState, useEffect } from 'react'
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  BookOpen,
  FileText,
  Download,
  Award,
  Printer
} from 'react-feather'
import { AdminNavbar } from '../../components/AdminNavbar'
import { Dropdown } from '../../components/ui/Dropdown'
import { DateTimePicker } from '../../components/ui/DateTimePicker'
import { dashboardApi } from '../../api/dashboard'
import {
  Container,
  Header,
  Title,
  FilterBar,
  ExportPdfButton,
  MetricsGrid,
  MetricCard,
  MetricIconWrap,
  MetricInfo,
  MetricLabel,
  MetricValue,
  MainContentGrid,
  Panel,
  PanelTitle,
  TopBooksList,
  TopBookItem,
  BookTitle,
  BookMeta,
  BookStat,
  BookStatValue,
  Table,
  Th,
  Td,
  StatusBadge,
  SecondaryGrid,
  CategoryItem,
  CustomerRow,
  CustomerInfo,
  CustomerName,
  CustomerEmail,
  CustomerValue,
  LoadingWrap,
  ErrorWrap,
  ChartContainer,
  ChartRow,
  ChartLabel,
  ChartBarContainer,
  ChartBarFill,
  ChartValue,
  VerticalChartContainer,
  VerticalChartColumn,
  VerticalBarFill,
  VerticalBarLabel,
  VerticalTooltip,
  DonutChartGrid,
  DonutCard,
  DonutRingSvg,
  DonutCircleBg,
  DonutCircleFill,
  DonutText,
  RingWrapper,
  PieChartWrapper,
  PieLegend,
  LegendItem,
  LegendColor,
  LegendTextWrap
} from './AdminDashboardPage.styles'

export function AdminDashboardPage() {
  const [fromDate, setFromDate] = useState(() => {
    const d = new Date()
    d.setMonth(d.getMonth() - 1)
    return d.toISOString().split('T')[0]
  })
  const [toDate, setToDate] = useState(() => {
    return new Date().toISOString().split('T')[0]
  })
  const [groupBy, setGroupBy] = useState('day')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [summary, setSummary] = useState(null)
  const [topBooks, setTopBooks] = useState([])
  const [categories, setCategories] = useState([])
  const [topCustomers, setTopCustomers] = useState([])
  const [orderStatus, setOrderStatus] = useState([])
  const [buyerGender, setBuyerGender] = useState([])
  const [revenueTimeseries, setRevenueTimeseries] = useState([])
  const [userTimeseries, setUserTimeseries] = useState([])
  const [cancellationTimeseries, setCancellationTimeseries] = useState([])

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0)
  }

  useEffect(() => {
    const loadStaticData = async () => {
      try {
        setLoading(true)
        setError(null)
        const params = { from: fromDate, to: toDate }

        const [
          summaryRes,
          topBooksRes,
          categoryRes,
          customersRes,
          statusRes,
          genderRes
        ] = await Promise.all([
          dashboardApi.getSummary(params),
          dashboardApi.getTopBooks({ ...params, limit: 5, metric: 'revenue' }),
          dashboardApi.getByCategory(params),
          dashboardApi.getTopCustomers({ ...params, limit: 5 }),
          dashboardApi.getOrderStatusBreakdown(params),
          dashboardApi.getBuyerGender(params)
        ])

        setSummary(summaryRes)
        setTopBooks(topBooksRes || [])
        setCategories(categoryRes || [])
        setTopCustomers(customersRes || [])
        setOrderStatus(statusRes || [])
        setBuyerGender(genderRes || [])
      } catch (err) {
        setError(err.message || 'Failed to fetch dashboard summary.')
      } finally {
        setLoading(false)
      }
    }

    loadStaticData()
  }, [fromDate, toDate])

  useEffect(() => {
    const loadTimeseriesData = async () => {
      try {
        setError(null)
        const params = { from: fromDate, to: toDate }
        const timeseriesParams = { ...params, group_by: groupBy }

        const [
          revTimeseriesRes,
          uTimeseriesRes,
          cancelTimeseriesRes
        ] = await Promise.all([
          dashboardApi.getRevenueTimeseries(timeseriesParams),
          dashboardApi.getUserTimeseries(timeseriesParams),
          dashboardApi.getCancellationTimeseries(timeseriesParams)
        ])

        setRevenueTimeseries(revTimeseriesRes || [])
        setUserTimeseries(uTimeseriesRes || [])
        setCancellationTimeseries(cancelTimeseriesRes || [])
      } catch (err) {
        setError(err.message || 'Failed to fetch timeline analytics.')
      }
    }

    loadTimeseriesData()
  }, [fromDate, toDate, groupBy])

  const csvUrl = dashboardApi.getRevenueCsvUrl({ from: fromDate, to: toDate, group_by: groupBy })

  if (loading && !summary) {
    return (
      <Container>
        <LoadingWrap>Loading dashboard data...</LoadingWrap>
      </Container>
    )
  }

  return (
    <>
      <AdminNavbar />
      <Container>
        <Header>
          <div>
            <Title>Admin Dashboard</Title>
          </div>
        <FilterBar>
          <Dropdown
            value={groupBy}
            onChange={(val) => setGroupBy(val)}
            options={[
              { value: 'day', label: 'Daily' },
              { value: 'week', label: 'Weekly' },
              { value: 'month', label: 'Monthly' },
              { value: 'year', label: 'Yearly' }
            ]}
            width="140px"
          />
          <DateTimePicker
            label="From"
            value={fromDate}
            onChange={(val) => setFromDate(val)}
          />
          <DateTimePicker
            label="To"
            value={toDate}
            onChange={(val) => setToDate(val)}
          />
          <ExportPdfButton onClick={() => window.print()}>
            <Printer size={16} /> Xuất PDF
          </ExportPdfButton>
        </FilterBar>
      </Header>

      {error && <ErrorWrap>{error}</ErrorWrap>}

      {/* Metrics Cards */}
      <MetricsGrid>
        <MetricCard>
          <MetricIconWrap $bgColor="#ecfdf5" $iconColor="#10b981">
            <DollarSign size={24} />
          </MetricIconWrap>
          <MetricInfo>
            <MetricLabel>Total Revenue</MetricLabel>
            <MetricValue>{formatCurrency(summary?.revenue)}</MetricValue>
          </MetricInfo>
        </MetricCard>

        <MetricCard>
          <MetricIconWrap $bgColor="#eff6ff" $iconColor="#3b82f6">
            <ShoppingBag size={24} />
          </MetricIconWrap>
          <MetricInfo>
            <MetricLabel>Orders</MetricLabel>
            <MetricValue>{summary?.order_count || 0}</MetricValue>
          </MetricInfo>
        </MetricCard>

        <MetricCard>
          <MetricIconWrap $bgColor="#fdf2f8" $iconColor="#ec4899">
            <BookOpen size={24} />
          </MetricIconWrap>
          <MetricInfo>
            <MetricLabel>Pending Orders</MetricLabel>
            <MetricValue>{summary?.pending_order_count || 0}</MetricValue>
          </MetricInfo>
        </MetricCard>

        <MetricCard>
          <MetricIconWrap $bgColor="#f5f3ff" $iconColor="#8b5cf6">
            <Users size={24} />
          </MetricIconWrap>
          <MetricInfo>
            <MetricLabel>New Customers</MetricLabel>
            <MetricValue>{summary?.new_user_count || 0}</MetricValue>
          </MetricInfo>
        </MetricCard>
      </MetricsGrid>

      {/* Main Stats layout */}
      <MainContentGrid>
        {/* Order Status Breakdown Table */}
        <Panel>
          <PanelTitle><FileText size={18} /> Order Status Breakdown</PanelTitle>
          <Table>
            <thead>
              <tr>
                <Th>Status</Th>
                <Th>Order Count</Th>
                <Th>Revenue</Th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const activeStatuses = orderStatus.filter(row => row.count > 0)
                if (activeStatuses.length === 0) {
                  return (
                    <tr>
                      <Td colSpan={3} style={{ textAlign: 'center' }}>No orders in selected range.</Td>
                    </tr>
                  )
                }
                return activeStatuses.map((row) => (
                  <tr key={row.status}>
                    <Td><StatusBadge $status={row.status}>{row.status}</StatusBadge></Td>
                    <Td>{row.count}</Td>
                    <Td>{formatCurrency(row.revenue)}</Td>
                  </tr>
                ))
              })()}
            </tbody>
          </Table>
        </Panel>

        {/* Best-selling Books list */}
        <Panel>
          <PanelTitle><TrendingUp size={18} /> Best Selling Books</PanelTitle>
          <TopBooksList>
            {topBooks.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#64748b' }}>No books sold.</p>
            ) : (
              topBooks.map((book) => (
                <TopBookItem key={book.book_id}>
                  <div>
                    <BookTitle>{book.title || `Book ID: ${book.book_id}`}</BookTitle>
                    <BookMeta>ID: {book.book_id}</BookMeta>
                  </div>
                  <BookStat>
                    <BookStatValue>{formatCurrency(book.revenue)}</BookStatValue>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Sold: {book.quantity_sold}</span>
                  </BookStat>
                </TopBookItem>
              ))
            )}
          </TopBooksList>
        </Panel>
      </MainContentGrid>

      <SecondaryGrid>
        {/* Categories Distribution */}
        <Panel>
          <PanelTitle><Award size={18} /> Sales by Category</PanelTitle>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {categories.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#64748b' }}>No category stats available.</p>
            ) : (
              categories.map((cat) => (
                <CategoryItem key={cat.category_id || cat.category_name}>
                  <span style={{ fontWeight: 500, fontSize: '14px', color: '#334155' }}>{cat.category_name}</span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>{formatCurrency(cat.revenue)}</div>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>Count: {cat.order_count}</span>
                  </div>
                </CategoryItem>
              ))
            )}
          </div>
        </Panel>

        {/* Top Customers list */}
        <Panel>
          <PanelTitle><Users size={18} /> Top Customers</PanelTitle>
          <div>
            {topCustomers.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#64748b' }}>No customers found.</p>
            ) : (
              topCustomers.map((cust) => (
                <CustomerRow key={cust.user_id}>
                  <CustomerInfo>
                    <CustomerName>{cust.full_name || `User ID: ${cust.user_id}`}</CustomerName>
                    <CustomerEmail>{cust.email}</CustomerEmail>
                  </CustomerInfo>
                  <CustomerValue>
                    <div>{formatCurrency(cust.total_spent)}</div>
                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>{cust.order_count} orders</span>
                  </CustomerValue>
                </CustomerRow>
              ))
            )}
          </div>
        </Panel>
      </SecondaryGrid>

      {/* Timeseries Analytics Charts */}
      <Panel>
        <PanelTitle><TrendingUp size={18} /> Sales & Revenue Timeline ({groupBy.toUpperCase()})</PanelTitle>
        {(() => {
          const filteredTimeseries = revenueTimeseries.filter(row => {
            if (groupBy === 'day') {
              return row.revenue > 0
            }
            return true
          })

          if (filteredTimeseries.length === 0) {
            return <p style={{ textAlign: 'center', color: '#64748b', margin: '24px 0' }}>No data available for selected range.</p>
          }

          const maxRevenue = Math.max(...filteredTimeseries.map(r => r.revenue), 1)
          return (
            <VerticalChartContainer>
              {filteredTimeseries.map((row) => {
                const percentageHeight = `${(row.revenue / maxRevenue) * 90 + 10}%` // scale between 10% and 100% for visibility
                return (
                  <VerticalChartColumn key={row.period}>
                    <VerticalTooltip $height={percentageHeight}>
                      <div>{formatCurrency(row.revenue)}</div>
                      <div style={{ fontSize: '9px', opacity: 0.8, textAlign: 'center' }}>{row.order_count} orders</div>
                    </VerticalTooltip>
                    <VerticalBarFill $color="#10b981" $height={percentageHeight} />
                    <VerticalBarLabel title={row.period}>{row.period}</VerticalBarLabel>
                  </VerticalChartColumn>
                )
              })}
            </VerticalChartContainer>
          )
        })()}
      </Panel>

      <SecondaryGrid>
        {/* User Registration Timeline */}
        <Panel>
          <PanelTitle><Users size={18} /> Customer Signups Timeline ({groupBy.toUpperCase()})</PanelTitle>
          {(() => {
            const filteredUserTimeseries = userTimeseries.filter(row => {
              return row.new_users > 0
            })

            if (filteredUserTimeseries.length === 0) {
              return <p style={{ textAlign: 'center', color: '#64748b', padding: '40px' }}>No data available.</p>
            }

            const maxNewUsers = Math.max(...filteredUserTimeseries.map(r => r.new_users), 1)
            return (
              <DonutChartGrid>
                {filteredUserTimeseries.slice(-4).map((row) => { // limit to last 4 for clean radial display
                  const ratio = Math.min(row.new_users / maxNewUsers, 1)
                  // SVG circumference is 226 (r=36). Dashoffset is 226 * (1 - ratio)
                  const offset = 226 * (1 - ratio)
                  return (
                    <DonutCard key={row.period}>
                      <RingWrapper>
                        <DonutRingSvg viewBox="0 0 90 90">
                          <DonutCircleBg cx="45" cy="45" r="36" />
                          <DonutCircleFill
                            cx="45"
                            cy="45"
                            r="36"
                            $color="#8b5cf6"
                            $offset={offset}
                          />
                        </DonutRingSvg>
                        <DonutText>{row.new_users}</DonutText>
                      </RingWrapper>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>{row.period}</div>
                      <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 500 }}>Signups</span>
                    </DonutCard>
                  )
                })}
              </DonutChartGrid>
            )
          })()}
        </Panel>

        {/* Cancellation Rate Timeline */}
        <Panel>
          <PanelTitle><FileText size={18} /> Order Cancellation Rates ({groupBy.toUpperCase()})</PanelTitle>
          <ChartContainer>
            {(() => {
              const filteredCancellation = cancellationTimeseries.filter(row => {
                return row.total_orders > 0
              })

              if (filteredCancellation.length === 0) {
                return <p style={{ textAlign: 'center', color: '#64748b', padding: '40px' }}>No data available.</p>
              }

              const maxCancelRate = Math.max(...filteredCancellation.map(r => r.cancel_rate), 1)
              return filteredCancellation.map((row) => (
                <ChartRow key={row.period}>
                  <ChartLabel>{row.period}</ChartLabel>
                  <ChartBarContainer>
                    <ChartBarFill $color="#f43f5e" $width={`${(row.cancel_rate / (maxCancelRate || 1)) * 100}%`} />
                  </ChartBarContainer>
                  <ChartValue>
                    <div>{Math.round(row.cancel_rate * 100)}%</div>
                    <span style={{ fontSize: '10px', color: '#64748b' }}>{row.cancelled_count}/{row.total_orders} orders</span>
                  </ChartValue>
                </ChartRow>
              ))
            })()}
          </ChartContainer>
        </Panel>
      </SecondaryGrid>

      {/* Customer Gender Distribution */}
      <Panel style={{ marginTop: '32px' }}>
        <PanelTitle><Users size={18} /> Customer Gender Comparison (Pie Chart)</PanelTitle>
        {(() => {
          const totalUsers = buyerGender.reduce((sum, g) => sum + g.user_count, 0)
          if (totalUsers === 0) {
            return <p style={{ textAlign: 'center', color: '#64748b', padding: '40px' }}>No demographic data available.</p>
          }

          const segments = []
          let accumulatedPercent = 0
          const colors = ['#3b82f6', '#ec4899', '#94a3b8', '#10b981', '#f59e0b']
          for (let i = 0; i < buyerGender.length; i++) {
            const row = buyerGender[i]
            const pct = row.user_count / totalUsers
            const strokeOffset = 226 * (1 - pct)
            const strokeRotation = (accumulatedPercent * 360) - 90
            accumulatedPercent += pct
            segments.push({
              ...row,
              pct,
              strokeOffset,
              strokeRotation,
              color: colors[i % colors.length]
            })
          }

          return (
            <PieChartWrapper>
              <RingWrapper style={{ width: '180px', height: '180px' }}>
                <svg viewBox="0 0 90 90" style={{ width: '180px', height: '180px' }}>
                  <circle cx="45" cy="45" r="36" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                  {segments.map((seg, idx) => (
                    <circle
                      key={idx}
                      cx="45"
                      cy="45"
                      r="36"
                      fill="none"
                      stroke={seg.color}
                      strokeWidth="8"
                      strokeDasharray="226"
                      strokeDashoffset={seg.strokeOffset}
                      style={{
                        transform: `rotate(${seg.strokeRotation}deg)`,
                        transformOrigin: '45px 45px',
                        transition: 'stroke-dashoffset 0.8s ease'
                      }}
                    />
                  ))}
                </svg>
                <div style={{ position: 'absolute', textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>{totalUsers}</div>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', uppercase: true }}>Buyers</div>
                </div>
              </RingWrapper>

              <PieLegend>
                {segments.map((seg, idx) => (
                  <LegendItem key={idx}>
                    <LegendTextWrap>
                      <LegendColor $color={seg.color} />
                      <span style={{ color: '#334155' }}>{seg.gender}</span>
                    </LegendTextWrap>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ color: '#0f172a', fontWeight: 700 }}>{Math.round(seg.pct * 100)}%</span>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{seg.user_count} buyers</div>
                    </div>
                  </LegendItem>
                ))}
              </PieLegend>
            </PieChartWrapper>
          )
        })()}
      </Panel>
    </Container>
    </>
  )
}
export default AdminDashboardPage
