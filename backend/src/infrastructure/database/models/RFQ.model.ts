import mongoose, { Schema, Document, Model } from 'mongoose';
import {
    IRFQ,
    RFQStatus,
    RFQPriority,
    ProjectType,
} from '@domain/rfq.interface';
import { CounterModel } from './Counter.model';

// Extend IRFQ with Mongoose Document
export interface IRFQDocument extends Omit<IRFQ, 'id'>, Document { }

// RFQ Model interface
export interface IRFQModel extends Model<IRFQDocument> {
    findByRFQNumber(rfqNumber: string): Promise<IRFQDocument | null>;
    findByStatus(status: RFQStatus): Promise<IRFQDocument[]>;
    findAssignedTo(userId: string): Promise<IRFQDocument[]>;
}

// RFQ Schema
const rfqSchema = new Schema<IRFQDocument, IRFQModel>(
    {
        rfqNumber: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        status: {
            type: String,
            enum: Object.values(RFQStatus),
            default: RFQStatus.DRAFT,
            required: true,
            index: true,
        },
        priority: {
            type: String,
            enum: Object.values(RFQPriority),
            default: RFQPriority.MEDIUM,
            required: true,
            index: true,
        },
        // Contact Information
        contact: {
            firstName: { type: String, required: true },
            lastName: { type: String, required: true },
            email: { type: String, required: true, lowercase: true },
            phone: { type: String, required: true },
            company: String,
            designation: String,
            address: String,
            city: String,
            state: String,
            country: String,
            pincode: String,
        },
        // Project Information
        project: {
            projectName: String,
            projectType: {
                type: String,
                enum: Object.values(ProjectType),
                required: true,
            },
            projectLocation: String,
            projectTimeline: String,
            budget: String,
            description: String,
        },
        // RFQ Items
        items: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product',
                },
                productName: { type: String, required: true },
                category: { type: String, required: true },
                quantity: { type: Number, required: true, min: 1 },
                unit: { type: String, required: true },
                specifications: String,
                notes: String,
            },
        ],
        // Top-level notes / specifications from wizard
        specifications: String,
        // Attachments (uploaded files)
        attachments: [
            {
                filename: { type: String, required: true },
                originalName: { type: String, required: true },
                path: { type: String, required: true },
                size: { type: Number, required: true },
                mimeType: { type: String, required: true },
                uploadedAt: { type: Date, default: Date.now },
            },
        ],
        // Quote Response
        quote: {
            items: [
                {
                    productName: { type: String, required: true },
                    quantity: { type: Number, required: true },
                    unit: { type: String, required: true },
                    unitPrice: { type: Number, required: true },
                    totalPrice: { type: Number, required: true },
                    leadTime: String,
                    notes: String,
                },
            ],
            subtotal: Number,
            tax: Number,
            discount: Number,
            total: Number,
            currency: { type: String, default: 'INR' },
            validUntil: Date,
            terms: String,
            notes: String,
            quotedBy: {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
            quotedAt: Date,
        },
        // Notes
        notes: String,
        customerNotes: String,
        // Timeline
        submittedAt: Date,
        reviewedAt: Date,
        quotedAt: Date,
        expiresAt: Date,
        // Assignment
        assignedTo: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            index: true,
        },
        assignedAt: Date,
        // Audit
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
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: function (_doc, ret) {
                ret.id = ret._id.toString();
                delete ret._id;
                delete ret.__v;
                return ret;
            },
        },
        toObject: {
            virtuals: true,
        },
    }
);

// Indexes for performance
rfqSchema.index({ rfqNumber: 1 }, { unique: true });
rfqSchema.index({ status: 1, priority: -1 });
rfqSchema.index({ assignedTo: 1, status: 1 });
rfqSchema.index({ 'contact.email': 1 });
rfqSchema.index({ createdAt: -1 });
rfqSchema.index({ submittedAt: -1 });

// Pre-save hook to generate RFQ number using atomic counter (race-condition safe)
rfqSchema.pre('save', async function (next) {
    if (!this.rfqNumber) {
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const counter = await CounterModel.findOneAndUpdate(
            { _id: `rfq-${dateStr}` },
            { $inc: { seq: 1 } },
            { upsert: true, new: true }
        );
        this.rfqNumber = `RFQ-${dateStr}-${String(counter.seq).padStart(4, '0')}`;
    }

    // Update timeline based on status changes
    if (this.isModified('status')) {
        const now = new Date();
        if (this.status === RFQStatus.SUBMITTED && !this.submittedAt) {
            this.submittedAt = now;
        } else if (this.status === RFQStatus.UNDER_REVIEW && !this.reviewedAt) {
            this.reviewedAt = now;
        } else if (this.status === RFQStatus.QUOTED && !this.quotedAt) {
            this.quotedAt = now;
        }
    }

    next();
});

// Static method to find by RFQ number
rfqSchema.statics.findByRFQNumber = function (rfqNumber: string) {
    return this.findOne({ rfqNumber });
};

// Static method to find by status
rfqSchema.statics.findByStatus = function (status: RFQStatus) {
    return this.find({ status }).sort({ createdAt: -1 });
};

// Static method to find assigned RFQs
rfqSchema.statics.findAssignedTo = function (userId: string) {
    return this.find({ assignedTo: userId }).sort({ priority: -1, createdAt: -1 });
};

// Export the model
export const RFQModel = mongoose.model<IRFQDocument, IRFQModel>('RFQ', rfqSchema);
