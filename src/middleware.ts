import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Special auth pages that should redirect to /home if user is authenticated
  const authPages = ['/signin', '/'];

  // Protected routes - only /home and its sub-routes
  const isHomeRoute = pathname === '/home' || pathname.startsWith('/home/');

  // If user is not authenticated and tries to access protected routes
  if (isHomeRoute && !token) {
    return NextResponse.redirect(new URL('/signin', req.url));
  }

  // If user is authenticated and tries to access auth pages
  if (authPages.includes(pathname) && token) {
    return NextResponse.redirect(new URL('/home', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/signin', '/home', '/home/:path*'],
};
