# Báo cáo Nghiên cứu & Thiết kế Kiến trúc Hệ thống KeBook: Phân hệ Frontend (React + Vite)
## Tiểu luận chuyên ngành Phát triển Hệ thống Web nâng cao

---

## TÓM TẮT ĐỀ TÀI

Phân hệ **KeBook Frontend** là lớp trình diễn (Presentation Layer) thuộc hệ thống thương mại điện tử chuyên biệt dành cho thị trường sách trực tuyến. Dự án được triển khai trên nền tảng **React** kết hợp công cụ đóng gói siêu tốc **Vite**, áp dụng mô hình thiết kế giao diện hướng thành phần (**Component-Driven Design**), quản lý trạng thái luồng dữ liệu thông qua **Context API** phối hợp cùng thư viện tạo kiểu thành phần động **Styled Components**.

Báo cáo kỹ thuật này phân tích sâu sắc các giải pháp kiến trúc giao diện người dùng, cơ chế điều phối và tối ưu tài nguyên mạng (SWR caching), luồng xử lý xác thực bảo mật và phân quyền trên Client, cấu trúc mã nguồn tối ưu hóa hiệu năng tải trang, cùng các quy chuẩn thiết kế UI/UX thực tiễn cho dự án.

---

## 1. GIỚI THIỆU TỔNG QUAN

### 1.1 Đặt vấn đề
Trong thiết kế ứng dụng Web hiện đại, trải nghiệm người dùng (UX) đóng vai trò quyết định sự thành bại của sản phẩm. Các ứng dụng đa trang (Multi-Page Applications) truyền thống gây trễ lớn do liên tục phải nạp lại toàn bộ trang từ Server. Đề tài nghiên cứu ứng dụng mô hình Ứng dụng một trang (**Single Page Application - SPA**) sử dụng thư viện React nhằm tối đa hóa tốc độ phản hồi, mang lại trải nghiệm mượt mà tương đương phần mềm máy tính (Desktop App).

### 1.2 Phạm vi dự án
Phân hệ **KeBook Frontend** đảm nhiệm toàn bộ giao tiếp trực quan với người dùng cuối và quản trị viên hệ thống. Ứng dụng tích hợp đầy đủ hệ thống hợp đồng dữ liệu chuẩn hóa của API v1 Backend, đảm bảo tính nhất quán từ giao dịch mua hàng, quy đổi điểm thưởng, đến phân hệ quản trị sách đa phương tiện.

---

## 2. KIẾN TRÚC GIAO DIỆN & TỔ CHỨC DỮ LIỆU

### 2.1 Mô hình Thiết kế Giao diện hướng Thành phần (Component-Driven Design)
Giao diện của KeBook được phân rã thành các nguyên tử độc lập (atomic elements) có khả năng tái sử dụng cao. Toàn bộ mã nguồn giao diện tuân thủ mô hình phân cấp:

```
┌────────────────────────────────────────────────────────┐
│ 1. Global App Context & Theme Provider                 │
│    - Quản lý trạng thái chung: Auth, Cart, Theme       │
└──────────────────────────┬─────────────────────────────┘
                           │  ▲
                           ▼  │  (Global State / Style Rules)
┌────────────────────────────────────────────────────────┐
│ 2. Page Screen Container (src/pages/)                  │
│    - Tiếp nhận URL Routing, tập hợp các component con   │
│    - Tách biệt logic kiểu dáng thông qua *.styles.jsx  │
└──────────────────────────┬─────────────────────────────┘
                           │  ▲
                           ▼  │  (Props / Callbacks)
┌────────────────────────────────────────────────────────┐
│ 3. Specialized Business Component (src/components/)     │
│    - Component phức tạp: Cart, OrderTracker, AdminPanel │
└──────────────────────────┬─────────────────────────────┘
                           │  ▲
                           ▼  │
┌────────────────────────────────────────────────────────┐
│ 4. Reusable Shared UI Atoms (src/components/common/)   │
│    - Button, Input, Modal, Slider, ProductCard         │
└────────────────────────────────────────────────────────┘
```

- **Lớp Toàn cục (Global Layer):** Áp dụng `ThemeProvider` của Styled Components để thiết lập hệ màu sắc đồng bộ, kết hợp cùng `AuthContext` và `CartContext` để chia sẻ trạng thái người dùng xuyên suốt toàn bộ ứng dụng.
- **Lớp Trang (Page Layer):** Đóng vai trò là các Container quản trị từng URL Router cụ thể. Mỗi trang chịu trách nhiệm điều phối việc nạp dữ liệu từ API và truyền xuống các component giao diện tương ứng.
- **Lớp Giao diện chia sẻ (Shared UI Atoms):** Các thành phần giao diện cơ bản như `ProductCard.jsx`, các hộp thoại modal, bộ lọc tìm kiếm được chuẩn hóa cao độ nhằm đảm bảo tính đồng nhất về mặt UX hình ảnh trên mọi độ phân giải màn hình.

