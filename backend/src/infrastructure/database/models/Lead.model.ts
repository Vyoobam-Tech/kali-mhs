import mongoose, { Schema, Document, Model } from 'mongoose';
import {
    ILead,
    ILeadActivity,
    LeadSource,
    LeadStatus,
    LeadPriority,
    ActivityType,
} from '@domain/lead.interface';

// Lead Document
export interface ILeadDocument extends Omit<ILead, 'id'>, Document { }

// Lead Activity Document  
export interface ILeadActivityDocument extends Omit<ILeadActivity, 'id'>, Document { }

// Lead Model
export interface ILeadModel extends Model<ILeadDocument> {
    findByEmail(email: string): Promise<ILeadDocument | null>;
    findByStatus(status: LeadStatus): Promise<ILeadDocument[]>;
}

// Lead Schema
const leadSchema = new Schema<ILeadDocument, ILeadModel>(
    {
        // Contact Info
        firstName: {
            type: String,
            required: [true, 'First name is required'],
            trim: true,
            index: true,
        },
        lastName: {
            type: String,
            required: [true, 'Last name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            lowercase: true,
            trim: true,
            unique: true,
            // index defined via leadSchema.index({ email: 1 }, { unique: true }) below
        },
        phone: String,
        company: {
            type: String,
            index: true,
        },
        designation: String,
        // Lead Details
        source: {
            type: String,
            enum: Object.values(LeadSource),
            required: [true, 'Lead source is required'],
            index: true,
        },
        status: {
            type: String,
            enum: Object.values(LeadStatus),
            default: LeadStatus.NEW,
            required: true,
            index: true,
        },
        priority: {
            type: String,
            enum: Object.values(LeadPriority),
            default: LeadPriority.MEDIUM,
            index: true,
        },
        score: {
            type: Number,
            min: 0,
            max: 100,
            default: 0,
            index: true,
        },
        // Source Details
        sourceDetails: {
            referenceId: String,
            referenceType: String,
            url: String,
            campaign: String,
        },
        // Interest
        interestedIn: [String],
        message: String,
        budget: String,
        timeline: String,
        // Location
        city: String,
        state: String,
        country: String,
        // Assignment
        assignedTo: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            index: true,
        },
        assignedAt: Date,
        // Conversion
        convertedToCustomer: {
            type: Boolean,
            default: false,
            index: true,
        },
        convertedAt: Date,
        dealValue: Number,
        // Engagement
        lastContactedAt: Date,
        lastActivityAt: Date,
        activityCount: {
            type: Number,
            default: 0,
        },
        // Tags
        tags: [String],
        // Notes
        notes: String,
        // Audit
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        updatedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        isDeleted: {
            type: Boolean,
            default: false,
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
                if (ret.isDeleted) delete ret.isDeleted;
                return ret;
            },
        },
    }
);

// Indexes
leadSchema.index({ email: 1 }, { unique: true });
leadSchema.index({ status: 1, priority: 1 });
leadSchema.index({ assignedTo: 1, status: 1 });
leadSchema.index({ score: -1 });
leadSchema.index({ source: 1 });
leadSchema.index({ createdAt: -1 });
leadSchema.index({ firstName: 'text', lastName: 'text', company: 'text' });

// Static methods
leadSchema.statics.findByEmail = function (this: ILeadModel, email: string) {
    return this.findOne({ email, isDeleted: false });
};

leadSchema.statics.findByStatus = function (this: ILeadModel, status: LeadStatus) {
    return this.find({ status, isDeleted: false }).sort({ score: -1, createdAt: -1 });
};

// Lead Activity Schema
const leadActivitySchema = new Schema<ILeadActivityDocument>(
    {
        lead: {
            type: Schema.Types.ObjectId,
            ref: 'Lead',
            required: true,
            index: true,
        },
        type: {
            type: String,
            enum: Object.values(ActivityType),
            required: [true, 'Activity type is required'],
            index: true,
        },
        subject: {
            type: String,
            required: [true, 'Subject is required'],
        },
        description: String,
        scheduledAt: Date,
        completedAt: Date,
        outcome: String,
        performedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
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

// Indexes
leadActivitySchema.index({ lead: 1, createdAt: -1 });
leadActivitySchema.index({ type: 1 });
leadActivitySchema.index({ performedBy: 1 });

// Export models
export const LeadModel = mongoose.model<ILeadDocument, ILeadModel>('Lead', leadSchema);
export const LeadActivityModel = mongoose.model<ILeadActivityDocument>('LeadActivity', leadActivitySchema);
