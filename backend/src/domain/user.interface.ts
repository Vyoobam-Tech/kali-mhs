/**
 * User Roles Enum
 * Defines the three role levels for the system
 */
export enum UserRole {
    SUPER_ADMIN = 'SUPER_ADMIN',
    ADMIN = 'ADMIN',
    EDITOR = 'EDITOR',
}

/**
 * User Status Enum
 */
export enum UserStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    SUSPENDED = 'SUSPENDED',
}

/**
 * User Interface
 * Domain entity representing a user in the system
 */
export interface IUser {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    status: UserStatus;
    tokenVersion: number;
    lastLogin?: Date;
    createdAt: Date;
    updatedAt: Date;
    createdBy?: string;
    updatedBy?: string;
}

/**
 * User Creation DTO
 * Data required to create a new user
 */
export interface ICreateUser {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    createdBy?: string;
}

/**
 * User Update DTO
 * Data that can be updated for a user
 */
export interface IUpdateUser {
    firstName?: string;
    lastName?: string;
    role?: UserRole;
    status?: UserStatus;
    updatedBy?: string;
}

/**
 * User Response DTO
 * User data returned to clients (without sensitive info)
 */
export interface IUserResponse {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
    role: UserRole;
    status: UserStatus;
    lastLogin?: Date;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Login Credentials
 */
export interface ILoginCredentials {
    email: string;
    password: string;
}

/**
 * Authentication Tokens
 */
export interface IAuthTokens {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

/**
 * JWT Payload
 */
export interface IJwtPayload {
    userId: string;
    email: string;
    role: UserRole;
    iat?: number;
    exp?: number;
}

/**
 * Refresh Token Payload
 */
export interface IRefreshTokenPayload {
    userId: string;
    tokenVersion: number;
    iat?: number;
    exp?: number;
}
