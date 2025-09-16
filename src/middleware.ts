import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the request is for harati routes (excluding login)
  if (pathname.startsWith('/harati/') && !pathname.startsWith('/harati/login')) {
    const sessionToken = request.cookies.get('admin-session')?.value;
    
    // Simple check - if no session token, redirect to login
    // The actual session verification will happen in the page components
    if (!sessionToken) {
      return NextResponse.redirect(new URL('/harati/login', request.url));
    }
  }

  // Check if the request is for admin API routes (excluding auth routes)
  if (pathname.startsWith('/api/admin/') && !pathname.startsWith('/api/admin/auth/')) {
    const sessionToken = request.cookies.get('admin-session')?.value;
    
    // Simple check - if no session token, return 401
    // The actual session verification will happen in the API routes
    if (!sessionToken) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/admin/:path*',
  ],
};