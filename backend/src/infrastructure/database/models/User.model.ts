import mongoose, { Schema, Document } from 'mongoose';
import { IUser, UserRole, UserStatus } from '@domain/user.interface';

// Extend IUser with Mongoose Document
export interface IUserDocument extends IUser, Document { }

// User Schema
const userSchema = new Schema<IUserDocument>(
    {
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
            // Note: index is defined via userSchema.index({ email: 1 }) below — no duplicate here
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [8, 'Password must be at least 8 characters'],
            select: false, // Don't include password in queries by default
        },
        firstName: {
            type: String,
            required: [true, 'First name is required'],
            trim: true,
            maxlength: [50, 'First name cannot exceed 50 characters'],
        },
        lastName: {
            type: String,
            required: [true, 'Last name is required'],
            trim: true,
            maxlength: [50, 'Last name cannot exceed 50 characters'],
        },
        role: {
            type: String,
            enum: Object.values(UserRole),
            default: UserRole.EDITOR,
            required: true,
        },
        status: {
            type: String,
            enum: Object.values(UserStatus),
            default: UserStatus.ACTIVE,
            required: true,
        },
        tokenVersion: {
            type: Number,
            default: 0,
            select: false,
        },
        lastLogin: {
            type: Date,
        },
        passwordResetToken: {
            type: String,
            select: false,
        },
        passwordResetExpires: {
            type: Date,
            select: false,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        updatedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt automatically
        toJSON: {
            virtuals: true,
            transform: function (doc, ret) {
                ret.id = ret._id.toString();
                delete ret._id;
                delete ret.__v;
                delete ret.password; // Never include password in JSON
                return ret;
            },
        },
        toObject: {
            virtuals: true,
        },
    }
);

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });
userSchema.index({ createdAt: -1 });

// Virtual for full name
userSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});

// Pre-save hook to update lastLogin timestamp
userSchema.pre('save', function (next) {
    // Additional pre-save logic can be added here
    next();
});

// Static method to find by email
userSchema.statics.findByEmail = function (email: string) {
    return this.findOne({ email: email.toLowerCase() });
};

// Instance method to check if user is active
userSchema.methods.isActive = function (): boolean {
    return this.status === UserStatus.ACTIVE;
};

// Instance method to check if user has specific role
userSchema.methods.hasRole = function (role: UserRole): boolean {
    return this.role === role;
};

// Instance method to check if user is admin or super admin
userSchema.methods.isAdminOrAbove = function (): boolean {
    return this.role === UserRole.ADMIN || this.role === UserRole.SUPER_ADMIN;
};

// Export the model
export const UserModel = mongoose.model<IUserDocument>('User', userSchema);
