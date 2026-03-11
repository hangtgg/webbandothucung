# ✅ OpenRouter API Key Cập Nhật

## 🔄 Cải Động (Mới Nhất)

| Thông Số | Giá Trị |
|---------|--------|
| **API Key** | `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` |
| **Model** | `liquid/lfm-2-24b-a2b` (Siêu rẻ: $0.00000003/token) |
| **Trạng Thái** | ✅ Cấu hình hoàn tất |

## 📋 Danh Sách Model Free/Rẻ Nhất

### Model Siêu Rẻ (< $0.000001 per token)
```
✨ liquid/lfm-2-24b-a2b              $0.00000003/$0.00000012
✨ bytedance-seed/seed-2.0-lite      $0.00000025/$0.000002
✨ qwen/qwen3.5-9b                   $0.0000001/$0.00000015
✨ qwen/qwen3.5-flash-02-23          $0.0000001/$0.0000004
✨ bytedance-seed/seed-2.0-mini      $0.0000001/$0.0000004
✨ google/gemini-3.1-flash-lite      $0.00000025/$0.0000015
```

### Model Phổ Biến (Rẻ)
```
✨ openai/gpt-3.5-turbo              $0.0005/$0.0015 (trong 100k tokens)
✨ qwen/qwen3.5-27b                  $0.000000195/$0.00000156
✨ anthropic/claude-sonnet-4.6       $0.000003/$0.000015
```

## 🚀 Khởi Động Server

```bash
npm install   # (Nếu cần)
npm start
```

Server chạy tại: http://localhost:3000

## 💳 Kích Hoạt API

### Bước 1: Thêm Credits
1. Truy cập: https://openrouter.ai/settings
2. Đăng nhập bằng tài khoản liên kết API key
3. Vào mục "Credits" → "Add Credits"
4. Thêm phương thức thanh toán (thẻ tín dụng / Stripe)
5. Mua credits (khuyến nghị: $5-10 để test)

### Bước 2: Xác Minh
```bash
node test-openrouter.js
```

Khi thành công, bạn sẽ thấy:
```
✅ API Response received successfully!
📝 Sample Response: [Phản hồi từ model]
```

## ⚠️ Tình Trạng Hiện Tại

### ❌ Lỗi: "Insufficient credits"
**Nguyên nhân:** Tài khoản không có credits
**Giải pháp:** 
1. Mua credits tại https://openrouter.ai/settings/credits
2. Hoặc dùng tài khoản OpenRouter khác có credits

### ✅ Fallback Mode Hoạt Động
- Chatbot vẫn hoạt động bằng logic rule-based
- Không cần AI enhancement 
- Sẽ tự động kích hoạt khi có credits

## 💰 Ước Tính Chi Phí

**Với model `liquid/lfm-2-24b-a2b` (siêu rẻ):**
```
1 tin nhắn (300 tokens) = $0.00000003 × 300 = $0.000009
1000 tin nhắn = ~$0.009 (1 cent)
```

**Với model `openai/gpt-3.5-turbo` (trung bình):**
```
1 tin nhắn (300 tokens) = $0.0005 × 300 = $0.15
1000 tin nhắn = ~$150
```

## 🔄 Chuyển Đổi Model

Để đổi model, chỉ cần sửa `.env`:

```env
# Dùng model siêu rẻ
OPENROUTER_MODEL=liquid/lfm-2-24b-a2b

# Hoặc dùng GPT-3.5 (mất tiền hơn)
OPENROUTER_MODEL=openai/gpt-3.5-turbo

# Hoặc dùng model khác từ danh sách
```

Rồi restart server:
```bash
npm start
```

## 📞 Hỗ Trợ

- **OpenRouter Docs**: https://openrouter.ai/docs
- **Danh sách Model**: https://openrouter.ai/models
- **Kiểm tra Status**: https://status.openrouter.ai/

## ✅ Các File Đã Cập Nhật

```
✅ .env                - Thêm API key mới + model free
✅ backend/routes/chatbot.js - Fallback mode ready
✅ backend/server.js   - dotenv configured
✅ test-openrouter.js  - Test script
✅ check-models.js     - Danh sách model truy cập được
```

---

**Cập Nhật:** 11 Tháng 3, 2026  
**Trạng Thái:** ⏳ Chờ Credits / ✅ Sẵn sàng  
**Tiếp Theo:** Mua credits → Test → Go Live
