# Hướng dẫn truy cập & Đề xuất thiết kế Admin Portal – KeBook Frontend

Tài liệu này hướng dẫn cách truy cập trang quản trị (Admin Dashboard) hiện tại và đề xuất kiến trúc thiết kế mở rộng hoàn toàn đồng bộ với các API Admin ở phía Backend.

---

## 1. Cách truy cập Admin Dashboard hiện tại

### Bước 1: Tài khoản Admin
Bạn cần đăng nhập bằng một tài khoản có thuộc tính `is_superuser = true` hoặc vai trò `ADMIN` ở backend. 
- *Mẹo thử nghiệm:* Nếu chạy ở môi trường testing (`TESTING=1` ở backend), bạn có thể gọi API `POST /api/v1/test/make-admin` để nâng cấp tài khoản của mình thành Admin nhanh chóng.

### Bước 2: Truy cập giao diện
1. Sau khi đăng nhập thành công bằng tài khoản Admin, điều hướng tới mục **Profile** (`/app/profile`).
2. Do tài khoản của bạn là Admin, hệ thống sẽ tự động hiển thị thêm phần **Security note** & **Admin links** trong thanh menu bên phải:
   - **Admin Dashboard**: Điều hướng tới `/app/admin/dashboard`
   - **Admin Orders**: Điều hướng tới `/app/admin/orders`
   - **Add Book**: Điều hướng tới `/app/admin/books/new`
3. Bạn cũng có thể truy cập trực tiếp bằng cách gõ URL: `http://localhost:5173/app/admin/dashboard` (hoặc cổng dịch vụ frontend tương ứng). Định tuyến này đã được bảo vệ thông qua component kiểm tra vai trò `<RequireRole role="ADMIN">`.

---

## 2. Đồng bộ hóa khớp với Route Backend

Hiện tại backend cung cấp 10+ nhóm API dành riêng cho Admin. Dưới đây là phương án đồng bộ chi tiết cho từng nhóm:

### 2.1 Quản lý Sách & Chi tiết Sách (`/books` & `/book-details`)
- **Backend Route:** 
  - `POST /books/` & `PATCH /books/{book_id}`
  - `POST /book-details/` & `PATCH /book-details/{detail_id}`
- **Hiện trạng Frontend:** Đã có trang `AdminAddBookPage` để tạo sách mới và quản lý nhiều hình ảnh thông qua kéo thả (drag-drop) đồng bộ với API ảnh.
- **Đề xuất nâng cấp:** Tích hợp biểu mẫu nhập thông tin chi tiết sách (`book_details` bao gồm: nhà xuất bản, số trang, kích thước, định dạng bìa...) ngay trong luồng tạo sách mới hoặc thêm tab "Sách chi tiết".

### 2.2 Quản lý Đơn hàng & Yêu cầu hoàn trả (`/orders` & `/return-requests`)
- **Backend Route:**
  - `PATCH /orders/{order_id}/status`
  - `PATCH /return-requests/{req_id}/process`
- **Hiện trạng Frontend:** Đã có `AdminOrdersPage` hỗ trợ cập nhật trạng thái đơn (CONFIRMED, DELIVERED, CANCELLED...).
- **Đề xuất nâng cấp:** Xây dựng thêm tab **Yêu cầu trả hàng (Return Requests)** ngay bên cạnh bảng quản lý đơn hàng. Admin có thể xem lý do trả hàng, hình ảnh minh chứng và bấm nút `Duyệt hoàn tiền` (gọi `PATCH /return-requests/{req_id}/process` với trạng thái `APPROVED` hoặc `REJECTED`).

### 2.3 Khuyến mãi & Voucher (`/promotions`)
- **Backend Route:** `GET /promotions/`, `POST /promotions/`, `PATCH /promotions/{promo_id}`
- **Đề xuất nâng cấp:** Thiết kế màn hình **Mã khuyến mãi (Promotions)**:
  - Hiển thị danh sách tất cả các mã voucher hiện có trong hệ thống kèm theo số lượng sử dụng và ngày hết hạn.
  - Tạo biểu mẫu thêm mới voucher (Mã code, phần trăm giảm giá, giá trị giảm tối đa, điều kiện đơn tối thiểu).
  - Bật/Tắt (Kích hoạt/Vô hiệu hóa) voucher trực tiếp từ bảng quản trị.

### 2.4 Hỗ trợ & Chăm sóc khách hàng (`/support-requests`)
- **Backend Route:** `GET /support-requests/` & `PATCH /support-requests/{req_id}`
- **Đề xuất nâng cấp:** Thêm tab **Hỗ trợ khách hàng (Support Center)**:
  - Liệt kê các ticket hỗ trợ chưa được giải quyết của người dùng.
  - Cho phép Admin phản hồi hoặc cập nhật trạng thái ticket sang `RESOLVED` để gửi thông báo cho khách hàng.

---

## 3. Bản thiết kế đề xuất cho giao diện Admin Dashboard Trung tâm (Tabs-based)

Để tối ưu hóa trải nghiệm sử dụng của Admin, thay vì chia nhỏ thành nhiều trang đơn lẻ, chúng ta nên thiết kế một **Admin Portal** sử dụng cấu trúc Tab linh hoạt:

```
+-------------------------------------------------------------------------+
|  KEBOOK ADMIN PORTAL                                                    |
+-------------------------------------------------------------------------+
|  [Tab 1: Dashboard]  [Tab 2: Orders]  [Tab 3: Books]  [Tab 4: Vouchers] |
+-------------------------------------------------------------------------+
|                                                                         |
|  * Khung hiển thị nội dung tùy theo Tab được chọn                       |
|                                                                         |
|  - Tab 1: Đồ thị thống kê, Metric Cards, Top-selling (Đã hoàn thiện)    |
|  - Tab 2: Danh sách đơn hàng + Trả hàng (Đơn giản hóa xử lý trạng thái) |
|  - Tab 3: Thêm sách, sửa giá, cập nhật kho, upload ảnh drag-drop        |
|  - Tab 4: Quản lý mã giảm giá hệ thống                                  |
|                                                                         |
+-------------------------------------------------------------------------+
```

Việc gộp chung các luồng xử lý này giúp Admin giám sát mọi chỉ số và vận hành cửa hàng sách trực tuyến một cách mượt mà nhất.
