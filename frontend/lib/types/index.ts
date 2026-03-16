export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'USER';
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    status: string;
    data: {
        user: User;
        tokens: {
            accessToken: string;
            // refreshToken is set as HttpOnly cookie — never in response body
        };
    };
}

export interface ApiError {
    status: string;
    message: string;
    statusCode?: number;
    errors?: any[];
}
