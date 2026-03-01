// Search functionality
const Search = {
  init: () => {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');

    searchBtn.addEventListener('click', Search.textSearch);
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        Search.textSearch();
      }
    });

    // Voice search
    document.getElementById('voiceRecordBtn').addEventListener('click', Search.startVoiceSearch);

    // Image search
    document.getElementById('imageInput').addEventListener('change', Search.handleImageUpload);

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
    minPrice.addEventListener('input', Search.applyFilters);
    maxPrice.addEventListener('input', Search.applyFilters);

    // Category checkboxes
    document.querySelectorAll('input[name="category"]').forEach(checkbox => {
      checkbox.addEventListener('change', Search.applyFilters);
    });

    // Tag buttons
    document.querySelectorAll('.tag-btn').forEach(btn => {
      btn.addEventListener('click', Search.applyTagFilter);
    });

    // Load all products initially
    Search.loadAllProducts();
  },

  loadAllProducts: async () => {
    const products = await API.getProducts();
    UI.renderProducts(products);
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

      // Search
      const result = await API.searchVoice(transcript);
      const resultsDiv = document.getElementById('voiceResults');
      
      if (result.results && result.results.length > 0) {
        resultsDiv.innerHTML = `
          <h3>Kết quả (${result.results.length} sản phẩm):</h3>
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
        resultsDiv.innerHTML = '<p style="color: #999;">Không tìm thấy sản phẩm nào</p>';
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
