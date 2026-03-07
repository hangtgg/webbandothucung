const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Store orders in a JSON file
const ordersDataFile = path.join(__dirname, '../data/orders.json');

// Ensure data directory exists
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize orders file if it doesn't exist
if (!fs.existsSync(ordersDataFile)) {
  fs.writeFileSync(ordersDataFile, JSON.stringify([], null, 2));
}

// Generate order ID
const generateOrderId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `ORD${timestamp}${random}`;
};

// POST: Create new order
router.post('/', (req, res) => {
  try {
    const orderData = req.body;

    // Validate required fields
    if (!orderData.customerName || !orderData.customerPhone || !orderData.customerAddress) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Read existing orders
    let orders = [];
    if (fs.existsSync(ordersDataFile)) {
      const fileContent = fs.readFileSync(ordersDataFile, 'utf-8');
      orders = JSON.parse(fileContent);
    }

    // Generate order ID
    const orderId = generateOrderId();

    // Create order object
    const order = {
      orderId,
      ...orderData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add order to array
    orders.push(order);

    // Save orders to file
    fs.writeFileSync(ordersDataFile, JSON.stringify(orders, null, 2));

    // Log order creation
    console.log(`Order created: ID: ${orderId}, Customer: ${orderData.customerName}, Phone: ${orderData.customerPhone}, Total: ${orderData.totalAmount}, Payment: ${orderData.paymentMethod}`);

    res.json({
      success: true,
      message: 'Order created successfully',
      orderId: orderId,
      data: order
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      error: 'Error creating order'
    });
  }
});

// GET: Retrieve all orders (admin only - should add authentication)
router.get('/', (req, res) => {
  try {
    if (!fs.existsSync(ordersDataFile)) {
      return res.json({ success: true, data: [] });
    }

    const fileContent = fs.readFileSync(ordersDataFile, 'utf-8');
    const orders = JSON.parse(fileContent);

    // Calculate statistics
    const stats = {
      totalOrders: orders.length,
      totalRevenue: 0,
      byPaymentMethod: {},
      byStatus: {}
    };

    orders.forEach(order => {
      stats.totalRevenue += order.totalAmount || 0;
      
      if (order.paymentMethod) {
        stats.byPaymentMethod[order.paymentMethod] = (stats.byPaymentMethod[order.paymentMethod] || 0) + 1;
      }
      
      if (order.status) {
        stats.byStatus[order.status] = (stats.byStatus[order.status] || 0) + 1;
      }
    });

    res.json({
      success: true,
      data: orders,
      statistics: stats
    });

  } catch (error) {
    console.error('Error retrieving orders:', error);
    res.status(500).json({
      success: false,
      error: 'Error retrieving orders'
    });
  }
});

// GET: Get order statistics
router.get('/stats', (req, res) => {
  try {
    if (!fs.existsSync(ordersDataFile)) {
      return res.json({ success: true, statistics: {} });
    }

    const fileContent = fs.readFileSync(ordersDataFile, 'utf-8');
    const orders = JSON.parse(fileContent);

    // Calculate statistics
    const stats = {
      totalOrders: orders.length,
      totalRevenue: 0,
      byPaymentMethod: {},
      byStatus: {},
      averageOrderValue: 0
    };

    orders.forEach(order => {
      stats.totalRevenue += order.totalAmount || 0;
      
      if (order.paymentMethod) {
        stats.byPaymentMethod[order.paymentMethod] = (stats.byPaymentMethod[order.paymentMethod] || 0) + 1;
      }
      
      if (order.status) {
        stats.byStatus[order.status] = (stats.byStatus[order.status] || 0) + 1;
      }
    });

    stats.averageOrderValue = orders.length > 0 ? (stats.totalRevenue / orders.length).toFixed(0) : 0;

    res.json({
      success: true,
      statistics: stats
    });

  } catch (error) {
    console.error('Error calculating order statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Error calculating order statistics'
    });
  }
});

// GET: Get single order by ID
router.get('/:orderId', (req, res) => {
  try {
    const { orderId } = req.params;

    if (!fs.existsSync(ordersDataFile)) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    const fileContent = fs.readFileSync(ordersDataFile, 'utf-8');
    const orders = JSON.parse(fileContent);
    const order = orders.find(o => o.orderId === orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error('Error retrieving order:', error);
    res.status(500).json({
      success: false,
      error: 'Error retrieving order'
    });
  }
});

// PUT: Update order status
router.put('/:orderId', (req, res) => {
  try {
    const { orderId } = req.params;
    const updateData = req.body;

    if (!fs.existsSync(ordersDataFile)) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    const fileContent = fs.readFileSync(ordersDataFile, 'utf-8');
    let orders = JSON.parse(fileContent);

    const orderIndex = orders.findIndex(o => o.orderId === orderId);
    if (orderIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Update order
    orders[orderIndex] = {
      ...orders[orderIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    // Save updated orders
    fs.writeFileSync(ordersDataFile, JSON.stringify(orders, null, 2));

    console.log(`Order updated: ID: ${orderId}, Status: ${updateData.status || 'unchanged'}`);

    res.json({
      success: true,
      message: 'Order updated successfully',
      data: orders[orderIndex]
    });

  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({
      success: false,
      error: 'Error updating order'
    });
  }
});

// DELETE: Delete order
router.delete('/:orderId', (req, res) => {
  try {
    const { orderId } = req.params;

    if (!fs.existsSync(ordersDataFile)) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    const fileContent = fs.readFileSync(ordersDataFile, 'utf-8');
    let orders = JSON.parse(fileContent);

    const initialLength = orders.length;
    orders = orders.filter(o => o.orderId !== orderId);

    if (orders.length === initialLength) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Save updated orders
    fs.writeFileSync(ordersDataFile, JSON.stringify(orders, null, 2));

    console.log(`Order deleted: ID: ${orderId}`);

    res.json({
      success: true,
      message: 'Order deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({
      success: false,
      error: 'Error deleting order'
    });
  }
});

module.exports = router;