### 2.2 Công cụ Tạo kiểu Động (Styled Components Rationale)
KeBook lựa chọn giải pháp **CSS-in-JS** thông qua thư viện `styled-components` vì các ưu thế vượt trội:
- **Tự động định phạm vi (Scoped Styles):** Loại bỏ hoàn toàn lỗi trùng lặp tên class CSS (class name collision) thường gặp trong các dự án lớn bằng cách sinh ra các hash ngẫu nhiên cho tên class CSS.
- **Kiểu dáng động theo Props (Dynamic Styling):** Dễ dàng thay đổi giao diện dựa trên trạng thái logic của React (ví dụ: đổi màu nút bấm tùy theo trạng thái hết hàng/còn hàng của sản phẩm mà không cần tạo thêm tệp tin CSS phụ).

### 2.3 Quản lý Trạng thái & Cơ chế Đồng bộ hóa SWR (State & Data Fetching)
- **State Management:** Kết hợp linh hoạt giữa trạng thái cục bộ (`useState`) cho các tương tác độc lập và Context API cho các dữ liệu cần đồng bộ toàn cục (trạng thái đăng nhập của người dùng, số lượng vật phẩm trong giỏ hàng).
- **SWR (Stale-While-Revalidate):** Ứng dụng cơ chế nạp dữ liệu thông minh giúp nâng cao hiệu năng giao diện:
  - Hệ thống hiển thị dữ liệu cũ (stale) từ bộ đệm (cache) lập tức ngay khi người dùng truy cập lại trang, đồng thời chạy ngầm tác vụ xác thực lại dữ liệu mới từ Server (revalidate) và cập nhật giao diện một cách êm ái mà không gây chớp nháy màn hình.
  - Tự động hủy yêu cầu trùng lặp (deduplication) và tự động tải lại dữ liệu khi mất mạng hoặc khi người dùng quay lại tab ứng dụng.

---

## 3. PHÂN HỆ NGHIỆP VỤ & LUỒNG TƯƠNG TÁC CHI TIẾT

Frontend KeBook bao quát toàn bộ các luồng nghiệp vụ khép kín của một sàn thương mại điện tử chuyên nghiệp:

### 3.1 Luồng Xác thực & Bảo vệ Tuyến đường (Auth & Route Guards)
- **Tự động khôi phục phiên:** Khi khởi chạy ứng dụng, hệ thống tự động kiểm tra sự tồn tại của JWT Token trong bộ nhớ trình duyệt để khôi phục phiên đăng nhập của người dùng.
- **Tuyến đường bảo vệ (Route Guards):** Triển khai các Component đóng gói định tuyến (ví dụ: `ProtectedRoute` và `AdminRoute`) để kiểm tra quyền hạn trước khi nạp trang. Khách hàng thường cố gắng truy cập trang quản trị Admin sẽ ngay lập tức bị chuyển hướng về trang chủ hoặc trang đăng nhập kèm thông điệp cảnh báo an toàn.

### 3.2 Luồng Đặt hàng & Tích hợp Khuyến mãi nâng cao
- **Trình đặt hàng an toàn (Checkout Flow):** Hỗ trợ chọn lựa thông tin giao nhận linh hoạt từ Sổ địa chỉ (`Address Book Modal`), ghi chú giao hàng đặc thù, và tích hợp bộ công cụ kiểm chuẩn mã ưu đãi trước khi gửi payload hoàn chỉnh đến endpoint `/orders/checkout`.
- **Hệ thống Điểm tích lũy & Đổi quà (Loyalty Rewards UI):** Giao diện chuyên biệt trực quan hóa lịch sử tích điểm của khách hàng, tích hợp thanh tiến trình thông minh và nút nhấn "Đổi thưởng" lập tức, tự động kích hoạt cập nhật lại trạng thái điểm và voucher của người dùng ngay sau khi giao dịch quy đổi hoàn tất thành công.

### 3.3 Phân hệ Quản trị Admin đa chức năng
- **Quản lý sách đa hình ảnh (Book Image Manager):** Giao diện hỗ trợ quản trị viên tải lên nhiều hình ảnh của một cuốn sách cùng lúc thông qua dịch vụ đám mây Cloudinary, cho phép sắp xếp thứ tự hiển thị và xóa ảnh trực tiếp với phản hồi thời gian thực.
- **Bảng điều khiển trạng thái đơn hàng:** Bộ lọc thông minh cho phép Admin cập nhật nhanh tiến trình vận đơn (Chờ xử lý, Đang giao, Đã giao, Đã hủy) một cách trực quan, tự động kích hoạt gửi thông báo (Notifications) cho khách hàng liên quan.

---

## 4. CẤU TRÚC THƯ MỤC DỰ ÁN (PROJECT LAYOUT)

