import { Gift, Percent, Tag, Truck } from 'react-feather'
import { formatMoney } from '../../../utils/formatters'

export function getPointBalance(payload) {
  return Number(payload?.balance ?? payload?.points ?? payload?.total_points ?? payload?.available_points ?? 0)
}

export function getRewardRemaining(reward) {
  if (reward?.usage_limit == null) return null
  return Math.max(0, Number(reward.usage_limit || 0) - Number(reward.used_count || 0))
}

export function getRewardTag(reward) {
  if (reward?.reward_type === 'FREE_SHIPPING') return 'Vận chuyển'
  return 'Giảm giá'
}

export function getRewardIcon(reward) {
  const icon = String(reward?.icon || '').toLowerCase()
  if (reward?.reward_type === 'FREE_SHIPPING' || icon.includes('truck')) return Truck
  if (icon.includes('gift')) return Gift
  if (icon.includes('percent') || reward?.reward_type === 'DISCOUNT_PERCENT') return Percent
  return Tag
}

export function getRewardFallbackName(reward) {
  if (reward?.name) return reward.name
  if (reward?.reward_type === 'FREE_SHIPPING') return 'Miễn phí vận chuyển'
  if (reward?.reward_type === 'DISCOUNT_AMOUNT') return `Voucher giảm ${formatMoney(reward.discount_amount)}`
  if (reward?.reward_type === 'DISCOUNT_PERCENT') return `Voucher giảm ${Number(reward.discount_percent || 0)}%`
  return `Reward ${reward?.id || ''}`
}
