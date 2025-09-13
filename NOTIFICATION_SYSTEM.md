# Notification System Documentation

## Overview

The Life Accessories notification system provides automated email and SMS notifications for order management. The system is designed to be optional for customers - if they provide an email address, they'll receive email notifications; if not, they'll only receive SMS notifications.

## Features

### 1. Order Confirmation Notifications
- **Email**: Beautiful HTML email with order details, customer info, and next steps
- **SMS**: Concise text message with order number, total, and delivery area
- **Admin**: Instant notification to admin about new orders with security risk assessment

### 2. Order Status Updates
- **Email**: Detailed status update with tracking info and delivery estimates
- **SMS**: Quick status update with tracking number if available
- **Admin**: Real-time updates on order status changes

### 3. Admin Notifications
- **Email**: Comprehensive order details with security analysis
- **SMS**: Quick alert with order number, customer name, and risk level

## Services Used

### Email Service (Resend)
- **Provider**: Resend API
- **Templates**: Custom HTML templates with Arabic RTL support
- **Features**: Order confirmation, admin alerts, status updates

### SMS Service (Twilio)
- **Provider**: Twilio API
- **Features**: Order confirmation, admin alerts, status updates
- **Phone Format**: Automatic conversion to international format (+218 for Libya)

## Configuration

### Environment Variables

Add these to your `.env.local` file:

```env
# Email Notifications (Resend) - Required
RESEND_API_KEY=re_your_resend_api_key_here
ADMIN_EMAIL=admin@lifeaccessories.com

# SMS Notifications (Twilio) - Optional
# Set SMS_NOTIFICATIONS_ENABLED=true to enable SMS notifications
SMS_NOTIFICATIONS_ENABLED=false
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890
ADMIN_PHONE=+218912345678
```

### SMS Notifications (Optional)

SMS notifications are **disabled by default**. To enable them:

1. Set `SMS_NOTIFICATIONS_ENABLED=true` in your environment variables
2. Configure your Twilio credentials
3. Restart your application

**Note**: Email notifications will work regardless of SMS settings.

### Setup Instructions

1. **Resend Setup**:
   - Sign up at [resend.com](https://resend.com)
   - Get your API key from the dashboard
   - Add your domain for sending emails

2. **Twilio Setup**:
   - Sign up at [twilio.com](https://twilio.com)
   - Get your Account SID and Auth Token
   - Purchase a phone number for sending SMS

## API Endpoints

### 1. Order Creation with Notifications
- **Endpoint**: `POST /api/order`
- **Description**: Creates order and sends automatic notifications
- **Notifications**: Customer confirmation + Admin alert

### 2. Order Status Update
- **Endpoint**: `PATCH /api/orders/[id]/status`
- **Description**: Updates order status and sends notifications
- **Body**:
  ```json
  {
    "status": "confirmed|shipped|delivered|cancelled",
    "trackingInfo": "optional tracking number",
    "estimatedDelivery": "optional delivery estimate",
    "notes": "optional additional notes"
  }
  ```

### 3. Manual Notification Sending
- **Endpoint**: `POST /api/notifications/send`
- **Description**: Send manual notifications from admin panel
- **Body**:
  ```json
  {
    "orderId": "order_id",
    "type": "confirmation|status_update|admin_alert",
    "status": "optional new status",
    "trackingInfo": "optional tracking info",
    "estimatedDelivery": "optional delivery estimate",
    "notes": "optional notes"
  }
  ```

## Admin Panel Features

### Notification Controls
- **Location**: Order details modal in admin panel
- **Features**:
  - Select notification type (confirmation, status update, admin alert)
  - Update order status with notifications
  - Add tracking information
  - Add delivery estimates
  - Add custom notes
  - View notification status (email/SMS availability)

### Status Management
- **Quick Status Updates**: Change order status with automatic notifications
- **Bulk Operations**: Update multiple orders at once
- **Tracking Integration**: Add tracking numbers and delivery estimates

## Email Templates

### Order Confirmation Template
- **Language**: Arabic (RTL)
- **Content**: Order details, customer info, next steps
- **Styling**: Modern design with gradients and responsive layout

### Admin Notification Template
- **Language**: Arabic (RTL)
- **Content**: Order details, security analysis, risk assessment
- **Styling**: Alert-style design with risk level indicators

### Status Update Template
- **Language**: Arabic (RTL)
- **Content**: Status change, tracking info, delivery estimates
- **Styling**: Status-specific color coding

## SMS Templates

### Order Confirmation SMS
```
مرحباً [Customer Name]! تم استلام طلبك رقم [Order Number] بنجاح. المجموع: [Total] د.ل. منطقة التوصيل: [Area]. سنتواصل معك قريباً. شكراً لاختيارك Life Accessories!
```

### Admin Alert SMS
```
طلب جديد! رقم: [Order Number] - العميل: [Customer Name] - المجموع: [Total] د.ل - مستوى المخاطر: [Risk Level]
```

### Status Update SMS
```
مرحباً [Customer Name]! تم تحديث حالة طلبك رقم [Order Number] إلى: [Status]. [Tracking Info] شكراً لاختيارك Life Accessories!
```

## Error Handling

### Graceful Degradation
- Notifications are sent asynchronously
- Order creation doesn't fail if notifications fail
- Logs all notification attempts and errors

### Retry Logic
- Failed notifications are logged for manual retry
- Admin can resend notifications from the admin panel
- Error messages are user-friendly

## Security Features

### Risk Assessment
- IP address tracking
- User agent analysis
- Risk score calculation
- Admin alerts for high-risk orders

### Data Protection
- No sensitive data in logs
- Secure API key storage
- Input validation and sanitization

## Monitoring and Logs

### Console Logging
- Notification send attempts
- Success/failure status
- Error details for debugging

### Admin Panel
- Notification status indicators
- Manual retry capabilities
- Order history with notification status

## Testing

### Test Notifications
1. Create a test order with your email/phone
2. Check email inbox for confirmation
3. Check SMS for confirmation
4. Update order status and verify notifications

### Admin Testing
1. Go to admin panel orders page
2. Click on an order to view details
3. Use notification controls to send test notifications
4. Verify both email and SMS delivery

## Troubleshooting

### Common Issues

1. **No Email Notifications**:
   - Check RESEND_API_KEY is set correctly
   - Verify domain is configured in Resend
   - Check customer email is provided

2. **No SMS Notifications**:
   - Check Twilio credentials are correct
   - Verify phone number format
   - Check Twilio account balance

3. **Admin Notifications Not Working**:
   - Check ADMIN_EMAIL and ADMIN_PHONE are set
   - Verify notification service is running
   - Check console logs for errors

### Debug Steps

1. Check environment variables are loaded
2. Verify API keys are valid
3. Test with manual notification sending
4. Check console logs for detailed error messages

## Future Enhancements

### Planned Features
- Email template customization
- SMS template customization
- Notification preferences for customers
- Delivery time estimates
- Order tracking page
- Push notifications for admin app

### Integration Opportunities
- WhatsApp Business API
- Telegram notifications
- Slack integration for admin alerts
- Webhook support for external systems
