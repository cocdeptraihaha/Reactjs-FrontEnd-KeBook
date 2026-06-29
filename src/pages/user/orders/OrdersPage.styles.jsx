import styled from 'styled-components'

export const Wrap = styled.div`display:grid;gap:14px;`
export const Tabs = styled.div`display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;`
export const TabBtn = styled.button`
  border: 1px solid ${(p) => (p.$active ? 'var(--brand-700)' : 'rgba(30,74,42,0.22)')};
  background: ${(p) => (p.$active ? 'rgba(30,74,42,0.12)' : '#fff')};
  color: var(--brand-900);
  border-radius: var(--radius-pill);
  min-height: 40px;
  padding: 8px 13px;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`
export const StateText = styled.p`margin:0;color:var(--text-secondary);`
export const AlertText = styled.p`margin:0;color:#8f2f3c;`
export const List = styled.div`display:grid;gap:10px;`
export const Card = styled.article`border:1px solid rgba(185,170,150,0.74);border-radius:var(--radius-md);background:rgba(255,250,240,0.82);padding:14px;display:grid;gap:10px;box-shadow:var(--shadow-soft);`
export const CardHead = styled.div`display:flex;justify-content:space-between;gap:8px;align-items:center;`
export const OrderCode = styled.p`margin:0;font-weight:700;color:var(--text-primary);`
export const StatusChip = styled.span`
  border-radius:999px;
  padding:4px 9px;
  font-size:0.74rem;
  font-weight:700;
  letter-spacing:0.08em;
  text-transform:uppercase;
  color:${(p) => p.$color || 'var(--brand-900)'};
  background:rgba(30,74,42,0.1);
`
export const ItemList = styled.div`display:grid;gap:8px;`
export const ItemRow = styled.div`display:grid;grid-template-columns:46px minmax(0,1fr) auto;gap:10px;align-items:center;`
export const Cover = styled.div`width:46px;height:62px;border-radius:7px;background:#ece4d6;overflow:hidden;`
export const CoverImg = styled.img`width:100%;height:100%;object-fit:cover;display:block;`
export const ItemTitle = styled.p`margin:0;color:var(--text-primary);font-size:0.92rem;font-weight:700;`
export const ItemMeta = styled.p`margin:2px 0 0;color:var(--text-secondary);font-size:0.82rem;`
export const Price = styled.p`margin:0;color:var(--brand-900);font-size:0.88rem;font-weight:800;`
export const MoreText = styled.p`margin:0;color:var(--text-secondary);font-size:0.84rem;`
export const Footer = styled.div`display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;`
export const FooterText = styled.p`margin:0;color:var(--text-secondary);font-size:0.84rem;`
export const Actions = styled.div`display:flex;gap:8px;flex-wrap:wrap;`
export const ActionBtn = styled.button`border:1px solid rgba(30,74,42,0.22);border-radius:999px;min-height:40px;padding:8px 13px;background:#fff;color:var(--brand-900);font-size:0.82rem;font-weight:800;`
export const ReturnPanel = styled.form`border:1px solid rgba(30,74,42,0.18);border-radius:var(--radius-sm);background:#fffdf8;padding:12px;display:grid;gap:10px;`
export const ReturnTitle = styled.p`margin:0;color:var(--text-primary);font-weight:900;`
export const ReturnGrid = styled.div`display:grid;grid-template-columns:minmax(0,1fr) 110px auto;gap:8px;align-items:end;@media(max-width:640px){grid-template-columns:1fr;}`
export const ReturnField = styled.label`display:grid;gap:5px;color:var(--text-secondary);font-size:0.82rem;font-weight:800;`
export const ReturnSelect = styled.select`border:1px solid var(--line);border-radius:var(--radius-sm);min-height:40px;padding:8px 10px;background:#fff;color:var(--text-primary);`
export const ReturnInput = styled.input`border:1px solid var(--line);border-radius:var(--radius-sm);min-height:40px;padding:8px 10px;background:#fff;color:var(--text-primary);`
export const ReturnTextarea = styled.textarea`border:1px solid var(--line);border-radius:var(--radius-sm);min-height:74px;padding:9px 10px;background:#fff;color:var(--text-primary);resize:vertical;`

export const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  border-top: 1px solid rgba(30, 74, 42, 0.1);
  margin-top: 12px;
`
export const PaginationInfo = styled.span`
  font-size: 0.84rem;
  color: var(--text-secondary);
  font-weight: 500;
`
export const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`
export const PaginationButton = styled.button`
  border: 1px solid rgba(30, 74, 42, 0.22);
  border-radius: var(--radius-sm);
  background: #fff;
  color: var(--brand-900);
  min-height: 32px;
  padding: 4px 10px;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover:not(:disabled) {
    background: rgba(30, 74, 42, 0.05);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`

