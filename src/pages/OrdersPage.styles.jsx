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
