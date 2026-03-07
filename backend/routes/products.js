const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { products } = require('../database');

// Lưu sản phẩm mới vào file
const productsFile = path.join(__dirname, '../data/products.json');

// Đảm bảo folder data tồn tại
const dataDir = path.dirname(productsFile);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Load custom products từ file nếu có
let customProducts = [];
if (fs.existsSync(productsFile)) {
  try {
    customProducts = JSON.parse(fs.readFileSync(productsFile, 'utf8'));
  } catch (e) {
    customProducts = [];
  }
}

// Combine default products với custom products
function getAllProducts() {
  return [...products, ...customProducts];
}

// Get all products
router.get('/', (req, res) => {
  const allProducts = getAllProducts();
  const category = req.query.category;
  
  if (category) {
    const filtered = allProducts.filter(p => p.category === category || p.subcategory === category);
    return res.json(filtered);
  }
  
  res.json(allProducts);
});

// Get product by ID
router.get('/:id', (req, res) => {
  const allProducts = getAllProducts();
  const product = allProducts.find(p => p.id === parseInt(req.params.id));
  
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  res.json(product);
});

// Get categories
router.get('/categories/all', (req, res) => {
  const allProducts = getAllProducts();
  const categories = [...new Set(allProducts.map(p => p.category))];
  const subcategories = [...new Set(allProducts.map(p => p.subcategory))];
  
  res.json({
    categories,
    subcategories
  });
});

// Create new product
router.post('/', (req, res) => {
  try {
    const { name, description, category, subcategory, price } = req.body;

    // Validate required fields
    if (!name || !category || !subcategory || !price) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin: name, category, subcategory, price'
      });
    }

    const allProducts = getAllProducts();
    const maxId = Math.max(...allProducts.map(p => p.id), 0);
    const newId = maxId + 1;

    const newProduct = {
      id: newId,
      name,
      description: description || '',
      category,
      subcategory,
      price: parseFloat(price),
      rating: 0,
      reviews: 0,
      inStock: true,
      related: [],
      tags: []
    };

    customProducts.push(newProduct);
    
    // Lưu vào file
    fs.writeFileSync(productsFile, JSON.stringify(customProducts, null, 2));

    res.json({
      success: true,
      message: 'Tạo sản phẩm mới thành công',
      product: newProduct
    });
  } catch (error) {
    console.error('Lỗi tạo sản phẩm:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi tạo sản phẩm: ' + error.message
    });
  }
});

module.exports = router;
