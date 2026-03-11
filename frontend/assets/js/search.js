// Search functionality
const Search = {
  // Detect pet type from voice transcript
  detectPetTypeFromVoice: (transcript) => {
    const msg = transcript.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    console.log('🔍 Raw message:', msg);
    
    const petMap = [
      { type: 'cat', keywords: ['meo', 'cat', 'meok', 'mèo'] },
      { type: 'dog', keywords: ['cho', 'dog', 'cun', 'chó'] },
      { type: 'hamster', keywords: ['hamster', 'hamsterr'] },
      { type: 'rabbit', keywords: ['tho', 'rabbit', 'thỏ'] },
      { type: 'bird', keywords: ['chim', 'bird', 'chuot bay', 'chuyên', 'chim chích'] },
      { type: 'fish', keywords: ['ca', 'fish', 'tay ca', 'cá'] },
      { type: 'reptile', keywords: ['bo sat', 'reptile', 'ran', 'bò sát'] }
    ];

    for (const item of petMap) {
      for (const keyword of item.keywords) {
        if (msg.includes(keyword)) {
          console.log(`✅ Found pet: ${item.type} (keyword: "${keyword}")`);
          return item.type;
        }
      }
    }
    console.log('❌ No pet type detected');
    return null;
  },

  // Detect needs from voice transcript
  detectNeedsFromVoice: (transcript) => {
    const msg = transcript.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const needs = [];

    // Map detection keys to actual product tags
    const needMap = [
      { tags: ['thức ăn', 'snack'], keywords: ['thuc an', 'food', 'hat', 'pate', 'an vat', 'snack', 'thức ăn'] },
      { tags: ['đồ chơi'], keywords: ['do choi', 'toy', 'bong', 'can gam', 'choi', 'đồ chơi', 'cạo'] },
      { tags: ['vệ sinh', 'bồn', 'toilet', 'cát'], keywords: ['ve sinh', 'cat', 'toilet', 'khay', 'bon', 'vệ sinh'] },
      { tags: ['dây dắt', 'vòng cổ'], keywords: ['phu kien', 'vong co', 'day dat', 'quan ao', 'balo', 'phụ kiện'] },
      { tags: ['nước', 'máy uống'], keywords: ['nuoc', 'uong', 'may uong', 'binh', 'fountain', 'nước'] },
      { tags: ['tắm'], keywords: ['tam', 'bon tam', 'sua tam', 'goi', 'tắm'] },
      { tags: ['giường', 'nệm'], keywords: ['nem', 'giuong', 'ghe nam', 'nap', 'giường'] },
      { tags: ['cạo móng', 'lông'], keywords: ['chuot', 'dai', 'ke', 'cat toc', 'groom', 'duong da', 'cạo'] }
    ];

    for (const item of needMap) {
      if (item.keywords.some(keyword => msg.includes(keyword))) {
        needs.push(...item.tags);
      }
    }

    return needs;
  },

  init: () => {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');

    if (!searchBtn || !searchInput) {
      console.warn('Search elements not found');
      return;
    }

    searchBtn.addEventListener('click', Search.textSearch);
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        Search.textSearch();
      }
    });

    // Voice search
    const voiceRecordBtn = document.getElementById('voiceRecordBtn');
    if (voiceRecordBtn) {
      voiceRecordBtn.addEventListener('click', Search.startVoiceSearch);
    }

    // Image search  
    const imageInput = document.getElementById('imageInput');
    if (imageInput) {
      imageInput.addEventListener('change', Search.handleImageUpload);
    }

    // Navigation filters
    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        const category = e.target.dataset.category;
        Search.filterByCategory(category);
      });
    });

    // Price range filter
    const minPrice = document.getElementById('minPrice');
    const maxPrice = document.getElementById('maxPrice');
    if (minPrice && maxPrice) {
      minPrice.addEventListener('input', Search.applyFilters);
      maxPrice.addEventListener('input', Search.applyFilters);
    }

    // Category checkboxes
    document.querySelectorAll('input[name="category"]').forEach(checkbox => {
      checkbox.addEventListener('change', Search.applyFilters);
    });

    // Tag buttons
    document.querySelectorAll('.tag-btn').forEach(btn => {
      btn.addEventListener('click', Search.applyTagFilter);
    });

    // Load all products initially
    console.log('Search initialized, loading products...');
    Search.loadAllProducts();
  },

  loadAllProducts: async () => {
    try {
      console.log('Fetching all products...');
      const products = await API.getProducts();
      console.log('Products fetched:', products.length, products);
      const container = document.getElementById('productsGrid');
      if (!container) {
        console.error('productsGrid container not found!');
        return;
      }
      console.log('Rendering products to container...');
      UI.renderProducts(products);
      console.log('Products rendered successfully');
    } catch (error) {
      console.error('Error in loadAllProducts:', error);
    }
  },

  textSearch: async () => {
    const query = document.getElementById('searchInput').value.trim();
    if (!query) return;

    const results = await API.searchText(query);
    UI.renderProducts(results);
  },

  filterByCategory: async (category) => {
    if (category === 'all') {
      Search.loadAllProducts();
    } else {
      const products = await API.getProducts(category);
      UI.renderProducts(products);
    }
  },

  // Helper to render fallback results with proper event listeners
  renderFallbackVoiceResults: (title, message, products) => {
    const resultsDiv = document.getElementById('voiceResults');
    if (!resultsDiv) return;
    
    resultsDiv.style.display = 'block';
    resultsDiv.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
        <h3>${title}</h3>
        <button class="voice-close-btn" style="background: #f5f5f5; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 18px;">✕</button>
      </div>
      <p style="color: #ff9800; margin-bottom: 10px;">${message}</p>
      <div class="search-results-list">
        ${products.slice(0, 6).map(p => `
          <div class="product-card voice-product-card" data-product-id="${p.id}">
            <div class="product-image">
              <img src="/api/images/image/${p.id}?name=${encodeURIComponent(p.name)}" alt="${p.name}">
            </div>
            <div class="product-body">
              <div class="product-name">${p.name}</div>
              <div class="product-price">${p.price.toLocaleString()} VND</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    
    // Attach event listeners
    console.log('🔗 Attaching event listeners to fallback voice results...');
    
    // Close button
    const closeBtn = resultsDiv.querySelector('.voice-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        console.log('Close button clicked');
        resultsDiv.innerHTML = '';
        resultsDiv.style.display = 'none';
      });
    }
    
    // Product cards
    const productCards = resultsDiv.querySelectorAll('.voice-product-card');
    productCards.forEach(card => {
      card.addEventListener('click', () => {
        const productId = card.getAttribute('data-product-id');
        console.log('📦 Fallback voice product card clicked:', productId);
        Search.selectProductFromSearch(productId, 'voice');
      });
      card.style.cursor = 'pointer';
    });
  },

  // Helper to render voice/image results with close button
  renderVoiceResults: (title, products) => {
    const resultsDiv = document.getElementById('voiceResults');
    if (!resultsDiv) return;
    
    // Make sure div is visible
    resultsDiv.style.display = 'block';
    
    resultsDiv.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
        <h3>${title}</h3>
        <button class="voice-close-btn" style="background: #f5f5f5; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 18px;">✕</button>
      </div>
      <div class="search-results-list">
        ${products.map(p => `
          <div class="product-card voice-product-card" data-product-id="${p.id}">
            <div class="product-image">
              <img src="/api/images/image/${p.id}?name=${encodeURIComponent(p.name)}" alt="${p.name}">
            </div>
            <div class="product-body">
              <div class="product-name">${p.name}</div>
              <div class="product-price">${p.price.toLocaleString()} VND</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    
    // Attach event listeners after rendering
    console.log('🔗 Attaching event listeners to voice product cards...');
    
    // Close button
    const closeBtn = resultsDiv.querySelector('.voice-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        console.log('Close button clicked');
        resultsDiv.innerHTML = '';
        resultsDiv.style.display = 'none';
      });
    }
    
    // Product cards
    const productCards = resultsDiv.querySelectorAll('.voice-product-card');
    productCards.forEach(card => {
      card.addEventListener('click', () => {
        const productId = card.getAttribute('data-product-id');
        console.log('📦 Voice product card clicked:', productId);
        Search.selectProductFromSearch(productId, 'voice');
      });
      // Add cursor pointer
      card.style.cursor = 'pointer';
    });
  },

  // Select product from voice/image search and close results
  selectProductFromSearch: (productId, type = 'voice') => {
    console.log(`📦 selectProductFromSearch called (${type}):`, productId);
    
    // Clear search results UI
    const resultsDiv = document.getElementById(type === 'image' ? 'imageResults' : 'voiceResults');
    const statusDiv = document.getElementById(type === 'image' ? 'imageStatus' : 'voiceStatus');
    
    console.log(`Clearing ${type} results div...`);
    if (resultsDiv) {
      resultsDiv.innerHTML = '';
      resultsDiv.style.display = 'none';
      console.log(`✅ ${type}Results cleared and hidden`);
    }
    if (statusDiv) {
      statusDiv.textContent = '';
    }
    
    // Then open product modal
    console.log('Opening product modal...');
    UI.openProductModal(productId);
  },

  // Legacy alias for backward compatibility
  selectProductFromVoice: (productId) => {
    Search.selectProductFromSearch(productId, 'voice');
  },

  startVoiceSearch: async () => {
    const btn = document.getElementById('voiceRecordBtn');
    const statusDiv = document.getElementById('voiceStatus');
    const resultsDiv = document.getElementById('voiceResults');

    // Check browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      statusDiv.textContent = '❌ Trình duyệt của bạn không hỗ trợ nhận diện giọng nói';
      return;
    }

    // Clear previous results immediately
    resultsDiv.style.display = 'block';  // Ensure div is visible
    resultsDiv.innerHTML = '';  // Clear all previous content
    
    const recognition = new SpeechRecognition();
    recognition.lang = 'vi-VN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    btn.textContent = '🎤 Đang nghe...';
    btn.disabled = true;
    statusDiv.textContent = 'Đang nghe...';

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      statusDiv.textContent = `Bạn nói: "${transcript}"`;

      // Detect pet type and needs from voice
      const petType = Search.detectPetTypeFromVoice(transcript);
      const needs = Search.detectNeedsFromVoice(transcript);
      
      console.log('🎤 Voice Detection:', { petType, needs, transcript });

      const resultsDiv = document.getElementById('voiceResults');

      // If pet type detected -> show products for that pet type
      if (petType) {
        const products = await API.getProducts(petType);
        console.log(`📦 Products for ${petType}:`, products.length);
        
        // Filter by needs if detected
        let filteredProducts = products;
        if (needs.length > 0) {
          console.log('🔍 Filtering by needs:', needs);
          filteredProducts = products.filter(p => {
            const tags = p.tags || [];
            const hasMatchingTag = needs.some(need => tags.includes(need));
            if (hasMatchingTag) {
              console.log(`✅ ${p.name} matches needs:`, tags);
            }
            return hasMatchingTag;
          });
          console.log(`📍 After filtering: ${filteredProducts.length} products found`);
          
          // Fallback: if no products found with needs filter, show all pet products
          if (filteredProducts.length === 0) {
            console.warn('⚠️ No products found with needs filter, showing all pet products instead');
            Search.renderFallbackVoiceResults(
              '⚠️ Không tìm thấy sản phẩm',
              `Không tìm thấy sản phẩm "${needs.join(', ')}" cho ${petType}, hiển thị tất cả sản phẩm:`,
              products
            );
          } else {
            // Show filtered results
            Search.renderVoiceResults(`🎯 Sản phẩm gợi ý (${filteredProducts.length}):`, filteredProducts.slice(0, 6));
          }
        } else {
          // No needs detected, show all pet products
          Search.renderVoiceResults(`📦 Sản phẩm cho ${petType} (${products.length}):`, products.slice(0, 6));
        }
      } else {
        // Fallback to text search if no pet type detected
        const result = await API.searchVoice(transcript);
        
        if (result.results && result.results.length > 0) {
          Search.renderVoiceResults(`🔍 Kết quả tìm kiếm (${result.results.length} sản phẩm):`, result.results.slice(0, 6));
        } else {
          resultsDiv.style.display = 'block';
          resultsDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
              <h3>Không tìm thấy sản phẩm</h3>
              <button onclick="document.getElementById('voiceResults').style.display='none'; document.getElementById('voiceResults').innerHTML='';" style="background: #f5f5f5; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 18px;">✕</button>
            </div>
            <p style="color: #999;">Không tìm thấy sản phẩm nào khớp với: "${transcript}"</p>
          `;
        }
      }
    };

    recognition.onstart = () => {
      console.log('🎙️ Recording started');
      // Ensure results div is visible and clear
      resultsDiv.style.display = 'block';
      resultsDiv.innerHTML = '<p style="color: #666; font-style: italic; text-align: center;">🎙️ Đang nghe, vui lòng nói...</p>';
    };

    recognition.onerror = (event) => {
      statusDiv.textContent = '❌ Lỗi: ' + event.error;
      btn.textContent = '🎤 Bắt đầu ghi âm';
      btn.disabled = false;
    };

    recognition.onend = () => {
      btn.textContent = '🎤 Bắt đầu ghi âm';
      btn.disabled = false;
    };

    recognition.start();
  },

  handleImageUpload: async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Simulate image recognition - in real app, would use a vision API
    const reader = new FileReader();
    reader.onload = async (event) => {
      const imageDescription = 'pet product'; // Placeholder
      
      const result = await API.searchImage(imageDescription);
      const resultsDiv = document.getElementById('imageResults');
      
      if (result.results && result.results.length > 0) {
        resultsDiv.innerHTML = `
          <h3>Kết quả (${result.results.length} sản phẩm tương tự):</h3>
          <div class="search-results-list">
            ${result.results.slice(0, 4).map(p => `
              <div class="product-card" onclick="UI.openProductModal(${p.id})">
                <div class="product-image">
                  <img src="/api/images/image/${p.id}?name=${encodeURIComponent(p.name)}" alt="${p.name}">
                </div>
                <div class="product-body">
                  <div class="product-name">${p.name}</div>
                  <div class="product-price">${p.price.toLocaleString()} VND</div>
                </div>
              </div>
            `).join('')}
          </div>
        `;
      } else {
        resultsDiv.innerHTML = '<p style="color: #999;">Không tìm thấy sản phẩm tương tự</p>';
      }
    };
    reader.readAsDataURL(file);
  },

  applyFilters: async () => {
    const minPrice = parseInt(document.getElementById('minPrice').value);
    const maxPrice = parseInt(document.getElementById('maxPrice').value);
    const categories = Array.from(document.querySelectorAll('input[name="category"]:checked'))
      .map(cb => cb.value);

    // Update price display
    document.getElementById('minPriceDisplay').textContent = minPrice.toLocaleString();
    document.getElementById('maxPriceDisplay').textContent = maxPrice.toLocaleString();

    const filters = {
      minPrice,
      maxPrice
    };

    if (categories.length > 0) {
      filters.category = categories[0];
    }

    const results = await API.filterSearch(filters);
    UI.renderProducts(results);
  },

  applyTagFilter: async (e) => {
    const tag = e.target.dataset.tag;
    e.target.classList.toggle('active');

    // Get all active tags
    const activeTags = Array.from(document.querySelectorAll('.tag-btn.active'))
      .map(btn => btn.dataset.tag);

    if (activeTags.length === 0) {
      Search.loadAllProducts();
      return;
    }

    // For simplicity, filter by first tag
    const filters = { tag: activeTags[0] };
    const results = await API.filterSearch(filters);
    UI.renderProducts(results);
  }
};

// Initialize search when page loads
document.addEventListener('DOMContentLoaded', () => {
  Search.init();
});
