import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/session';

const protectedPrefixes = ['/admin'];
const publicRoutes = ['/admin/login'];

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const isProtectedRoute = protectedPrefixes.some(
    (r) => path.startsWith(r) && !publicRoutes.includes(path)
  );
  const isPublicRoute = publicRoutes.includes(path);

  const cookie = req.cookies.get('session')?.value;
  const session = await decrypt(cookie);

  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL('/admin/login', req.nextUrl));
  }

  if (isPublicRoute && session?.userId) {
    return NextResponse.redirect(new URL('/admin', req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