Kiến trúc mã nguồn Frontend được tổ chức một cách khoa học:

```
src/
├── api/             # API clients, axios interceptors, response normalization
├── auth/            # Auth store, AuthContext, route guards (Protected/Admin)
├── components/      # Reusable presentation & business layout components
│   ├── cart/        # Giỏ hàng & tóm tắt đơn hàng
│   ├── common/      # Reusable atoms: Modals, Buttons, Inputs, Loaders
│   ├── layout/      # Header, Footer, Navbar (User/Admin)
│   └── product/     # ProductCard, SimilarBooksSlider
├── hooks/           # Custom hooks dùng chung (useSWR wrappers)
├── pages/           # Page screen containers (Routing endpoints)
│   ├── admin/       # Dashboard, sách, quản lý đơn hàng
│   ├── auth/        # Đăng ký, Đăng nhập, OTP, Quên mật khẩu
│   └── user/        # Profile, Đơn hàng cá nhân, Điểm tích lũy, Trợ giúp
├── utils/           # Helper formatters (tiền tệ, ngày tháng, Unicode)
├── App.jsx          # Cấu hình routing tổng và liên kết các Context Providers
└── main.jsx         # Điểm khởi đầu của ứng dụng (DOM mount)
```

---

## 5. HƯỚNG DẪN CÀI ĐẶT & VẬN HÀNH

### 5.1 Cài đặt môi trường Node.js và các gói thư viện
Yêu cầu hệ thống: Cài đặt Node.js phiên bản LTS mới nhất (v18+ hoặc v20+ khuyến nghị).

```bash
cd Reactjs-FrontEnd-KeBook
npm install
```

### 5.2 Cấu hình cổng kết nối API thông qua biến môi trường
Tạo tệp `.env` tại thư mục gốc của phân hệ Frontend từ tệp mẫu `.env.example`:
```env
# URL gốc trỏ tới phân hệ KeBook Backend API v1
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

### 5.3 Khởi động Máy chủ Phát triển siêu tốc (Vite Dev Server)
```bash
npm run dev
```
Giao diện phát triển sẽ khả dụng tại địa chỉ: `http://localhost:5173`. Hệ thống tự động tích hợp cơ chế nạp lại mô-đun nóng (**Hot Module Replacement - HMR**) giúp phản ánh lập tức mọi thay đổi mã nguồn lên giao diện trình duyệt mà không làm mất trạng thái của ứng dụng.

### 5.4 Biên dịch tối ưu cho môi trường Production
```bash
npm run build
```
Mã nguồn sau biên dịch được thu nhỏ dung lượng tối đa (minified), chia nhỏ gói tài nguyên (code splitting) và lưu trữ trong thư mục `dist/`, sẵn sàng triển khai lên các CDN hiện đại như Vercel, Netlify hoặc Net Server.

---

## 6. ĐẢM BẢO CHẤT LƯỢNG MÃ NGUỒN (QA & LINTING)

### 6.1 Kiểm chuẩn cú pháp (ESLint)
Ứng dụng tích hợp bộ quy tắc chuẩn hóa mã nguồn nghiêm ngặt, đảm bảo các lập trình viên đều tuân thủ viết code nhất quán, tránh lỗi rò rỉ bộ nhớ hoặc gọi sai thứ tự hooks:
```bash
npm run lint
```

### 6.2 Công cụ rà soát lỗi ký tự đặc biệt (Unicode Scan Tool)
Do giao diện hỗ trợ ngôn ngữ tiếng Việt hoàn chỉnh, hệ thống tích hợp sẵn một script quét ký tự đặc biệt bị lỗi (mojibake) hoặc các chuỗi ký tự lỗi phát sinh trong quá trình biên tập:
```bash
# Quét tìm kiếm các ký tự lỗi Unicode tiếng Việt thường gặp trong thư mục src
rg -n "Ã|Â|Ä|Æ||Ch\\?|\\?ang|\\?\\? giao|\\?\\? h|T\\?t|Y\\?u|Ho\\?n|Gi\\?|S\\?ch|\\?u ti|ng\\?\\?|Gi\\?m" src
```

---

## 7. KẾT LUẬN

Giải pháp **KeBook Frontend (React + Vite)** là sự tổng hòa của các công nghệ giao diện Web tiên tiến. Việc tách biệt lớp trình diễn, tối ưu bộ đệm dữ liệu thông qua cơ chế SWR và bảo vệ phân quyền nghiêm ngặt không chỉ đem lại khả năng phản hồi mượt mà cho khách hàng mà còn thiết lập một quy chuẩn kỹ thuật chuyên nghiệp, dễ dàng mở rộng và nâng cấp hệ thống trong tương lai.

---
*Tài liệu thuộc Chương trình Nghiên cứu & Phát triển Hệ thống Web - Dự án KeBook.*
