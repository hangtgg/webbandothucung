# OpenRouter AI Chatbot Integration - Hướng Dẫn Cài Đặt

## ✅ Tích Hợp Hoàn Tất

OpenRouter API đã được tích hợp thành công vào chatbot của ứng dụng PetShop. Chatbot sẽ sử dụng mô hình Mistral 7B hoặc GPT-3.5-turbo từ OpenRouter để tạo ra các phản hồi tự nhiên và thông minh hơn.

## 📋 Cách Cấu Hình

### 1. Tệp `.env` đã được cập nhật

```env
OPENROUTER_API_KEY=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
OPENROUTER_MODEL=openai/gpt-3.5-turbo
```

### 2. Backend đã được cập nhật

**File: `backend/routes/chatbot.js`**
- ✅ Hàm `callOpenRouterAPI()` - Gọi API OpenRouter
- ✅ Hàm `enhanceResponseWithAI()` - Cải thiện phản hồi với AI
- ✅ Endpoint `/message` - Được chuyển thành async

**File: `backend/server.js`**
- ✅ Đã thêm `require('dotenv').config()` để tải biến môi trường

### 3. Frontend không cần thay đổi
- Chatbot frontend tự động sử dụng endpoint mới

## 🚀 Sử Dụng

### Bước 1: Khởi động Server
```bash
npm install  # Nếu bạn chưa cài npm packages
npm start    # Khởi động server trên port 3000
```

### Bước 2: Mở Ứng Dụng
- Truy cập: https://kdkts.tools.edu.vn
- Nhấp vào biểu tượng chatbot ở góc dưới phải
- Bắt đầu trò chuyện!

## 🔄 Cách Hoạt Động

### Luồng Xử Lý Thông Điệp

```
Người dùng nhập tin nhắn
        ↓
Frontend gửi đến `/api/chatbot/message`
        ↓
Backend xử lý logic hiện tại:
  - Phát hiện loại thú cưng
  - Phát hiện nhu cầu
  - Lọc các sản phẩm phù hợp
        ↓
Backend gọi OpenRouter API:
  - Gửi tin nhắn + ngữ cảnh sản phẩm
  - Nhận phản hồi AI tự nhiên
        ↓
AI cải thiện phản hồi
        ↓
Frontend hiển thị kết quả
```

### Ví Dụ Phản Hồi

**Trước (Rule-based):**
```
Tôi đã tìm được một số sản phẩm phù hợp với nhu cầu của bạn:
1. Cát vệ sinh cao cấp - 150,000 VND
2. Đồ chơi cho mèo - 89,000 VND
...
```

**Sau (AI-enhanced):**
```
Chào bạn! 🐱 Tôi vừa tìm thấy một số sản phẩm tuyệt vời chuyên dành cho mèo của bạn. 
Cát vệ sinh cao cấp (150,000 VND) rất được khuyên dùng vì nó có khả năng hấp thụ mùi tốt, 
còn các đồ chơi tương tác (89,000 VND) sẽ giúp mèo của bạn vui vẻ và hoạt động hơn. 
Bạn muốn tìm hiểu thêm về bất kỳ sản phẩm nào không?
```

## 🎯 Tính Năng

### 1. Phát Hiện Intent (Ý định)
- Lời chào
- Yêu cầu tư vấn
- Tìm kiếm sản phẩm
- Hỏi về giá cả
- v.v.

### 2. Phát Hiện Ngữ Cảnh
- Loại thú cưng: chó, mèo, hamster, thỏ, chim, cá, bò sát
- Nhu cầu: thức ăn, đồ chơi, vệ sinh, phụ kiện, v.v.
- Mức giá: dưới 200k, 200-500k, trên 500k

### 3. Lọc Sản Phẩm
- Lọc theo loại thú cưng
- Lọc theo nhu cầu
- Lọc theo mức giá
- Sắp xếp theo: giá, bán chạy, đánh giá

### 4. Gợi Ý Thông Minh
- Sản phẩm bán chạy nhất
- Hàng mới về
- Sản phẩm nổi bật
- Câu hỏi tiếp theo (follow-up questions)

