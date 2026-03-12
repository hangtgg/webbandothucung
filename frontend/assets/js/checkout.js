// Checkout functionality
const Checkout = {
  init: () => {
    const checkoutBtn = document.getElementById('checkoutBtn');
    const checkoutClose = document.getElementById('checkoutClose');
    const checkoutCancelBtn = document.getElementById('checkoutCancelBtn');
    const checkoutForm = document.getElementById('checkoutForm');
    const checkoutModal = document.getElementById('checkoutModal');
    const paymentOptions = document.querySelectorAll('.payment-option');
    const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
    const bankInfo = document.getElementById('bankInfo');

    // Checkout button click
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => Checkout.openCheckout());
    }

    // Close checkout modal
    if (checkoutClose) {
      checkoutClose.addEventListener('click', () => Checkout.closeCheckout());
    }

    if (checkoutCancelBtn) {
      checkoutCancelBtn.addEventListener('click', () => Checkout.closeCheckout());
    }

    // Click outside modal to close
    if (checkoutModal) {
      checkoutModal.addEventListener('click', (e) => {
        if (e.target === checkoutModal) {
          Checkout.closeCheckout();
        }
      });
    }

    // Show payment options (make them visible)
    paymentOptions.forEach(option => {
      option.style.display = 'flex';
    });

    // Payment method toggle
    paymentRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        if (e.target.value === 'bank') {
          bankInfo.style.display = 'block';
        } else {
          bankInfo.style.display = 'none';
        }

        // Track payment method selection in Google Analytics
        if (typeof gtag !== 'undefined') {
          gtag('event', 'payment_method_selected', {
            'event_category': 'checkout',
            'payment_method': e.target.value
          });
        }
      });
    });

    // Form submission
    if (checkoutForm) {
      checkoutForm.addEventListener('submit', (e) => Checkout.handleSubmit(e));
    }
  },

  openCheckout: () => {
    const cart = Cart.getCart();
    
    if (cart.length === 0) {
      alert('Giỏ hàng trống. Vui lòng thêm sản phẩm trước khi thanh toán.');
      return;
    }

    const checkoutModal = document.getElementById('checkoutModal');
    const checkoutOrderItems = document.getElementById('checkoutOrderItems');
    const checkoutTotal = document.getElementById('checkoutTotal');

    // Display cart items
    checkoutOrderItems.innerHTML = cart.map(product => `
      <div class="checkout-item">
        <div class="checkout-item-info">
          <div class="checkout-item-name">${product.name}</div>
          <div class="checkout-item-qty">Số lượng: ${product.quantity || 1}</div>
          <div class="checkout-item-price">${(product.price * (product.quantity || 1)).toLocaleString()} VND</div>
        </div>
      </div>
    `).join('');

    // Display total
    const total = Cart.getTotalPrice();
    checkoutTotal.textContent = `${total.toLocaleString()} VND`;

    // Reset form
    document.getElementById('checkoutForm').reset();
    
    // Make payment options visible
    const paymentOptions = document.querySelectorAll('.payment-option');
    paymentOptions.forEach(option => {
      option.style.display = 'flex';
    });

    // Hide bank info initially
    document.getElementById('bankInfo').style.display = 'none';

    // Show checkout modal
    checkoutModal.style.display = 'flex';
    checkoutModal.classList.add('active');

    // Track checkout opened in Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'checkout_started', {
        'event_category': 'checkout',
        'value': total,
        'currency': 'VND'
      });
    }
  },

  closeCheckout: () => {
    const checkoutModal = document.getElementById('checkoutModal');
    checkoutModal.style.display = 'none';
    checkoutModal.classList.remove('active');
  },

  handleSubmit: async (e) => {
    e.preventDefault();

    // Validate form
    const customerName = document.getElementById('customerName').value.trim();
    const customerPhone = document.getElementById('customerPhone').value.trim();
    const customerAddress = document.getElementById('customerAddress').value.trim();
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    const customerEmail = document.getElementById('customerEmail').value.trim();

    if (!customerName || !customerPhone || !customerAddress) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    // Validate phone number (basic validation)
    const phoneRegex = /^[0-9\s\-\+\(\)]{10,}$/;
    if (!phoneRegex.test(customerPhone)) {
      alert('Số điện thoại không hợp lệ. Vui lòng nhập lại.');
      return;
    }

    const cart = Cart.getCart();
    const total = Cart.getTotalPrice();

    // Prepare order data
    const orderData = {
      customerName,
      customerPhone,
      customerAddress,
      customerEmail,
      paymentMethod,
      items: cart,
      totalAmount: total,
      orderDate: new Date().toISOString(),
      status: 'pending'
    };

    try {
      // Show loading state
      const submitBtn = document.querySelector('#checkoutForm button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = '⏳ Đang xử lý...';

      // Send order to backend
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        const result = await response.json();

        // Track checkout completed in Google Analytics
        if (typeof gtag !== 'undefined') {
          gtag('event', 'purchase', {
            'event_category': 'checkout',
            'transaction_id': result.orderId,
            'value': total,
            'currency': 'VND',
            'items': cart.map(item => ({
              'item_name': item.name,
              'quantity': item.quantity || 1,
              'price': item.price
            }))
          });
        }

        // Save order to localStorage
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push({
          ...orderData,
          orderId: result.orderId,
          createdAt: new Date().toISOString()
        });
        localStorage.setItem('orders', JSON.stringify(orders));

        // Show success message
        Checkout.showSuccessMessage(result.orderId);

        // Clear cart
        Cart.clearCart();

        // Wait a bit then close modal
        setTimeout(() => {
          Checkout.closeCheckout();
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }, 2000);

      } else {
        throw new Error('Order submission failed');
      }

    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Lỗi khi xử lý đơn hàng. Vui lòng thử lại.');
      
      const submitBtn = document.querySelector('#checkoutForm button[type="submit"]');
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;

      // Track checkout error in Google Analytics
      if (typeof gtag !== 'undefined') {
        gtag('event', 'checkout_error', {
          'event_category': 'checkout',
          'error_message': error.message
        });
      }
    }
  },

  showSuccessMessage: (orderId) => {
    const form = document.getElementById('checkoutForm');
    const originalContent = form.innerHTML;

    form.innerHTML = `
      <div style="text-align: center; padding: 40px 20px;">
        <div style="font-size: 48px; color: var(--secondary-color); margin-bottom: 15px;">
          <i class="fas fa-check-circle"></i>
        </div>
        <h3 style="color: var(--dark-color); margin-bottom: 10px;">Đặt hàng thành công!</h3>
        <p style="color: #666; margin-bottom: 15px;">
          Cảm ơn bạn đã mua hàng tại PetShop
        </p>
        <p style="color: #999; font-size: 14px; margin-bottom: 15px;">
          Mã đơn hàng: <strong style="color: var(--dark-color);">${orderId}</strong>
        </p>
        <p style="color: #666; font-size: 14px;">
          Chúng tôi sẽ liên hệ với bạn sớm để xác nhận đơn hàng
        </p>
      </div>
    `;

    // Restore form after 2 seconds
    setTimeout(() => {
      form.innerHTML = originalContent;
      Checkout.init(); // Re-initialize event listeners
    }, 2000);
  }
};

// Initialize checkout when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  Checkout.init();
});
