// Shopping Cart functionality
const Cart = {
  getCart: () => {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  },

  saveCart: (cart) => {
    localStorage.setItem('cart', JSON.stringify(cart));
    UI.updateCartCount();
  },

  addToCart: (product) => {
    const cart = Cart.getCart();
    
    // Check if product already exists
    const existingProduct = cart.find(p => p.id === product.id);
    if (existingProduct) {
      existingProduct.quantity = (existingProduct.quantity || 1) + 1;
    } else {
      product.quantity = 1;
      cart.push(product);
    }
    
    Cart.saveCart(cart);
  },

  removeFromCart: (productId) => {
    let cart = Cart.getCart();
    cart = cart.filter(p => p.id !== productId);
    Cart.saveCart(cart);
  },

  clearCart: () => {
    localStorage.removeItem('cart');
    UI.updateCartCount();
  },

  getTotalPrice: () => {
    const cart = Cart.getCart();
    return cart.reduce((total, product) => total + (product.price * (product.quantity || 1)), 0);
  },

  displayCart: async () => {
    const cart = Cart.getCart();
    const modal = document.getElementById('cartModal');
    const cartItemsDiv = document.getElementById('cartItems');
    
    // Display cart items
    if (cart.length === 0) {
      cartItemsDiv.innerHTML = `
        <div class="empty-cart">
          <i class="fas fa-shopping-cart"></i>
          <p>Giỏ hàng trống</p>
          <p style="font-size: 12px; margin-top: 10px;">Hãy thêm các sản phẩm yêu thích vào giỏ</p>
        </div>
      `;
      document.getElementById('cartRecommendations').innerHTML = '';
      document.getElementById('cartTotalItems').textContent = '0';
      document.getElementById('cartTotalPrice').textContent = '0 VND';
    } else {
      cartItemsDiv.innerHTML = cart.map(product => `
        <div class="cart-item">
          <div class="cart-item-image">
            <img src="/api/images/image/${product.id}?name=${encodeURIComponent(product.name)}" alt="${product.name}">
          </div>
          <div class="cart-item-info">
            <div class="cart-item-name">${product.name}</div>
            <div class="cart-item-price">${(product.price * (product.quantity || 1)).toLocaleString()} VND</div>
            <div class="cart-item-actions">
              <button onclick="Cart.updateQuantity(${product.id}, -1)">−</button>
              <span style="padding: 4px 8px; min-width: 30px; text-align: center;">${product.quantity || 1}</span>
              <button onclick="Cart.updateQuantity(${product.id}, 1)">+</button>
              <button onclick="Cart.removeFromCart(${product.id}); Cart.displayCart();" style="background-color: var(--primary-color); color: white; margin-left: auto;">Xóa</button>
            </div>
          </div>
        </div>
      `).join('');

      // Update cart summary
      const totalItems = cart.reduce((sum, p) => sum + (p.quantity || 1), 0);
      const totalPrice = Cart.getTotalPrice();
      document.getElementById('cartTotalItems').textContent = totalItems;
      document.getElementById('cartTotalPrice').textContent = `${totalPrice.toLocaleString()} VND`;

      // Load recommendations
      const recommendationsData = await API.getCartRecommendations(cart.map(p => p.id));
      Cart.displayRecommendations(recommendationsData.recommendations || []);
    }

    modal.classList.add('active');
  },

  updateQuantity: (productId, change) => {
    const cart = Cart.getCart();
    const product = cart.find(p => p.id === productId);
    if (product) {
      product.quantity = Math.max(1, (product.quantity || 1) + change);
      Cart.saveCart(cart);
      Cart.displayCart();
    }
  },

  displayRecommendations: (recommendations) => {
    const recDiv = document.getElementById('cartRecommendations');
    
    if (!recommendations || recommendations.length === 0) {
      recDiv.innerHTML = `
        <p style="text-align: center; color: #999; margin-top: 20px;">Không có gợi ý nào</p>
      `;
      return;
    }

    recDiv.innerHTML = recommendations.map(product => `
      <div class="recommendation-item" onclick="UI.openProductModal(${product.id}); setTimeout(() => document.getElementById('cartModal').classList.remove('active'), 100);">
        <img src="/api/images/image/${product.id}?name=${encodeURIComponent(product.name)}" alt="${product.name}">
        <p>${product.name}</p>
        <p class="price">${product.price.toLocaleString()} VND</p>
        <button class="btn-primary" style="width: 100%; font-size: 11px; padding: 6px;" onclick="event.stopPropagation(); Cart.addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')}); Cart.displayCart();">
          Thêm
        </button>
      </div>
    `).join('');
  }
};

