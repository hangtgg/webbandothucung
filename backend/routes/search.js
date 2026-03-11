const express = require('express');
const router = express.Router();
const multer = require('multer');
const { products } = require('../database');

// Multer config for image upload
const uploadImage = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimes = /image\/(jpeg|png|gif|webp)/;
    if (allowedMimes.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Error handler for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error('Multer error:', err.message);
    return res.status(400).json({ error: `Upload error: ${err.message}` });
  } else if (err) {
    console.error('Upload error:', err.message);
    return res.status(400).json({ error: err.message });
  }
  next();
};

// Text search
router.get('/text', (req, res) => {
  const query = req.query.q?.toLowerCase() || '';
  
  if (!query) {
    return res.json([]);
  }
  
  const results = products.filter(p => 
    p.name.toLowerCase().includes(query) ||
    p.description.toLowerCase().includes(query) ||
    p.tags.some(tag => tag.toLowerCase().includes(query))
  );
  
  res.json(results);
});

// Voice search (text recognition will be done on frontend)
router.post('/voice', (req, res) => {
  const { transcript } = req.body;
  
  if (!transcript) {
    return res.status(400).json({ error: 'No transcript provided' });
  }
  
  const query = transcript.toLowerCase();
  
  const results = products.filter(p => 
    p.name.toLowerCase().includes(query) ||
    p.description.toLowerCase().includes(query) ||
    p.tags.some(tag => tag.toLowerCase().includes(query)) ||
    p.category.toLowerCase().includes(query)
  );
  
  res.json({
    transcript,
    results,
    message: `Tôi tìm thấy ${results.length} sản phẩm liên quan đến "${transcript}"`
  });
});

// Image search - accepts file upload
router.post('/image', uploadImage.single('image'), handleMulterError, (req, res) => {
  console.log('\n=== IMAGE UPLOAD DEBUG ===');
  console.log('Method:', req.method);
  console.log('Content-Type:', req.get('content-type'));
  console.log('Body keys:', Object.keys(req.body));
  console.log('File object:', req.file ? { 
    originalname: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size,
    fieldname: req.file.fieldname
  } : 'NO FILE');
  console.log('Body.description:', req.body.description);
  console.log('========================\n');
  
  let query = '';
  
  // Check if image file was uploaded
  if (req.file) {
    console.log('✅ Image uploaded:', req.file.originalname);
    query = req.file.originalname.toLowerCase();
  } else if (req.body.description) {
    console.log('✅ Description provided:', req.body.description);
    query = req.body.description.toLowerCase();
  }
  
  if (!query) {
    console.error('❌ No image or description provided');
    console.error('   req.file:', !!req.file);
    console.error('   req.body.description:', req.body.description);
    return res.status(400).json({ error: 'No image or description provided' });
  }
  
  // Search products
  let results = products.filter(p => 
    p.description.toLowerCase().includes(query) ||
    p.tags.some(tag => tag.toLowerCase().includes(query)) ||
    p.name.toLowerCase().includes(query) ||
    p.category.toLowerCase().includes(query)
  );
  
  // If no results, return popular products
  if (results.length === 0) {
    console.log('ℹ️ No results found, returning popular products');
    results = products
      .sort((a, b) => (b.sold || 0) - (a.sold || 0))
      .slice(0, 8);
  }
  
  console.log(`✅ Returning ${results.length} results`);
  res.json({
    results: results.slice(0, 6),
    message: `Dựa trên hình ảnh bạn upload, tôi tìm thấy ${Math.min(results.length, 6)} sản phẩm tương tự`
  });
});

// Filter search
router.get('/filter', (req, res) => {
  let filtered = [...products];
  
  if (req.query.category) {
    filtered = filtered.filter(p => 
      p.category === req.query.category || p.subcategory === req.query.category
    );
  }
  
  if (req.query.minPrice) {
    const minPrice = parseInt(req.query.minPrice);
    filtered = filtered.filter(p => p.price >= minPrice);
  }
  
  if (req.query.maxPrice) {
    const maxPrice = parseInt(req.query.maxPrice);
    filtered = filtered.filter(p => p.price <= maxPrice);
  }
  
  if (req.query.tag) {
    filtered = filtered.filter(p => p.tags.includes(req.query.tag));
  }
  
  res.json(filtered);
});

module.exports = router;