## 💰 Quản Lý Tài Khoản OpenRouter

### Kiểm Tra Tín Dụng
1. Truy cập: https://openrouter.ai/settings/credits
2. Xem số dư tài khoản
3. Mua thêm tín dụng nếu cần

### Giá Cả
- Mô hình Mistral 7B: khoảng 0.01-0.05 USD/1000 tokens
- Mô hình GPT-3.5: khoảng 0.0005-0.0015 USD/1000 tokens (rẻ hơn)

### Tối Ưu Hóa Chi Phí
Để giảm chi phí:
1. Sử dụng mô hình rẻ hơn (ví dụ: GPT-3.5 thay vì GPT-4)
2. Giảm `max_tokens` trong request
3. Chỉ gọi AI khi cần thiết
4. Cache kết quả nếu có thể

## 🔧 Theo Dõi & Debug

### Kiểm Tra Logs
```bash
# Terminal chạy server
npm start
# Sẽ thấy logs: "OpenRouter API response received"
```

### Log File (tuỳ chọn)
Nếu muốn, bạn có thể thêm logging:

```javascript
// Thêm vào backend/routes/chatbot.js
const fs = require('fs');
const logDir = './logs';
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

const logToFile = (message, data) => {
  const timestamp = new Date().toISOString();
  const log = `[${timestamp}] ${message}\n${JSON.stringify(data, null, 2)}\n---\n`;
  fs.appendFileSync(`${logDir}/chatbot.log`, log);
};
```

## 📊 Thống Kê Sử Dụng

### Giám Sát Hiệu Suất
1. Đăng nhập OpenRouter: https://openrouter.ai
2. Xem: Analytics → Usage Statistics
3. Monitored: số lượng request, tokens, chi phí

## ⚠️ Tronbleshoot

### Lỗi 1: "Insufficient credits"
**Giải pháp:** Mua thêm tín dụng tại https://openrouter.ai/settings/credits

### Lỗi 2: "No endpoints found for model..."
**Giải pháp:** 
- Kiểm tra tên mô hình chính xác
- Sử dụng mô hình khác: `openai/gpt-3.5-turbo`, `meta-llama/llama-2-70b-chat`

### Lỗi 3: "Invalid API key"
**Giải pháp:** 
- Kiểm tra API key trong `.env`
- Đảm bảo API key không bị sao chép sai
- Sinh key mới nếu cần

### Lỗi 4: Timeout khi gọi API
**Giải pháp:**
- Kiểm tra kết nối Internet
- Thử giảm `max_tokens`
- Thử lại sau vài giây

## 🔄 Fallback Logic

Nếu OpenRouter API lỗi, chatbot sẽ:
1. ✅ Vẫn sử dụng logic rule-based cũ
2. ✅ Hiển thị danh sách sản phẩm
3. ✅ Hiện gợi ý câu hỏi tiếp theo
4. ↻ Retry khi lần tiếp theo người dùng gửi tin

## 📝 Các File Đã Cập Nhật

```
✅ .env                          - Thêm OPENROUTER_API_KEY & OPENROUTER_MODEL
✅ backend/server.js             - Thêm dotenv config
✅ backend/routes/chatbot.js     - Thêm OpenRouter integration functions
✅ test-openrouter.js            - Test script (có thể xóa sau)
```

## 🎓 Tham Khảo

- **OpenRouter Docs**: https://openrouter.ai/docs
- **Mistral Model**: https://mistral.ai/
- **API Reference**: https://openrouter.ai/api/v1/chat/completions

## ✨ Tiếp Theo

Bạn có thể:
1. Tùy chỉnh system prompt để chatbot hoạt động theo ý bạn
2. Thêm history/memory cho chatbot
3. Thống kê chi phí API
4. Cài đặt webhook cho thông báo
5. Tích hợp database để lưu lịch sử chat

---

**Ngày Tích Hợp:** 11 Tháng 3, 2026
**Trạng Thái:** ✅ Sẵn sàng sử dụng
**Phiên Bản:** 1.0
