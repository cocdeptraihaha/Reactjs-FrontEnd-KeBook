import { useState, useRef, useEffect } from 'react'
import styled, { keyframes, css } from 'styled-components'
import { ChevronDown } from 'react-feather'

const slideDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-8px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`

const DropdownContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: ${props => props.$width || '200px'};
  font-family: 'Inter', -apple-system, sans-serif;
`

const DropdownTrigger = styled.button`
  width: 100%;
  padding: 10px 16px;
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  color: #334155;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    border-color: #94a3b8;
    background-color: #f8fafc;
  }

  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
  }

  ${props => props.$isOpen && css`
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
    background-color: #ffffff;
  `}
`

const ArrowIconWrap = styled.div`
  display: flex;
  align-items: center;
  color: #64748b;
  transition: transform 0.2s ease;

  ${props => props.$isOpen && css`
    transform: rotate(180deg);
    color: #4f46e5;
  `}
`

const DropdownMenu = styled.ul`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 6px;
  margin: 0;
  list-style: none;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  z-index: 200;
  transform-origin: top;
  animation: ${slideDown} 0.2s cubic-bezier(0.16, 1, 0.3, 1);
`

const DropdownItem = styled.li`
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 550;
  color: #475569;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:hover {
    background-color: #f5f3ff;
    color: #4f46e5;
  }

  ${props => props.$isActive && css`
    background-color: #ede9fe;
    color: #4f46e5;
    font-weight: 700;

    &::after {
      content: '';
      width: 6px;
      height: 6px;
      background-color: #6366f1;
      border-radius: 50%;
    }
  `}
`

export function Dropdown({ value, onChange, options, placeholder = 'Select option', width }) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedOption = options.find(opt => opt.value === value)

  return (
    <DropdownContainer ref={containerRef} $width={width}>
      <DropdownTrigger
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        $isOpen={isOpen}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <ArrowIconWrap $isOpen={isOpen}>
          <ChevronDown size={16} />
        </ArrowIconWrap>
      </DropdownTrigger>

      {isOpen && (
        <DropdownMenu>
          {options.map(opt => (
            <DropdownItem
              key={opt.value}
              $isActive={opt.value === value}
              onClick={() => {
                onChange(opt.value)
                setIsOpen(false)
              }}
            >
              {opt.label}
            </DropdownItem>
          ))}
        </DropdownMenu>
      )}
    </DropdownContainer>
  )
}

export default Dropdown
