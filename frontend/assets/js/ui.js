// UI Components
const UI = {
  // Render product grid
  renderProducts: (products, containerId = 'productsGrid') => {
    const container = document.getElementById(containerId);
    console.log('renderProducts called with', products.length, 'products, container:', container);
    
    if (!container) {
      console.error('Container not found:', containerId);
      return;
    }
    
    if (!products || products.length === 0) {
      console.warn('No products to display');
      container.innerHTML = `
        <div class="no-results" style="grid-column: 1/-1;">
          <i class="fas fa-search"></i>
          <p>Không tìm thấy sản phẩm nào</p>
        </div>
      `;
      return;
    }
    
    const html = products.map(product => `
      <div class="product-card" onclick="UI.openProductModal(${product.id})">
        <div class="product-image">
          <img src="/api/images/image/${product.id}?name=${encodeURIComponent(product.name)}" alt="${product.name}">
        </div>
        <div class="product-body">
          <div class="product-name">${product.name}</div>
          <div class="product-category">${product.subcategory}</div>
          <div class="product-price">${product.price.toLocaleString()} VND</div>
          <div class="product-footer">
            <button class="btn-primary" onclick="event.stopPropagation(); UI.addToCart(${product.id})">
              <i class="fas fa-plus"></i> Giỏ
            </button>
            <button class="btn-secondary" onclick="event.stopPropagation(); UI.openProductModal(${product.id})">
              Chi tiết
            </button>
          </div>
        </div>
      </div>
    `).join('');
    
    console.log('Setting innerHTML, length:', html.length);
    container.innerHTML = html;
    console.log('Products rendered, container innerHTML length:', container.innerHTML.length);
  },

  // Open product modal
  openProductModal: async (productId) => {
    const product = await API.getProduct(productId);
    const modal = document.getElementById('productModal');
    
    if (!product) return;
    
    document.getElementById('modalName').textContent = product.name;
    document.getElementById('modalDescription').textContent = product.description;
    document.getElementById('modalPrice').textContent = `${product.price.toLocaleString()} VND`;
    document.getElementById('modalImage').src = `/api/images/image/${product.id}?name=${encodeURIComponent(product.name)}`;
    document.getElementById('addToCartBtn').onclick = () => {
      UI.addToCart(productId);
      modal.classList.remove('active');
    };
    
    // Load recommendations
    const recData = await API.getRecommendations(productId);
    UI.renderRecommendations(recData.recommendations);
    
    modal.classList.add('active');
  },

  // Render recommendations
  renderRecommendations: (recommendations) => {
    const section = document.getElementById('recommendationsSection');
    
    if (!recommendations || recommendations.length === 0) {
      section.innerHTML = '';
      return;
    }
    
    section.innerHTML = `
      <h3><i class="fas fa-lightbulb"></i> Sản phẩm được khuyến nghị</h3>
      <p style="font-size: 13px; color: #666; margin-bottom: 15px;">
        Những sản phẩm này thường được mua cùng với sản phẩm này:
      </p>
      <div class="recommendations-grid">
        ${recommendations.map(product => `
          <div class="recommendation-item" onclick="UI.openProductModal(${product.id})">
            <img src="/api/images/image/${product.id}?name=${encodeURIComponent(product.name)}" style="width: 100%; height: 60px; object-fit: cover; border-radius: 4px; margin-bottom: 8px;">
            <p>${product.name}</p>
            <p class="price">${product.price.toLocaleString()} VND</p>
            <p style="font-size: 11px; color: #999; margin-top: 5px;">Thêm vào giỏ →</p>
          </div>
        `).join('')}
      </div>
    `;
  },

  // Add to cart
  addToCart: async (productId) => {
    const product = await API.getProduct(productId);
    if (product) {
      Cart.addToCart(product);
      
      // Show notification
      const btn = document.querySelector(`[onclick*="UI.addToCart(${productId})"]`);
      if (btn) {
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Đã thêm';
        setTimeout(() => {
          btn.innerHTML = originalText;
        }, 1500);
      }
    }
  },

  // Update cart count
  updateCartCount: () => {
    const cart = Cart.getCart();
    document.getElementById('cartCount').textContent = cart.length;
  },

  // Close modal
  closeModal: (modalId) => {
    document.getElementById(modalId).classList.remove('active');
  }
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  // Close modals
  document.querySelectorAll('.close-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modal = e.target.closest('.modal');
      if (modal) {
        modal.classList.remove('active');
      }
    });
  });

  // Close modal when clicking outside
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });

  // Chatbot toggle
  document.getElementById('chatbotToggle').addEventListener('click', () => {
    document.getElementById('chatbotWidget').classList.toggle('active');
  });

  document.getElementById('chatbotClose').addEventListener('click', () => {
    document.getElementById('chatbotWidget').classList.remove('active');
  });

  // Voice search button
  document.getElementById('voiceSearchBtn').addEventListener('click', () => {
    document.getElementById('voiceModal').classList.add('active');
  });

  // Image search button
  document.getElementById('imageSearchBtn').addEventListener('click', () => {
    document.getElementById('imageModal').classList.add('active');
  });

  // Cart button
  document.querySelector('.btn-cart').addEventListener('click', () => {
    Cart.displayCart();
  });

  // Update cart count on load
  UI.updateCartCount();
});
