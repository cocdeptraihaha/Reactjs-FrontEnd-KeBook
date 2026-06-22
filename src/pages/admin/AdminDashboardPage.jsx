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
  Printer,
  AlertTriangle
} from 'react-feather'
import { AdminNavbar } from '../../components/AdminNavbar'
import { Dropdown } from '../../components/ui/Dropdown'
import { DateTimePicker } from '../../components/ui/DateTimePicker'
import { dashboardApi } from '../../api/dashboard'
import { booksApi } from '../../api/books'
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
  LegendTextWrap,
  AlertBanner,
  AlertHeader,
  AlertList,
  AlertItem,
  AlertBadge
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

  const handleGroupByChange = (val) => {
    setGroupBy(val)
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]
    let pastDate = new Date()

    if (val === 'day') {
      pastDate.setDate(today.getDate() - 7)
    } else if (val === 'week') {
      pastDate.setMonth(today.getMonth() - 1)
    } else if (val === 'month') {
      pastDate.setMonth(today.getMonth() - 3)
    } else if (val === 'quarter') {
      pastDate.setFullYear(today.getFullYear() - 1)
    } else if (val === 'year') {
      pastDate.setFullYear(today.getFullYear() - 3)
    }

    const pastStr = pastDate.toISOString().split('T')[0]
    setFromDate(pastStr)
    setToDate(todayStr)
  }

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
  const [lowStockBooks, setLowStockBooks] = useState([])

  const formatPeriodLabel = (period) => {
    if (!period) return period
    // If period is like "2026-Q2" or "2026-Q02"
    if (/-Q\d+$/i.test(period)) {
      const parts = period.split('-')
      const quarter = parts[1].replace(/Q0?/i, '')
      return `Quý ${quarter}/${parts[0]}`
    }
    // If period is like "2026-06"
    if (/^\d{4}-\d{2}$/.test(period)) {
      const parts = period.split('-')
      return `Tháng ${parseInt(parts[1], 10)}/${parts[0]}`
    }
    // If period is like "2026-W24" or "2026-W024"
    if (/-W\d+$/i.test(period)) {
      const parts = period.split('-')
      const week = parts[1].replace(/W0?/i, '')
      return `Tuần ${week}/${parts[0]}`
    }
    // If period is a pure year "2026"
    if (/^\d{4}$/.test(period)) {
      return `Năm ${period}`
    }
    // If period is a date "2026-06-21"
    if (/^\d{4}-\d{2}-\d{2}$/.test(period)) {
      const parts = period.split('-')
      return `${parts[2]}/${parts[1]}/${parts[0]}`
    }
    return period
  }

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
          genderRes,
          lowStockRes
        ] = await Promise.all([
          dashboardApi.getSummary(params),
          dashboardApi.getTopBooks({ ...params, limit: 5, metric: 'revenue' }),
          dashboardApi.getByCategory(params),
          dashboardApi.getTopCustomers({ ...params, limit: 5 }),
          dashboardApi.getOrderStatusBreakdown(params),
          dashboardApi.getBuyerGender(params),
          booksApi.adminLowStock(5, 50).catch(() => ({ data: [] }))
        ])

        setSummary(summaryRes)
        setTopBooks(topBooksRes || [])
        setCategories(categoryRes || [])
        setTopCustomers(customersRes || [])
        setOrderStatus(statusRes || [])
        setBuyerGender(genderRes || [])
        setLowStockBooks(lowStockRes?.data || lowStockRes || [])
      } catch (err) {
        setError(err.message || 'Có lỗi xảy ra khi tải dữ liệu tổng quan.')
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
        setError(err.message || 'Có lỗi xảy ra khi tải dữ liệu dòng thời gian.')
      }
    }

    loadTimeseriesData()
  }, [fromDate, toDate, groupBy])

  const csvUrl = dashboardApi.getRevenueCsvUrl({ from: fromDate, to: toDate, group_by: groupBy })

  if (loading && !summary) {
    return (
      <Container>
        <LoadingWrap>Đang tải dữ liệu tổng quan...</LoadingWrap>
      </Container>
    )
  }

  return (
    <>
      <AdminNavbar />
      <Container>
        <Header>
          <div>
            <Title>Trang tổng quan Admin</Title>
          </div>
        <FilterBar>
          <Dropdown
            value={groupBy}
            onChange={handleGroupByChange}
            options={[
              { value: 'day', label: 'Hàng ngày' },
              { value: 'week', label: 'Hàng tuần' },
              { value: 'month', label: 'Hàng tháng' },
              { value: 'quarter', label: 'Hàng quý' },
              { value: 'year', label: 'Hàng năm' }
            ]}
            width="140px"
          />
          <DateTimePicker
            label="Từ"
            value={fromDate}
            onChange={(val) => setFromDate(val)}
          />
          <DateTimePicker
            label="Đến"
            value={toDate}
            onChange={(val) => setToDate(val)}
          />
          <ExportPdfButton onClick={() => window.print()}>
            <Printer size={16} /> Xuất PDF
          </ExportPdfButton>
        </FilterBar>
      </Header>

      {error && <ErrorWrap>{error}</ErrorWrap>}

      {/* Low Stock Alerts */}
      {lowStockBooks.length > 0 && (
        <AlertBanner>
          <AlertHeader>
            <AlertTriangle size={18} />
            Cảnh báo hết sách hoặc sắp hết hàng ({lowStockBooks.length})
          </AlertHeader>
          <AlertList>
            {lowStockBooks.map((book) => (
              <AlertItem key={book.id}>
                <span>
                  <strong>{book.title}</strong> (ID: {book.id})
                </span>
                <AlertBadge>Còn lại: {book.stock_quantity}</AlertBadge>
              </AlertItem>
            ))}
          </AlertList>
        </AlertBanner>
      )}

      {/* Metrics Cards */}
      <MetricsGrid>
        <MetricCard>
          <MetricIconWrap $bgColor="#ecfdf5" $iconColor="#10b981">
            <DollarSign size={24} />
          </MetricIconWrap>
          <MetricInfo>
            <MetricLabel>Tổng doanh thu</MetricLabel>
            <MetricValue>{formatCurrency(summary?.revenue)}</MetricValue>
          </MetricInfo>
        </MetricCard>

        <MetricCard>
          <MetricIconWrap $bgColor="#eff6ff" $iconColor="#3b82f6">
            <ShoppingBag size={24} />
          </MetricIconWrap>
          <MetricInfo>
            <MetricLabel>Đơn hàng</MetricLabel>
            <MetricValue>{summary?.order_count || 0}</MetricValue>
          </MetricInfo>
        </MetricCard>

        <MetricCard>
          <MetricIconWrap $bgColor="#fdf2f8" $iconColor="#ec4899">
            <BookOpen size={24} />
          </MetricIconWrap>
          <MetricInfo>
            <MetricLabel>Đơn hàng chờ xử lý</MetricLabel>
            <MetricValue>{summary?.pending_order_count || 0}</MetricValue>
          </MetricInfo>
        </MetricCard>

        <MetricCard>
          <MetricIconWrap $bgColor="#f5f3ff" $iconColor="#8b5cf6">
            <Users size={24} />
          </MetricIconWrap>
          <MetricInfo>
            <MetricLabel>Khách hàng mới</MetricLabel>
            <MetricValue>{summary?.new_user_count || 0}</MetricValue>
          </MetricInfo>
        </MetricCard>
      </MetricsGrid>

      {/* Main Stats layout */}
      <MainContentGrid>
        {/* Order Status Breakdown Table */}
        <Panel>
          <PanelTitle><FileText size={18} /> Phân tích trạng thái đơn hàng</PanelTitle>
          <Table>
            <thead>
              <tr>
                <Th>Trạng thái</Th>
                <Th>Số lượng đơn</Th>
                <Th>Doanh thu</Th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const activeStatuses = orderStatus.filter(row => row.count > 0)
                if (activeStatuses.length === 0) {
                  return (
                    <tr>
                      <Td colSpan={3} style={{ textAlign: 'center' }}>Không có đơn hàng trong khoảng thời gian này.</Td>
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
          <PanelTitle><TrendingUp size={18} /> Sách bán chạy nhất</PanelTitle>
          <TopBooksList>
            {topBooks.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#64748b' }}>Chưa bán được sách nào.</p>
            ) : (
              topBooks.map((book) => (
                <TopBookItem key={book.book_id}>
                  <div>
                    <BookTitle>{book.title || `Mã sách: ${book.book_id}`}</BookTitle>
                    <BookMeta>Mã: {book.book_id}</BookMeta>
                  </div>
                  <BookStat>
                    <BookStatValue>{formatCurrency(book.revenue)}</BookStatValue>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Đã bán: {book.quantity_sold}</span>
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
          <PanelTitle><Award size={18} /> Doanh số theo thể loại</PanelTitle>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {categories.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#64748b' }}>Chưa có số liệu theo thể loại.</p>
            ) : (
              categories.map((cat) => (
                <CategoryItem key={cat.category_id || cat.category_name}>
                  <span style={{ fontWeight: 500, fontSize: '14px', color: '#334155' }}>{cat.category_name}</span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>{formatCurrency(cat.revenue)}</div>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>Số đơn: {cat.order_count}</span>
                  </div>
                </CategoryItem>
              ))
            )}
          </div>
        </Panel>

        {/* Top Customers list */}
        <Panel>
          <PanelTitle><Users size={18} /> Khách hàng thân thiết</PanelTitle>
          <div>
            {topCustomers.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#64748b' }}>Không tìm thấy khách hàng nào.</p>
            ) : (
              topCustomers.map((cust) => (
                <CustomerRow key={cust.user_id}>
                  <CustomerInfo>
                    <CustomerName>{cust.full_name || `Mã người dùng: ${cust.user_id}`}</CustomerName>
                    <CustomerEmail>{cust.email}</CustomerEmail>
                  </CustomerInfo>
                  <CustomerValue>
                    <div>{formatCurrency(cust.total_spent)}</div>
                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>{cust.order_count} đơn hàng</span>
                  </CustomerValue>
                </CustomerRow>
              ))
            )}
          </div>
        </Panel>
      </SecondaryGrid>

      {/* Timeseries Analytics Charts */}
      <Panel>
        <PanelTitle><TrendingUp size={18} /> Biểu đồ doanh thu & số đơn ({groupBy.toUpperCase()})</PanelTitle>
        {(() => {
          const filteredTimeseries = revenueTimeseries.filter(row => {
            if (groupBy === 'day') {
              return row.revenue > 0
            }
            return true
          })

          if (filteredTimeseries.length === 0) {
            return <p style={{ textAlign: 'center', color: '#64748b', margin: '24px 0' }}>Không có dữ liệu trong khoảng thời gian đã chọn.</p>
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
                      <div style={{ fontSize: '9px', opacity: 0.8, textAlign: 'center' }}>{row.order_count} đơn</div>
                    </VerticalTooltip>
                    <VerticalBarFill $color="#10b981" $height={percentageHeight} />
                    <VerticalBarLabel title={row.period}>{formatPeriodLabel(row.period)}</VerticalBarLabel>
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
          <PanelTitle><Users size={18} /> Khách hàng đăng ký mới ({groupBy.toUpperCase()})</PanelTitle>
          {(() => {
            const filteredUserTimeseries = userTimeseries.filter(row => {
              return row.new_users > 0
            })

            if (filteredUserTimeseries.length === 0) {
              return <p style={{ textAlign: 'center', color: '#64748b', padding: '40px' }}>Không có dữ liệu đăng ký mới.</p>
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
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>{formatPeriodLabel(row.period)}</div>
                      <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 500 }}>Đăng ký</span>
                    </DonutCard>
                  )
                })}
              </DonutChartGrid>
            )
          })()}
        </Panel>

        {/* Cancellation Rate Timeline */}
        <Panel>
          <PanelTitle><FileText size={18} /> Tỷ lệ hủy đơn hàng ({groupBy.toUpperCase()})</PanelTitle>
          <ChartContainer>
            {(() => {
              const filteredCancellation = cancellationTimeseries.filter(row => {
                return row.total_orders > 0
              })

              if (filteredCancellation.length === 0) {
                return <p style={{ textAlign: 'center', color: '#64748b', padding: '40px' }}>Không có dữ liệu đơn hủy.</p>
              }

              const maxCancelRate = Math.max(...filteredCancellation.map(r => r.cancel_rate), 1)
              return filteredCancellation.map((row) => (
                <ChartRow key={row.period}>
                  <ChartLabel>{formatPeriodLabel(row.period)}</ChartLabel>
                  <ChartBarContainer>
                    <ChartBarFill $color="#f43f5e" $width={`${(row.cancel_rate / (maxCancelRate || 1)) * 100}%`} />
                  </ChartBarContainer>
                  <ChartValue>
                    <div>{Math.round(row.cancel_rate * 100)}%</div>
                    <span style={{ fontSize: '10px', color: '#64748b' }}>{row.cancelled_count}/{row.total_orders} đơn</span>
                  </ChartValue>
                </ChartRow>
              ))
            })()}
          </ChartContainer>
        </Panel>
      </SecondaryGrid>

      {/* Customer Gender Distribution */}
      <Panel style={{ marginTop: '32px' }}>
        <PanelTitle><Users size={18} /> Tỷ lệ giới tính người mua</PanelTitle>
        {(() => {
          const totalUsers = buyerGender.reduce((sum, g) => sum + g.user_count, 0)
          if (totalUsers === 0) {
            return <p style={{ textAlign: 'center', color: '#64748b', padding: '40px' }}>Chưa có dữ liệu thống kê nhân khẩu học.</p>
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
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Người mua</div>
                </div>
              </RingWrapper>

              <PieLegend>
                {segments.map((seg, idx) => (
                  <LegendItem key={idx}>
                    <LegendTextWrap>
                      <LegendColor $color={seg.color} />
                      <span style={{ color: '#334155' }}>{seg.gender === 'male' ? 'Nam' : seg.gender === 'female' ? 'Nữ' : seg.gender || 'Khác'}</span>
                    </LegendTextWrap>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ color: '#0f172a', fontWeight: 700 }}>{Math.round(seg.pct * 100)}%</span>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{seg.user_count} người mua</div>
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
