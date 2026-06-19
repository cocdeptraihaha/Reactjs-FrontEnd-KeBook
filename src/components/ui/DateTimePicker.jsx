import { useState, useRef, useEffect, useMemo } from 'react'
import styled, { keyframes, css } from 'styled-components'
import { Calendar, Clock, ChevronDown, ChevronLeft, ChevronRight } from 'react-feather'

const popIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`

const PickerContainer = styled.div`
  position: relative;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  display: inline-block;
  width: 100%;
  max-width: 280px;
`

const TriggerButton = styled.button`
  width: 100%;
  padding: 10px 16px;
  border-radius: 12px;
  border: 1px solid rgba(185, 170, 150, 0.4);
  background-color: #ffffff;
  color: #334155;
  font-size: 13.5px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    border-color: var(--brand-700);
    background-color: #fdfbf7;
  }

  ${props => props.$isOpen && css`
    border-color: var(--brand-900);
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15);
    background-color: #ffffff;
  `}
`

const ValueArea = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const ArrowWrap = styled.div`
  display: flex;
  align-items: center;
  transition: transform 0.2s ease;
  color: #64748b;

  ${props => props.$isOpen && css`
    transform: rotate(180deg);
    color: var(--brand-900);
  `}
`

const PopoverCard = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  background-color: #ffffff;
  border: 1px solid rgba(185, 170, 150, 0.3);
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  z-index: 500;
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  animation: ${popIn} 0.2s cubic-bezier(0.16, 1, 0.3, 1);
`

const QuickTabs = styled.div`
  display: flex;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 8px;
  margin-bottom: 4px;
`

const TabBtn = styled.button`
  flex: 1;
  background: none;
  border: none;
  padding: 6px;
  font-size: 12px;
  font-weight: 700;
  color: ${props => props.$active ? 'var(--brand-900)' : '#64748b'};
  border-bottom: 2px solid ${props => props.$active ? 'var(--brand-900)' : 'transparent'};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.15s ease;

  &:hover {
    color: var(--brand-800);
  }
`

const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`

const MonthYearLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

const HeaderSelect = styled.select`
  border: none;
  background: transparent;
  font-size: 13.5px;
  font-weight: 800;
  color: #1e293b;
  cursor: pointer;
  outline: none;
  padding: 2px 4px;
  border-radius: 6px;
  transition: background-color 0.15s;

  &:hover {
    background-color: #f1f5f9;
  }
`

const NavButton = styled.button`
  background: none;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background-color: #f1f5f9;
    color: #1e293b;
    border-color: #cbd5e1;
  }
`

const WeekDaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  text-align: center;
  margin-bottom: 4px;
`

const WeekDay = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
`

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
`

const DayCell = styled.button`
  background: none;
  border: none;
  height: 32px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.1s ease;
  color: ${props => props.$isCurrentMonth ? '#334155' : '#cbd5e1'};

  &:hover {
    background-color: #f1f5f9;
  }

  ${props => props.$isToday && css`
    border: 1px solid var(--brand-500);
    color: var(--brand-900);
    font-weight: 800;
  `}

  ${props => props.$isSelected && css`
    background-color: var(--brand-900) !important;
    color: #ffffff !important;
    font-weight: 800;
  `}
`

const TimeSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const TimeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  max-height: 160px;
  overflow-y: auto;
  padding: 4px 2px;
`

const TimeInputWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  background-color: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
`

const StyledTimeInput = styled.input`
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
  width: 70px;
  text-align: center;
  outline: none;
  background-color: #ffffff;

  &:focus {
    border-color: var(--brand-900);
    box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.1);
  }
`

const TimeDivider = styled.span`
  font-weight: 800;
  color: #64748b;
`

const FooterSection = styled.div`
  display: flex;
  gap: 8px;
  border-top: 1px solid #f1f5f9;
  padding-top: 12px;
`

const ActionBtn = styled.button`
  flex: 1;
  padding: 8px;
  font-size: 12px;
  font-weight: 700;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
  border: none;

  &.secondary {
    background-color: #f1f5f9;
    color: #475569;
    &:hover {
      background-color: #e2e8f0;
    }
  }

  &.primary {
    background-color: var(--brand-900);
    color: #ffffff;
    &:hover {
      background-color: var(--brand-800);
    }
  }
`

