# Daily Stock Alerts Setup

## Overview
This document explains how to set up daily stock alerts that send email notifications only once per day instead of every time you visit the stock page.

## What Was Fixed

### 1. Stock Email Spam Issue
- **Problem**: Stock alerts were sending emails every time you clicked on the stock category in the admin panel
- **Solution**: Modified `StockService.checkLowStockAlerts()` to only send notifications when explicitly requested
- **Implementation**: Added a `sendNotifications` parameter (defaults to `false`)

### 2. Customer Purchase View Issue
- **Problem**: Eye icon in orders page was causing client-side errors
- **Solution**: Added proper error handling and improved the order details modal
- **Improvements**: 
  - Better error handling for the eye icon click
  - Improved order items display with proper images and pricing
  - Added fallback for missing order data
  - Enhanced modal layout and responsiveness

## How It Works Now

### Stock Alerts
1. **Admin Panel**: When you visit the stock page, it only displays alerts without sending emails
2. **Daily Cron Job**: A separate endpoint (`/api/cron`) sends daily email notifications
3. **Once Per Day**: The system tracks when alerts were last sent and only sends them once per day

### Order Details
1. **Eye Icon**: Now has proper error handling and won't crash the page
2. **Order Items**: Displays what customers actually purchased with proper images and pricing
3. **Better Layout**: Improved modal design with better information display

## Setting Up Daily Cron Job

### Option 1: Vercel Cron Jobs (Recommended)
Add this to your `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron",
      "schedule": "0 9 * * *"
    }
  ]
}
```

This runs the cron job daily at 9:00 AM UTC.

### Option 2: External Cron Service
Use services like:
- **cron-job.org**
- **EasyCron**
- **SetCronJob**

Set up a daily HTTP request to: `https://your-domain.com/api/cron`

### Option 3: Server Cron (if self-hosting)
Add to your server's crontab:
```bash
0 9 * * * curl -X GET https://your-domain.com/api/cron
```

## Testing

### Test the Cron Endpoint
```bash
# Run the test script
node scripts/test-daily-stock-alerts.js

# Or test manually
curl -X GET http://localhost:3000/api/cron
```

### Test Stock Alerts in Admin
1. Go to Admin Panel → Stock
2. Check the "Alerts" tab
3. Verify that no emails are sent when viewing alerts
4. Only the daily cron job should send emails

## Environment Variables

Add to your `.env.local`:
```env
CRON_SECRET=your-secret-key-here
```

This prevents unauthorized access to the cron endpoint.

## Files Modified

1. `src/lib/services/stockService.ts` - Added daily check logic
2. `src/app/api/admin/stock/route.ts` - Disabled notifications by default
3. `src/app/api/cron/route.ts` - New daily cron endpoint
4. `src/app/harati/orders/page.tsx` - Fixed order details modal
5. `scripts/test-daily-stock-alerts.js` - Test script

## Benefits

✅ **No More Email Spam**: Stock alerts only sent once per day
✅ **Better Order Management**: Can properly view customer purchases
✅ **Improved User Experience**: No more crashes when viewing order details
✅ **Proper Error Handling**: Better debugging and error messages
✅ **Scalable Solution**: Works with any cron service or hosting platform
