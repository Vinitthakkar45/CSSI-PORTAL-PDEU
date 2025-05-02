import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const roleProtectedRoutes: { prefix: string; role: string }[] = [
  { prefix: '/api/admin', role: 'admin' },
  { prefix: '/api/coord', role: 'coordinator' },
  { prefix: '/api/faculty', role: 'faculty' },
  { prefix: '/api/student', role: 'student' },
  { prefix: '/home/admin', role: 'admin' },
  { prefix: '/home/coordinator', role: 'coordinator' },
];

const publicRoutes = ['/', '/signin'];

export async function middleware(req: NextRequest) {
  const requestHeaders = new Headers(req.headers);
  requestHeaders.delete('x-middleware-subrequest'); // Mitigate header exploit

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Enforce frontend-only access to ALL API routes
  if (pathname.startsWith('/api')) {
    const origin = req.headers.get('origin') || '';
    const referer = req.headers.get('referer') || '';
    const isAllowedDomain =
      origin.includes('cssi.pdpu.ac.in') ||
      referer.includes('cssi.pdpu.ac.in') ||
      origin.includes('localhost') ||
      referer.includes('localhost');

    // if (!isAllowedDomain) {
    //   return NextResponse.redirect(new URL('/not-found', req.url));
    // }
  }

  // Redirect authenticated users away from signin/home
  if (token && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/home', req.url));
  }

  // Block unauthenticated access to home pages
  if (!token && (pathname === '/home' || pathname.startsWith('/home/'))) {
    return NextResponse.redirect(new URL('/signin', req.url));
  }

  // Role-based route protection
  for (const { prefix, role } of roleProtectedRoutes) {
    if (pathname.startsWith(prefix)) {
      if (!token || token.role !== role) {
        const isApi = prefix.startsWith('/api');
        if (isApi) {
          return NextResponse.redirect(new URL('/not-found', req.url));
        } else {
          return NextResponse.redirect(new URL('/home', req.url), {
            headers: requestHeaders,
          });
        }
      }
    }
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ['/', '/signin', '/home', '/home/:path*', '/admin/:path*', '/coordinator/:path*', '/api/:path*'],
};
