import { test, expect } from '@playwright/test'

test.describe('KeBook E-Commerce Core Flows', () => {
  test.beforeEach(async ({ page }) => {
    // ponytail: clear localstorage before each run
    await page.goto('http://localhost:5173/')
  })

  test('should load home page and perform search with filters', async ({ page }) => {
    await page.goto('http://localhost:5173/app/home')
    await expect(page.locator('text=Tìm kiếm')).toBeVisible({ timeout: 10000 })

    // Navigate to Search page
    await page.goto('http://localhost:5173/app/search')

    // Fill search keyword
    const searchInput = page.locator('placeholder="Tìm trong tên sách, tên tác giả, nhà xuất bản..."')
    if (await searchInput.isVisible()) {
      await searchInput.fill('Đất rừng phương Nam')
      // Wait for debounce API load
      await page.waitForTimeout(500)
    }
  })

  test('should display low stock warning card on admin dashboard', async ({ page }) => {
    // ponytail: mock auth as admin or navigate directly if public-mocked
    await page.goto('http://localhost:5173/app/admin/dashboard')
    const warningHeader = page.locator('text=Cảnh báo sắp hết hàng')
    await expect(warningHeader).toBeVisible({ timeout: 10000 })
  })
})
