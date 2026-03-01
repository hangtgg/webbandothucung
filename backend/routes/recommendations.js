const express = require('express');
const router = express.Router();
const { products } = require('../database');

// Get recommendations based on product ID
router.get('/:productId', (req, res) => {
  const productId = parseInt(req.params.productId);
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  // Get related products
  const relatedProducts = products.filter(p => 
    product.relatedProducts.includes(p.id)
  );
  
  // Get products from same category
  const categoryProducts = products.filter(p => 
    p.category === product.category && p.id !== productId
  );
  
  // Get products by tags
  const tagProducts = products.filter(p => 
    p.tags.some(tag => product.tags.includes(tag)) && p.id !== productId
  );
  
  // Combine and deduplicate
  const recommendationMap = new Map();
  
  relatedProducts.forEach(p => {
    if (!recommendationMap.has(p.id)) {
      recommendationMap.set(p.id, { ...p, score: 3 });
    }
  });
  
  categoryProducts.forEach(p => {
    if (recommendationMap.has(p.id)) {
      recommendationMap.get(p.id).score += 2;
    } else {
      recommendationMap.set(p.id, { ...p, score: 2 });
    }
  });
  
  tagProducts.forEach(p => {
    if (recommendationMap.has(p.id)) {
      recommendationMap.get(p.id).score += 1;
    } else {
      recommendationMap.set(p.id, { ...p, score: 1 });
    }
  });
  
  const recommendations = Array.from(recommendationMap.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(({ score, ...p }) => p);
  
  res.json({
    product,
    recommendations
  });
});

// Get recommendations based on multiple products (cart)
router.post('/cart', (req, res) => {
  const { productIds } = req.body;
  
  if (!Array.isArray(productIds) || productIds.length === 0) {
    return res.status(400).json({ error: 'Invalid input' });
  }
  
  const cart = products.filter(p => productIds.includes(p.id));
  
  if (cart.length === 0) {
    return res.status(404).json({ error: 'Products not found' });
  }
  
  const recommendationMap = new Map();
  
  // For each product in cart, add its related products
  cart.forEach(cartItem => {
    cartItem.relatedProducts.forEach(relatedId => {
      if (!productIds.includes(relatedId)) {
        if (recommendationMap.has(relatedId)) {
          recommendationMap.get(relatedId).score += 2;
        } else {
          const relProduct = products.find(p => p.id === relatedId);
          if (relProduct) {
            recommendationMap.set(relatedId, { ...relProduct, score: 2 });
          }
        }
      }
    });
  });
  
  const recommendations = Array.from(recommendationMap.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(({ score, ...p }) => p);
  
  res.json({
    cart,
    recommendations,
    message: `Dựa trên các sản phẩm bạn chọn, tôi gợi ý thêm những sản phẩm phù hợp:`
  });
});

module.exports = router;
