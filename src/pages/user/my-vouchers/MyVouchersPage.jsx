import { useState } from 'react'
import styled from 'styled-components'
import { usersApi } from '../../../api/users'
import { Section } from '../../../components/Section'
import { useAsync } from '../../../hooks/useAsync'
import { Alert, P, Wrap } from '../../WorkflowPages.styles'
import { Tag, Calendar, ShoppingBag, Clock, Copy, Check } from 'react-feather'

const VoucherContainer = styled.div`
  background: #fdfcf7;
  border: 1px solid rgba(185, 170, 150, 0.4);
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: var(--shadow-soft);
  max-width: 800px;
  margin: 0 auto;
`

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px dashed rgba(185, 170, 150, 0.4);
  padding-bottom: 16px;
  margin-bottom: 24px;
`

const Title = styled.h1`
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--brand-950);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
`

const VoucherCountBadge = styled.span`
  background-color: var(--brand-900);
  color: #ffffff;
  font-size: 0.8rem;
  padding: 4px 10px;
  border-radius: var(--radius-pill);
  font-weight: 700;
`

const VoucherGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;

  @media (min-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const VoucherCard = styled.div`
  background-color: #ffffff;
  border: 1px solid rgba(185, 170, 150, 0.3);
  border-radius: var(--radius-md);
  display: flex;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(185, 170, 150, 0.08);
  transition: transform 0.22s ease, box-shadow 0.22s ease;
  position: relative;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(185, 170, 150, 0.15);
    border-color: rgba(30, 74, 42, 0.35);
  }

  /* Coupon ticket half-circles */
  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 14px;
    height: 14px;
    background-color: #fdfcf7; /* matches wrapper background */
    border: 1px solid rgba(185, 170, 150, 0.3);
    border-radius: 50%;
    transform: translateY(-50%);
    z-index: 10;
  }

  &::before {
    left: -7px;
    border-right: none;
  }

  &::after {
    right: -7px;
    border-left: none;
  }
`

const LeftPromoPanel = styled.div`
  background: linear-gradient(135deg, var(--brand-950) 0%, var(--brand-700) 100%);
  color: #ffffff;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 160px;
  min-width: 160px;
  border-right: 1px dashed rgba(185, 170, 150, 0.45);
  position: relative;

  @media (max-width: 480px) {
    width: 110px;
    min-width: 110px;
    padding: 12px;
  }
`

const DiscountValue = styled.div`
  font-size: 1.8rem;
  font-weight: 800;
  line-height: 1.1;

  @media (max-width: 480px) {
    font-size: 1.3rem;
  }
`

const DiscountLabel = styled.div`
  font-size: 0.68rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-top: 4px;
  opacity: 0.9;
`

const RightPromoPanel = styled.div`
  padding: 20px 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 12px;

  @media (max-width: 480px) {
    padding: 14px 16px;
  }
`

const PromoHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
`

const PromoName = styled.h3`
  font-size: 1rem;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.4;
`

const CodeGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
`

const CodeBadge = styled.span`
  font-family: monospace;
  font-size: 0.85rem;
  font-weight: 700;
  background-color: rgba(46, 106, 59, 0.08);
  border: 1px solid rgba(46, 106, 59, 0.25);
  color: var(--brand-950);
  padding: 4px 10px;
  border-radius: var(--radius-sm);
  letter-spacing: 0.05em;
`

const CopyButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--brand-700);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 999px;
  transition: all 0.15s ease;

  &:hover {
    background-color: rgba(46, 106, 59, 0.08);
    color: var(--brand-950);
  }
`

const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  font-size: 0.76rem;
  color: var(--text-secondary);
  border-top: 1px solid rgba(185, 170, 150, 0.15);
  padding-top: 12px;
`

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
`

const EmptyStateContainer = styled.div`
  text-align: center;
  padding: 48px 24px;
`

const EmptyTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 12px 0 6px;
`

export function MyVouchersPage() {
  const s = useAsync(() => usersApi.myPromotions(), [])
  const [copiedCode, setCopiedCode] = useState(null)

  const handleCopyCode = (code) => {
    void navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0)
  }

  const formatDate = (val) => {
    if (!val) return 'Vô thời hạn'
    return new Date(val).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  return (
    <Wrap style={{ padding: '16px 0' }}>
      <Section>
        <VoucherContainer>
          <HeaderSection>
            <Title>
              <Tag size={22} style={{ color: 'var(--brand-900)' }} /> Kho Voucher Của Tôi
            </Title>
            {s.data && s.data.length > 0 && (
              <VoucherCountBadge>
                {s.data.length} Voucher
              </VoucherCountBadge>
            )}
          </HeaderSection>

          {s.loading && <P style={{ textAlign: 'center', padding: '24px' }}>Đang tải danh sách voucher...</P>}
          {s.error && <Alert role="alert">Lỗi tải dữ liệu: {s.error}</Alert>}

          {!s.loading && !s.error && (!s.data || s.data.length === 0) && (
            <EmptyStateContainer>
              <Tag size={48} style={{ color: 'rgba(185, 170, 150, 0.4)', strokeWidth: 1.5 }} />
              <EmptyTitle>Kho voucher trống</EmptyTitle>
              <P>Bạn chưa sở hữu hoặc chưa được phát voucher cá nhân nào.</P>
            </EmptyStateContainer>
          )}

          {!s.loading && s.data && s.data.length > 0 && (
            <VoucherGrid>
              {s.data.map((promo) => {
                const hasPercent = promo.discount_percent && promo.discount_percent > 0
                const hasAmount = promo.discount_amount && promo.discount_amount > 0
                const isFreeShip = Boolean(promo.free_shipping)

                return (
                  <VoucherCard key={promo.id}>
                    <LeftPromoPanel>
                      {hasPercent && (
                        <>
                          <DiscountValue>{promo.discount_percent}%</DiscountValue>
                          <DiscountLabel>Giảm Giá</DiscountLabel>
                        </>
                      )}
                      {!hasPercent && hasAmount && (
                        <>
                          <DiscountValue>{promo.discount_amount >= 1000 ? `${promo.discount_amount / 1000}k` : promo.discount_amount}</DiscountValue>
                          <DiscountLabel>Giảm Tiền</DiscountLabel>
                        </>
                      )}
                      {!hasPercent && !hasAmount && isFreeShip && (
                        <>
                          <DiscountValue>FS</DiscountValue>
                          <DiscountLabel>Miễn Ship</DiscountLabel>
                        </>
                      )}
                    </LeftPromoPanel>

                    <RightPromoPanel>
                      <div>
                        <PromoHeader>
                          <PromoName>{promo.name || 'Ưu đãi đặc biệt'}</PromoName>
                        </PromoHeader>

                        <CodeGroup>
                          <CodeBadge>{promo.code}</CodeBadge>
                          <CopyButton
                            type="button"
                            title="Sao chép mã"
                            onClick={() => handleCopyCode(promo.code)}
                          >
                            {copiedCode === promo.code ? (
                              <Check size={14} style={{ color: '#15803d' }} />
                            ) : (
                              <Copy size={14} />
                            )}
                          </CopyButton>
                        </CodeGroup>
                      </div>

                      <MetaRow>
                        {promo.min_order_amount > 0 && (
                          <MetaItem>
                            <ShoppingBag size={13} style={{ color: 'var(--brand-700)' }} />
                            Đơn tối thiểu: <strong>{formatCurrency(promo.min_order_amount)}</strong>
                          </MetaItem>
                        )}
                        {promo.max_discount > 0 && (
                          <MetaItem>
                            <Tag size={13} style={{ color: 'var(--brand-700)' }} />
                            Giảm tối đa: <strong>{formatCurrency(promo.max_discount)}</strong>
                          </MetaItem>
                        )}
                        <MetaItem>
                          <Calendar size={13} style={{ color: 'var(--brand-700)' }} />
                          Hạn dùng: {formatDate(promo.end_date)}
                        </MetaItem>
                        {promo.usage_limit !== null && (
                          <MetaItem>
                            <Clock size={13} style={{ color: 'var(--brand-700)' }} />
                            Lượt dùng: còn {promo.usage_limit} lần
                          </MetaItem>
                        )}
                      </MetaRow>
                    </RightPromoPanel>
                  </VoucherCard>
                )
              })}
            </VoucherGrid>
          )}
        </VoucherContainer>
      </Section>
    </Wrap>
  )
}