export function DateTimePicker({ value, onChange, label = 'Select Date', type = 'date' }) {
  const [isOpen, setIsOpen] = useState(false)
  const popoverRef = useRef(null)

  // Internal Date State tracking
  const dateObj = useMemo(() => {
    if (!value) return new Date()
    const parsed = new Date(value)
    return Number.isNaN(parsed.getTime()) ? new Date() : parsed
  }, [value])

  const [viewTab, setViewTab] = useState('date') // 'date' | 'time'
  const [currentMonth, setCurrentMonth] = useState(() => dateObj.getMonth())
  const [currentYear, setCurrentYear] = useState(() => dateObj.getFullYear())

  const [hours, setHours] = useState(() => {
    const hr = dateObj.getHours()
    return String(hr).padStart(2, '0')
  })

  const [minutes, setMinutes] = useState(() => {
    const min = dateObj.getMinutes()
    return String(min).padStart(2, '0')
  })

  // Sync internal Month/Year/Time with value changes
  useEffect(() => {
    if (value) {
      const parsed = new Date(value)
      if (!Number.isNaN(parsed.getTime())) {
        setCurrentMonth(parsed.getMonth())
        setCurrentYear(parsed.getFullYear())
        setHours(String(parsed.getHours()).padStart(2, '0'))
        setMinutes(String(parsed.getMinutes()).padStart(2, '0'))
      }
    }
  }, [value])

  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Days calculations
  const daysInMonth = useMemo(() => {
    return new Date(currentYear, currentMonth + 1, 0).getDate()
  }, [currentMonth, currentYear])

  const startDayOfWeek = useMemo(() => {
    // 0 = Sunday, 1 = Monday, etc.
    return new Date(currentYear, currentMonth, 1).getDay()
  }, [currentMonth, currentYear])

  const prevMonthDays = useMemo(() => {
    const count = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1 // Align so Mon is first day or Sun is first. Let's do Standard Sun=0 to Sat=6 grid
    const daysInPrev = new Date(currentYear, currentMonth, 0).getDate()
    const result = []
    for (let i = count - 1; i >= 0; i--) {
      result.push(daysInPrev - i)
    }
    return result
  }, [currentMonth, currentYear, startDayOfWeek])

  const nextMonthDays = useMemo(() => {
    const totalCellsOccupied = prevMonthDays.length + daysInMonth
    const remaining = 42 - totalCellsOccupied
    const result = []
    for (let i = 1; i <= remaining; i++) {
      result.push(i)
    }
    return result
  }, [prevMonthDays, daysInMonth])

  // Month navigation
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const handleSelectDay = (day) => {
    const selected = new Date(currentYear, currentMonth, day, Number(hours), Number(minutes))
    triggerChange(selected)
    if (type === 'date') {
      setIsOpen(false)
    }
  }

  const handleTimeBlur = () => {
    let h = Math.max(0, Math.min(23, Number(hours) || 0))
    let m = Math.max(0, Math.min(59, Number(minutes) || 0))
    setHours(String(h).padStart(2, '0'))
    setMinutes(String(m).padStart(2, '0'))

    const updated = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(), h, m)
    triggerChange(updated)
  }

  const triggerChange = (date) => {
    if (type === 'date') {
      onChange(date.toISOString().split('T')[0])
    } else {
      onChange(date.toISOString())
    }
  }

  const formattedDateDisplay = useMemo(() => {
    if (!value) return 'Chọn thời gian'
    try {
      const date = new Date(value)
      if (Number.isNaN(date.getTime())) return value

      const locale = 'vi-VN'
      const dateStr = date.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })

      if (type === 'date') {
        return dateStr
      } else {
        const timeStr = date.toLocaleTimeString(locale, {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        })
        return `${timeStr}, ${dateStr}`
      }
    } catch {
      return value
    }
  }, [value, type])

  const activeDay = dateObj.getDate()
  const activeMonth = dateObj.getMonth()
  const activeYear = dateObj.getFullYear()

  return (
    <PickerContainer ref={popoverRef}>
      <TriggerButton type="button" onClick={() => setIsOpen(!isOpen)} $isOpen={isOpen}>
        <ValueArea>
          {type === 'date' ? (
            <Calendar size={15} style={{ color: 'var(--brand-900)' }} />
          ) : (
            <Clock size={15} style={{ color: 'var(--brand-900)' }} />
          )}
          <span>{label}: {formattedDateDisplay}</span>
        </ValueArea>
        <ArrowWrap $isOpen={isOpen}>
          <ChevronDown size={14} />
        </ArrowWrap>
      </TriggerButton>

      {isOpen && (
        <PopoverCard>
          {type === 'datetime-local' && (
            <QuickTabs>
              <TabBtn type="button" $active={viewTab === 'date'} onClick={() => setViewTab('date')}>
                <Calendar size={13} /> Ngày
              </TabBtn>
              <TabBtn type="button" $active={viewTab === 'time'} onClick={() => setViewTab('time')}>
                <Clock size={13} /> Giờ
              </TabBtn>
            </QuickTabs>
          )}

          {viewTab === 'date' || type === 'date' ? (
            <>
              <CalendarHeader>
                <NavButton type="button" onClick={prevMonth}>
                  <ChevronLeft size={14} />
                </NavButton>
                <MonthYearLabel>
                  <HeaderSelect
                    value={currentMonth}
                    onChange={(e) => setCurrentMonth(Number(e.target.value))}
                  >
                    {Array.from({ length: 12 }).map((_, mIdx) => (
                      <option key={mIdx} value={mIdx}>
                        Tháng {mIdx + 1}
                      </option>
                    ))}
                  </HeaderSelect>
                  <HeaderSelect
                    value={currentYear}
                    onChange={(e) => setCurrentYear(Number(e.target.value))}
                  >
                    {Array.from({ length: 21 }).map((_, yIdx) => {
                      const yr = new Date().getFullYear() - 10 + yIdx
                      return (
                        <option key={yr} value={yr}>
                          {yr}
                        </option>
                      )
                    })}
                  </HeaderSelect>
                </MonthYearLabel>
                <NavButton type="button" onClick={nextMonth}>
                  <ChevronRight size={14} />
                </NavButton>
              </CalendarHeader>

              <WeekDaysGrid>
                <WeekDay>T2</WeekDay>
                <WeekDay>T3</WeekDay>
                <WeekDay>T4</WeekDay>
                <WeekDay>T5</WeekDay>
                <WeekDay>T6</WeekDay>
                <WeekDay>T7</WeekDay>
                <WeekDay>CN</WeekDay>
              </WeekDaysGrid>

              <DaysGrid>
                {prevMonthDays.map((d, idx) => (
                  <DayCell key={`prev-${idx}`} $isCurrentMonth={false} disabled>
                    {d}
                  </DayCell>
                ))}
                {Array.from({ length: daysInMonth }).map((_, idx) => {
                  const day = idx + 1
                  const isSelected = day === activeDay && currentMonth === activeMonth && currentYear === activeYear
                  const today = new Date()
                  const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()

                  return (
                    <DayCell
                      key={`day-${day}`}
                      type="button"
                      $isCurrentMonth={true}
                      $isSelected={isSelected}
                      $isToday={isToday}
                      onClick={() => handleSelectDay(day)}
                    >
                      {day}
                    </DayCell>
                  )
                })}
                {nextMonthDays.map((d, idx) => (
                  <DayCell key={`next-${idx}`} $isCurrentMonth={false} disabled>
                    {d}
                  </DayCell>
                ))}
              </DaysGrid>
            </>
          ) : (
            <TimeSection>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b' }}>Thiết lập giờ & phút</span>
              <TimeInputWrapper>
                <StyledTimeInput
                  type="text"
                  maxLength={2}
                  value={hours}
                  onChange={(e) => setHours(e.target.value.replace(/\D/g, ''))}
                  onBlur={handleTimeBlur}
                  placeholder="HH"
                />
                <TimeDivider>:</TimeDivider>
                <StyledTimeInput
                  type="text"
                  maxLength={2}
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value.replace(/\D/g, ''))}
                  onBlur={handleTimeBlur}
                  placeholder="MM"
                />
              </TimeInputWrapper>
            </TimeSection>
          )}

          {type === 'datetime-local' && (
            <FooterSection>
              <ActionBtn type="button" className="secondary" onClick={() => setIsOpen(false)}>
                Đóng
              </ActionBtn>
              <ActionBtn type="button" className="primary" onClick={() => setIsOpen(false)}>
                Áp dụng
              </ActionBtn>
            </FooterSection>
          )}
        </PopoverCard>
      )}
    </PickerContainer>
  )
}

export default DateTimePicker
