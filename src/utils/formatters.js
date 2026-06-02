export function formatDateTime(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleString('vi-VN')
}

export function formatMoney(value) {
  return `${Number(value || 0).toLocaleString('vi-VN')} ?`
}

export function formatPoint(value) {
  return Number(value || 0).toLocaleString('vi-VN')
}
