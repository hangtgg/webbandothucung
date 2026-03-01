# PetShop Project Setup Instructions

## Project Overview
PetShop is a full-stack e-commerce application for pet products with advanced features like:
- AI chatbot for consulting
- Smart product recommendations
- Voice search capability
- Image-based search

## Completed Steps

✅ Project structure created
✅ Backend API with Express.js
✅ Product database with recommendations
✅ Chatbot with NLP
✅ Voice and image search
✅ Responsive frontend UI
✅ Shopping cart functionality
✅ README documentation

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Server
```bash
npm start
```

The server runs on http://localhost:3000

### 3. Features

#### Chatbot Consultation
- Open the chatbot widget in the bottom right
- Ask questions about products (e.g., "I have a cat, need litter")
- Get intelligent product recommendations

#### Product Recommendations
- Product recommendations based on related items
- When buying a litter box, automatically suggest cat litter
- When buying food, suggest water fountain
- Cart-based recommendations

#### Voice Search
- Click the microphone icon in the search bar
- Say what you're looking for
- Search results appear instantly

#### Image Search
- Click the image icon in the search bar
- Upload or drag an image
- Find similar products

#### Smart Filtering
- Filter by price range
- Filter by category (Cats, Dogs, Accessories)
- Filter by features/tags
- Combination filtering supported

## API Routes

### Products
- `GET /api/products` - All products
- `GET /api/products?category=cat` - Filter by category
- `GET /api/products/:id` - Product details

### Search
- `GET /api/search/text?q=query` - Text search
- `POST /api/search/voice` - Voice search
- `POST /api/search/image` - Image search
- `GET /api/search/filter` - Advanced filtering

### Recommendations
- `GET /api/recommendations/:id` - Single product recommendations
- `POST /api/recommendations/cart` - Cart recommendations

### Chatbot
- `POST /api/chatbot/message` - Send message to chatbot

## Project Structure

```
backend/
  ├── server.js           - Express server
  ├── database.js         - Product data & chatbot responses
  └── routes/
      ├── products.js     - Product routes
      ├── chatbot.js      - Chatbot routes
      ├── recommendations.js - Recommendation routes
      └── search.js       - Search routes

frontend/
  ├── index.html          - Main HTML
  └── assets/
      ├── css/style.css   - All styles
      └── js/
          ├── api.js      - API functions
          ├── ui.js       - UI components
          ├── chatbot.js  - Chatbot logic
          ├── search.js   - Search logic
          ├── cart.js     - Cart management
          └── main.js     - App initialization
```

## Technologies

### Backend
- Node.js
- Express.js
- CORS
- Multer (file handling)

### Frontend
- HTML5
- CSS3
- Vanilla JavaScript
- Web Speech API
- localStorage

## Future Enhancements

- User authentication & registration
- Payment integration (Stripe, VNPay)
- Purchase history
- Product reviews & ratings
- Advanced ML-based recommendations
- Admin dashboard
- Inventory management
- Real-time notifications
- Mobile app (React Native)

## Troubleshooting

### Port 3000 already in use
```bash
PORT=8000 npm start
```

### CORS errors
- Ensure backend is running
- Check API URL in `frontend/assets/js/api.js`

### Voice search not working
- Only works on HTTPS or localhost
- Requires Chrome, Edge, or Firefox
- Browser needs microphone permission

---

For more details, see README.md in the project root.
