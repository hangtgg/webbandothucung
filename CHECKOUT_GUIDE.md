# Checkout & Orders Implementation Guide

## Overview
This document explains the checkout system for the PetShop e-commerce application.

## Features

### Checkout Form
When users click the "Thanh toán" (Checkout) button in the shopping cart, they see a form with:

**Customer Information:**
- **Họ và tên** (Full Name) - Required
- **Số điện thoại** (Phone Number) - Required, validated
- **Địa chỉ giao hàng** (Delivery Address) - Required
- **Email** - Optional (for order notifications)

**Payment Methods:**
1. **Nhận khi nhận hàng (COD)** - Cash on Delivery
   - Pay when receiving the order
   - Default option
   
2. **Chuyển khoản ngân hàng** - Bank Transfer
   - Shows bank account details
   - Customer transfers money before delivery
   - Information includes:
     - Bank name: Vietcombank
     - Account: 1234567890
     - Account holder: PetShop Store

### Order Summary
- Shows all items in cart
- Displays total amount
- Sticky position for easy reference

## Frontend Implementation

### Files Modified/Created

**HTML:** [frontend/index.html](../frontend/index.html)
- Added checkout button ID: `#checkoutBtn`
- Added checkout modal: `#checkoutModal`
- Includes order summary and checkout form

**CSS:** [frontend/assets/css/style.css](../frontend/assets/css/style.css)
- `.checkout-modal` - Main modal container
- `.checkout-content` - Two-column layout (order summary + form)
- `.payment-options` - Payment method selector
- `.bank-info` - Bank details display
- Responsive design for mobile

**JavaScript:** [frontend/assets/js/checkout.js](../frontend/assets/js/checkout.js)
- `Checkout.init()` - Initialize event listeners
- `Checkout.openCheckout()` - Show checkout modal with cart items
- `Checkout.closeCheckout()` - Close modal
- `Checkout.handleSubmit()` - Process form submission
- `Checkout.showSuccessMessage()` - Show success confirmation

### Checkout Flow

```
1. User adds products to cart
   ↓
2. User clicks "Thanh toán" button
   ↓
3. Checkout modal opens showing:
   - Cart items and total (left side)
   - Checkout form (right side)
   ↓
4. User fills in:
   - Name, Phone, Address (required)
   - Email (optional)
   - Selects payment method
   ↓
5. User clicks "Đặt hàng"
   ↓
6. Form validation:
   - Check required fields
   - Validate phone number
   ↓
7. Send order to backend
   ↓
8. Backend creates order and returns order ID
   ↓
9. Show success message with order ID
   ↓
10. Clear cart and close modal
```

## Backend Implementation

### Files Created

**[backend/routes/orders.js](../backend/routes/orders.js)**

### API Endpoints

#### 1. **POST /api/orders** - Create Order
Submit a new order

**Request:**
```json
{
  "customerName": "Nguyễn Văn A",
  "customerPhone": "0123456789",
  "customerAddress": "123 Đường Lê Lợi, Hà Nội",
  "customerEmail": "user@example.com",
  "paymentMethod": "cod",
  "items": [
    {
      "id": 1,
      "name": "Product Name",
      "price": 100000,
      "quantity": 2
    }
  ],
  "totalAmount": 200000
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order created successfully",
  "orderId": "ORD16804892341234",
  "data": {
    "orderId": "ORD16804892341234",
    "customerName": "Nguyễn Văn A",
    "customerPhone": "0123456789",
    "customerAddress": "123 Đường Lê Lợi, Hà Nội",
    "customerEmail": "user@example.com",
    "paymentMethod": "cod",
    "items": [...],
    "totalAmount": 200000,
    "status": "pending",
    "createdAt": "2026-03-07T10:30:00.000Z",
    "updatedAt": "2026-03-07T10:30:00.000Z"
  }
}
```

#### 2. **GET /api/orders** - Get All Orders
Retrieve all orders with statistics (admin)

**Response:**
```json
{
  "success": true,
  "data": [...],
  "statistics": {
    "totalOrders": 15,
    "totalRevenue": 3500000,
    "byPaymentMethod": {
      "cod": 10,
      "bank": 5
    },
    "byStatus": {
      "pending": 8,
      "confirmed": 5,
      "delivered": 2
    }
  }
}
```

#### 3. **GET /api/orders/stats** - Get Statistics
Get order statistics only

**Response:**
```json
{
  "success": true,
  "statistics": {
    "totalOrders": 15,
    "totalRevenue": 3500000,
    "byPaymentMethod": {...},
    "byStatus": {...},
    "averageOrderValue": 233333
  }
}
```

#### 4. **GET /api/orders/:orderId** - Get Single Order
Retrieve a specific order by ID

**Example:** `GET /api/orders/ORD16804892341234`

#### 5. **PUT /api/orders/:orderId** - Update Order
Update order status or other fields

**Example Request:**
```json
{
  "status": "confirmed",
  "notes": "Confirmed for delivery"
}
```

#### 6. **DELETE /api/orders/:orderId** - Delete Order
Remove an order from the system

## Data Storage

### Local Storage (Client-side)
- **`orders`** - Array of orders with full details
  - Backup of submitted orders on user's browser
  - Persists page reloads

### Server Storage (Backend)
- **Location:** `backend/data/orders.json`
- **Format:** JSON array of order objects
- **Auto-created:** If directory doesn't exist
- **Auto-initialized:** If file doesn't exist

