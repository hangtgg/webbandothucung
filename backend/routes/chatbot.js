const express = require('express');
const router = express.Router();
const { products } = require('../database');

// ============================================================================
// PHẦN 1: UTILITY FUNCTIONS - XỬ LÝ TEXT
// ============================================================================

function normalizeText(text = '') {
  return text.toLowerCase().trim();
}

function removeVietnameseTones(str = '') {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

function normalizeForSearch(text = '') {
  return removeVietnameseTones(normalizeText(text));
}

function containsAny(text, keywords = []) {
  return keywords.some(keyword => text.includes(keyword));
}

// ============================================================================
// PHẦN 2: DETECTION FUNCTIONS - NHẬN DIỆN INTENT
// ============================================================================

function detectPetType(message) {
  const msg = normalizeForSearch(message);

  const petMap = [
    { type: 'dog', keywords: ['cho', 'dog', 'cun'] },
    { type: 'cat', keywords: ['meo', 'cat', 'meok'] },
    { type: 'bird', keywords: ['chim', 'bird', 'chuot bay'] },
    { type: 'fish', keywords: ['ca', 'fish', 'tay ca'] },
    { type: 'hamster', keywords: ['hamster', 'chuot', 'chuot tuong lau'] },
    { type: 'rabbit', keywords: ['tho', 'rabbit', 'tho trang'] },
    { type: 'reptile', keywords: ['bo sat', 'reptile', 'ran', 'thao nhan'] }
  ];

  const found = petMap.find(item => containsAny(msg, item.keywords));
  return found ? found.type : null;
}

function detectNeeds(message) {
  const msg = normalizeForSearch(message);
  const needs = [];

  const needMap = [
    { key: 'food', keywords: ['thuc an', 'food', 'hat', 'pate', 'an vat', 'snack'] },
    { key: 'toy', keywords: ['do choi', 'toy', 'bong', 'can gam', 'choi'] },
    { key: 'hygiene', keywords: ['ve sinh', 'cat', 'toilet', 'khay ve sinh', 'bon ve sinh'] },
    { key: 'accessory', keywords: ['phu kien', 'vong co', 'day dat', 'quan ao', 'balo'] },
    { key: 'water', keywords: ['nuoc', 'uong', 'may uong', 'binh nuoc', 'may', 'fountain'] },
    { key: 'bath', keywords: ['tam', 'bon tam', 'sua tam', 'goi'] },
    { key: 'bedding', keywords: ['nem', 'giuong', 'ghe nam', 'nap'] },
    { key: 'grooming', keywords: ['chuot', 'dai', 'ke', 'cat toc', 'groom', 'duong da'] }
  ];

  for (const item of needMap) {
    if (containsAny(msg, item.keywords)) {
      needs.push(item.key);
    }
  }

  return needs;
}

function detectIntent(message) {
  const msg = normalizeForSearch(message);

  if (containsAny(msg, ['chao', 'hello', 'hi', 'xin chao', 'hey', 'yo'])) return 'greeting';
  if (containsAny(msg, ['cam on', 'thanks', 'thank u', 'cam on nhieu'])) return 'thanks';
  if (containsAny(msg, ['giup', 'help', 'huong dan', 'lam sao', 'cach nao', 'co the nao'])) return 'help';
  if (containsAny(msg, ['goi y', 'tu van', 'de xuat', 'recommend', 'nen mua', 'nen chon'])) return 'consult';
  if (containsAny(msg, ['ban chay', 'best seller', 'noi bat', 'top', 'hung dung', 'pho bien'])) return 'best_seller';
  if (containsAny(msg, ['hang moi', 'san pham moi', 'moi ve', 'just arrived'])) return 'new_arrivals';
  if (containsAny(msg, ['khuyen mai', 'giam gia', 'sale', 'khuyen', 'gia si', 're nhat'])) return 'promotion';
  if (containsAny(msg, ['bao nhieu', 'gia', 'chi phi', 'tien', 'cost', 'price'])) return 'price_inquiry';

  return 'product_search';
}

function detectPriceRange(message) {
  const msg = normalizeForSearch(message);

  const underMatch = msg.match(/duoi\s*(\d+)\s*(k|nghin|trieu|ngan)?/);
  if (underMatch) {
    return {
      min: 0,
      max: convertPriceToNumber(underMatch[1], underMatch[2])
    };
  }

  const overMatch = msg.match(/tren\s*(\d+)\s*(k|nghin|trieu|ngan)?/);
  if (overMatch) {
    return {
      min: convertPriceToNumber(overMatch[1], overMatch[2]),
      max: Infinity
    };
  }

  const rangeMatch = msg.match(/tu\s*(\d+)\s*(k|nghin|trieu|ngan)?\s*(den|-)\s*(\d+)\s*(k|nghin|trieu|ngan)?/);
  if (rangeMatch) {
    return {
      min: convertPriceToNumber(rangeMatch[1], rangeMatch[2]),
      max: convertPriceToNumber(rangeMatch[4], rangeMatch[5])
    };
  }

  return null;
}

function convertPriceToNumber(numberStr, unit) {
  const n = Number(numberStr);
  if (!unit) return n;

  const u = unit.toLowerCase();
  if (u === 'k' || u === 'nghin' || u === 'ngan') return n * 1000;
  if (u === 'trieu') return n * 1000000;

  return n;
}

function detectSortPreference(message) {
  const msg = normalizeForSearch(message);

  if (containsAny(msg, ['re nhat', 'gia re', 'gia thap', 'gia si'])) return 'price_asc';
  if (containsAny(msg, ['dat nhat', 'cao cap', 'gia cao', 'premium'])) return 'price_desc';
  if (containsAny(msg, ['ban chay', 'pho bien', 'noi tieng', 'hung dung'])) return 'sold_desc';
  if (containsAny(msg, ['danh gia cao', 'tot nhat', 'tot', 'chat luong', 'review'])) return 'rating_desc';

  return null;
}

// ============================================================================
// PHẦN 3: PRODUCT FILTERING & SCORING
// ============================================================================

function productToSearchText(product) {
  return normalizeForSearch([
    product.name,
    product.description,
    product.category,
    ...(product.tags || [])
  ].join(' '));
}

function scoreProduct(product, context) {
  let score = 0;
  const searchText = productToSearchText(product);

  if (context.petType && product.category === context.petType) {
    score += 30;
  }

  for (const need of context.needs) {
    if ((product.tags || []).includes(need)) score += 20;
    if (searchText.includes(need)) score += 5;
  }

  const words = normalizeForSearch(context.message)
    .split(/\s+/)
    .filter(w => w.length > 1);

  for (const word of words) {
    if (searchText.includes(word)) score += 2;
  }

  if (product.isFeatured) score += 8;
  score += Math.min(product.sold || 0, 500) / 25;
  score += (product.rating || 0) * 2;

  return score;
}

function filterProducts(allProducts, context) {
  let result = [...allProducts];

  if (context.petType) {
    result = result.filter(p => normalizeText(p.category) === context.petType);
  }

  if (context.needs.length > 0) {
    result = result.filter(product => {
      const tags = product.tags || [];
      const text = productToSearchText(product);
      return context.needs.some(need => tags.includes(need) || text.includes(need));
    });
  }

  if (context.priceRange) {
    result = result.filter(product => {
      const price = Number(product.price) || 0;
      return price >= context.priceRange.min && price <= context.priceRange.max;
    });
  }

  result = result.map(product => ({
    ...product,
    _score: scoreProduct(product, context)
  }));

  if (context.sortPreference === 'price_asc') {
    result.sort((a, b) => a.price - b.price);
  } else if (context.sortPreference === 'price_desc') {
    result.sort((a, b) => b.price - a.price);
  } else if (context.sortPreference === 'sold_desc') {
    result.sort((a, b) => (b.sold || 0) - (a.sold || 0));
  } else if (context.sortPreference === 'rating_desc') {
    result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else {
    result.sort((a, b) => b._score - a._score);
  }

  return result;
}

// ============================================================================
// PHẦN 4: FEATURED PRODUCTS
// ============================================================================

function getFeaturedProducts() {
  return [...products]
    .sort((a, b) => {
      const scoreA = (a.isFeatured ? 20 : 0) + (a.sold || 0) + (a.rating || 0) * 10;
      const scoreB = (b.isFeatured ? 20 : 0) + (b.sold || 0) + (b.rating || 0) * 10;
      return scoreB - scoreA;
    })
    .slice(0, 6);
}

function getBestSellerProducts(petType = null) {
  let result = [...products];
  if (petType) {
    result = result.filter(p => p.category === petType);
  }
  return result.sort((a, b) => (b.sold || 0) - (a.sold || 0)).slice(0, 6);
}

function getNewArrivalProducts(petType = null) {
  let result = [...products];
  if (petType) {
    result = result.filter(p => p.category === petType);
  }
  return result.sort((a, b) => (b.id || 0) - (a.id || 0)).slice(0, 6);
}

// ============================================================================
// PHẦN 5: SMART FOLLOW-UP QUESTIONS
// ============================================================================

function buildSmartFollowUpQuestions(context, matchedProducts = []) {
  const questions = [];
  
  // Nếu chưa xác định loại thú cưng
  if (!context.petType) {
    questions.push('Bạn đang tìm cho thú cưng nào? (chó, mèo, hamster, v.v.)');
    questions.push('Loại thú cưng của bạn là gì?');
  } else {
    const petNames = {
      cat: 'mèo',
      dog: 'chó',
      hamster: 'hamster',
      rabbit: 'thỏ',
      bird: 'chim',
      fish: 'cá',
      reptile: 'bò sát'
    };
    
    // Nếu đã biết loại nhưng chưa biết nhu cầu
    if (context.needs.length === 0) {
      questions.push(`Bạn muốn tìm thức ăn, đồ chơi, hay phụ kiện cho ${petNames[context.petType]}?`);
      questions.push(`Cần gì để chăm sóc ${petNames[context.petType]} hôm nay?`);
    } else {
      // Có nhu cầu rồi, gợi ý thêm
      if (!context.priceRange) {
        questions.push('Bạn có ngân sách nhất định không? (VD: dưới 200k, 200-500k)');
        questions.push('Mức giá bạn muốn là khoảng bao nhiêu?');
      }
      
      if (matchedProducts.length > 0) {
        questions.push('Bạn muốn xem sản phẩm bán chạy hay giá rẻ hơn không?');
        questions.push('Sản phẩm này có phù hợp không? Cần tìm loại khác?');
      }
    }
  }

  // Nếu chưa có sản phẩm phù hợp
  if (matchedProducts.length === 0) {
    questions.push('Bạn có thể mô tả chi tiết hơn nhu cầu của mình không?');
    questions.push('Hãy thử tìm kiếm với từ khóa khác xem sao');
  }

  return [...new Set(questions)].slice(0, 4);
}

// ============================================================================
// PHẦN 6: SMART SUGGESTIONS
// ============================================================================

function buildSmartSuggestions(context, matchedProducts = []) {
  const suggestions = [];

  if (!context.petType) {
    suggestions.push('Sản phẩm cho chó');
    suggestions.push('Sản phẩm cho mèo');
    suggestions.push('Phụ kiện chung');
  }

  if (context.petType === 'cat' && context.needs.length === 0) {
    suggestions.push('Cát vệ sinh cao cấp');
    suggestions.push('Đồ chơi cho mèo');
    suggestions.push('Giường cho mèo');
  }

  if (context.petType === 'dog' && context.needs.length === 0) {
    suggestions.push('Thức ăn chó bán chạy');
    suggestions.push('Dây dắt & cổ chó');
    suggestions.push('Giường cho chó');
  }

  if (context.needs.length === 0 && context.petType) {
    suggestions.push('Sản phẩm bán chạy nhất');
    suggestions.push('Sản phẩm mới về');
  }

  if (!context.priceRange) {
    suggestions.push('Sản phẩm dưới 200k');
    suggestions.push('Sản phẩm cao cấp (trên 500k)');
  }

  if (matchedProducts.length > 0) {
    suggestions.push('Xem sản phẩm tương tự');
    suggestions.push('Tìm giá rẻ hơn');
  }

  return [...new Set(suggestions)].slice(0, 6);
}

// ============================================================================
// PHẦN 7: FORMAT UTILITIES
// ============================================================================

function formatCurrency(number) {
  return Number(number || 0).toLocaleString('vi-VN') + ' VND';
}

function formatProductSummary(products) {
  return products.slice(0, 5)
    .map((p, index) => `${index + 1}. ${p.name} - ${formatCurrency(p.price)}`)
    .join('\n');
}

// ============================================================================
// PHẦN 8: MAIN RESPONSE BUILDER
// ============================================================================

function buildResponse(message) {
  const context = {
    message,
    intent: detectIntent(message),
    petType: detectPetType(message),
    needs: detectNeeds(message),
    priceRange: detectPriceRange(message),
    sortPreference: detectSortPreference(message)
  };

  let title = 'Tư vấn sản phẩm';
  let responseMessage = '';
  let recommendedProducts = [];

  switch (context.intent) {
    case 'greeting':
      title = 'Xin chào! 👋';
      responseMessage =
        'Chào bạn! Tôi là trợ lý mua sắm thú cưng của bạn.\n\n' +
        'Tôi có thể giúp bạn:\n' +
        '• Tìm sản phẩm cho loại thú cưng của bạn\n' +
        '• Gợi ý theo nhu cầu (thức ăn, đồ chơi, phụ kiện...)\n' +
        '• Lọc theo mức giá\n' +
        '• Tìm sản phẩm bán chạy hoặc mới về\n\n' +
        'Bạn muốn tìm gì hôm nay?';
      break;

    case 'thanks':
      title = 'Phản hồi';
      responseMessage = 'Cảm ơn bạn đã sử dụng dịch vụ tư vấn! 😊\n\nBạn muốn mình giúp tìm gì thêm không?';
      break;

    case 'help':
      title = 'Hướng dẫn sử dụng';
      responseMessage =
        'Bạn có thể hỏi tôi theo những cách sau:\n\n' +
        '📌 Theo loại thú cưng:\n' +
        '• Sản phẩm cho chó / mèo\n' +
        '• Thức ăn cho hamster\n\n' +
        '📌 Theo nhu cầu:\n' +
        '• Cát vệ sinh cao cấp\n' +
        '• Đồ chơi cho mèo\n\n' +
        '📌 Theo giá:\n' +
        '• Sản phẩm dưới 200k\n' +
        '• Từ 200k đến 500k\n\n' +
        '📌 Theo xu hướng:\n' +
        '• Sản phẩm bán chạy\n' +
        '• Hàng mới về';
      break;

    case 'best_seller':
      title = 'Sản phẩm bán chạy nhất ⭐';
      recommendedProducts = getBestSellerProducts(context.petType);
      responseMessage =
        'Đây là những sản phẩm bán chạy nhất mà khách hàng yêu thích:\n\n' +
        formatProductSummary(recommendedProducts);
      break;

    case 'new_arrivals':
      title = 'Hàng mới về 🆕';
      recommendedProducts = getNewArrivalProducts(context.petType);
      responseMessage =
        'Những sản phẩm mới nhất đã về:\n\n' +
        formatProductSummary(recommendedProducts);
      break;

    case 'price_inquiry':
      title = 'Thông tin giá';
      recommendedProducts = filterProducts(products, context).slice(0, 8);
      if (recommendedProducts.length > 0) {
        responseMessage =
          'Các sản phẩm trong tầm giá bạn tìm:\n\n' +
          formatProductSummary(recommendedProducts);
      } else {
        responseMessage = 'Không tìm thấy sản phẩm phù hợp trong tầm giá này. Bạn có thể thử:\n• Tăng ngân sách\n• Tìm loại sản phẩm khác';
      }
      break;

    case 'consult':
    case 'product_search':
    default:
      recommendedProducts = filterProducts(products, context).slice(0, 8);

      if (recommendedProducts.length > 0) {
        responseMessage =
          'Tôi đã tìm được một số sản phẩm phù hợp với nhu cầu của bạn:\n\n' +
          formatProductSummary(recommendedProducts);
      } else {
        recommendedProducts = getFeaturedProducts();
        responseMessage =
          'Tôi chưa tìm thấy sản phẩm khớp hoàn toàn. Đây là một số sản phẩm nổi bật để bạn tham khảo:\n\n' +
          formatProductSummary(recommendedProducts);
      }
      break;
  }

  return {
    success: true,
    title,
    message: responseMessage,
    suggestions: buildSmartSuggestions(context, recommendedProducts),
    followUpQuestions: buildSmartFollowUpQuestions(context, recommendedProducts),
    products: recommendedProducts.map(product => ({
      id: product.id,
      name: product.name,
      price: product.price,
      oldPrice: product.oldPrice || null,
      category: product.category,
      description: product.description || '',
      image: product.image || '',
      stock: product.stock || 0,
      sold: product.sold || 0,
      rating: product.rating || 0,
      tags: product.tags || []
    })),
    detected: {
      intent: context.intent,
      petType: context.petType,
      needs: context.needs,
      priceRange: context.priceRange,
      sortPreference: context.sortPreference
    }
  };
}

// ============================================================================
// PHẦN 9: API ENDPOINT
// ============================================================================

router.post('/message', (req, res) => {
  try {
    const message = req.body.message || '';
    
    if (!message.trim()) {
      return res.status(400).json({
        success: false,
        title: 'Thông báo',
        message: 'Vui lòng nhập câu hỏi hoặc nhu cầu của bạn',
        suggestions: [],
        followUpQuestions: [],
        products: []
      });
    }

    const result = buildResponse(message);
    res.json(result);
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({
      success: false,
      title: 'Lỗi hệ thống',
      message: 'Đã có lỗi xảy ra khi xử lý yêu cầu. Vui lòng thử lại sau.',
      suggestions: ['Sản phẩm cho mèo', 'Thức ăn cho chó', 'Sản phẩm bán chạy'],
      followUpQuestions: ['Bạn muốn tìm sản phẩm cho loại thú cưng nào?'],
      products: []
    });
  }
});

// ============================================================================
// PHẦN 10: OPENAI INTEGRATION (OPTIONAL)
// ============================================================================
// 
// Để tích hợp OpenAI API (tùy chọn):
// 1. Cài npm: npm install openai
// 2. Thêm vào .env: OPENAI_API_KEY=sk-...
// 3. Uncomment đoạn code dưới đây và gọi hàm enhanceWithAI() 
//
// const { Configuration, OpenAIApi } = require("openai");
// 
// async function enhanceWithAI(message, products) {
//   if (!process.env.OPENAI_API_KEY) return null;
//   
//   try {
//     const configuration = new Configuration({
//       apiKey: process.env.OPENAI_API_KEY,
//     });
//     const openai = new OpenAIApi(configuration);
//     
//     const response = await openai.createChatCompletion({
//       model: "gpt-3.5-turbo",
//       messages: [{
//         role: "user",
//         content: `Bạn là trợ lý mua sắm thú cưng. Khách hỏi: "${message}"\n\nDanh sách sản phẩm: ${JSON.stringify(products.slice(0, 5))}\n\nHãy gợi ý ngắn gọn (2-3 câu) và thân thiện.`
//       }],
//       temperature: 0.7,
//       max_tokens: 200
//     });
//     
//     return response.data.choices[0].message.content;
//   } catch (error) {
//     console.error('OpenAI error:', error);
//     return null;
//   }
// }

module.exports = router;