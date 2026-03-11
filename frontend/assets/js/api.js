// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// API Functions
const API = {
  // Products
  getProducts: async (category = null) => {
    try {
      const url = category ? `${API_BASE_URL}/products?category=${category}` : `${API_BASE_URL}/products`;
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },

  getProduct: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  },

  // Search
  searchText: async (query) => {
    try {
      const response = await fetch(`${API_BASE_URL}/search/text?q=${encodeURIComponent(query)}`);
      return await response.json();
    } catch (error) {
      console.error('Error searching:', error);
      return [];
    }
  },

  searchVoice: async (transcript) => {
    try {
      const response = await fetch(`${API_BASE_URL}/search/voice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript })
      });
      return await response.json();
    } catch (error) {
      console.error('Error in voice search:', error);
      return { results: [] };
    }
  },

  searchImage: async (file) => {
    try {
      let body;
      let headers = {};
      
      if (file instanceof FormData) {
        body = file;
      } else if (typeof file === 'string') {
        body = JSON.stringify({ description: file });
        headers['Content-Type'] = 'application/json';
      }
      
      const response = await fetch(`${API_BASE_URL}/search/image`, {
        method: 'POST',
        headers: Object.keys(headers).length > 0 ? headers : undefined,
        body
      });
      return await response.json();
    } catch (error) {
      console.error('Error in image search:', error);
      return { results: [] };
    }
  },

  filterSearch: async (filters) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await fetch(`${API_BASE_URL}/search/filter?${params}`);
      return await response.json();
    } catch (error) {
      console.error('Error filtering:', error);
      return [];
    }
  },

  // Recommendations
  getRecommendations: async (productId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/recommendations/${productId}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      return { recommendations: [] };
    }
  },

  getCartRecommendations: async (productIds) => {
    try {
      const response = await fetch(`${API_BASE_URL}/recommendations/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIds })
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching cart recommendations:', error);
      return { recommendations: [] };
    }
  },

  // Chatbot
  sendMessage: async (message) => {
    try {
      const response = await fetch(`${API_BASE_URL}/chatbot/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      return await response.json();
    } catch (error) {
      console.error('Error sending message:', error);
      return { message: 'Xin lỗi, đã xảy ra lỗi' };
    }
  }
};
