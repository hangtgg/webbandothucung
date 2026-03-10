# Thuật Toán Gợi Ý Sản Phẩm - PetShop

## 📊 Giới Thiệu

Hệ thống gợi ý sản phẩm của PetShop sử dụng **Hybrid Recommendation System** (Hệ thống gợi ý kết hợp) để cung cấp những sản phẩm phù hợp nhất cho khách hàng.

## 🔧 Cấu Trúc Thuật Toán

Thuật toán sử dụng phương pháp **Scoring-based Hybrid** kết hợp ba nguồn dữ liệu:

### 1. **Related Products (Sản phẩm liên quan)**
- **Trọng số**: 3 điểm
- **Mô tả**: Dựa trên các mối quan hệ được định nghĩa sẵn giữa các sản phẩm
- **Ví dụ**: 
  - Hộp cát mèo → Cát vệ sinh mèo
  - Thức ăn cho chó → Bát ăn cho chó

### 2. **Category Matching (Khớp danh mục)**
- **Trọng số**: 2 điểm
- **Mô tả**: Gợi ý các sản phẩm trong cùng danh mục
- **Ví dụ**:
  - Xem sản phẩm mèo → Gợi ý các sản phẩm mèo khác

### 3. **Tag Matching (Khớp thẻ)**
- **Trọng số**: 1 điểm
- **Mô tả**: Dựa trên các thẻ/nhãn chung giữa sản phẩm
- **Ví dụ**:
  - Sản phẩm có thẻ "premium" → Gợi ý sản phẩm premium khác

## 🧮 Công Thức Tính Điểm

```
Tổng Điểm = (Điểm Related × 3) + (Điểm Category × 2) + (Điểm Tag × 1)

Kết quả cuối cùng: 
- Sắp xếp giảm dần theo điểm
- Loại bỏ trùng lặp
- Trả về top 5 sản phẩm hàng đầu
```

## 📋 Ví Dụ Toán Học

Giả sử người dùng xem sản phẩm: **Hộp cát mèo**

| Sản phẩm | Related | Category | Tag | Tổng | Xếp hạng |
|----------|---------|----------|-----|------|----------|
| Cát vệ sinh mèo | 3 | 2 | 1 | **6** | 🥇 1 |
| Chảy nước mèo | 0 | 2 | 1 | **3** | 🥈 2 |
| Đồ chơi mèo | 0 | 2 | 0 | **2** | 🥉 3 |

## 🛒 Gợi Ý Từ Giỏ Hàng

Khi người dùng có nhiều sản phẩm trong giỏ hàng, hệ thống:

1. **Lặp lại** cho từng sản phẩm trong giỏ
2. **Cộng gộp** điểm từ tất cả sản phẩm
3. **Loại bỏ** các sản phẩm đã có trong giỏ
4. **Trả về** top 5 sản phẩm có điểm cao nhất

### Ví dụ:
```
Giỏ hàng: [Hộp cát mèo, Mèo cỏ catnip]

Sản phẩm       | Từ Hộp Cát | Từ Catnip | Tổng | Xếp hạng
Cát vệ sinh    | 2          | 0        | 2    | 🥇
Đồ chơi mèo    | 1          | 2        | 3    | 🥇
```

## 🎯 Tối Ưu Hóa

### Độ chính xác
- Loại bỏ trùng lặp bằng `Map` để đảm bảo không có sản phẩm nào lặp lại
- Cập nhật và cộng gộp điểm cho sản phẩm xuất hiện nhiều lần

### Hiệu suất
- Sử dụng `Map` thay vì mảng để tra cứu nhanh: O(1)
- Không cần sort toàn bộ danh sách - chỉ slice top 5

### Linh hoạt
- Dễ dàng điều chỉnh trọng số (hiện tại: 3, 2, 1)
- Có thể thêm tiêu chí mới: độ phổ biến, rating, giá cả, v.v.

## 🔄 Quy Trình Gợi Ý

```
┌─────────────────────────────────────────┐
│ Người dùng xem sản phẩm / Vào trang     │
└──────────┬──────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│ Lấy ID sản phẩm từ URL / Request        │
└──────────┬──────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│ Tìm kiếm Related Products (Trọng số: 3) │
└──────────┬──────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│ Tìm kiếm Category Products (Trọng số: 2)│
└──────────┬──────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│ Tìm kiếm Tag Products (Trọng số: 1)     │
└──────────┬──────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│ Kết hợp & Loại bỏ trùng lặp             │
│ Cộng gộp điểm + Sắp xếp                 │
└──────────┬──────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│ Trả về Top 5 Sản Phẩm Gợi Ý            │
└─────────────────────────────────────────┘
```

## 📈 API Endpoints

### Gợi ý cho một sản phẩm
```
GET /api/recommendations/:productId
```

**Response:**
```json
{
  "product": {
    "id": 1,
    "name": "Hộp cát mèo",
    "price": 150000
  },
  "recommendations": [
    {
      "id": 2,
      "name": "Cát vệ sinh mèo",
      "price": 80000
    },
    {
      "id": 3,
      "name": "Chảy nước mèo",
      "price": 250000
    }
  ]
}
```

### Gợi ý cho giỏ hàng
```
POST /api/recommendations/cart
Content-Type: application/json

{
  "productIds": [1, 5, 10]
}
```

## 🚀 Cải Tiến Tương Lai

1. **Collaborative Filtering** - Học từ hành vi người dùng
2. **Content-Based Filtering** - Phân tích nội dung sản phẩm
3. **Deep Learning** - Neural networks cho dự đoán chính xác hơn
4. **A/B Testing** - So sánh hiệu quả các thuật toán khác nhau
5. **Real-time Personalization** - Điều chỉnh dựa trên hành vi real-time

## 📊 Thống Kê Hiệu Suất

- **Thời gian phản ứng**: < 100ms
- **Độ chính xác**: Phụ thuộc vào dữ liệu liên quan được định nghĩa
- **Tỷ lệ CTR (Click-Through Rate)**: Được theo dõi qua Analytics

## 🔐 Bảo Mật & Quyền Riêng Tư

- Không lưu trữ thông tin người dùng cá nhân
- Chỉ dùng công khai: danh mục, thẻ, ID sản phẩm
- Tương thích GDPR

---

**Cập nhật lần cuối**: 2026-03-10
**Phiên bản**: 1.0
