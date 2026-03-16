import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_PREFIXES = ['/dashboard'];
const AUTH_ROUTES = ['/login', '/register'];

/**
 * Next.js Edge Middleware — runs before every matched request.
 *
 * - Unauthenticated users hitting /dashboard/* are redirected to /login
 *   with the original path preserved as ?redirect= so they land back
 *   after logging in.
 *
 * - Authenticated users hitting /login or /register are sent to /dashboard
 *   (avoids showing the login form to someone who is already signed in).
 *
 * Authentication is inferred from the presence of the HttpOnly `refreshToken`
 * cookie set by the backend on login. The middleware does NOT verify the token
 * (that would require a round-trip); full verification happens on the backend
 * for every API request via the Authorization header.
 */
export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
    const isAuthRoute = AUTH_ROUTES.some((p) => pathname.startsWith(p));

    // Presence of the cookie means the user has an active session
    const hasSession = req.cookies.has('refreshToken');

    if (isProtected && !hasSession) {
        const loginUrl = new URL('/login', req.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    if (isAuthRoute && hasSession) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/login',
        '/register',
    ],
};
