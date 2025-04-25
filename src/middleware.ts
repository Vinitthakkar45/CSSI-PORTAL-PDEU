import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  const authPages = ['/signin', '/'];

  const isHomeRoute = pathname === '/home' || pathname.startsWith('/home/');

  const isAdminRoute = pathname === '/admin' || pathname.includes('/admin/');
  const isCoordRoute = pathname === '/coordinator' || pathname.includes('/coordinator/');

  if (isCoordRoute && token?.role !== 'coordinator') {
    return NextResponse.redirect(new URL('/home', req.url));
  }

  // If user is not authenticated and tries to access protected routes
  if (isAdminRoute && token?.role !== 'admin') {
    return NextResponse.redirect(new URL('/home', req.url));
  }
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
