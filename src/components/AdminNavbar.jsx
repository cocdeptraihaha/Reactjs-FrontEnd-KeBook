import { useState, useEffect, useRef } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { BarChart2, Package, Book, Shield, ArrowLeft, Users, Bell, Tag, Search, Loader, Percent } from 'react-feather'
import { booksApi, pickPrimaryImage } from '../api/books'

const HeaderContainer = styled.header`
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  padding: 12px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -2px rgba(0, 0, 0, 0.02);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  gap: 20px;

  @media print {
    display: none !important;
  }
`

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  flex-shrink: 0;
`

const BrandingGroup = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
`

const LogoIconWrap = styled.div`
  background: linear-gradient(135deg, #4f46e5 0%, #311042 100%);
  color: #ffffff;
  padding: 10px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
`

const BrandingText = styled.div`
  display: flex;
  flex-direction: column;
`

const BrandTitle = styled.h2`
  margin: 0;
  font-size: 16px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.02em;
`

const BrandSubtitle = styled.span`
  font-size: 10px;
  color: #8b5cf6;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-top: 2px;
`

/* Search bar styling */
const SearchWrapper = styled.div`
  position: relative;
  width: 280px;
  max-width: 100%;

  @media (max-width: 1024px) {
    width: 200px;
  }

  @media (max-width: 768px) {
    display: none;
  }
`

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 8px 12px;
  gap: 8px;
  transition: all 0.2s ease;

  &:focus-within {
    background-color: #ffffff;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }
`

const SearchInput = styled.input`
  border: none;
  background: transparent;
  outline: none;
  font-size: 13px;
  font-weight: 500;
  color: #1e293b;
  width: 100%;

  &::placeholder {
    color: #94a3b8;
  }
`

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  z-index: 110;
`

const ResultItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  cursor: pointer;
  border-bottom: 1px solid #f1f5f9;
  transition: background-color 0.15s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f5f3ff;
  }
`

const BookThumb = styled.img`
  width: 32px;
  height: 44px;
  object-fit: cover;
  border-radius: 4px;
  background-color: #f1f5f9;
  border: 1px solid #e2e8f0;
  flex-shrink: 0;
`

const BookInfo = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
`

const BookTitleText = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const BookAuthorText = styled.span`
  font-size: 11px;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 1px;
`

const BookPriceText = styled.span`
  font-size: 11px;
  font-weight: 800;
  color: #4f46e5;
  margin-top: 1px;
`

const ResultStatusText = styled.span`
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 9999px;
  background-color: ${props => props.$isOutOfStock ? '#fee2e2' : '#dcfce7'};
  color: ${props => props.$isOutOfStock ? '#be123c' : '#15803d'};
  white-shrink: 0;
`

const NoResultsItem = styled.div`
  padding: 14px;
  font-size: 12px;
  color: #64748b;
  text-align: center;
  font-weight: 500;
`

const NavMenu = styled.nav`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: nowrap;

  @media (max-width: 1150px) {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 4px;
  }
`

const StyledLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  color: #475569;
  text-decoration: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;

  svg {
    transition: transform 0.2s ease;
  }

  &:hover {
    color: #4f46e5;
    background-color: #f5f3ff;

    svg {
      transform: translateY(-1px);
    }
  }

  &.active {
    color: #4f46e5;
    background-color: #ede9fe;
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.05);

    svg {
      color: #6366f1;
    }
  }
`

const BackBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  font-size: 13px;
  font-weight: 700;
  color: #64748b;
  text-decoration: none;
  background-color: #ffffff;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background-color: #f8fafc;
    border-color: #cbd5e1;
    color: #334155;
  }
`

export function AdminNavbar() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Debounced search query fetching
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      setDropdownOpen(false)
      return
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await booksApi.adminList({ q: searchQuery, size: 5 })
        setSearchResults(res?.data || [])
        setDropdownOpen(true)
      } catch (err) {
        console.error('Lỗi tìm kiếm sách:', err)
        setSearchResults([])
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0)
  }

  const handleSelectBook = (bookId) => {
    setDropdownOpen(false)
    setSearchQuery('')
    // Route to book edit panel or detail context
    navigate(`/app/admin/books/new?id=${bookId}`)
    window.location.reload() // Force reload to trigger editing view on books/new path
  }

  return (
    <HeaderContainer>
      <LeftSection>
        <BrandingGroup to="/app/admin/dashboard">
          <LogoIconWrap>
            <Shield size={18} />
          </LogoIconWrap>
          <BrandingText>
            <BrandTitle>KeBook</BrandTitle>
            <BrandSubtitle>Admin</BrandSubtitle>
          </BrandingText>
        </BrandingGroup>

        {/* Search bar inside navbar */}
        <SearchWrapper ref={dropdownRef}>
          <SearchBox>
            {loading ? (
              <Loader size={16} color="#6366f1" className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              <Search size={16} color="#94a3b8" />
            )}
            <SearchInput
              type="text"
              placeholder="Tìm kiếm sách nhanh..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchResults.length > 0) setDropdownOpen(true)
              }}
            />
          </SearchBox>

          {dropdownOpen && (
            <DropdownMenu>
              {searchResults.length === 0 ? (
                <NoResultsItem>Không tìm thấy sách phù hợp</NoResultsItem>
              ) : (
                searchResults.map((book) => {
                  const isOutOfStock = (book.stock_quantity || 0) <= 0
                  return (
                    <ResultItem key={book.id} onClick={() => handleSelectBook(book.id)}>
                      <BookThumb src={pickPrimaryImage(book)} alt={book.title} />
                      <BookInfo>
                        <BookTitleText>{book.title}</BookTitleText>
                        <BookAuthorText>{book.author || 'Chưa rõ tác giả'}</BookAuthorText>
                        <BookPriceText>{formatCurrency(book.selling_price)}</BookPriceText>
                      </BookInfo>
                      <ResultStatusText $isOutOfStock={isOutOfStock}>
                        {isOutOfStock ? 'Hết hàng' : `Còn: ${book.stock_quantity}`}
                      </ResultStatusText>
                    </ResultItem>
                  )
                })
              )}
            </DropdownMenu>
          )}
        </SearchWrapper>
      </LeftSection>

      <NavMenu>
        <StyledLink to="/app/admin/dashboard">
          <BarChart2 size={15} />
          Tổng Quan
        </StyledLink>
        <StyledLink to="/app/admin/orders">
          <Package size={15} />
          Đơn Hàng
        </StyledLink>
        <StyledLink to="/app/admin/books/new">
          <Book size={15} />
          Sách
        </StyledLink>
        <StyledLink to="/app/admin/users">
          <Users size={15} />
          Người Dùng
        </StyledLink>
        <StyledLink to="/app/admin/promotions">
          <Tag size={15} />
          Khuyến Mãi
        </StyledLink>
        <StyledLink to="/app/admin/notifications">
          <Bell size={15} />
          Thông Báo
        </StyledLink>
      </NavMenu>

      <BackBtn to="/app/profile">
        <ArrowLeft size={13} /> Về Cửa Hàng
      </BackBtn>
    </HeaderContainer>
  )
}

export default AdminNavbar
