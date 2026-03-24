'use client';

import { useEffect, useRef, useState } from 'react';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/store/authStore';

/**
 * SessionProvider
 *
 * Restores the user's auth session on page load by silently calling
 * POST /auth/refresh. The server reads the HttpOnly refresh token cookie
 * and returns a fresh access token + user profile.
 *
 * On client-side navigation (e.g. after login), the in-memory store is already
 * populated so children render immediately without waiting.
 *
 * On hard refresh, children are held until the refresh call resolves so that
 * protected API calls are never made without a valid access token.
 */
export function SessionProvider({ children }: { children: React.ReactNode }) {
    const setAuth = useAuthStore((state) => state.setAuth);
    const restored = useRef(false);
    // Skip the loading gate if we already have an access token in memory
    // (happens on client-side navigation — the Zustand store persists).
    const [ready, setReady] = useState(() => useAuthStore.getState().isAuthenticated);

    useEffect(() => {
        if (restored.current) return;
        restored.current = true;

        // Already authenticated via in-memory store — nothing to restore.
        // ready is already true from the useState in
        // itializer in this case.
        if (useAuthStore.getState().isAuthenticated) return;

        authApi.refresh().then((data) => {
            if (data?.user && data?.tokens?.accessToken) {
                setAuth(data.user, data.tokens.accessToken);
            }
            // Always unblock children. If the session was invalid the backend
            // cleared the cookie; any protected API call will return 401 and
            // client.ts will redirect to /login automatically.
            setReady(true);
        });
    }, [setAuth]);

    if (!ready) return null;

    return <>{children}</>;
}
