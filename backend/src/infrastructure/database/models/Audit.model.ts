import mongoose, { Schema, Document, Model } from 'mongoose';
import { IAuditLog, AuditAction, AuditLevel } from '@domain/audit.interface';

export interface IAuditLogDocument extends Omit<IAuditLog, 'id'>, Document { }

const auditLogSchema = new Schema<IAuditLogDocument>(
    {
        action: {
            type: String,
            enum: Object.values(AuditAction),
            required: [true, 'Action is required'],
            index: true,
        },
        level: {
            type: String,
            enum: Object.values(AuditLevel),
            default: AuditLevel.INFO,
            required: true,
            index: true,
        },
        actor: {
            userId: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                index: true,
            },
            email: String,
            ipAddress: String,
            userAgent: String,
        },
        resource: {
            type: String,
            resourceId: String,
            resourceName: String,
        },
        details: Schema.Types.Mixed,
        result: {
            type: String,
            enum: ['SUCCESS', 'FAILURE', 'PARTIAL'],
            default: 'SUCCESS',
        },
        errorMessage: String,
        riskScore: {
            type: Number,
            min: 0,
            max: 100,
            default: 0,
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: function (_doc: any, ret: any) {
                ret.id = ret._id.toString();
                delete ret._id;
                delete ret.__v;
                return ret;
            },
        },
    }
);

// Indexes for performance
auditLogSchema.index({ action: 1, createdAt: -1 });
auditLogSchema.index({ 'actor.userId': 1, createdAt: -1 });
auditLogSchema.index({ level: 1, createdAt: -1 });
auditLogSchema.index({ riskScore: -1 });
auditLogSchema.index({ createdAt: 1 }); // No TTL — use manual archival to comply with audit retention policies

export const AuditLogModel = mongoose.model<IAuditLogDocument>('AuditLog', auditLogSchema);
