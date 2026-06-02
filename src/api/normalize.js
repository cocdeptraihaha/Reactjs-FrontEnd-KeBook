export function ensureArray(payload) {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.items)) return payload.items
  if (Array.isArray(payload?.data)) return payload.data
  if (Array.isArray(payload?.results)) return payload.results
  if (Array.isArray(payload?.list)) return payload.list
  return []
}

export function normalizePage(payload) {
  const src = payload?.data && !Array.isArray(payload.data) ? payload.data : payload
  return {
    items: ensureArray(src),
    total: Number(src?.total ?? src?.total_items ?? src?.count ?? 0),
    page: Number(src?.page ?? src?.current_page ?? 1),
    size: Number(src?.size ?? src?.page_size ?? src?.limit ?? ensureArray(src).length),
    pages: Number(src?.pages ?? src?.total_pages ?? 1),
    raw: payload,
  }
}
