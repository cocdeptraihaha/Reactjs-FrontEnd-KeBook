import { useState, useRef, useEffect } from 'react'
import styled, { keyframes, css } from 'styled-components'
import { Calendar, Clock, ChevronDown } from 'react-feather'

const popIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`

const PickerContainer = styled.div`
  position: relative;
  font-family: 'Inter', -apple-system, sans-serif;
`

const TriggerButton = styled.button`
  padding: 10px 16px;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  background-color: #ffffff;
  color: #334155;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    border-color: #94a3b8;
    background-color: #f8fafc;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  ${props => props.$isOpen && css`
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
    background-color: #ffffff;
  `}
`

const ArrowWrap = styled.div`
  display: flex;
  align-items: center;
  transition: transform 0.2s ease;
  color: #64748b;

  ${props => props.$isOpen && css`
    transform: rotate(180deg);
    color: #4f46e5;
  `}
`

const PopoverCard = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  z-index: 250;
  min-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  animation: ${popIn} 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.15);
`

const HeaderSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 12px;
`

const HeaderTitle = styled.h4`
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
`

const GridInputs = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
`

const InputLabel = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 11px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

const NativeField = styled.input`
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  outline: none;
  background-color: #f8fafc;
  transition: all 0.15s ease;

  &:focus {
    border-color: #4f46e5;
    background-color: #ffffff;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.12);
  }
`

const ApplyButton = styled.button`
  width: 100%;
  padding: 10px;
  background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
  color: #ffffff;
  font-weight: 700;
  font-size: 13px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.1);
  transition: all 0.15s ease;

  &:hover {
    filter: brightness(1.05);
    box-shadow: 0 6px 12px -1px rgba(79, 70, 229, 0.2);
  }

  &:active {
    transform: scale(0.99);
  }
`

export function DateTimePicker({ value, onChange, label = 'Select Date' }) {
  const [isOpen, setIsOpen] = useState(false)
  const [tempValue, setTempValue] = useState(value)
  const popoverRef = useRef(null)

  useEffect(() => {
    setTempValue(value)
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

  const formattedDateDisplay = useMemo(() => {
    if (!value) return 'No Date'
    try {
      return new Date(value).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch {
      return value
    }
  }, [value])

  function handleApply() {
    onChange(tempValue)
    setIsOpen(false)
  }

  return (
    <PickerContainer ref={popoverRef}>
      <TriggerButton type="button" onClick={() => setIsOpen(!isOpen)} $isOpen={isOpen}>
        <Calendar size={15} style={{ color: '#4f46e5' }} />
        <span>{label}: {formattedDateDisplay}</span>
        <ArrowWrap $isOpen={isOpen}>
          <ChevronDown size={14} />
        </ArrowWrap>
      </TriggerButton>

      {isOpen && (
        <PopoverCard>
          <HeaderSection>
            <Clock size={16} style={{ color: '#6366f1' }} />
            <HeaderTitle>Set Custom Date & Time</HeaderTitle>
          </HeaderSection>
          <GridInputs>
            <InputLabel>
              Selected Date
              <NativeField
                type="date"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
              />
            </InputLabel>
          </GridInputs>
          <ApplyButton type="button" onClick={handleApply}>
            Apply Changes
          </ApplyButton>
        </PopoverCard>
      )}
    </PickerContainer>
  )
}

import { useMemo } from 'react'

export default DateTimePicker
