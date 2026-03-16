'use client';

import { useEffect, useRef } from 'react';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/store/authStore';

/**
 * SessionProvider
 *
 * Restores the user's auth session on page load by silently calling
 * POST /auth/refresh. The server reads the HttpOnly refresh token cookie
 * and returns a fresh access token + user profile.
 *
 * This runs once per page load / hard refresh.
 * On subsequent navigations (client-side routing), the in-memory store persists.
 */
export function SessionProvider({ children }: { children: React.ReactNode }) {
    const setAuth = useAuthStore((state) => state.setAuth);
    const restored = useRef(false);

    useEffect(() => {
        if (restored.current) return;
        restored.current = true;

        authApi.refresh().then((data) => {
            if (data?.user && data?.tokens?.accessToken) {
                setAuth(data.user, data.tokens.accessToken);
            }
        });
    }, [setAuth]);

    return <>{children}</>;
}
