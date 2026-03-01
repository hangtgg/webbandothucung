// Chatbot functionality
const Chatbot = {
  init: () => {
    const sendBtn = document.getElementById('chatbotSendBtn');
    const input = document.getElementById('chatbotInput');

    sendBtn.addEventListener('click', Chatbot.sendMessage);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        Chatbot.sendMessage();
      }
    });

    // Welcome message
    Chatbot.addMessage('bot', 'Xin chào! 👋 Tôi là trợ lý thú cưng của bạn. Tôi có thể giúp bạn tìm sản phẩm phù hợp. Bạn cần gì hôm nay?');
  },

  sendMessage: async () => {
    const input = document.getElementById('chatbotInput');
    const message = input.value.trim();

    if (!message) return;

    // Add user message
    Chatbot.addMessage('user', message);
    input.value = '';

    // Show loading
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
    messagesDiv.scrollTop = messagesDiv.scrollHeight;

    // Get response
    const response = await API.sendMessage(message);
    loadingDiv.remove();

    // Add bot message
    Chatbot.addMessage('bot', response.message);

    // Add suggestions if available
    if (response.suggestions && response.suggestions.length > 0) {
      Chatbot.addSuggestions(response.suggestions);
    }
  },

  addMessage: (sender, message) => {
    const messagesDiv = document.getElementById('chatbotMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message message-${sender}`;
    messageDiv.innerHTML = `<div class="message-content">${message}</div>`;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  },

  addSuggestions: (suggestions) => {
    const messagesDiv = document.getElementById('chatbotMessages');
    const suggestionDiv = document.createElement('div');
    suggestionDiv.className = 'chat-message message-bot';
    suggestionDiv.innerHTML = `
      <div class="chatbot-suggestions">
        ${suggestions.map(s => `
          <button class="suggestion-btn" onclick="Chatbot.handleSuggestion('${s}')">${s}</button>
        `).join('')}
      </div>
    `;
    messagesDiv.appendChild(suggestionDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  },

  handleSuggestion: (suggestion) => {
    const input = document.getElementById('chatbotInput');
    input.value = suggestion;
    document.getElementById('chatbotSendBtn').click();
  }
};

// Initialize chatbot when page loads
document.addEventListener('DOMContentLoaded', () => {
  Chatbot.init();
});
