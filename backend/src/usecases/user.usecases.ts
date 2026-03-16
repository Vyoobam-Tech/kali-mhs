import { UserModel } from '@infrastructure/database/models/User.model';
import { PasswordUtil } from '@utils/password.util';
import { IUpdateUser, IUserResponse, UserRole, UserStatus } from '@domain/user.interface';
import { AppError } from '@middlewares/errorHandler';

/**
 * User Management Use Cases
 * Contains business logic for user management operations (Admin functions)
 */
export class UserUseCases {
    /**
     * Get all users (with pagination and filtering)
     * @param page - Page number
     * @param limit - Items per page
     * @param role - Filter by role
     * @param status - Filter by status
     * @returns List of users and pagination info
     */
    static async getAllUsers(
        page: number = 1,
        limit: number = 20,
        role?: UserRole,
        status?: UserStatus
    ): Promise<{ users: IUserResponse[]; total: number; page: number; totalPages: number }> {
        const skip = (page - 1) * limit;

        // Build filter query
        const filter: any = {};
        if (role) filter.role = role;
        if (status) filter.status = status;

        // Get total count and users
        const [users, total] = await Promise.all([
            UserModel.find(filter).select('-password').sort({ createdAt: -1 }).skip(skip).limit(limit),
            UserModel.countDocuments(filter),
        ]);

        const userResponses = users.map((user) => this.toUserResponse(user));

        return {
            users: userResponses,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }

    /**
     * Get user by ID
     * @param userId - User ID
     * @returns User data
     */
    static async getUserById(userId: string): Promise<IUserResponse> {
        const user = await UserModel.findById(userId).select('-password');

        if (!user) {
            throw new AppError(404, 'User not found');
        }

        return this.toUserResponse(user);
    }

    /**
     * Update user (Admin function)
     * @param userId - User ID to update
     * @param updateData - Data to update
     * @param updatedBy - ID of admin making the update
     * @returns Updated user
     */
    static async updateUser(
        userId: string,
        updateData: IUpdateUser,
        updatedBy: string
    ): Promise<IUserResponse> {
        const user = await UserModel.findById(userId);

        if (!user) {
            throw new AppError(404, 'User not found');
        }

        // Update fields
        if (updateData.firstName) user.firstName = updateData.firstName;
        if (updateData.lastName) user.lastName = updateData.lastName;
        if (updateData.role) user.role = updateData.role;
        if (updateData.status) user.status = updateData.status;
        user.updatedBy = updatedBy as any;

        await user.save();

        return this.toUserResponse(user);
    }

    /**
     * Delete user (soft delete by changing status to INACTIVE)
     * @param userId - User ID to delete
     * @param deletedBy - ID of admin performing deletion
     */
    static async deleteUser(userId: string, deletedBy: string): Promise<void> {
        const user = await UserModel.findById(userId);

        if (!user) {
            throw new AppError(404, 'User not found');
        }

        // Soft delete: Set status to INACTIVE
        user.status = UserStatus.INACTIVE;
        user.updatedBy = deletedBy as any;
        await user.save();

        // For hard delete (use with caution):
        // await UserModel.findByIdAndDelete(userId);
    }

    /**
     * Activate/Deactivate user
     * @param userId - User ID
     * @param status - New status
     * @param updatedBy - ID of admin making the change
     * @returns Updated user
     */
    static async changeUserStatus(
        userId: string,
        status: UserStatus,
        updatedBy: string
    ): Promise<IUserResponse> {
        const user = await UserModel.findById(userId);

        if (!user) {
            throw new AppError(404, 'User not found');
        }

        user.status = status;
        user.updatedBy = updatedBy as any;
        await user.save();

        return this.toUserResponse(user);
    }

    /**
     * Search users by email or name
     * @param query - Search query
     * @param limit - Max results
     * @returns Matching users
     */
    static async searchUsers(query: string, limit: number = 10): Promise<IUserResponse[]> {
        const users = await UserModel.find({
            $or: [
                { email: { $regex: query, $options: 'i' } },
                { firstName: { $regex: query, $options: 'i' } },
                { lastName: { $regex: query, $options: 'i' } },
            ],
        })
            .select('-password')
            .limit(limit);

        return users.map((user) => this.toUserResponse(user));
    }

    /**
     * Reset user password (Admin function)
     * @param userId - User ID
     * @param newPassword - New password
     * @param updatedBy - ID of admin resetting password
     */
    static async resetUserPassword(
        userId: string,
        newPassword: string,
        updatedBy: string
    ): Promise<void> {
        // Validate password strength
        const passwordValidation = PasswordUtil.validateStrength(newPassword);
        if (!passwordValidation.valid) {
            throw new AppError(400, 'Password does not meet requirements', true, passwordValidation.errors);
        }

        const user = await UserModel.findById(userId);

        if (!user) {
            throw new AppError(404, 'User not found');
        }

        // Hash new password
        const hashedPassword = await PasswordUtil.hash(newPassword);

        user.password = hashedPassword;
        user.updatedBy = updatedBy as any;
        await user.save();
    }

    /**
     * Convert User document to UserResponse
     * @param user - User document
     * @returns User response DTO
     */
    private static toUserResponse(user: any): IUserResponse {
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
