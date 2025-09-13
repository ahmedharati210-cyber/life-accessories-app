# Stock Tracking System Documentation

## Overview

The Life Accessories stock tracking system provides comprehensive inventory management with automated alerts, real-time updates, and complete audit trails. The system ensures accurate stock levels and prevents overselling.

## Features Implemented

### ✅ 1. Low Stock Alerts
- **Automatic Detection**: Monitors stock levels and triggers alerts when inventory falls below threshold (5 items)
- **Real-time Notifications**: Sends email alerts to admin when products are low in stock or out of stock
- **Configurable Thresholds**: Easy to adjust low stock and out-of-stock thresholds
- **Admin Dashboard**: Visual alerts in the admin panel with product details

### ✅ 2. Inventory Updates on Purchase
- **Automatic Stock Reduction**: Stock is decremented when orders are confirmed
- **Stock Restoration**: Stock is restored when confirmed orders are cancelled
- **Real-time Validation**: Prevents overselling by checking stock availability during checkout
- **Error Handling**: Graceful handling of stock update failures

### ✅ 3. Stock History Tracking
- **Complete Audit Trail**: Every stock change is recorded with timestamp and reason
- **Change Types**: Tracks purchases, restocks, manual adjustments, returns, and damage
- **Product-specific History**: View stock history for individual products
- **Admin Interface**: Easy-to-use interface for viewing and managing stock history

### ✅ 4. Stock Validation During Checkout
- **Pre-purchase Validation**: Checks stock availability before allowing order completion
- **User-friendly Errors**: Clear error messages when products are unavailable
- **Real-time Updates**: Stock levels are checked at the moment of purchase

### ✅ 5. Admin Interface for Stock Management
- **Stock Overview Dashboard**: Visual summary of inventory status
- **Low Stock Alerts Panel**: Dedicated section for managing stock alerts
- **Stock History Viewer**: Complete audit trail with filtering and pagination
- **Manual Stock Adjustment**: Ability to manually adjust stock levels with reasons

### ✅ 6. Manual Stock Adjustment
- **Admin Controls**: Easy-to-use interface for manual stock updates
- **Reason Tracking**: Every adjustment requires a reason for accountability
- **Real-time Updates**: Changes are immediately reflected across the system
- **Audit Trail**: All manual adjustments are logged in stock history

## Technical Implementation

### Database Schema

#### Products Collection
```javascript
{
  _id: ObjectId,
  name: String,
  stock: Number,        // Current stock quantity
  inStock: Boolean,     // Whether product is available
  // ... other product fields
}
```

#### Stock History Collection
```javascript
{
  _id: ObjectId,
  productId: String,    // Reference to product
  productName: String,  // Product name for easy reference
  changeType: String,   // 'purchase', 'restock', 'adjustment', 'return', 'damage'
  quantityChange: Number, // Positive for increase, negative for decrease
  previousStock: Number,
  newStock: Number,
  reason: String,       // Reason for change
  orderId: String,      // Reference to order (if applicable)
  adminId: String,      // Admin who made change (if applicable)
  timestamp: String     // ISO timestamp
}
```

### API Endpoints

#### Stock Management
- `GET /api/admin/stock?type=alerts` - Get low stock alerts
- `GET /api/admin/stock?type=history` - Get stock history
- `POST /api/admin/stock` - Adjust stock manually

#### Automated Alerts
- `GET /api/cron/stock-alerts` - Cron job endpoint for checking alerts

### Services

#### StockService
Main service class handling all stock-related operations:
- `checkLowStockAlerts()` - Check for low stock and send notifications
- `updateStock()` - Update product stock and create history record
- `validateStockAvailability()` - Validate stock for order items
- `processOrderStockUpdate()` - Process stock updates for orders
- `adjustStock()` - Manual stock adjustment
- `getStockHistory()` - Retrieve stock history

## Setup Instructions

### 1. Database Setup
Run the setup script to create the stock history collection and indexes:

```bash
cd life-accessories
node scripts/setup-stock-tracking.js
```

### 2. Environment Variables
Add these to your `.env.local` file:

```env
# Stock tracking
LOW_STOCK_THRESHOLD=5
OUT_OF_STOCK_THRESHOLD=0

# Cron job security (optional)
CRON_SECRET=your_cron_secret_here
```

### 3. Admin Panel Access
Navigate to `/admin/stock` to access the stock management interface.

## Usage Guide

### For Administrators

#### Managing Stock
1. **View Stock Overview**: Go to Admin → Stock → Overview
2. **Check Alerts**: Go to Admin → Stock → Alerts
3. **View History**: Go to Admin → Stock → History
4. **Adjust Stock**: Go to Admin → Stock → Adjust

#### Manual Stock Adjustment
1. Select the product from the dropdown
2. Enter the new stock quantity
3. Provide a reason for the adjustment
4. Click "Update Stock"

#### Product Management
1. When creating/editing products, set the initial stock quantity
2. The "In Stock" checkbox will automatically update based on stock quantity
3. Stock changes are automatically tracked in history

### For Customers

#### Shopping Experience
- Products show current stock status ("متوفر" with quantity)
- Out-of-stock products are disabled for purchase
- Clear error messages when products are unavailable
- Stock levels are checked in real-time during checkout

## Automated Features

### Low Stock Alerts
- **Trigger**: When stock falls to 5 items or below
- **Notification**: Email sent to admin with product details
- **Frequency**: Can be triggered manually or via cron job

### Stock Updates
- **Order Confirmation**: Stock is automatically decremented
- **Order Cancellation**: Stock is automatically restored
- **Real-time**: Updates happen immediately when order status changes

### History Tracking
- **Automatic**: Every stock change is logged
- **Detailed**: Includes reason, timestamp, and user information
- **Searchable**: Easy to find specific changes

## Monitoring and Maintenance

### Regular Tasks
1. **Check Alerts**: Review low stock alerts regularly
2. **Monitor History**: Review stock changes for anomalies
3. **Update Thresholds**: Adjust low stock thresholds as needed
4. **Backup Data**: Ensure stock history is included in backups

### Troubleshooting
1. **Stock Discrepancies**: Check stock history for the product
2. **Missing Alerts**: Verify notification settings and email configuration
3. **Performance Issues**: Check database indexes on stock history collection

## Security Considerations

### Access Control
- Stock management requires admin authentication
- All stock changes are logged with admin ID
- Sensitive operations are protected by proper authorization

### Data Integrity
- Stock updates are atomic operations
- Validation prevents negative stock quantities
- History records cannot be modified after creation

### Audit Trail
- Complete history of all stock changes
- Timestamp and user tracking
- Reason codes for accountability

## Future Enhancements

### Potential Improvements
1. **Bulk Stock Updates**: Import stock levels from CSV
2. **Advanced Analytics**: Stock movement reports and trends
3. **Supplier Integration**: Automatic restock notifications
4. **Mobile Alerts**: SMS notifications for critical stock levels
5. **Stock Forecasting**: Predict stock needs based on sales patterns

### Integration Opportunities
1. **External Inventory Systems**: Connect with existing inventory management
2. **Supplier APIs**: Automatic restock ordering
3. **Analytics Platforms**: Export data for business intelligence
4. **Notification Services**: Integration with Slack, Discord, etc.

## Support

For technical support or questions about the stock tracking system:
1. Check the admin panel for error messages
2. Review the stock history for recent changes
3. Verify database connectivity and permissions
4. Check notification service configuration

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Status**: Production Ready ✅
