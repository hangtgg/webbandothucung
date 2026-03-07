const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Tạo folder uploads nếu chưa có
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Config multer cho upload ảnh
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const productId = req.body.productId || req.params.productId;
    const ext = path.extname(file.originalname);
    cb(null, `product-${productId}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận ảnh (jpg, png, gif, webp)'));
    }
  }
});

// Map của product ID tới Unsplash URL (fallback)
const productImages = {
  1: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=500&h=500&fit=crop',
  2: 'https://images.unsplash.com/photo-1577805643773-c13f77e88d1f?w=500&h=500&fit=crop',
  3: 'https://images.unsplash.com/photo-1583511655857-d19db992cb74?w=500&h=500&fit=crop',
  4: 'https://images.unsplash.com/photo-1453227588063-bb302b62f50b?w=500&h=500&fit=crop',
  5: 'https://images.unsplash.com/photo-1584467735445-d8d2ff500a46?w=500&h=500&fit=crop',
  6: 'https://images.unsplash.com/photo-1518599504759-666bc6d9fb3a?w=500&h=500&fit=crop',
  7: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=500&h=500&fit=crop',
  8: 'https://images.unsplash.com/photo-1558950881-c6b0b8c2b62e?w=500&h=500&fit=crop',
  9: 'https://images.unsplash.com/photo-1567722715463-19f932c3e2e4?w=500&h=500&fit=crop',
  10: 'https://images.unsplash.com/photo-1601758228578-0361ad427aa2?w=500&h=500&fit=crop',
  11: 'https://images.unsplash.com/photo-1559163499-64f93f55f0ac?w=500&h=500&fit=crop',
  12: 'https://images.unsplash.com/photo-1557223556-51c4e9b60982?w=500&h=500&fit=crop',
  13: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=500&fit=crop',
  14: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=500&h=500&fit=crop',
  15: 'https://images.unsplash.com/photo-1576881842008-c833faa438cd?w=500&h=500&fit=crop',
  16: 'https://images.unsplash.com/photo-1601758228900-757d19ba7c19?w=500&h=500&fit=crop',
  17: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=500&h=500&fit=crop',
  18: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=500&h=500&fit=crop',
  19: 'https://images.unsplash.com/photo-1558950881-c6b0b8c2b62e?w=500&h=500&fit=crop',
  20: 'https://images.unsplash.com/photo-1568152950485-2f80fcf71b74?w=500&h=500&fit=crop',
  21: 'https://images.unsplash.com/photo-1577805643773-c13f77e88d1f?w=500&h=500&fit=crop',
  22: 'https://images.unsplash.com/photo-1567722715463-19f932c3e2e4?w=500&h=500&fit=crop',
  23: 'https://images.unsplash.com/photo-1557223556-51c4e9b60982?w=500&h=500&fit=crop',
  24: 'https://images.unsplash.com/photo-1559163499-64f93f55f0ac?w=500&h=500&fit=crop',
  25: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=500&fit=crop',
  26: 'https://images.unsplash.com/photo-1576881842008-c833faa438cd?w=500&h=500&fit=crop',
  27: 'https://images.unsplash.com/photo-1573865526014-f3550ef3b5c8?w=500&h=500&fit=crop',
  28: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=500&fit=crop',
  29: 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&h=500&fit=crop',
  30: 'https://images.unsplash.com/photo-1599043513771-5139c9b64b0a?w=500&h=500&fit=crop',
  31: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop',
  32: 'https://images.unsplash.com/photo-1591837954293-b54d9c98c975?w=500&h=500&fit=crop',
  33: 'https://images.unsplash.com/photo-1576081335632-37b0c4dff763?w=500&h=500&fit=crop',
  34: 'https://images.unsplash.com/photo-1584512723237-c3cc7a8f5e5e?w=500&h=500&fit=crop',
  35: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop',
  36: 'https://images.unsplash.com/photo-1549887534-7b4b0e36b1da?w=500&h=500&fit=crop',
  37: 'https://images.unsplash.com/photo-1578003588666-130d89f94c02?w=500&h=500&fit=crop',
  38: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=500&fit=crop',
  39: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop',
  40: 'https://images.unsplash.com/photo-1576081335632-37b0c4dff763?w=500&h=500&fit=crop'
};

// Tạo placeholder SVG nếu không có ảnh
function generateProductImage(productId, productName) {
  const colors = [
    '#667eea', '#764ba2', '#f093fb', '#4facfe',
    '#43e97b', '#fa709a', '#feca57', '#48dbfb',
    '#ff9ff3', '#54a0ff', '#00d2d3', '#ff6348'
  ];

  const color = colors[productId % colors.length];
  let icon = '📦';

  const name = (productName || '').toLowerCase();

  if (name.includes('mèo')) icon = '🐱';
  else if (name.includes('chó')) icon = '🐕';
  else if (name.includes('cát')) icon = '🏜️';
  else if (name.includes('bồn')) icon = '🚽';
  else if (name.includes('nhà')) icon = '🏠';
  else if (name.includes('đồ chơi')) icon = '🎾';
  else if (name.includes('nệm') || name.includes('ghế')) icon = '🛏️';
  else if (name.includes('nước')) icon = '💧';
  else if (name.includes('ăn') || name.includes('thức ăn') || name.includes('snack')) icon = '🍖';
  else if (name.includes('dây')) icon = '📍';
  else if (name.includes('gội') || name.includes('dầu') || name.includes('kéo')) icon = '✂️';
  else if (name.includes('vitamin')) icon = '💊';

  return `
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'>
      <rect fill='${color}' width='200' height='200'/>
      <circle cx='100' cy='100' r='80' fill='rgba(255,255,255,0.1)'/>
      <text x='100' y='110' font-size='72' fill='white' text-anchor='middle' dy='0.3em'>${icon}</text>
      <text x='100' y='170' font-size='14' fill='white' text-anchor='middle' opacity='0.8'>ID: ${productId}</text>
    </svg>
  `;
}

// Endpoint lấy ảnh sản phẩm
router.get('/image/:productId', (req, res) => {
  try {
    const productId = parseInt(req.params.productId, 10);
    const productName = req.query.name || `Product ${productId}`;

    // Kiểm tra ảnh local trong thư mục uploads
    const extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    for (const ext of extensions) {
      const localFile = path.join(uploadsDir, `product-${productId}${ext}`);
      if (fs.existsSync(localFile)) {
        return res.sendFile(localFile);
      }
    }

    // Nếu không có ảnh local, redirect đến Unsplash
    if (productImages[productId]) {
      return res.redirect(productImages[productId]);
    }

    // Fallback: tạo SVG placeholder
    const svg = generateProductImage(productId, productName);
    res.setHeader('Content-Type', 'image/svg+xml');
    return res.send(svg);

  } catch (error) {
    console.error('Lỗi lấy ảnh:', error.message);

    const productId = parseInt(req.params.productId, 10);
    const productName = req.query.name || `Product ${productId}`;
    const svg = generateProductImage(productId, productName);

    res.setHeader('Content-Type', 'image/svg+xml');
    return res.send(svg);
  }
});

// Endpoint upload ảnh sản phẩm
router.post('/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'Vui lòng chọn file ảnh' 
      });
    }

    const productId = req.body.productId;
    if (!productId) {
      // Xóa file vừa upload vì thiếu product ID
      fs.unlinkSync(path.join(uploadsDir, req.file.filename));
      return res.status(400).json({ 
        success: false, 
        message: 'Product ID là bắt buộc' 
      });
    }

    res.json({
      success: true,
      message: 'Upload ảnh thành công',
      filename: req.file.filename,
      productId: productId,
      url: `/api/images/image/${productId}`
    });

  } catch (error) {
    console.error('Lỗi upload ảnh:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi upload ảnh: ' + error.message 
    });
  }
});

// Endpoint xem danh sách ảnh uploaded
router.get('/list', (req, res) => {
  try {
    const files = fs.readdirSync(uploadsDir);
    const images = files.map(file => ({
      filename: file,
      productId: file.match(/product-(\d+)/)?.[1] || null,
      url: `/api/images/image/${file.match(/product-(\d+)/)?.[1] || null}`
    }));

    res.json({
      success: true,
      count: images.length,
      images
    });
  } catch (error) {
    console.error('Lỗi liệt kê ảnh:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi liệt kê ảnh' 
    });
  }
});

// Endpoint xóa ảnh uploaded
router.delete('/delete/:productId', (req, res) => {
  try {
    const productId = req.params.productId;
    const extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    
    let deleted = false;
    for (const ext of extensions) {
      const localFile = path.join(uploadsDir, `product-${productId}${ext}`);
      if (fs.existsSync(localFile)) {
        fs.unlinkSync(localFile);
        deleted = true;
        break;
      }
    }

    if (deleted) {
      return res.json({
        success: true,
        message: 'Xóa ảnh thành công'
      });
    } else {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy ảnh'
      });
    }
  } catch (error) {
    console.error('Lỗi xóa ảnh:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi xóa ảnh' 
    });
  }
});

module.exports = router;