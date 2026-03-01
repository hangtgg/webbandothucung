const express = require('express');
const router = express.Router();

// Generate SVG image based on product category
function generateProductImage(productId, productName) {
  const colors = [
    '#667eea', '#764ba2', '#f093fb', '#4facfe',
    '#43e97b', '#fa709a', '#feca57', '#48dbfb',
    '#ff9ff3', '#54a0ff', '#00d2d3', '#ff6348'
  ];

  const icons = {
    'litter': '💩',
    'toilet': '🚽',
    'housing': '🏠',
    'toys': '🎾',
    'bedding': '🛏️',
    'water': '💧',
    'food': '🍖',
    'leash': '📍',
    'grooming': '✂️',
    'supplement': '💊',
    'accessories': '🎀'
  };

  const color = colors[productId % colors.length];
  const categoryKey = productName.toLowerCase().split(' ')[0];
  let icon = '📦';

  // Try to determine icon from description
  if (productName.includes('mèo')) icon = '🐱';
  if (productName.includes('chó')) icon = '🐕';
  if (productName.includes('cát')) icon = '🏜️';
  if (productName.includes('bồn')) icon = '🚽';
  if (productName.includes('nhà')) icon = '🏠';
  if (productName.includes('đồ chơi')) icon = '🎾';
  if (productName.includes('nệm') || productName.includes('ghế')) icon = '🛏️';
  if (productName.includes('nước')) icon = '💧';
  if (productName.includes('ăn') || productName.includes('thức ăn') || productName.includes('snack')) icon = '🍖';
  if (productName.includes('dây')) icon = '📍';
  if (productName.includes('gội') || productName.includes('dầu') || productName.includes('kéo')) icon = '✂️';
  if (productName.includes('vitamin')) icon = '💊';
  if (productName.includes('bóng')) icon = '⚽';
  if (productName.includes('khay')) icon = '🍽️';
  if (productName.includes('chuông')) icon = '🔔';
  if (productName.includes('balo')) icon = '🎒';
  if (productName.includes('quần áo')) icon = '👕';
  if (productName.includes('xe')) icon = '🛒';
  if (productName.includes('rương')) icon = '📦';
  if (productName.includes('đèn')) icon = '💡';
  if (productName.includes('quạt')) icon = '🌀';
  if (productName.includes('sưởi')) icon = '🔥';
  if (productName.includes('chuốt')) icon = '🖌️';
  if (productName.includes('chuỗi')) icon = '⛓️';
  if (productName.includes('ngói')) icon = '📐';

  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'>
      <defs>
        <linearGradient id='grad${productId}' x1='0%' y1='0%' x2='100%' y2='100%'>
          <stop offset='0%' style='stop-color:${color};stop-opacity:1' />
          <stop offset='100%' style='stop-color:${adjustColor(color, -20)};stop-opacity:1' />
        </linearGradient>
      </defs>
      <rect fill='url(#grad${productId})' width='200' height='200'/>
      <circle cx='100' cy='100' r='80' fill='rgba(255,255,255,0.1)'/>
      <text x='100' y='110' font-size='72' fill='white' text-anchor='middle' dy='0.3em'>${icon}</text>
      <text x='100' y='170' font-size='14' fill='white' text-anchor='middle' opacity='0.8'>ID: ${productId}</text>
    </svg>
  `;

  return svg;
}

function adjustColor(color, percent) {
  const num = parseInt(color.replace('#',''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return '#' + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 +
    (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255))
    .toString(16).slice(1);
}

// Endpoint to get product image
router.get('/image/:productId', (req, res) => {
  const productId = parseInt(req.params.productId);
  const productName = req.query.name || `Product ${productId}`;

  const svg = generateProductImage(productId, productName);

  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(svg);
});

module.exports = router;
