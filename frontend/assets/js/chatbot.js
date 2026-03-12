// Add chatbot message function to existing API object
API.sendMessage = async (message) => {
  try {
    const response = await fetch("/api/chatbot/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: message
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      message: 'Lỗi kết nối API. Vui lòng kiểm tra server.',
      title: 'Lỗi'
    };
  }
};

const Chatbot = {
  init: () => {
    console.log('🤖 Chatbot.init() called');
    
    const sendBtn = document.getElementById('chatbotSendBtn');
    const input = document.getElementById('chatbotInput');
    const messagesDiv = document.getElementById('chatbotMessages');

    console.log('Elements check:', { sendBtn: !!sendBtn, input: !!input, messagesDiv: !!messagesDiv });

    if (!sendBtn || !input || !messagesDiv) {
      console.error('❌ Missing required elements for chatbot');
      return;
    }

    sendBtn.addEventListener('click', () => Chatbot.sendMessage());
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        Chatbot.sendMessage();
      }
    });

    console.log('✅ Welcome message loading...');

    Chatbot.addMessage('bot', `
      <div class="bot-welcome">
        <div class="bot-title">🤖 Trợ lý thú cưng của bạn</div>
        <div>Xin chào! Tôi sẵn sàng tư vấn sản phẩm cho thú cưng của bạn.</div>
        <div style="font-size: 0.85em; color: #666; margin-top: 8px;">
          💡 Bạn có thể hỏi về các loại thú cưng, nhu cầu, mức giá...
        </div>
      </div>
    `);

    console.log('✅ Suggestions loading...');

    Chatbot.addSuggestions([
      'Sản phẩm cho chó',
      'Sản phẩm cho mèo',
      'Sản phẩm bán chạy nhất',
      'Hàng mới về'
    ]);

    Chatbot.initResizer();
    console.log('✅ Chatbot initialized successfully');
  },

  initResizer: () => {
    const resizer = document.getElementById('chatbotResizer');
    const widget = document.getElementById('chatbotWidget');
    if (!resizer || !widget) return;

    let startX, startY, startWidth, startHeight;

    resizer.addEventListener('mousedown', (e) => {
      startX = e.clientX;
      startY = e.clientY;
      const style = document.defaultView.getComputedStyle(widget);
      startWidth = parseInt(style.width, 10);
      startHeight = parseInt(style.height, 10);
      
      document.documentElement.addEventListener('mousemove', doDrag, false);
      document.documentElement.addEventListener('mouseup', stopDrag, false);
      widget.classList.add('resizing');
      e.preventDefault(); // Prevent text selection
    });

    function doDrag(e) {
      // Calculate new dimensions (growing to the left and up)
      const newWidth = startWidth + (startX - e.clientX);
      const newHeight = startHeight + (startY - e.clientY);
      
      // Apply constraints
      if (newHeight > 250 && newHeight < (window.innerHeight - 50)) {
        widget.style.height = newHeight + 'px';
      }
      if (newWidth > 320 && newWidth < (window.innerWidth - 50)) {
        widget.style.width = newWidth + 'px';
      }
    }

    function stopDrag() {
      document.documentElement.removeEventListener('mousemove', doDrag, false);
      document.documentElement.removeEventListener('mouseup', stopDrag, false);
      widget.classList.remove('resizing');
      
      // Save both dimensions
      localStorage.setItem('chatbot_height', widget.style.height);
      localStorage.setItem('chatbot_width', widget.style.width);
    }

    // Restore dimensions
    const savedHeight = localStorage.getItem('chatbot_height');
    const savedWidth = localStorage.getItem('chatbot_width');
    if (savedHeight) widget.style.height = savedHeight;
    if (savedWidth) widget.style.width = savedWidth;
  },

  sendMessage: async (messageArg = null) => {
    const input = document.getElementById('chatbotInput');
    
    // Robust check: Only use the argument if it's explicitly a string
    // Otherwise, always fall back to the input field's value
    let message;
    if (typeof messageArg === 'string') {
        message = messageArg.trim();
    } else if (input) {
        message = input.value.trim();
    } else {
        return;
    }

    if (!message) return;

    Chatbot.addMessage('user', Chatbot.escapeHtml(message));
    input.value = '';
    Chatbot.setInputState(true);

    const loadingDiv = Chatbot.addLoading();

    try {
      const response = await API.sendMessage(message);
      loadingDiv.remove();

      if (!response || response.success === false) {
        Chatbot.addMessage('bot', 'Xin lỗi, hiện tôi chưa thể xử lý yêu cầu này. Bạn thử lại nhé.');
        return;
      }

      Chatbot.renderBotResponse(response);
    } catch (error) {
      console.error('Chatbot frontend error:', error);
      loadingDiv.remove();
      Chatbot.addMessage('bot', 'Đã xảy ra lỗi kết nối. Bạn vui lòng thử lại sau.');
    } finally {
      Chatbot.setInputState(false);
    }
  },

  renderBotResponse: (response) => {
    const title = response.title ? `<div class="bot-response-title">${Chatbot.escapeHtml(response.title)}</div>` : '';
    const message = response.message ? Chatbot.formatMessage(response.message) : 'Tôi đã nhận được yêu cầu của bạn.';

    Chatbot.addMessage('bot', `
      <div class="bot-response">
        ${title}
        <div class="bot-response-text">${message}</div>
      </div>
    `);

    // Render products if available
    if (response.products && response.products.length > 0) {
      Chatbot.renderProducts(response.products);
    }
  },

  renderProducts: (products) => {
    const messagesDiv = document.getElementById('chatbotMessages');
    
    // Create the message wrapper with special class for full width
    const productsWrapper = document.createElement('div');
    productsWrapper.className = 'chat-message message-bot message-full-width';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    const productsScroll = document.createElement('div');
    productsScroll.className = 'chatbot-products-scroll';
    
    products.forEach(product => {
      const card = document.createElement('div');
      card.className = 'chatbot-premium-card';
      card.innerHTML = `
        <div class="card-image">
          <img src="/api/images/image/${product.id}?name=${encodeURIComponent(product.name)}" alt="${product.name}">
          ${product.oldPrice ? `<span class="card-badge">-${Math.round((1 - product.price/product.oldPrice) * 100)}%</span>` : ''}
        </div>
        <div class="card-info">
          <div class="card-name">${product.name}</div>
          <div class="card-price-row">
            <span class="card-price">${Chatbot.formatCurrency(product.price)}</span>
            ${product.oldPrice ? `<span class="card-old-price">${Chatbot.formatCurrency(product.oldPrice)}</span>` : ''}
          </div>
          <div class="card-rating">
            <i class="fas fa-star"></i> ${product.rating || 5} | Đã bán ${product.sold || 0}
          </div>
          <button class="card-add-btn">
            <i class="fas fa-cart-plus"></i> Thêm vào giỏ
          </button>
        </div>
      `;
      
      // Attach listeners directly to the element before appending
      card.addEventListener('click', () => UI.openProductModal(product.id));
      const btn = card.querySelector('.card-add-btn');
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (typeof UI !== 'undefined' && UI.addToCart) {
          UI.addToCart(product.id);
        }
      });
      
      productsScroll.appendChild(card);
    });

    contentDiv.appendChild(productsScroll);
    productsWrapper.appendChild(contentDiv);
    messagesDiv.appendChild(productsWrapper);
    
    // Auto-scroll to show products
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  },


  addMessage: (sender, html) => {
    const messagesDiv = document.getElementById('chatbotMessages');
    if (!messagesDiv) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message message-${sender}`;
    messageDiv.innerHTML = `<div class="message-content">${html}</div>`;
    messagesDiv.appendChild(messageDiv);
    Chatbot.scrollToBottom();
  },

  addLoading: () => {
    const messagesDiv = document.getElementById('chatbotMessages');
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'chat-message message-bot';
    loadingDiv.innerHTML = `
      <div class="message-content">
        <div class="loading">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    `;
    messagesDiv.appendChild(loadingDiv);
    Chatbot.scrollToBottom();
    return loadingDiv;
  },

  addSuggestions: (suggestions = []) => {
    const messagesDiv = document.getElementById('chatbotMessages');
    if (!messagesDiv || !suggestions.length) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'chat-message message-bot';

    const container = document.createElement('div');
    container.className = 'chatbot-suggestions';

    const title = document.createElement('div');
    title.className = 'suggestion-title';
    title.textContent = '💡 Gợi ý nhanh';
    container.appendChild(title);

    suggestions.forEach((suggestion) => {
      const btn = document.createElement('button');
      btn.className = 'suggestion-btn';
      btn.type = 'button';
      btn.textContent = suggestion;
      btn.addEventListener('click', () => Chatbot.handleSuggestion(suggestion));
      container.appendChild(btn);
    });

    wrapper.appendChild(container);
    messagesDiv.appendChild(wrapper);
    Chatbot.scrollToBottom();
  },

  handleSuggestion: (suggestion) => {
    Chatbot.sendMessage(suggestion);
  },

  setInputState: (isLoading) => {
    const input = document.getElementById('chatbotInput');
    const sendBtn = document.getElementById('chatbotSendBtn');

    if (input) input.disabled = isLoading;
    if (sendBtn) sendBtn.disabled = isLoading;
  },

  scrollToBottom: () => {
    const messagesDiv = document.getElementById('chatbotMessages');
    if (messagesDiv) {
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
  },

  formatCurrency: (number) => {
    return Number(number || 0).toLocaleString('vi-VN') + ' VND';
  },

  formatMessage: (text = '') => {
    return Chatbot.escapeHtml(text).replace(/\n/g, '<br>');
  },

  escapeHtml: (str = '') => {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  escapeAttribute: (str = '') => {
    return Chatbot.escapeHtml(str);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ DOMContentLoaded fired - initializing Chatbot');
  Chatbot.init();
});