# Hướng Dẫn Nhanh - Chức Năng Checkout & Thanh Toán

## 🛒 Tính Năng Mới

### Quy trình Thanh Toán
1. Người dùng thêm sản phẩm vào giỏ hàng
2. Bấm vào nút **"Thanh toán"** trong giỏ hàng
3. Một form bootstrap hiện ra với:
   - **Thông tin giao hàng** (Họ tên, SĐT, Địa chỉ, Email)
   - **Chọn hình thức thanh toán** (COD hoặc chuyển khoản)
   - **Tóm tắt đơn hàng** (hiển thị bên trái)

### Các Từng Bước

#### Bước 1: Điền Thông Tin Giao Hàng
- **Họ và tên** (bắt buộc) - Nhập đầy đủ họ tên
- **Số điện thoại** (bắt buộc) - Phải ≥ 10 chữ số
- **Địa chỉ giao hàng** (bắt buộc) - Nhập địa chỉ nhà/công ty
- **Email** (tùy chọn) - Để nhận thông tin đơn hàng

#### Bước 2: Chọn Hình Thức Thanh Toán
**Hình thức 1: Nhận khi nhận hàng (COD)**
- Thanh toán tiền mặt khi nhận hàng từ shipper
- Không cần chuyển khoản trước
- Mặc định được chọn

**Hình thức 2: Chuyển khoản ngân hàng**
- Chuyển tiền vào tài khoản PetShop
- Thông tin hiển thị:
  - Ngân hàng: Vietcombank
  - Số tài khoản: 1234567890
  - Chủ tài khoản: PetShop Store

#### Bước 3: Đặt Hàng
- Bấm nút **"Đặt hàng"** để xác nhận đơn
- Hệ thống sẽ xử lý đơn hàng
- Hiển thị mã đơn hàng thành công (dạng: ORD16804892341234)

## 📊 Dữ Liệu & Lưu Trữ

### Dữ Liệu Lưu Trên Server
- **Thư mục:** `backend/data/orders.json`
- **Tự động tạo** nếu không tồn tại
- **Chứa:** Tất cả đơn hàng được đặt

### Dữ Liệu Lưu Trên Trình Duyệt
- **localStorage:** Sao lưu đơn hàng trên máy khách

## 📈 Google Analytics

Hệ thống tự động theo dõi:
- ✅ Khi người dùng mở form thanh toán
- ✅ Khi chọn hình thức thanh toán
- ✅ Khi đặt hàng thành công
- ✅ Lỗi trong quá trình thanh toán

**Cách xem:** Google Analytics Dashboard → Events → purchase/checkout_started/etc

## 🔧 Cách Chạy

### 1. Khởi Động Server
```bash
npm start
```

Server chạy tại: http://localhost:3000

### 2. Mở Website
```
http://localhost:3000
```

### 3. Test Checkout
1. Thêm sản phẩm vào giỏ hàng
2. Bấm nút giỏ hàng
3. Bấm **"Thanh toán"**
4. Điền thông tin và chọn thanh toán
5. Bấm **"Đặt hàng"**
6. Xác nhận thành công với mã đơn hàng

## 🔍 Kiểm Tra Dữ Liệu Đơn Hàng

### Xem Tất Cả Đơn Hàng
```bash
curl http://localhost:3000/api/orders
```

### Xem Thống Kê
```bash
curl http://localhost:3000/api/orders/stats
```

### Xem Chi Tiết Một Đơn
```bash
curl http://localhost:3000/api/orders/ORD16804892341234
```

## 📁 Các File Liên Quan

### Frontend
- **[frontend/index.html](frontend/index.html)** - Giao diện form
- **[frontend/assets/css/style.css](frontend/assets/css/style.css)** - CSS cho checkout
- **[frontend/assets/js/checkout.js](frontend/assets/js/checkout.js)** - Logic xử lý

### Backend  
- **[backend/routes/orders.js](backend/routes/orders.js)** - API endpoints
- **[backend/server.js](backend/server.js)** - Cấu hình server
- **backend/data/orders.json** - Dữ liệu đơn hàng (auto-created)

### Tài Liệu
- **[CHECKOUT_GUIDE.md](CHECKOUT_GUIDE.md)** - Hướng dẫn chi tiết
- **[SURVEY_ANALYTICS_GUIDE.md](SURVEY_ANALYTICS_GUIDE.md)** - Hướng dẫn khảo sát

## ✅ Kiểm Tra Hoạt Động

- [x] Nút "Thanh toán" hiển thị trong giỏ hàng
- [x] Form checkout mở khi bấm thanh toán
- [x] Hiển thị danh sách sản phẩm + tổng tiền
- [x] Validate thông tin giao hàng
- [x] Chọn hình thức thanh toán (COD/Ngân hàng)
- [x] Thông tin ngân hàng hiển thị khi chọn chuyển khoản
- [x] Lưu đơn hàng lên server
- [x] Hiển thị mã đơn hàng thành công
- [x] Xóa giỏ hàng sau đặt hàng
- [x] Theo dõi qua Google Analytics

## 🚨 Lưu Ý

1. **Bắt buộc**: Phải điền Họ tên, SĐT, Địa chỉ
2. **SĐT**: Phải ≥ 10 chữ số
3. **Email**: Tùy chọn nhưng nên điền
4. **Thanh toán**: Chọn một trong hai hình thức
5. **Server**: Phải chạy để lưu đơn hàng

## 💡 Mẹo

- Để trắng form, bấm **"Hủy bỏ"** hoặc click bên ngoài modal
- Mã đơn hàng dùng để theo dõi - lưu lại để tiện tra cứu
- Thông tin giao hàng được lưu trong `backend/data/orders.json`

---

**Bắt đầu ngay:** Thêm sản phẩm → Bấm "Thanh toán" → Điền thông tin → Xác nhận! ✨
