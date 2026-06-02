# KeBook Frontend (React + Vite)

Frontend integrated with KeBook backend API v1 contracts.

## Current Scope

- Auth: login, register, OTP verification, forgot/reset password, protected routes, admin-only routes.
- Catalog: book listing, search, product detail, multi-image detail view, similar-book slider.
- Home: featured categories, discounted books, best sellers, paginated product grid.
- Cart/checkout: cart management, address-book based checkout, promotion code, delivery note.
- Profile: profile modal edit, address book modal edit, account settings page with re-auth.
- Account workflows: notifications, favorites, points history, vouchers, rewards redemption, return requests, support ticket, write review.
- Admin workflows: order status update, book creation, book image manager.

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## Environment

Create `.env` from `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

## Backend dependency

This app expects backend running from:

- `C:\Users\firef\OneDrive\Desktop\KeBook-backend`
- API docs: `docs/API_DOCS.md`

Required for production-like flows:

- Auth routes: `/auth/login`, `/auth/register`, `/auth/verify-otp`, `/auth/forgot-password`, `/auth/reset-password`
- Catalog routes: `/books`, `/books/{id}`, `/books/{id}/images`, `/books/top-discounted`, `/books/top-selling`, `/categories`
- Cart/checkout routes: `/cart/`, `/cart/summary`, `/orders/checkout`, `/promotions/validate`
- Profile routes: `/users/me`, `/users/me/points`, `/users/me/promotions`, `/addresses/me`
- Notification routes: `/notifications/me`, `/notifications/me/unread-count`, `/notifications/me/read-all`
- Reward/support routes: `/points/rewards`, `/points/rewards/{id}/redeem`, `/support-requests`

## Project Structure

- `src/api/`: API clients and response normalization.
- `src/auth/`: auth store, context, route guards.
- `src/components/`: reusable layout, cart, section, modal, product card components.
- `src/pages/`: page-level screens with per-page `*.styles.jsx`.
- `src/pages/checkout/`, `src/pages/rewards/`, `src/pages/support/`, `src/pages/account/`, `src/pages/admin/`, `src/pages/auth/`: split workflow pages.
- `src/hooks/`: shared hooks.
- `src/utils/`: shared formatters.

## UI Conventions

- Product cards use shared `src/components/product/ProductCard.jsx`.
- Styled components stay in component/page `*.styles.jsx` files.
- Avoid writing Vietnamese text through shell redirection; use UTF-8-safe edits and scan for mojibake.

## Quality checks

```bash
npm run lint
npm run build
```

Optional Unicode scan after Vietnamese edits:

```bash
rg -n "Ã|Â|Ä|Æ|�|Ch\\?|\\?ang|\\?\\? giao|\\?\\? h|T\\?t|Y\\?u|Ho\\?n|Gi\\?|S\\?ch|\\?u ti|ng\\?\\?|Gi\\?m" src CLAUDE.md
```
