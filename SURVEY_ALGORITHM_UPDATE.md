# Cập Nhật: Hệ Thống Khảo Sát - Thuật Toán Gợi Ý Sản Phẩm

**Ngày**: 2026-03-10  
**Phiên bản**: 1.0

## 📋 Tóm Tắt Thay Đổi

Tôi đã thêm thông tin về thuật toán gợi ý sản phẩm vào hệ thống khảo sát PetShop. Người dùng bây giờ có thể:
- Chọn ưu tiên loại gợi ý sản phẩm
- Yêu cầu thông tin chi tiết về thuật toán
- Xem trực quan cách hệ thống hoạt động

---

## 🔧 Thay Đổi Chi Tiết

### 1. **Frontend - Biểu Mẫu Khảo Sát** 
📄 Tệp: `frontend/index.html`

**Thêm 2 trường mới:**

```html
<!-- Trường 1: Ưu tiên gợi ý sản phẩm -->
<div class="form-group">
  <label for="recommendationPreference">Ưu tiên gợi ý sản phẩm</label>
  <select id="recommendationPreference" name="recommendationPreference">
    <option value="">-- Chọn ưu tiên --</option>
    <option value="related_products">Sản phẩm liên quan ⭐⭐⭐</option>
    <option value="same_category">Cùng danh mục ⭐⭐</option>
    <option value="same_tags">Cùng thẻ/nhãn ⭐</option>
    <option value="all">Tất cả</option>
  </select>
</div>

<!-- Trường 2: Muốn biết thêm về thuật toán -->
<div class="form-group">
  <label for="algorithmInfo">
    <input type="checkbox" id="algorithmInfo" name="algorithmInfo">
    Tôi muốn biết thêm về thuật toán gợi ý sản phẩm
  </label>
</div>
```

**Tác dụng:**
- Ưu tiên có thể dùng để điều chỉnh gợi ý trong tương lai
- Checkbox giúp xác định ai muốn học thêm về hệ thống

---

### 2. **Frontend - Logic JavaScript**
📄 Tệp: `frontend/assets/js/main.js`

**Cập nhật hàm `handleSubmit()`:**

```javascript
// Thu thập dữ liệu mới
const formData = {
  // ... trường cũ ...
  recommendationPreference: document.getElementById('recommendationPreference').value,
  algorithmInfoInterest: document.getElementById('algorithmInfo').checked,
  recommendationAlgorithm: 'Hybrid-Scoring-System'  // ← Đặc tả thuật toán
};

// Theo dõi trong Google Analytics
gtag('event', 'survey_submitted', {
  'recommendation_algo': formData.recommendationAlgorithm,
  'recommendation_preference': formData.recommendationPreference
});
```

**Thêm hàm mới `showAlgorithmInfo()`:**
- Hiển thị modal thông tin chi tiết khi người dùng chọn checkbox
- Giải thích 3 tiêu chí: Sản phẩm liên quan, Danh mục, Thẻ/nhãn
- Hiển thị công thức tính điểm
- Ví dụ trực quan với biểu đồ

---

### 3. **Backend - Lưu Trữ Dữ Liệu**
📄 Tệp: `backend/routes/survey.js`

**Cập nhật lưu dữ liệu:**
- Lưu trữ `recommendationPreference` và `algorithmInfoInterest`
- Ghi log khi người dùng gửi: "Recommendation Algorithm: Hybrid-Scoring-System"

**Cập nhật thống kê (stats):**

```javascript
// Thêm vào statistics:
const stats = {
  // ... cũ ...
  recommendationAlgorithm: {},        // Theo dõi thuật toán
  recommendationPreferences: {},      // Phân bổ ưu tiên
  algorithmInfoInterest: 0            // Số người quan tâm
};
```

---

### 4. **Tài Liệu - Thuật Toán Gợi Ý**
📄 Tệp: `RECOMMENDATION_ALGORITHM.md` (TẠO MỚI)

**Nội dung:**
- ✅ Giới thiệu hệ thống Hybrid Recommendation
- ✅ Giải thích 3 tiêu chí (Related, Category, Tags)
- ✅ Trọng số cho mỗi tiêu chí (3, 2, 1 điểm)
- ✅ Công thức toán học: `Tổng Điểm = (Liên quan × 3) + (Danh mục × 2) + (Thẻ × 1)`
- ✅ Biểu đồ quy trình gợi ý
- ✅ API endpoints
- ✅ Cải tiến tương lai

**Ví dụ cụ thể:**

| Sản phẩm | Related | Category | Tag | Tổng | Xếp hạng |
|----------|---------|----------|-----|------|----------|
| Cát vệ sinh mèo | 3 | 2 | 1 | **6** | 🥇 1 |
| Chảy nước mèo | 0 | 2 | 1 | **3** | 🥈 2 |

