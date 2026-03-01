const express = require('express');
const router = express.Router();
const { products, chatbotResponses } = require('../database');

// Simple NLP chatbot
router.post('/message', (req, res) => {
  const message = req.body.message.toLowerCase();
  let response = '';
  
  // Greeting
  if (message.includes('chào') || message.includes('hello') || message.includes('hi')) {
    response = chatbotResponses.greetings[0];
  }
  // Help request
  else if (message.includes('giúp') || message.includes('help')) {
    response = chatbotResponses.help[0];
  }
  // Cat litter recommendation
  else if (message.includes('cát') || message.includes('bồn vệ') || message.includes('toilet')) {
    response = chatbotResponses.recommendation_litter + 
               "\n\nSản phẩm liên quan: " + 
               products.filter(p => p.id === 1 || p.id === 2).map(p => p.name).join(", ");
  }
  // Food recommendation
  else if (message.includes('thức ăn') || message.includes('food') || message.includes('ăn')) {
    response = chatbotResponses.recommendation_food + 
               "\n\nSản phẩm liên quan: " + 
               products.filter(p => p.id === 6 || p.id === 7 || p.id === 9).map(p => p.name).join(", ");
  }
  // Water fountain
  else if (message.includes('nước') || message.includes('uống')) {
    response = "Máy uống nước tự động là lựa chọn tuyệt vời! Nó giúp thú cưng của bạn luôn có nước sạch sẽ. " +
               "Khi mua thức ăn hay bồn vệ sinh, tôi cũng gợi ý sản phẩm này.";
  }
  // Cat products
  else if (message.includes('mèo') || message.includes('cat')) {
    const catProducts = products.filter(p => p.category === 'cat');
    response = "Sản phẩm cho mèo của chúng tôi:\n";
    catProducts.slice(0, 5).forEach(p => {
      response += `- ${p.name}: ${p.price.toLocaleString()} VND\n`;
    });
  }
  // Dog products
  else if (message.includes('chó') || message.includes('dog')) {
    const dogProducts = products.filter(p => p.category === 'dog');
    response = "Sản phẩm cho chó của chúng tôi:\n";
    dogProducts.slice(0, 5).forEach(p => {
      response += `- ${p.name}: ${p.price.toLocaleString()} VND\n`;
    });
  }
  else {
    response = "Xin lỗi, tôi chưa hiểu rõ. Bạn có thể yêu cầu:\n- Tìm sản phẩm cho mèo/chó\n- Nhận gợi ý sản phẩm liên quan\n- Tìm kiếm bằng hình ảnh";
  }
  
  res.json({
    message: response,
    suggestions: generateSuggestions(message)
  });
});

function generateSuggestions(message) {
  const suggestions = [];
  
  if (message.includes('cat') || message.includes('mèo')) {
    suggestions.push('Xem tất cả sản phẩm mèo');
  }
  if (message.includes('dog') || message.includes('chó')) {
    suggestions.push('Xem tất cả sản phẩm chó');
  }
  if (message.includes('food') || message.includes('ăn')) {
    suggestions.push('Xem tất cả thức ăn');
  }
  
  if (suggestions.length === 0) {
    suggestions.push('Tìm kiếm bằng hình ảnh', 'Tìm kiếm bằng giọng nói');
  }
  
  return suggestions;
}

module.exports = router;
