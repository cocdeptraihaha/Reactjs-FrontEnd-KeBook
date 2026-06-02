import styled from 'styled-components'

export const Wrap = styled.div`
  display: grid;
  gap: 14px;
  max-width: 1200px;
`
export const Row = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;

  > * {
    flex: 1 1 220px;
  }
`
export const Input = styled.input`
  width: 100%;
  min-height: 46px;
  padding: 11px 13px;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(185, 170, 150, 0.82);
  background: rgba(255, 250, 240, 0.86);

  &:focus {
    outline: none;
    border-color: rgba(180, 120, 47, 0.72);
    box-shadow: 0 0 0 4px rgba(180, 120, 47, 0.14);
  }
`
export const Textarea = styled.textarea`
  width: 100%;
  padding: 11px 13px;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(185, 170, 150, 0.82);
  background: rgba(255, 250, 240, 0.86);
  min-height: 104px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: rgba(180, 120, 47, 0.72);
    box-shadow: 0 0 0 4px rgba(180, 120, 47, 0.14);
  }
`
export const Select = styled.select`
  width: 100%;
  min-height: 46px;
  padding: 11px 13px;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(185, 170, 150, 0.82);
  background: rgba(255, 250, 240, 0.86);

  &:focus {
    outline: none;
    border-color: rgba(180, 120, 47, 0.72);
    box-shadow: 0 0 0 4px rgba(180, 120, 47, 0.14);
  }
`
export const Btn = styled.button`
  min-height: 44px;
  padding: 10px 14px;
  border-radius: var(--radius-pill);
  border: 1px solid rgba(31, 77, 46, 0.28);
  background: #fffaf0;
  color: var(--brand-900);
  font-size: 0.86rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  transition: 0.18s ease;

  &:hover,
  &:focus-visible {
    border-color: rgba(180, 120, 47, 0.58);
    box-shadow: 0 8px 18px rgba(180, 120, 47, 0.16);
  }
`
export const P = styled.p`
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.92rem;
`
export const Alert = styled.p`
  margin: 0;
  color: var(--danger-700);
  font-size: 0.92rem;
`
export const List = styled.ul`
  margin: 10px 0 0;
  padding-left: 0;
  list-style: none;
  display: grid;
  gap: 8px;

  > li {
    border: 1px solid rgba(185, 170, 150, 0.62);
    border-radius: var(--radius-sm);
    background: rgba(255, 250, 240, 0.74);
    padding: 10px 12px;
  }
`
export const CheckoutGrid = styled.div`
  display: grid;
  gap: 16px;
  margin-top: 18px;

  @media (min-width: 900px) {
    grid-template-columns: minmax(0, 1.15fr) minmax(280px, 0.85fr);
    align-items: start;
  }
`
export const CheckoutPanel = styled.div`
  border-radius: var(--radius-lg);
  border: 1px solid rgba(185, 170, 150, 0.72);
  background:
    linear-gradient(168deg, rgba(255, 253, 248, 0.98), rgba(246, 238, 226, 0.96)),
    linear-gradient(90deg, rgba(31, 77, 46, 0.05) 1px, transparent 1px);
  box-shadow: var(--shadow-soft);
  padding: 16px;
  display: grid;
  gap: 12px;
`
export const PanelTitle = styled.h3`
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.08rem;
  color: var(--text-primary);
`
export const AddressChoices = styled.div`
  display: grid;
  gap: 10px;
`
export const AddressChoice = styled.label`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 10px;
  padding: 12px;
  border: 1px solid ${(p) => (p.$active ? 'rgba(31, 77, 46, 0.56)' : 'rgba(185, 170, 150, 0.72)')};
  border-radius: var(--radius-md);
  background: ${(p) => (p.$active ? 'rgba(31, 77, 46, 0.08)' : 'rgba(255, 253, 248, 0.8)')};
  cursor: pointer;

  input {
    margin-top: 4px;
    accent-color: var(--brand-700);
  }
`
export const AddressName = styled.strong`
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-primary);
`
export const Badge = styled.span`
  border-radius: var(--radius-sm);
  padding: 3px 7px;
  background: rgba(180, 120, 47, 0.16);
  color: var(--brand-900);
  font-size: 0.72rem;
  font-weight: 800;