// Shopee-style detailed order styles
export const DetailContainer = styled.div`
  display: grid;
  gap: 16px;
  max-width: 1000px;
  margin: 0 auto;
  padding: 16px;
  background-color: transparent;
`

export const DetailHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--surface-elevated);
  padding: 16px 24px;
  border-radius: var(--radius-md);
  border: 1px solid var(--line);
  box-shadow: var(--shadow-soft);
`

export const HeaderNav = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  font-size: 0.88rem;

  a {
    color: var(--text-secondary);
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 4px;
    &:hover {
      color: var(--brand-700);
    }
  }
`

export const HeaderStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.88rem;

  .code {
    font-weight: 600;
    color: var(--text-primary);
  }
  .divider {
    color: var(--line);
  }
  .status {
    font-weight: 700;
    color: var(--berry-700);
    text-transform: uppercase;
  }
`

export const ShopeeTimeline = styled.div`
  background: var(--surface-elevated);
  padding: 24px;
  border-radius: var(--radius-md);
  border: 1px solid var(--line);
  box-shadow: var(--shadow-soft);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow-x: auto;

  @media(max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
    padding-left: 40px;
  }
`

export const TimelineProgressLine = styled.div`
  position: absolute;
  top: 42px;
  left: 60px;
  right: 60px;
  height: 4px;
  background: var(--line);
  z-index: 1;

  @media(max-width: 768px) {
    top: 30px;
    bottom: 30px;
    left: 24px;
    width: 4px;
    height: auto;
  }
`

export const TimelineProgressActive = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: ${(p) => p.$percentage || '0%'};
  background: var(--brand-700);
  transition: width 0.3s ease;

  @media(max-width: 768px) {
    width: 100%;
    height: ${(p) => p.$percentage || '0%'};
  }
`

export const TimelineStep = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 120px;
  position: relative;
  z-index: 2;

  @media(max-width: 768px) {
    flex-direction: row;
    text-align: left;
    width: 100%;
    gap: 16px;
  }
`

export const StepIconWrap = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${(p) => (p.$active ? 'var(--brand-700)' : 'var(--surface-elevated)')};
  border: 4px solid ${(p) => (p.$active ? 'var(--brand-500)' : 'var(--line)')};
  color: ${(p) => (p.$active ? '#fff' : 'var(--text-muted)')};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  font-weight: bold;
  box-shadow: var(--shadow-soft);
`

export const StepContent = styled.div`
  margin-top: 8px;

  .title {
    font-size: 0.82rem;
    font-weight: 700;
    color: ${(p) => (p.$active ? 'var(--text-primary)' : 'var(--text-muted)')};
  }
  .time {
    font-size: 0.74rem;
    color: var(--text-muted);
    margin-top: 2px;
  }

  @media(max-width: 768px) {
    margin-top: 0;
  }
`

export const AddressBorder = styled.div`
  height: 4px;
  width: 100%;
  background-position: x;
  background-size: 116px 4px;
  background-image: repeating-linear-gradient(45deg, var(--brand-700), var(--brand-700) 33px, transparent 0, transparent 41px, var(--berry-600) 0, var(--berry-600) 74px, transparent 0, transparent 82px);
  border-radius: var(--radius-md) var(--radius-md) 0 0;
`

export const InfoSection = styled.div`
  background: var(--surface-elevated);
  border-radius: 0 0 var(--radius-md) var(--radius-md);
  border: 1px solid var(--line);
  border-top: none;
  box-shadow: var(--shadow-soft);
  display: grid;
  grid-template-columns: 1.5fr 1fr;

  @media(max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

export const BlockPanel = styled.div`
  padding: 24px;
  border-right: ${(p) => (p.$borderRight ? '1px solid var(--line)' : 'none')};

  @media(max-width: 768px) {
    border-right: none;
    border-bottom: 1px solid var(--line);
  }
`

export const BlockHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--text-primary);

  svg {
    color: var(--brand-700);
  }
`

export const BlockBody = styled.div`
  font-size: 0.88rem;
  color: var(--text-secondary);
  line-height: 1.5;

  .name {
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 4px;
  }
  .phone {
    color: var(--text-secondary);
    margin-bottom: 8px;
  }
  .address {
    color: var(--text-muted);
    margin-bottom: 8px;
  }
  .note {
    font-style: italic;
    background: var(--surface-card);
    border-left: 3px solid var(--gold-600);
    padding: 6px 12px;
    border-radius: var(--radius-sm);
    margin-top: 10px;
    font-size: 0.82rem;
  }
`

