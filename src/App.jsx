import { Navigate, Route, Routes } from 'react-router-dom'
import { RequireAuth } from './auth/RequireAuth'
import { RequireRole } from './auth/RequireRole'
import { AppLayout } from './components/AppLayout'
import { LoginPage } from './pages/LoginPage'
import {
  HomePage,
  SearchPage,
  BookDetailPage,
  CartPage,
  CheckoutPage,
  VNPayCallbackPage,
  OrderDetailPage,
  OrderHistoryPage,
  ProfilePage,
  AccountSettingsPage,
  FavoritesPage,
  MyVouchersPage,
  RewardsPage,
  SupportTicketPage,
  WriteReviewPage,
  NotificationsPage,
  AdminOrdersPage,
  AdminAddBookPage,
  AdminDashboardPage,
  AdminUsersPage,
  AdminNotificationsPage,
  AdminPromotionsPage,
  AdminBookDiscountsPage,
  AuthGatePage,
  ForgotPasswordPage,
  RegisterPage,
  ResetPasswordPage,
  VerifyOtpPage
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
        <Route path="search" element={<SearchPage />} />
        <Route path="book/:id" element={<BookDetailPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="orders" element={<OrderHistoryPage />} />
        <Route path="orders/:id" element={<OrderDetailPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="profile/account" element={<AccountSettingsPage />} />
        <Route path="profile/favorites" element={<FavoritesPage />} />
        <Route path="profile/my-vouchers" element={<MyVouchersPage />} />
        <Route path="profile/rewards" element={<RewardsPage />} />
        <Route path="profile/support" element={<SupportTicketPage />} />
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
          path="admin/dashboard"
          element={(
            <RequireRole role="ADMIN">
              <AdminDashboardPage />
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
        <Route
          path="admin/users"
          element={(
            <RequireRole role="ADMIN">
              <AdminUsersPage />
            </RequireRole>
          )}
        />
        <Route
          path="admin/notifications"
          element={(
            <RequireRole role="ADMIN">
              <AdminNotificationsPage />
            </RequireRole>
          )}
        />
        <Route
          path="admin/promotions"
          element={(
            <RequireRole role="ADMIN">
              <AdminPromotionsPage />
            </RequireRole>
          )}
        />
        <Route
          path="admin/book-discounts"
          element={(
            <RequireRole role="ADMIN">
              <Navigate to="/app/admin/books/new?tab=book-discounts" replace />
            </RequireRole>
          )}
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
      <Route
        path="/payment/vnpay-callback"
        element={(
          <RequireAuth>
            <VNPayCallbackPage />
          </RequireAuth>
        )}
      />
    </Routes>
  )
}

export default App
