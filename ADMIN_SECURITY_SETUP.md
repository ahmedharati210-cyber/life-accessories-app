# Admin Panel Security Setup

## Overview
The admin panel is now secured with authentication. Only authorized users can access the admin area.

## Security Features
- **Authentication Required**: All admin routes require login
- **Session Management**: Secure encrypted sessions with 24-hour expiration
- **API Protection**: All admin API routes are protected by middleware
- **No Registration**: Admin accounts cannot be created through the UI
- **Secure Cookies**: HTTP-only, secure cookies for session management

## Setup Instructions

### 1. Environment Variables
Add these variables to your `.env.local` file:

```env
# Admin Panel Security
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password_here
ADMIN_SESSION_SECRET=your_admin_session_secret_here
```

### 2. Generate Secure Credentials
Replace the placeholder values with secure credentials:

- **ADMIN_USERNAME**: Choose a strong username (default: `admin`)
- **ADMIN_PASSWORD**: Use a strong password with at least 12 characters
- **ADMIN_SESSION_SECRET**: Generate a random 32+ character string

### 3. Access the Admin Panel
1. Navigate to `/admin` - you'll be redirected to `/admin/login`
2. Enter your admin credentials
3. You'll be redirected to the admin dashboard

## Security Notes

### Password Requirements
- Use a strong, unique password
- Consider using a password manager
- Change the default password immediately

### Session Security
- Sessions expire after 24 hours
- Sessions are encrypted and stored in HTTP-only cookies
- No sensitive data is stored in localStorage or sessionStorage

### API Protection
- All admin API routes (`/api/admin/*`) require authentication
- Auth routes (`/api/admin/auth/*`) are excluded from protection
- Invalid or expired sessions return 401 Unauthorized

### Access Control
- Only one admin account exists (no registration system)
- Admin credentials are stored in environment variables
- No database storage of admin credentials

## Troubleshooting

### Login Issues
- Verify environment variables are set correctly
- Check that the server has been restarted after adding env vars
- Ensure cookies are enabled in your browser

### Session Expired
- Sessions automatically expire after 24 hours
- Simply log in again to continue

### API Errors
- Ensure you're logged in before making API calls
- Check that the session cookie is present
- Verify the middleware is working correctly

## Security Best Practices

1. **Regular Password Updates**: Change your admin password periodically
2. **Secure Environment**: Keep your `.env.local` file secure and never commit it
3. **HTTPS in Production**: Ensure your production site uses HTTPS
4. **Monitor Access**: Check server logs for any unauthorized access attempts
5. **Backup Credentials**: Store your admin credentials securely offline

## File Structure
```
src/
├── lib/
│   └── adminAuth.ts          # Authentication utilities
├── app/
│   ├── admin/
│   │   ├── login/
│   │   │   └── page.tsx      # Login page
│   │   ├── dashboard/
│   │   │   └── page.tsx      # Admin dashboard
│   │   └── layout.tsx        # Protected admin layout
│   └── api/
│       └── admin/
│           └── auth/
│               ├── login/
│               │   └── route.ts
│               └── logout/
│                   └── route.ts
└── middleware.ts             # API protection middleware
```

## Support
If you encounter any issues with the admin security system, check:
1. Environment variables are properly set
2. Server has been restarted
3. Browser cookies are enabled
4. No typos in credentials
