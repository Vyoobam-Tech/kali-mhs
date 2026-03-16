import mongoose, { Schema, Document, Model } from 'mongoose';
import {
    IDocument as IDocumentInterface,
    DocumentCategory,
    DocumentAccessLevel,
    DocumentStatus,
} from '@domain/document.interface';

// Extend IDocument with Mongoose Document
export interface IDocumentDocument extends Omit<IDocumentInterface, 'id'>, Document { }

// Document Model interface
export interface IDocumentModel extends Model<IDocumentDocument> {
    findBySlug(slug: string): Promise<IDocumentDocument | null>;
    findByCategory(category: DocumentCategory): Promise<IDocumentDocument[]>;
    findPublished(): Promise<IDocumentDocument[]>;
}

// Document Schema
const documentSchema = new Schema<IDocumentDocument, IDocumentModel>(
    {
        title: {
            type: String,
            required: [true, 'Document title is required'],
            trim: true,
            maxlength: [200, 'Title cannot exceed 200 characters'],
            index: true,
        },
        description: {
            type: String,
            trim: true,
        },
        category: {
            type: String,
            enum: Object.values(DocumentCategory),
            required: [true, 'Document category is required'],
            index: true,
        },
        status: {
            type: String,
            enum: Object.values(DocumentStatus),
            default: DocumentStatus.DRAFT,
            required: true,
            index: true,
        },
        // File Details
        fileUrl: {
            type: String,
            required: [true, 'File URL is required'],
        },
        fileName: {
            type: String,
            required: [true, 'File name is required'],
        },
        fileType: {
            type: String,
            required: [true, 'File type is required'],
        },
        fileSize: {
            type: Number,
            required: [true, 'File size is required'],
        },
        thumbnailUrl: String,
        // Access Control
        accessLevel: {
            type: String,
            enum: Object.values(DocumentAccessLevel),
            default: DocumentAccessLevel.PUBLIC,
            required: true,
            index: true,
        },
        allowedRoles: [String],
        watermarkEnabled: {
            type: Boolean,
            default: false,
        },
        watermarkText: String,
        // Related Entities
        relatedProducts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Product',
            },
        ],
        relatedProjects: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Project',
            },
        ],
        // SEO & Discovery
        tags: [String],
        keywords: [String],
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        // Analytics
        viewCount: {
            type: Number,
            default: 0,
        },
        downloadCount: {
            type: Number,
            default: 0,
        },
        // Lead Capture for Gated Content
        leads: [
            {
                firstName: String,
                lastName: String,
                email: String,
                phone: String,
                company: String,
                designation: String,
                country: String,
                downloadedAt: Date,
            },
        ],
        // Version Control
        version: {
            type: String,
            default: '1.0',
        },
        previousVersions: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Document',
            },
        ],
        // Expiry
        expiresAt: Date,
        // Audit
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        updatedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        publishedAt: Date,
        publishedBy: {
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
                // Leads are excluded by default; admin queries must explicitly .select('+leads')
                if (ret.isDeleted) delete ret.isDeleted;
                return ret;
            },
        },
        toObject: {
            virtuals: true,
        },
    }
);

// Indexes for performance
documentSchema.index({ title: 'text', description: 'text' });
documentSchema.index({ category: 1, status: 1 });
documentSchema.index({ accessLevel: 1, status: 1 });
documentSchema.index({ slug: 1 }, { unique: true });
documentSchema.index({ tags: 1 });
documentSchema.index({ isDeleted: 1 });
documentSchema.index({ createdAt: -1 });

// Middleware to generate slug if not provided
documentSchema.pre('save', function (next) {
    if (!this.slug && this.title) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
    next();
});

// Static method to find by slug
documentSchema.statics.findBySlug = function (this: IDocumentModel, slug: string) {
    return this.findOne({ slug, isDeleted: false });
};

// Static method to find by category
documentSchema.statics.findByCategory = function (this: IDocumentModel, category: DocumentCategory) {
    return this.find({
        category,
        status: DocumentStatus.PUBLISHED,
        isDeleted: false,
    }).sort({ createdAt: -1 });
};

// Static method to find published documents
documentSchema.statics.findPublished = function (this: IDocumentModel) {
    return this.find({
        status: DocumentStatus.PUBLISHED,
        isDeleted: false,
    }).sort({ createdAt: -1 });
};

// Export the model
export const DocumentModel = mongoose.model<IDocumentDocument, IDocumentModel>('Document', documentSchema);
