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

const popInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(-8px) scale(0.96);
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
`

const TriggerButton = styled.button`
  width: 100%;
  padding: 12px;
  min-height: 46px;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(185, 170, 150, 0.82);
  background-color: rgba(255, 250, 240, 0.86);
  color: inherit;
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    border-color: rgba(180, 120, 47, 0.72);
    background-color: rgba(255, 250, 240, 0.95);
  }

  &:focus-visible {
    border-color: rgba(180, 120, 47, 0.72);
    box-shadow: 0 0 0 4px rgba(180, 120, 47, 0.14);
    outline: none;
  }

  ${props => props.$isOpen && css`
    border-color: rgba(180, 120, 47, 0.72);
    box-shadow: 0 0 0 4px rgba(180, 120, 47, 0.14);
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
  ${props => props.$position === 'top' ? css`
    bottom: calc(100% + 6px);
    top: auto;
    animation: ${popInUp} 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  ` : css`
    top: calc(100% + 6px);
    bottom: auto;
    animation: ${popIn} 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  `}
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
  border: 1px solid rgba(185, 170, 150, 0.3);
  background-color: #fcfaf6;
  font-size: 13.5px;
  font-weight: 800;
  color: #1e293b;
  cursor: pointer;
  outline: none;
  padding: 4px 10px;
  border-radius: 8px;
  transition: all 0.15s;
  appearance: auto;

  &:hover {
    background-color: #f1f5f9;
    border-color: rgba(185, 170, 150, 0.6);
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

  &:disabled {
    color: #cbd5e1;
    cursor: not-allowed;
    background: none !important;
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

function parseLocalDate(value) {
  if (!value) return new Date()
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, d] = value.split('-').map(Number)
    return new Date(y, m - 1, d)
  }
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return new Date()
  return parsed
}

export function DateTimePicker({ value, onChange, label = 'Select Date', type = 'date', maxDate }) {
  const [isOpen, setIsOpen] = useState(false)
  const popoverRef = useRef(null)

  const maxDateParsed = useMemo(() => {
    if (!maxDate) return null
    const parsed = new Date(maxDate)
    return Number.isNaN(parsed.getTime()) ? null : parsed
  }, [maxDate])

  // Internal Date State tracking
  const dateObj = useMemo(() => {
    if (!value) return new Date()
    const parsed = parseLocalDate(value)
    if (Number.isNaN(parsed.getTime())) return new Date()
    // Enforce maxDate boundary if initialized with value
    if (maxDateParsed && parsed > maxDateParsed) {
      return new Date(maxDateParsed.getTime())
    }
    return parsed
  }, [value, maxDateParsed])

  const [viewTab, setViewTab] = useState('date') // 'date' | 'time'
  const [dropdownPosition, setDropdownPosition] = useState('bottom')
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
      const parsed = parseLocalDate(value)
      if (!Number.isNaN(parsed.getTime())) {
        const adjustedDate = maxDateParsed && parsed > maxDateParsed ? maxDateParsed : parsed
        setCurrentMonth(adjustedDate.getMonth())
        setCurrentYear(adjustedDate.getFullYear())
        setHours(String(adjustedDate.getHours()).padStart(2, '0'))
        setMinutes(String(adjustedDate.getMinutes()).padStart(2, '0'))
      }
    }
  }, [value, maxDateParsed])

  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (isOpen && popoverRef.current) {
      const rect = popoverRef.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      const spaceAbove = rect.top
      const estimatedHeight = 420 // Estimated height of PopoverCard

      if (spaceBelow < estimatedHeight && spaceAbove > spaceBelow) {
        setDropdownPosition('top')
      } else {
        setDropdownPosition('bottom')
      }
    }
  }, [isOpen])

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
    if (maxDateParsed) {
      const nextM = currentMonth === 11 ? 0 : currentMonth + 1
      const nextY = currentMonth === 11 ? currentYear + 1 : currentYear
      if (nextY > maxDateParsed.getFullYear() || (nextY === maxDateParsed.getFullYear() && nextM > maxDateParsed.getMonth())) {
        return // Do not navigate past maxDate month/year
      }
    }
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const handleSelectDay = (day) => {
    if (maxDateParsed) {
      const selected = new Date(currentYear, currentMonth, day, Number(hours), Number(minutes))
      if (selected > maxDateParsed) {
        return
      }
    }
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
      const yyyy = date.getFullYear()
      const mm = String(date.getMonth() + 1).padStart(2, '0')
      const dd = String(date.getDate()).padStart(2, '0')
      onChange(`${yyyy}-${mm}-${dd}`)
    } else {
      onChange(date.toISOString())
    }
  }

  const formattedDateDisplay = useMemo(() => {
    if (!value) return 'Chọn thời gian'
    try {
      const date = parseLocalDate(value)
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
          <span>{label ? `${label}: ` : ''}{formattedDateDisplay}</span>
        </ValueArea>
        <ArrowWrap $isOpen={isOpen}>
          <ChevronDown size={14} />
        </ArrowWrap>
      </TriggerButton>

      {isOpen && (
        <PopoverCard $position={dropdownPosition}>
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
                    onChange={(e) => {
                      const newMonth = Number(e.target.value)
                      if (maxDateParsed && currentYear === maxDateParsed.getFullYear() && newMonth > maxDateParsed.getMonth()) {
                        return
                      }
                      setCurrentMonth(newMonth)
                    }}
                  >
                    {Array.from({ length: 12 }).map((_, mIdx) => {
                      const isDisabled = maxDateParsed && currentYear === maxDateParsed.getFullYear() && mIdx > maxDateParsed.getMonth()
                      return (
                        <option key={mIdx} value={mIdx} disabled={isDisabled}>
                          Tháng {mIdx + 1}
                        </option>
                      )
                    })}
                  </HeaderSelect>
                  <HeaderSelect
                    value={currentYear}
                    onChange={(e) => {
                      const newYear = Number(e.target.value)
                      setCurrentYear(newYear)
                      if (maxDateParsed && newYear === maxDateParsed.getFullYear() && currentMonth > maxDateParsed.getMonth()) {
                        setCurrentMonth(maxDateParsed.getMonth())
                      }
                    }}
                  >
                    {Array.from({ length: 100 }).map((_, yIdx) => {
                      const yr = new Date().getFullYear() - 99 + yIdx
                      const isDisabled = maxDateParsed && yr > maxDateParsed.getFullYear()
                      return (
                        <option key={yr} value={yr} disabled={isDisabled}>
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

                  let isDisabled = false
                  if (maxDateParsed) {
                    const thisDate = new Date(currentYear, currentMonth, day, 23, 59, 59)
                    isDisabled = thisDate > maxDateParsed
                  }

                  return (
                    <DayCell
                      key={`day-${day}`}
                      type="button"
                      $isCurrentMonth={true}
                      $isSelected={isSelected}
                      $isToday={isToday}
                      disabled={isDisabled}
                      onClick={() => !isDisabled && handleSelectDay(day)}
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
