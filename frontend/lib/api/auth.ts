import { apiClient } from './client';
import { AuthResponse } from '@/lib/types';
import { z } from 'zod';

// Login Schema
export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type LoginCredentials = z.infer<typeof loginSchema>;

// Register Schema
export const registerSchema = z.object({
    firstName: z.string().min(2, 'First name is required'),
    lastName: z.string().min(2, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export type RegisterCredentials = z.infer<typeof registerSchema>;

export const authApi = {
    login: async (credentials: LoginCredentials) => {
        const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
        return response.data;
    },

    register: async (data: Omit<RegisterCredentials, 'confirmPassword'>) => {
        const response = await apiClient.post<AuthResponse>('/auth/register', data);
        return response.data;
    },

    /**
     * Silently restore session using the HttpOnly refresh token cookie.
     * Called on page load to rehydrate the in-memory auth store.
     */
    refresh: async (): Promise<AuthResponse['data'] | null> => {
        try {
            const response = await apiClient.post<AuthResponse>('/auth/refresh');
            return response.data.data;
        } catch {
            return null;
        }
    },

    logout: async () => {
        try {
            await apiClient.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        }
    },

    getProfile: async () => {
        const response = await apiClient.get<AuthResponse['data']['user']>('/auth/profile');
        return response.data;
    },
};
