import { UserModel, IUserDocument } from '@infrastructure/database/models/User.model';
import { JWTService } from '@infrastructure/services/jwt.service';
import { PasswordUtil } from '@utils/password.util';
import {
    ICreateUser,
    ILoginCredentials,
    IAuthTokens,
    IUserResponse,
    UserRole,
    UserStatus,
} from '@domain/user.interface';
import { AppError } from '@middlewares/errorHandler';

/**
 * Authentication Use Cases
 * Contains business logic for authentication operations
 */
export class AuthUseCases {
    /**
     * Register a new user
     * @param userData - User registration data
     * @param createdBy - ID of the user creating this user (for audit)
     * @returns Created user and authentication tokens
     */
    static async register(
        userData: ICreateUser,
        createdBy?: string
    ): Promise<{ user: IUserResponse; tokens: IAuthTokens }> {
        // Check if user already exists
        const existingUser = await UserModel.findByEmail(userData.email);
        if (existingUser) {
            throw new AppError(409, 'User with this email already exists');
        }

        // Validate password strength
        const passwordValidation = PasswordUtil.validateStrength(userData.password);
        if (!passwordValidation.valid) {
            throw new AppError(400, 'Password does not meet requirements', true, passwordValidation.errors);
        }

        // Hash password
        const hashedPassword = await PasswordUtil.hash(userData.password);

        // Create user
        const user = new UserModel({
            email: userData.email,
            password: hashedPassword,
            firstName: userData.firstName,
            lastName: userData.lastName,
            role: userData.role || UserRole.EDITOR,
            status: UserStatus.ACTIVE,
            createdBy: createdBy || undefined,
        });

        await user.save();

        // Generate tokens
        const tokens = JWTService.generateTokenPair(
            user._id.toString(),
            user.email,
            user.role,
            user.tokenVersion
        );

        // Return user response (without password)
        const userResponse = this.toUserResponse(user);

        return { user: userResponse, tokens };
    }

    /**
     * Login user
     * @param credentials - User login credentials
     * @returns User data and authentication tokens
     */
    static async login(
        credentials: ILoginCredentials
    ): Promise<{ user: IUserResponse; tokens: IAuthTokens }> {
        // Find user by email (include password field)
        const user = await UserModel.findOne({ email: credentials.email }).select('+password');

        if (!user) {
            throw new AppError(401, 'Invalid email or password');
        }

        // Check if user is active
        if (user.status !== UserStatus.ACTIVE) {
            throw new AppError(403, 'Account is inactive or suspended');
        }

        // Verify password
        const isPasswordValid = await PasswordUtil.compare(credentials.password, user.password);

        if (!isPasswordValid) {
            throw new AppError(401, 'Invalid email or password');
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate tokens
        const tokens = JWTService.generateTokenPair(user._id.toString(), user.email, user.role, user.tokenVersion);

        // Return user response
        const userResponse = this.toUserResponse(user);

        return { user: userResponse, tokens };
    }

    /**
     * Refresh access token using refresh token
     * @param refreshToken - Refresh token
     * @returns New authentication tokens
     */
    static async refreshToken(refreshToken: string): Promise<IAuthTokens> {
        // Verify refresh token
        const payload = JWTService.verifyRefreshToken(refreshToken);

        // Find user (include tokenVersion for validation)
        const user = await UserModel.findById(payload.userId).select('+tokenVersion');

        if (!user) {
            throw new AppError(401, 'User not found');
        }

        // Check if user is active
        if (user.status !== UserStatus.ACTIVE) {
            throw new AppError(403, 'Account is inactive or suspended');
        }

        // Reject replayed or revoked refresh tokens
        if (payload.tokenVersion !== user.tokenVersion) {
            throw new AppError(401, 'Refresh token has been revoked');
        }

        // Increment tokenVersion in DB to invalidate the consumed refresh token
        const nextVersion = user.tokenVersion + 1;
        await UserModel.findByIdAndUpdate(user._id, { tokenVersion: nextVersion });

        const tokens = JWTService.generateTokenPair(
            user._id.toString(),
            user.email,
            user.role,
            nextVersion
        );

        return tokens;
    }

    /**
     * Logout — invalidate all outstanding refresh tokens by bumping tokenVersion
     */
    static async logout(userId: string): Promise<void> {
        await UserModel.findByIdAndUpdate(userId, { $inc: { tokenVersion: 1 } });
    }

    /**
     * Get authenticated user profile
     * @param userId - User ID
     * @returns User profile
     */
    static async getProfile(userId: string): Promise<IUserResponse> {
        const user = await UserModel.findById(userId);

        if (!user) {
            throw new AppError(404, 'User not found');
        }

        return this.toUserResponse(user);
    }

    /**
     * Change user password
     * @param userId - User ID
     * @param currentPassword - Current password
     * @param newPassword - New password
     */
    static async changePassword(
        userId: string,
        currentPassword: string,
        newPassword: string
    ): Promise<void> {
        // Find user with password
        const user = await UserModel.findById(userId).select('+password');

        if (!user) {
            throw new AppError(404, 'User not found');
        }

        // Verify current password
        const isPasswordValid = await PasswordUtil.compare(currentPassword, user.password);

        if (!isPasswordValid) {
            throw new AppError(401, 'Current password is incorrect');
        }

        // Validate new password strength
        const passwordValidation = PasswordUtil.validateStrength(newPassword);
        if (!passwordValidation.valid) {
            throw new AppError(400, 'New password does not meet requirements', true, passwordValidation.errors);
        }

        // Hash new password
        const hashedPassword = await PasswordUtil.hash(newPassword);

        // Update password and bump tokenVersion to invalidate all outstanding tokens
        user.password = hashedPassword;
        await user.save();
        await UserModel.findByIdAndUpdate(user._id, { $inc: { tokenVersion: 1 } });
    }

    /**
     * Convert User document to UserResponse (removes sensitive data)
     * @param user - User document from database
     * @returns User response DTO
     */
    private static toUserResponse(user: IUserDocument): IUserResponse {
        return {
            id: user._id.toString(),
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            fullName: user.fullName,
            role: user.role,
            status: user.status,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
}
