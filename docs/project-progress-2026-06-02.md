# Báo cáo tiến độ dự án (cập nhật 2026-06-02)

## 1) Tổng quan nhanh
- Trạng thái tổng: `đang phát triển`, đã có luồng người dùng chính từ đăng nhập đến đặt hàng.
- Ước lượng hoàn thành frontend theo route hiện tại: `~78%`.
- Điểm mạnh: nhiều screen đã gắn API thật, có xử lý loading/error/retry.
- Điểm nghẽn: vài màn workflow còn bản MVP, còn thiếu validation sâu, chưa thấy test tự động cho screen.

## 2) Tiến độ chi tiết theo screen/route

| Route | Screen | Trạng thái | % | Đã xong | Còn thiếu / Rủi ro |
|---|---|---:|---:|---|---|
| `/` | AuthGate | Hoàn thành | 100 | Điều hướng theo trạng thái auth | Không |
| `/auth/login` | Login | Hoàn thành | 95 | Form login, loading/error, redirect sau login | Cần thông báo lỗi theo field nếu backend trả chi tiết |
| `/auth/register` | Register | Gần hoàn thành | 85 | Form đăng ký, gọi API, điều hướng OTP | Cần validation client mạnh hơn (email/password policy) |
| `/auth/verify-otp` | Verify OTP | Đang ổn định | 80 | Verify OTP, resend OTP, chuyển vào app | Cách refresh auth context còn “best-effort”, cần chuẩn hóa |
| `/auth/forgot-password` | Forgot Password | Gần hoàn thành | 85 | Gửi OTP reset, hiển thị message | Cần UX trạng thái gửi lại OTP/timer |
| `/auth/reset-password` | Reset Password | Gần hoàn thành | 85 | Nhập email/otp/mật khẩu mới, gọi API | Cần check độ mạnh mật khẩu + confirm password |
| `/app/home` | Home | Hoàn thành tốt | 92 | Hero, category, list sách, phân trang local, đổi grid, loading/error/retry | Chưa có filter category thực tế lên danh sách |
| `/app/catalog` | Catalog | Chưa mở route thật | 40 | Screen có search/filter local đầy đủ | Trong `App.jsx` đang redirect về `/app/home`, người dùng chưa truy cập được |
| `/app/book/:id` | Book Detail | Hoàn thành tốt | 90 | Detail + similar + reviews + add to cart + record view | Cần xử lý fallback ảnh/giá triệt để hơn |
| `/app/notifications` | Notifications | Hoàn thành | 90 | Đọc danh sách thông báo, render payload/meta | Cần pagination nếu data lớn |
| `/app/cart` | Cart | Hoàn thành tốt | 92 | Đồng bộ `/cart` và `/cart/summary`, update quantity, remove, summary | Cần optimistic update để mượt hơn |
| `/app/checkout` | Checkout | MVP chạy được | 75 | Form checkout, validate promo, place order | Dùng `alert`, thiếu confirm screen và tính toán tổng tiền trước submit |
| `/app/orders` | Order History | Hoàn thành tốt | 93 | Tab theo trạng thái, hủy đơn, xác nhận nhận hàng, mua lại, link chi tiết | Cần chuẩn hóa i18n text EN/VI |
| `/app/orders/:id` | Order Detail | Hoàn thành | 90 | Chi tiết đơn, items, trạng thái, quay lại list | Thiếu timeline vận chuyển |
| `/app/profile` | Profile (full) | Hoàn thành tốt | 92 | React Query + react-hook-form, upload avatar, save/cancel, quick links | Cần khóa double-submit chặt hơn một số thao tác |
| `/app/profile/personal-info` | Personal Info (workflow) | MVP | 70 | Đọc/sửa basic info | Chức năng bị trùng với Profile chính, cần quyết định giữ/xóa |
| `/app/profile/change-password` | Change Password | Tạm thời | 50 | Có điều hướng sang forgot/reset | Chưa có form đổi mật khẩu trong app |
| `/app/profile/favorites` | Favorites | Gần hoàn thành | 85 | List favorites + link detail | Cần remove favorite trực tiếp trên màn |
| `/app/profile/points-history` | Points History | Gần hoàn thành | 85 | Balance + transactions | Thiếu filter theo thời gian |
| `/app/profile/my-vouchers` | My Vouchers | Gần hoàn thành | 85 | Danh sách voucher cá nhân | Thiếu trạng thái usable/expired |
| `/app/profile/rewards` | Rewards | Gần hoàn thành | 85 | List rewards + redeem action | Cần confirm trước redeem |
| `/app/profile/return-requests` | Return Requests | MVP | 72 | Tạo yêu cầu hoàn trả + list trạng thái | Cần chọn item trực quan thay vì nhập tay ID |
| `/app/profile/write-review` | Write Review | MVP | 70 | Submit review | Cần chọn book theo order đã mua, hạn chế nhập tay `book_id` |
| `/app/admin/orders` | Admin Orders | Gần hoàn thành | 82 | List đơn admin, cập nhật trạng thái | Cần dropdown status hợp lệ thay vì text tự do |
| `/app/admin/books/new` | Admin Add Book | Gần hoàn thành | 84 | Tạo sách + quản lý ảnh + set primary + drag reorder | Cần validation số và preview ảnh rõ hơn |

## 3) Nhận định kỹ thuật quan trọng
- `App.jsx` đang dùng `OrderHistoryPage`/`OrderDetailPage` từ `src/pages/OrdersPage.jsx` (bản đầy đủ).  
  Trong `src/pages/WorkflowPages.jsx` có định nghĩa cùng tên nhưng hiện không được import trong router.
- Screen `CatalogPage.jsx` có code tốt nhưng route `/app/catalog` đang `Navigate` về home, chưa dùng thực tế.
- Có dấu hiệu lỗi mã hóa ký tự tiền tệ tại vài chỗ hiển thị `Ä‘` thay vì `đ` (cần kiểm tra encoding nguồn và font/render pipeline).

## 4) Đề xuất sprint kế tiếp (ưu tiên cao -> thấp)
1. Mở lại route catalog thật (`/app/catalog`) + nối filter category/search chuẩn.
2. Nâng Checkout từ MVP lên production flow (review đơn, tổng tiền, trạng thái thành công rõ ràng).
3. Hợp nhất màn profile phụ (`personal-info`, `change-password`) với profile chính để tránh trùng chức năng.
4. Chuẩn hóa validation form toàn app (schema chung), đặc biệt auth + admin.
5. Bổ sung test smoke cho route quan trọng: login, home, cart, checkout, orders.

## 5) Gợi ý KPI theo dõi tiến độ
- Tỷ lệ screen production-ready (target > 90%).
- Số screen còn MVP.
- Tỷ lệ screen có loading/error/retry chuẩn.
- Tỷ lệ screen có test tự động cơ bản.