export const LogisticsRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px dashed var(--line);
  font-size: 0.84rem;

  span:first-child {
    color: var(--text-muted);
  }
  span:last-child {
    font-weight: 600;
    color: var(--text-primary);
  }
`

export const ShopeeItemCard = styled.div`
  background: var(--surface-elevated);
  padding: 20px;
  border-radius: var(--radius-md);
  border: 1px solid var(--line);
  box-shadow: var(--shadow-soft);
`

export const ShopHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--line);
  margin-bottom: 12px;
`

export const ShopInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  color: var(--text-primary);

  .label-mall {
    background: var(--berry-700);
    color: #fff;
    font-size: 0.68rem;
    font-weight: 900;
    padding: 1px 4px;
    border-radius: var(--radius-sm);
  }
`

export const ShopeeItemRow = styled.div`
  display: flex;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid var(--line);
  align-items: flex-start;

  &:last-child {
    border-bottom: none;
  }
`

export const ShopeeItemImage = styled.div`
  width: 80px;
  height: 108px;
  flex-shrink: 0;
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  overflow: hidden;
  background-color: var(--surface);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

export const ShopeeItemDetails = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`

export const ShopeeItemName = styled.h4`
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.4;
`

export const ShopeeItemQuantity = styled.div`
  color: var(--text-secondary);
  font-size: 0.82rem;
`

export const ShopeeItemPrice = styled.div`
  text-align: right;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;

  .price {
    font-weight: 600;
    font-size: 0.95rem;
    color: var(--brand-900);
  }
`

export const PricingBreakdown = styled.div`
  background: var(--surface-elevated);
  padding: 20px 24px;
  border-radius: var(--radius-md);
  border: 1px solid var(--line);
  box-shadow: var(--shadow-soft);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
`

export const PricingRow = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  font-size: 0.88rem;
  color: var(--text-secondary);

  .label {
    width: 250px;
    text-align: right;
    padding-right: 24px;
    color: var(--text-muted);
  }
  .value {
    width: 150px;
    text-align: right;
    font-weight: 500;
    color: var(--text-primary);
  }

  &.discount {
    .value {
      color: var(--berry-700);
    }
  }

  &.grand-total {
    align-items: center;
    margin-top: 6px;
    padding-top: 12px;
    border-top: 1px solid var(--line);
    font-size: 1.15rem;

    .label {
      color: var(--text-primary);
      font-weight: 600;
    }
    .value {
      color: var(--berry-700);
      font-size: 1.5rem;
      font-weight: 700;
    }
  }
`

export const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 12px;
`

export const HistoryRow = styled.div`
  display: flex;
  gap: 16px;
  font-size: 0.84rem;
  line-height: 1.4;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  background: var(--surface);
  border-left: 3px solid var(--line-strong);

  &.active {
    background: var(--surface-card);
    border-left-color: var(--brand-700);
    .date, .desc {
      color: var(--brand-900);
      font-weight: 600;
    }
  }

  .date {
    width: 140px;
    flex-shrink: 0;
    color: var(--text-muted);
  }

  .desc {
    color: var(--text-secondary);
  }
`

export const DetailCard = styled.div`
  background: var(--surface-elevated);
  padding: 24px;
  border-radius: var(--radius-md);
  border: 1px solid var(--line);
  box-shadow: var(--shadow-soft);
`

export const DetailCardTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 16px;
`

export const ReturnItemCard = styled.div`
  padding: 16px;
  background-color: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const ReturnItemCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const ReturnItemTitle = styled.span`
  font-weight: 700;
  font-size: 14px;
  color: var(--text-primary);
`

export const ReturnItemStatus = styled.span`
  font-size: 11px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: var(--radius-pill);
  background-color: ${(p) => p.$approved ? 'rgba(30, 74, 42, 0.12)' : p.$rejected ? 'rgba(143, 47, 60, 0.12)' : 'rgba(180, 120, 47, 0.12)'};
  color: ${(p) => p.$approved ? 'var(--brand-900)' : p.$rejected ? 'var(--danger-700)' : 'var(--gold-600)'};
`

export const ReturnItemReason = styled.div`
  font-size: 13px;
  color: var(--text-secondary);
`

export const ReturnItemRefund = styled.div`
  font-size: 13px;
  color: var(--brand-700);
  font-weight: 700;
`

export const DetailFooterActions = styled.div`
  background: var(--surface-elevated);
  padding: 16px 24px;
  border-radius: var(--radius-md);
  border: 1px solid var(--line);
  box-shadow: var(--shadow-soft);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  flex-wrap: wrap;
`



