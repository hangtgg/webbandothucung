const express = require('express');
const cors = require('cors');
const path = require('path');
const productRoutes = require('./routes/products');
const chatbotRoutes = require('./routes/chatbot');
const recommendationRoutes = require('./routes/recommendations');
const searchRoutes = require('./routes/search');
const imageRoutes = require('./routes/images');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/images', imageRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Serve main HTML on root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
