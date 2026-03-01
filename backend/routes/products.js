const express = require('express');
const router = express.Router();
const { products } = require('../database');

// Get all products
router.get('/', (req, res) => {
  const category = req.query.category;
  
  if (category) {
    const filtered = products.filter(p => p.category === category || p.subcategory === category);
    return res.json(filtered);
  }
  
  res.json(products);
});

// Get product by ID
router.get('/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  res.json(product);
});

// Get categories
router.get('/categories/all', (req, res) => {
  const categories = [...new Set(products.map(p => p.category))];
  const subcategories = [...new Set(products.map(p => p.subcategory))];
  
  res.json({
    categories,
    subcategories
  });
});

module.exports = router;
