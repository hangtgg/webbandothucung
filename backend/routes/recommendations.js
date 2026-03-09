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

// Get recommendations based on pet type from survey
router.post('/pet-type', (req, res) => {
  const { petType } = req.body;
  
  if (!petType) {
    return res.status(400).json({ error: 'Pet type is required' });
  }
  
  // Map loài thú cưng sang category
  const categoryMap = {
    'cat': 'cat',
    'dog': 'dog',
    'bird': 'bird',
    'fish': 'fish',
    'hamster': 'hamster',
    'rabbit': 'rabbit',
    'reptile': 'reptile',
    'other': null
  };
  
  const category = categoryMap[petType.toLowerCase()];
  
  if (!category) {
    // If pet type is not specific, show general products
    const generalProducts = products
      .filter(p => p.category === 'general' || p.subcategory === 'accessories')
      .slice(0, 5);
    
    return res.json({
      petType,
      recommendations: generalProducts,
      message: `Chúng tôi gợi ý những phụ kiện hữu ích cho thú cưng của bạn`
    });
  }
  
  // Get products for the selected pet type
  const petProducts = products.filter(p => p.category === category);
  
  if (petProducts.length === 0) {
    return res.json({
      petType,
      recommendations: [],
      message: `Xin lỗi, hiện chúng tôi chưa có sản phẩm cho loài thú cưng này`
    });
  }
  
  // Prioritize by subcategory (essentials first)
  const essentialSubcategories = ['food', 'litter', 'toilet', 'water', 'housing', 'bedding'];
  
  const prioritized = petProducts.sort((a, b) => {
    const aIndex = essentialSubcategories.indexOf(a.subcategory);
    const bIndex = essentialSubcategories.indexOf(b.subcategory);
    
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return 0;
  });
  
  const recommendations = prioritized.slice(0, 6);
  
  // Get pet display name
  const petDisplayNames = {
    'cat': 'mèo',
    'dog': 'chó',
    'bird': 'chim',
    'fish': 'cá',
    'hamster': 'hamster',
    'rabbit': 'thỏ',
    'reptile': 'bò sát'
  };
  
  const petDisplayName = petDisplayNames[category];
  
  res.json({
    petType,
    category,
    recommendations,
    message: `Dựa trên loài ${petDisplayName}, tôi gợi ý những sản phẩm cần thiết cho thú cưng của bạn`
  });
});

module.exports = router;
