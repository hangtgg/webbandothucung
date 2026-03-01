# 🐾 PetShop - Cửa hàng thú cưng trực tuyến

Một ứng dụng web bán lẻ hiện đại dành cho các sản phẩm thú cưng với các tính năng nâng cao như chatbot tư vấn, gợi ý sản phẩm thông minh, tìm kiếm bằng giọng nói và hình ảnh.

## ✨ Tính năng chính

### 1. **Chatbot Tư vấn Thông minh** 🤖
- Trợ lý ảo hỗ trợ 24/7
- Hiểu các câu hỏi bằng tiếng Việt
- Cung cấp gợi ý sản phẩm dựa trên nhu cầu
- Giao diện chat thân thiện, dễ sử dụng

### 2. **Hệ thống Gợi ý Sản phẩm Thông minh** 💡
- **Gợi ý liên quan**: Khi mua bồn vệ sinh → gợi ý cát mèo
- **Gợi ý kết hợp**: Khi mua thức ăn → gợi ý máy uống nước
- Học hỏi từ hành vi mua sắm của khách hàng
- Tăng giá trị đơn hàng trung bình

### 3. **Tìm kiếm Nâng cao** 🔍
- **Tìm kiếm văn bản**: Nhanh chóng tìm sản phẩm
- **Tìm kiếm bằng giọng nói**: Sử dụng Web Speech API
- **Tìm kiếm bằng hình ảnh**: Upload ảnh để tìm sản phẩm tương tự
- **Lọc nâng cao**: Theo giá, danh mục, thẻ (tag)

### 4. **Quản lý Giỏ hàng** 🛒
- Lưu giỏ hàng vào localStorage
- Tính tổng giá
- Gợi ý sản phẩm bổ sung dựa trên giỏ hàng

### 5. **Giao diện Người dùng Hiện đại** 🎨
- Responsive design (hoạt động trên desktop, tablet, di động)
- Dark mode ready
- Hiệu ứng animation mượt mà
- Biểu tượng Font Awesome

## 📋 Cấu trúc Dự án

```
WEB THU CUNG/
├── backend/
│   ├── server.js                 # Express server chính
│   ├── database.js               # Dữ liệu sản phẩm và chatbot
│   └── routes/
│       ├── products.js           # API sản phẩm
│       ├── chatbot.js            # API chatbot
│       ├── recommendations.js    # API gợi ý
│       └── search.js             # API tìm kiếm
├── frontend/
│   ├── index.html                # HTML chính
│   └── assets/
│       ├── css/
│       │   └── style.css         # Styles
│       └── js/
│           ├── api.js            # Hàm gọi API
│           ├── ui.js             # Thành phần UI
│           ├── chatbot.js        # Logic chatbot
│           ├── search.js         # Logic tìm kiếm
│           ├── cart.js           # Quản lý giỏ hàng
│           └── main.js           # Khởi tạo ứng dụng
├── package.json                  # Phụ thuộc Node.js
├── .env                         # Biến môi trường
├── .gitignore                   # Git ignore patterns
└── README.md                    # Tài liệu này
```

## 🚀 Cài đặt và Chạy

### Yêu cầu
- Node.js v14+ 
- npm hoặc yarn
- Trình duyệt modern (Chrome, Firefox, Safari, Edge)

### Bước 1: Cài đặt Dependencies
```bash
# CD vào thư mục dự án
cd "c:\Users\hangn\OneDrive\Desktop\WEB THU CUNG"

# Cài đặt các gói cần thiết
npm install
```

### Bước 2: Khởi động Server
```bash
# Chế độ production
npm start

# Hoặc chế độ development (tự động reload)
npm run dev
```

Server sẽ chạy trên `http://localhost:3000`

### Bước 3: Mở ứng dụng
Mở trình duyệt và truy cập: **http://localhost:3000**

## 💻 Cách Sử dụng

### Duyệt sản phẩm
1. Chọn danh mục từ thanh navigation (Mèo, Chó, Phụ kiện)
2. Dùng sidebar để lọc theo giá, danh mục, và tính năng
3. Nhấp vào sản phẩm để xem chi tiết và gợi ý liên quan

### Chatbot tư vấn
1. Nhấp nút "Trợ lý" góc phải
2. Nhập câu hỏi hoặc nhu cầu (ví dụ: "tôi có mèo, cần cát vệ sinh")
3. Chatbot sẽ trả lời và gợi ý sản phẩm phù hợp

### Tìm kiếm bằng giọng nói
1. Nhấp biểu tượng 🎤 trên thanh tìm kiếm
2. Nhấp "Bắt đầu ghi âm"
3. Nói yêu cầu của bạn (ví dụ: "thức ăn cho mèo")
4. Kết quả sẽ hiển thị tự động

### Tìm kiếm bằng hình ảnh
1. Nhấp biểu tượng 🖼️ trên thanh tìm kiếm
2. Chọn hoặc kéo-thả hình ảnh sản phẩm
3. Ứng dụng sẽ tìm sản phẩm tương tự

