const Chatbot = {
  init: () => {
    const sendBtn = document.getElementById('chatbotSendBtn');
    const input = document.getElementById('chatbotInput');

    if (!sendBtn || !input) return;

    sendBtn.addEventListener('click', Chatbot.sendMessage);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        Chatbot.sendMessage();
      }
    });

    Chatbot.addMessage('bot', `
      <div class="bot-welcome">
        <div class="bot-title">🤖 Trợ lý thú cưng của bạn</div>
        <div>Xin chào! Tôi sẵn sàng tư vấn sản phẩm cho thú cưng của bạn.</div>
        <div style="font-size: 0.85em; color: #666; margin-top: 8px;">
          💡 Bạn có thể hỏi về các loại thú cưng, nhu cầu, mức giá...
        </div>
      </div>
    `);

    Chatbot.addSuggestions([
      'Sản phẩm cho chó',
      'Sản phẩm cho mèo',
      'Sản phẩm bán chạy nhất',
      'Hàng mới về'
    ]);
  },

  sendMessage: async (customMessage = null) => {
    const input = document.getElementById('chatbotInput');
    const message = customMessage || input.value.trim();

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
  Chatbot.init();
});