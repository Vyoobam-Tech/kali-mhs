import { create } from 'zustand';
import { User } from '@/lib/types';

interface AuthState {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    setAuth: (user: User, accessToken: string) => void;
    logout: () => void;
    updateUser: (user: Partial<User>) => void;
}

// Token is stored in memory only — never in localStorage.
// This prevents XSS attacks from stealing the access token.
// Session is restored on page load via the HttpOnly refresh token cookie (see CRIT-03).
export const useAuthStore = create<AuthState>()((set) => ({
    user: null,
    accessToken: null,
    isAuthenticated: false,

    setAuth: (user, accessToken) =>
        set({ user, accessToken, isAuthenticated: true }),

    logout: () =>
        set({ user: null, accessToken: null, isAuthenticated: false }),

    updateUser: (updates) =>
        set((state) => ({
            user: state.user ? { ...state.user, ...updates } : null,
        })),
}));
