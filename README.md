# KeBook Frontend (React + Vite)

Frontend integrated with KeBook backend API v1 contracts.

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
- `POST /auth/login` (form-urlencoded)
- protected cart routes: `/cart/`, `/cart/summary`, `/cart/{id}`
- public books/categories/reviews routes

## Quality checks

```bash
npm run lint
npm run build
```
