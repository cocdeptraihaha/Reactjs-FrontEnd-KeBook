import { Navigate, Route, Routes } from 'react-router-dom'
import { RequireAuth } from './auth/RequireAuth'
import { RequireRole } from './auth/RequireRole'
import { AppLayout } from './components/AppLayout'
import { BookDetailPage } from './pages/BookDetailPage'
import { CartPage } from './pages/CartPage'
import { CatalogPage } from './pages/CatalogPage'
import { HomePage } from './pages/HomePage'
import { AccountSettingsPage, ProfilePage } from './pages/ProfilePage'
import { LoginPage } from './pages/LoginPage'
import { OrderDetailPage, OrderHistoryPage } from './pages/OrdersPage'
import {
  AdminAddBookPage,
  AdminOrdersPage,
  AuthGatePage,
  CheckoutPage,
  FavoritesPage,
  ForgotPasswordPage,
  MyVouchersPage,
  NotificationsPage,
  PointsHistoryPage,
  RegisterPage,
  ResetPasswordPage,
  ReturnRequestsPage,
  RewardsPage,
  SupportTicketPage,
  VerifyOtpPage,
  WriteReviewPage,
} from './pages/WorkflowPages'

function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthGatePage />} />

      <Route path="/auth">
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="verify-otp" element={<VerifyOtpPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
      </Route>

      <Route
        path="/app"
        element={(
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        )}
      >
        <Route index element={<Navigate to="/app/home" replace />} />
        <Route path="home" element={<HomePage />} />
        <Route path="catalog" element={<CatalogPage />} />
        <Route path="book/:id" element={<BookDetailPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="orders" element={<OrderHistoryPage />} />
        <Route path="orders/:id" element={<OrderDetailPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="profile/account" element={<AccountSettingsPage />} />
        <Route path="profile/favorites" element={<FavoritesPage />} />
        <Route path="profile/points-history" element={<PointsHistoryPage />} />
        <Route path="profile/my-vouchers" element={<MyVouchersPage />} />
        <Route path="profile/rewards" element={<RewardsPage />} />
        <Route path="profile/return-requests" element={<ReturnRequestsPage />} />
        <Route path="profile/support-ticket" element={<SupportTicketPage />} />
        <Route path="profile/write-review" element={<WriteReviewPage />} />
        <Route
          path="admin/orders"
          element={(
            <RequireRole role="ADMIN">
              <AdminOrdersPage />
            </RequireRole>
          )}
        />
        <Route
          path="admin/books/new"
          element={(
            <RequireRole role="ADMIN">
              <AdminAddBookPage />
            </RequireRole>
          )}
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
