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
  if (!req.file) {
    console.error('❌ No image file provided');
    return res.status(400).json({ error: 'No image file provided' });
  }
  
  console.log('✅ Image uploaded:', req.file.originalname);
  
  // Extract keywords from filename (remove extension, split by - or _)
  const filename = req.file.originalname.toLowerCase();
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, ''); // Remove extension
  const keywords = nameWithoutExt.split(/[-_\s]+/).filter(k => k.length > 0); // Split by -, _, space
  
  console.log('🔍 Filename:', filename);
  console.log('🔍 Keywords:', keywords);
  
  // Search products - each keyword must match something
  let results = [];
  
  if (keywords.length > 0) {
    results = products.filter(p => {
      const name = p.name.toLowerCase();
      const desc = p.description.toLowerCase();
      const tags = (p.tags || []).map(t => t.toLowerCase());
      const category = p.category.toLowerCase();
      
      // Product matches if ANY keyword matches ANY field
      return keywords.some(keyword => 
        name.includes(keyword) ||
        desc.includes(keyword) ||
        tags.some(tag => tag.includes(keyword)) ||
        category.includes(keyword)
      );
    });
    
    console.log(`📦 Found ${results.length} products matching keywords:`, keywords);
  }
  
  // If no results, return popular products
  if (results.length === 0) {
    console.log('ℹ️ No matches found, returning popular products');
    results = products
      .sort((a, b) => (b.sold || 0) - (a.sold || 0))
      .slice(0, 8);
  }
  
  console.log(`✅ Returning ${results.length} results`);
  res.json({
    results: results.slice(0, 6),
    keywords: keywords,
    message: `Tìm kiếm theo từ khóa: ${keywords.join(', ')} - tìm thấy ${Math.min(results.length, 6)} sản phẩm`
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