## 🔌 API Endpoints

### Sản phẩm
- `GET /api/products` - Lấy tất cả sản phẩm
- `GET /api/products?category=cat` - Lọc theo danh mục
- `GET /api/products/:id` - Lấy chi tiết sản phẩm

### Tìm kiếm
- `GET /api/search/text?q=query` - Tìm kiếm văn bản
- `POST /api/search/voice` - Tìm kiếm giọng nói
- `POST /api/search/image` - Tìm kiếm hình ảnh
- `GET /api/search/filter` - Lọc nâng cao

### Gợi ý
- `GET /api/recommendations/:id` - Gợi ý cho sản phẩm
- `POST /api/recommendations/cart` - Gợi ý cho giỏ hàng

### Chatbot
- `POST /api/chatbot/message` - Gửi tin nhắn cho chatbot

## 🛠️ Công nghệ sử dụng

### Backend
- **Express.js** - Server web framework
- **Node.js** - Runtime JavaScript
- **CORS** - Xử lý cross-origin requests
- **Multer** - Xử lý file upload (cho tìm kiếm hình)

### Frontend
- **HTML5** - Cấu trúc trang
- **CSS3** - Styling & animations
- **Vanilla JavaScript** - Logic ứng dụng
- **Web Speech API** - Tìm kiếm giọng nói
- **localStorage** - Lưu giỏ hàng

## 📈 Cên thiế về Hệ Thống Gợi ý

### Cơ chế Matching
1. **Sản phẩm liên quan trực tiếp** (Điểm: 3)
   - Được định nghĩa trong `relatedProducts` của từng sản phẩm

2. **Cùng danh mục** (Điểm: 2)
   - Sản phẩm trong cùng danh mục (cat, dog, general)

3. **Cùng thẻ** (Điểm: 1)
   - Sản phẩm chia sẻ từ khóa hoặc tính năng

Sản phẩm được sắp xếp theo điểm và hiển thị 5 sản phẩm hàng đầu.

## 🤖 Chatbot NLP

Chatbot sử dụng đối sánh mẫu đơn giản để nhận diện ý định:
- Nhận diện **từ khóa chính** trong tin nhắn
- Trả lời với **mẫu phản hồi được xác định trước**
- Cung cấp **gợi ý sản phẩm liên quan**

Có thể nâng cấp với:
- TensorFlow.js cho NLP cao cấp hơn
- OpenAI API để chatbot tự do hơn
- Sentiment analysis để hiểu cảm xúc

## 🚀 Tối ưu hóa trong tương lai

### Ngắn hạn
- [ ] Thêm thanh toán (Stripe, VNPay)
- [ ] Đăng ký & đăng nhập người dùng
- [ ] Lịch sử mua hàng
- [ ] Reviews & ratings
- [ ] Email notifications

### Dài hạn
- [ ] Machine Learning cho gợi ý cá nhân hóa
- [ ] Tích hợp with real payment gateways
- [ ] Admin dashboard
- [ ] Inventory management
- [ ] Real-time chat support
- [ ] Mobile app (React Native)

## 📝 Ghi chú phát triển

### Mở rộng Chatbot
Để thêm phản hồi mới, chỉnh sửa `backend/database.js`:

```javascript
const chatbotResponses = {
  // Thêm đây:
  new_intent: "Phản hồi của bạn"
};
```

Và thêm logic vào `backend/routes/chatbot.js`:

```javascript
else if (message.includes('từ khóa')) {
  response = chatbotResponses.new_intent;
}
```

### Thêm sản phẩm mới
Chỉnh sửa mảng `products` trong `backend/database.js`:

```javascript
{
  id: 14,
  name: "Tên sản phẩm",
  category: "cat", // hoặc "dog", "general"
  price: 100000,
  relatedProducts: [1, 2], // ID sản phẩm liên quan
  tags: ["tag1", "tag2"]
}
```

## 🐛 Troubleshooting

### Server không chạy
```bash
# Kiểm tra port 3000 có đang được sử dụng
netstat -ano | findstr :3000

# Nếu có, kill process:
taskkill /PID <PID> /F

# Hoặc chọn port khác:
PORT=8000 npm start
```

### CORS errors trong console
- Đảm bảo backend đang chạy
- Kiểm tra URL API trong `frontend/assets/js/api.js`

### Voice search không hoạt động
- Chỉ hoạt động trên HTTPS hoặc localhost
- Cần Chrome, Edge, hoặc Firefox
- Cho phép quyền truy cập microphone

## 📞 Hỗ trợ

Nếu gặp vấn đề:
1. Kiểm tra browser console (F12)
2. Kiểm tra server logs
3. Xem phần Troubleshooting ở trên

## 📄 License

MIT License

---

Made with ❤️ for pet lovers 🐾
