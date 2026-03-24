import axios from 'axios';
import { useAuthStore } from '@/lib/store/authStore';

// Use relative URL so all requests go through Next.js → backend proxy (next.config.ts rewrites).
// This ensures the refreshToken cookie is always same-origin, avoiding SameSite/cross-port issues.
const baseURL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

export const apiClient = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Required for HttpOnly refresh token cookie
});

// Request interceptor — read token from in-memory store, never localStorage
apiClient.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().accessToken;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor — auto-logout on 401
// Exception: do NOT redirect when the failing request is the refresh endpoint itself
// (a 401 there simply means no session cookie is present — not a loop condition).

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const isRefreshCall = error.config?.url?.includes('/auth/refresh');
        if (error.response?.status === 401 && !isRefreshCall) {
            useAuthStore.getState().logout();
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);
