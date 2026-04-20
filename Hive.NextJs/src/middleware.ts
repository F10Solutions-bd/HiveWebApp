import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getRequiredRoles } from '@/lib/getRequiredRoles';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const isLoginPage = pathname === '/login';

    const cookieHeader = req.headers.get('cookie') ?? '';
    const accessToken = req.cookies.get('auth_access_token')?.value;

    if (process.env.NODE_ENV === 'development') {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    }

    let isAuthenticated = true;

    try {
        if (!accessToken) {
            console.log('Middleware: validating access token');

            const response = await fetch(`${API_BASE_URL}/auth/access-token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    cookie: cookieHeader,
                    'x-from-middleware': 'secret-bypass-key'
                },
            });

            if (!response.ok) {
                isAuthenticated = false;
            }
        }

        // Redirect authenticated users away from login
        if (isLoginPage && isAuthenticated) {
            return NextResponse.redirect(new URL('/', req.url));
        }

        // Redirect unauthenticated users to login
        if (!isLoginPage && !isAuthenticated) {
            return NextResponse.redirect(new URL('/login', req.url));
        }

        const requiredRoles = getRequiredRoles(pathname);
        if (requiredRoles != null) {
            const response = await fetch(
                `${API_BASE_URL}/users/validate-user-roles`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        cookie: cookieHeader,
                        Authorization: `Bearer ${accessToken}`,
                        'x-from-middleware': 'secret-bypass-key'
                    },
                    body: JSON.stringify({
                        requiredRoles,
                    }),
                }
            );

            if (!response.ok) {
                return NextResponse.redirect(new URL('/unauthorized', req.url));
            }

            let isAuthorized = false;
            const result = await response.json();
            isAuthorized = result?.data === true;

            if (!isAuthorized) {
                return NextResponse.redirect(new URL('/unauthorized', req.url));
            }
        }
    } catch (error) {
        console.error('Middleware backend call failed:', error);

        if (!isLoginPage) {
            return NextResponse.redirect(new URL('/login', req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next|api|static|images|favicon.ico).*)'],
    runtime: 'nodejs',
};