### Order Object Structure
```javascript
{
  "orderId": "ORD16804892341234",        // Unique order ID
  "customerName": "Nguyễn Văn A",
  "customerPhone": "0123456789",
  "customerAddress": "123 Đường Lê Lợi",
  "customerEmail": "user@example.com",
  "paymentMethod": "cod" | "bank",
  "items": [
    {
      "id": 1,
      "name": "Product Name",
      "price": 100000,
      "quantity": 2
    }
  ],
  "totalAmount": 200000,
  "status": "pending",
  "createdAt": "2026-03-07T10:30:00.000Z",
  "updatedAt": "2026-03-07T10:30:00.000Z"
}
```

## Google Analytics Tracking

The checkout process tracks these events:

### 1. **checkout_started**
Fired when checkout modal opens
```javascript
{
  'event_category': 'checkout',
  'value': 200000,
  'currency': 'VND'
}
```

### 2. **payment_method_selected**
Fired when user selects payment method
```javascript
{
  'event_category': 'checkout',
  'payment_method': 'cod' | 'bank'
}
```

### 3. **purchase**
Fired on successful order submission
```javascript
{
  'event_category': 'checkout',
  'transaction_id': 'ORD16804892341234',
  'value': 200000,
  'currency': 'VND',
  'items': [...]
}
```

### 4. **checkout_error**
Fired on order submission error
```javascript
{
  'event_category': 'checkout',
  'error_message': 'Error message...'
}
```

## Form Validation

### Customer Name
- Required
- Min 2 characters
- Max 100 characters

### Phone Number
- Required
- Format: 10+ digits with optional formatting
- Regex: `/^[0-9\s\-\+\(\)]{10,}$/`
- Examples: `0123456789`, `(012) 3456789`, `+84 12 3456789`

### Address
- Required
- Min 10 characters
- Max 500 characters
- Support for multi-line input

### Email
- Optional
- Valid email format if provided
- HTML5 validation

## Payment Methods

### COD (Cash on Delivery)
- **Default option**
- Customer pays when receiving order
- **Status:** Available immediately
- **Best for:** Vietnam customers

### Bank Transfer
- Customer transfers money to PetShop account
- **Bank Details:**
  - Bank: Vietcombank
  - Account: 1234567890
  - Holder: PetShop Store

## Order Status

### Status Values
- **pending** - Order created, awaiting confirmation
- **confirmed** - Order confirmed by store
- **processing** - Order being prepared
- **shipped** - Order sent out
- **delivered** - Order received by customer
- **cancelled** - Order cancelled

## Testing

### Test Checkout Flow
1. Add products to cart
2. Click "Thanh toán" button
3. Fill in all required fields:
   - Name: "Nguyễn Văn Test"
   - Phone: "0987654321"
   - Address: "123 Đường Test"
4. Select payment method
5. Click "Đặt hàng"
6. Should see success message with Order ID

### Test API Endpoints

**Create order:**
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test User",
    "customerPhone": "0123456789",
    "customerAddress": "Test Address",
    "paymentMethod": "cod",
    "items": [],
    "totalAmount": 100000
  }'
```

**Get all orders:**
```bash
curl http://localhost:3000/api/orders
```

**Get statistics:**
```bash
curl http://localhost:3000/api/orders/stats
```

**Get single order:**
```bash
curl http://localhost:3000/api/orders/ORD16804892341234
```

## Configuration

### Change Bank Details
Edit [backend/routes/orders.js](../backend/routes/orders.js) or update in checkout modal HTML

### Modify Payment Methods
Edit `PAYMENT_OPTIONS` in [frontend/assets/js/checkout.js](../frontend/assets/js/checkout.js)

### Customize Order ID Format
Edit `generateOrderId()` function in [backend/routes/orders.js](../backend/routes/orders.js)

## Error Handling

### Frontend Validation Errors
- Empty required fields → "Vui lòng điền đầy đủ thông tin bắt buộc"
- Invalid phone → "Số điện thoại không hợp lệ"
- Empty cart → "Giỏ hàng trống"

### Backend Errors
- Missing fields → 400 Bad Request
- Server error → 500 Internal Server Error
- All errors logged to console

### Network Errors
- Handled gracefully with user-friendly messages
- Maintains form data for retry
- Tracks error in Google Analytics

## Security Considerations

- Phone number validation to prevent spam
- Email optional (reduces data collection)
- Orders stored with timestamp for audit
- Input sanitization recommended for production
- Add user authentication for sensitive operations
- Consider HTTPS for real transactions

## Future Enhancements

1. **Email Notifications**
   - Send confirmation email with order details
   - Send delivery tracking updates

2. **SMS Notifications**
   - Send SMS when order status changes
   - Delivery confirmation SMS

3. **Order History**
   - User dashboard showing past orders
   - Order tracking with real-time status
   - Download invoice as PDF

4. **Payment Gateway Integration**
   - Stripe for international payments
   - VNPay for Vietnamese payments
   - Online payment confirmation

5. **Admin Dashboard**
   - View all orders
   - Manage order status
   - Export orders to CSV/Excel
   - Order analytics and reports

6. **Inventory Management**
   - Check stock availability
   - Auto-reduce stock on order
   - Notify when stock is low

## Files Summary

```
Frontend:
├── index.html                  # Checkout modal HTML
├── assets/
│   ├── css/style.css          # Checkout styles
│   └── js/
│       ├── checkout.js         # Checkout logic
│       └── cart.js             # Cart integration

Backend:
├── routes/
│   └── orders.js              # Order API endpoints
├── server.js                  # Updated with orders routes
└── data/
    └── orders.json            # Orders storage (auto-created)
```

---

**Last Updated:** March 7, 2026
**Version:** 1.0
