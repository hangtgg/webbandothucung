const express = require('express');
const router = express.Router();
const { products } = require('../database');

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

// Image search (simulated - uses description/tags matching)
router.post('/image', (req, res) => {
  const { description } = req.body;
  
  if (!description) {
    return res.status(400).json({ error: 'No description provided' });
  }
  
  const query = description.toLowerCase();
  
  // Simulate image search by finding products matching the description
  const results = products.filter(p => 
    p.description.toLowerCase().includes(query) ||
    p.tags.some(tag => tag.toLowerCase().includes(query)) ||
    p.name.toLowerCase().includes(query)
  );
  
  res.json({
    description,
    results,
    message: `Dựa trên hình ảnh bạn upload, tôi tìm thấy ${results.length} sản phẩm tương tự`
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
