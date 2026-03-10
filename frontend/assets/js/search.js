// Search functionality
const Search = {
  // Detect pet type from voice transcript
  detectPetTypeFromVoice: (transcript) => {
    const msg = transcript.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    
    const petMap = [
      { type: 'dog', keywords: ['cho', 'dog', 'cun', 'chó'] },
      { type: 'cat', keywords: ['meo', 'cat', 'meok', 'mèo'] },
      { type: 'hamster', keywords: ['hamster', 'hamsterr'] },
      { type: 'rabbit', keywords: ['tho', 'rabbit', 'thỏ'] },
      { type: 'bird', keywords: ['chim', 'bird', 'chuot bay', 'chuyên', 'chim chích'] },
      { type: 'fish', keywords: ['ca', 'fish', 'tay ca', 'cá'] },
      { type: 'reptile', keywords: ['bo sat', 'reptile', 'ran', 'bò sát'] }
    ];

    const found = petMap.find(item => item.keywords.some(keyword => msg.includes(keyword)));
    return found ? found.type : null;
  },

  // Detect needs from voice transcript
  detectNeedsFromVoice: (transcript) => {
    const msg = transcript.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const needs = [];

    const needMap = [
      { key: 'food', keywords: ['thuc an', 'food', 'hat', 'pate', 'an vat', 'snack', 'thức ăn'] },
      { key: 'toy', keywords: ['do choi', 'toy', 'bong', 'can gam', 'choi', 'đồ chơi'] },
      { key: 'hygiene', keywords: ['ve sinh', 'cat', 'toilet', 'khay', 'bon', 'vệ sinh'] },
      { key: 'accessory', keywords: ['phu kien', 'vong co', 'day dat', 'quan ao', 'balo', 'phụ kiện'] },
      { key: 'water', keywords: ['nuoc', 'uong', 'may uong', 'binh', 'fountain', 'nước'] },
      { key: 'bath', keywords: ['tam', 'bon tam', 'sua tam', 'goi', 'tắm'] },
      { key: 'bedding', keywords: ['nem', 'giuong', 'ghe nam', 'nap', 'giường'] },
      { key: 'grooming', keywords: ['chuot', 'dai', 'ke', 'cat toc', 'groom', 'duong da'] }
    ];

    for (const item of needMap) {
      if (item.keywords.some(keyword => msg.includes(keyword))) {
        needs.push(item.key);
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

  startVoiceSearch: async () => {
    const btn = document.getElementById('voiceRecordBtn');
    const statusDiv = document.getElementById('voiceStatus');

    // Check browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      statusDiv.textContent = '❌ Trình duyệt của bạn không hỗ trợ nhận diện giọng nói';
      return;
    }

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

      const resultsDiv = document.getElementById('voiceResults');

      // If pet type detected -> show products for that pet type
      if (petType) {
        const products = await API.getProducts(petType);
        
        // Filter by needs if detected
        let filteredProducts = products;
        if (needs.length > 0) {
          filteredProducts = products.filter(p => {
            const tags = p.tags || [];
            return needs.some(need => tags.includes(need));
          });
        }

        // Show results
        if (filteredProducts.length > 0) {
          resultsDiv.innerHTML = `
            <h3>🎯 Sản phẩm gợi ý (${filteredProducts.length}):</h3>
            <div class="search-results-list">
              ${filteredProducts.slice(0, 6).map(p => `
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
          resultsDiv.innerHTML = '<p style="color: #999;">Không tìm thấy sản phẩm phù hợp</p>';
        }
      } else {
        // Fallback to text search if no pet type detected
        const result = await API.searchVoice(transcript);
        
        if (result.results && result.results.length > 0) {
          resultsDiv.innerHTML = `
            <h3>Kết quả tìm kiếm (${result.results.length} sản phẩm):</h3>
            <div class="search-results-list">
              ${result.results.slice(0, 6).map(p => `
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
          resultsDiv.innerHTML = '<p style="color: #999;">Không tìm thấy sản phẩm nào</p>';
        }
      }
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