---

### 5. **Tài Liệu - Hướng Dẫn Khảo Sát**
📄 Tệp: `SURVEY_ANALYTICS_GUIDE.md` (CẬP NHẬT)

**Thay đổi:**
- ✅ Thêm 2 trường khảo sát mới vào danh sách
- ✅ Cập nhật sự kiện Google Analytics để theo dõi algorithm
- ✅ Thêm mô tả modal thông tin thuật toán
- ✅ Cập nhật ví dụ response với dữ liệu algorithm
- ✅ Liên kết đến `RECOMMENDATION_ALGORITHM.md`

---

## 📊 Dữ Liệu Được Thu Thập

**Ví dụ khảo sát đầy đủ:**

```json
{
  "petType": "cat",
  "petAge": "1",
  "petWeight": "4",
  "petBreed": "",
  "petName": "",
  "petHealth": "normal",
  "recommendationPreference": "related_products",
  "algorithmInfoInterest": true,
  "recommendationAlgorithm": "Hybrid-Scoring-System",
  "timestamp": "2026-03-10T10:15:16.748Z",
  "id": 5,
  "submittedAt": "2026-03-10T10:15:16.759Z"
}
```

---

## 📈 Thống Kê Mới Có Sẵn

**Endpoint**: `GET /api/survey/stats`

```json
{
  "success": true,
  "statistics": {
    "total": 15,
    "petTypes": { "cat": 8, "dog": 5, "bird": 2 },
    "healthStatus": { "healthy": 12, "sensitive": 3 },
    "recommendationAlgorithm": { "Hybrid-Scoring-System": 15 },
    "recommendationPreferences": {
      "related_products": 6,
      "same_category": 4,
      "same_tags": 2,
      "all": 3
    },
    "algorithmInfoInterest": 8,
    "averageAge": "3.5",
    "averageWeight": "4.2"
  }
}
```

**Chỉ số quan trọng:**
- `algorithmInfoInterest`: 8 người (53%) muốn học về thuật toán
- `recommendationPreferences`: Người dùng ưa thích gợi ý "sản phẩm liên quan" nhất

---

## 🎯 Cách Sử Dụng

### 1. Kiểm Tra Khảo Sát
```bash
# Truy cập trang web
https://kdkts.tools.edu.vn
# → Modal khảo sát sẽ hiện lên
# → Chọn loại thú cưng, ưu tiên gợi ý, và checkbox "muốn biết thêm"
# → Nhấn "Gửi thông tin"
# → Modal thông tin thuật toán sẽ hiện lên
```

### 2. Kiểm Tra Dữ Liệu Lưu Trữ
```bash
curl https://kdkts.tools.edu.vn/api/survey/stats
```

### 3. Kiểm Tra Tất Cả Phản Hồi
```bash
curl https://kdkts.tools.edu.vn/api/survey/responses
```

---

## 🔮 Cải Tiến Tương Lai

1. **Điều chỉnh gợi ý dựa trên ưu tiên**
   - Nếu người dùng chọn "related_products", tăng trọng số lên 4
   - Nếu chọn "same_tags", giảm trọng số xuống 0.5

2. **Phân tích A/B Testing**
   - So sánh CTR của mỗi loại ưu tiên
   - Xác định cách gợi ý nào hiệu quả nhất

3. **Machine Learning**
   - Học từ dữ liệu người dùng
   - Tự động điều chỉnh trọng số

4. **Real-time Personalization**
   - Áp dụng ưu tiên ngay lập tức
   - Hiển thị sản phẩm phù hợp hơn

---

## 📝 Ghi Chú Quan Trọng

✅ **Các trường được thêm là tùy chọn** - Người dùng có thể bỏ qua không cần điền  
✅ **Dữ liệu được lưu ở 2 nơi** - LocalStorage (client) + JSON (server)  
✅ **Tương thích với Google Analytics** - Tự động theo dõi sự kiện gửi khảo sát  
✅ **Không có dữ liệu cá nhân** - Chỉ lưu thông tin thú cưng và ưu tiên  

---

## 🔗 Tài Liệu Liên Quan

- [RECOMMENDATION_ALGORITHM.md](RECOMMENDATION_ALGORITHM.md) - Chi tiết thuật toán
- [SURVEY_ANALYTICS_GUIDE.md](SURVEY_ANALYTICS_GUIDE.md) - Hướng dẫn khảo sát
- [README.md](README.md) - Tài liệu chính

---

**Hoàn tất**: ✅ 2026-03-10  
**Trạng thái**: Sẵn sàng sử dụng