`
export const SummaryLine = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  color: var(--text-secondary);
`
export const TotalLine = styled(SummaryLine)`
  padding-top: 12px;
  border-top: 1px solid rgba(185, 170, 150, 0.5);
  color: var(--text-primary);
  font-weight: 900;
  font-size: 1.12rem;

  strong {
    color: var(--brand-900);
  }
`
export const PrimaryCheckoutButton = styled(Btn)`
  width: 100%;
  color: #fffaf0;
  background: linear-gradient(145deg, var(--brand-950), var(--brand-700));
  border-color: transparent;
  margin-top: ${(p) => (p.$spaced ? '18px' : '0')};
`
export const FormStack = styled.div`
  display: grid;
  gap: 12px;
`
export const SuccessText = styled(P)`
  color: var(--brand-900);
  font-weight: 800;
`
export const StackedCheckoutPanel = styled(CheckoutPanel)`
  margin-top: 16px;
`
export const SpacedAlert = styled(Alert)`
  margin-top: 10px;
`
export const SummaryItem = styled.li`
  display: flex;
  justify-content: space-between;
  gap: 10px;
`
export const DiscountLine = styled(SummaryLine)`
  color: var(--danger-700);
`
export const RewardsShell = styled.div`
  display: grid;
  gap: 16px;
  width: min(100%, 940px);
  margin: 0 auto;
`
export const RewardTop = styled.div`
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
`
export const BalanceCard = styled.div`
  min-width: 170px;
  padding: 14px 16px;
  border-radius: var(--radius-md);
  border: 1px solid rgba(185, 170, 150, 0.72);
  background:
    linear-gradient(145deg, rgba(255, 253, 248, 0.98), rgba(243, 234, 220, 0.94)),
    radial-gradient(circle at 100% 0%, rgba(180, 120, 47, 0.16), transparent 40%);
  box-shadow: var(--shadow-soft);

  strong {
    display: block;
    margin-top: 4px;
    color: var(--brand-900);
    font-size: 1.25rem;
  }
`
export const RewardList = styled.div`
  display: grid;
  gap: 12px;
`
export const RewardCard = styled.article`
  display: grid;
  gap: 14px;
  padding: 14px;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  border-radius: var(--radius-md);
  border: 1px solid rgba(185, 170, 150, 0.72);
  background: rgba(255, 253, 248, 0.9);
  box-shadow: 0 10px 24px rgba(32, 22, 10, 0.04);

  @media (min-width: 760px) {
    grid-template-columns: 96px minmax(0, 1fr) 130px 128px;
    align-items: center;
  }
`
export const RewardIconBox = styled.div`
  width: 88px;
  height: 88px;
  display: grid;
  place-items: center;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(185, 170, 150, 0.82);
  background: linear-gradient(145deg, #fffdf8, #ece4d6);
  color: var(--brand-900);
`
export const RewardInfo = styled.div`
  display: grid;
  gap: 5px;
  min-width: 0;
`
export const RewardName = styled.h3`
  margin: 0;
  font-family: var(--font-display);
  color: var(--text-primary);
  font-size: 1.04rem;
  overflow-wrap: anywhere;
`
export const RewardTag = styled.span`
  width: fit-content;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(185, 170, 150, 0.72);
  padding: 4px 8px;
  background: rgba(255, 250, 240, 0.82);
  color: var(--text-secondary);
  font-size: 0.76rem;
  font-weight: 800;
`
export const RewardCost = styled.div`
  color: var(--text-secondary);
  font-size: 0.82rem;

  strong {
    display: block;
    margin-top: 4px;
    color: var(--text-primary);
    font-size: 1.18rem;
  }
`
export const RewardAction = styled.div`
  display: grid;
  gap: 8px;
  justify-items: stretch;
`
export const RewardNote = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 10px;
  padding: 14px;
  border-radius: var(--radius-md);
  border: 1px solid rgba(185, 170, 150, 0.62);
  background: rgba(255, 250, 240, 0.74);
  color: var(--text-secondary);
  font-size: 0.86rem;
`
export const NotiList = styled.ul`
  margin: 10px 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 8px;
`
export const NotiCard = styled.li`
  border: 1px solid rgba(185, 170, 150, 0.72);
  border-radius: var(--radius-sm);
  background: #fffaf0;
  padding: 12px;
  display: grid;
  gap: 5px;
`
export const NotiHead = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  align-items: baseline;
`
export const NotiTitle = styled.p`
  margin: 0;
  font-weight: 800;
  color: var(--text-primary);
`
export const NotiType = styled.span`
  border-radius: 999px;
  padding: 3px 8px;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  background: rgba(31, 77, 46, 0.1);
  color: var(--brand-900);
`
export const NotiMsg = styled.p`
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
`
export const NotiMeta = styled.p`
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.8rem;
`
export const NotiPayload = styled.p`
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.8rem;
`
