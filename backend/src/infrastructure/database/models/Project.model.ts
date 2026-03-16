import mongoose, { Schema, Document, Model } from 'mongoose';
import {
    IProject,
    ProjectCategory,
    ProjectStatus,
    ProjectLocation,
} from '@domain/project.interface';

// Extend IProject with Mongoose Document
export interface IProjectDocument extends Omit<IProject, 'id'>, Document { }

// Project Model interface
export interface IProjectModel extends Model<IProjectDocument> {
    findBySlug(slug: string): Promise<IProjectDocument | null>;
    findByCategory(category: ProjectCategory): Promise<IProjectDocument[]>;
    findFeatured(): Promise<IProjectDocument[]>;
    findCompleted(): Promise<IProjectDocument[]>;
}

// Project Schema
const projectSchema = new Schema<IProjectDocument, IProjectModel>(
    {
        title: {
            type: String,
            required: [true, 'Project title is required'],
            trim: true,
            maxlength: [200, 'Title cannot exceed 200 characters'],
            index: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        category: {
            type: String,
            enum: Object.values(ProjectCategory),
            required: [true, 'Project category is required'],
            index: true,
        },
        status: {
            type: String,
            enum: Object.values(ProjectStatus),
            default: ProjectStatus.DRAFT,
            required: true,
            index: true,
        },
        // Basic Details
        shortDescription: {
            type: String,
            maxlength: [500, 'Short description cannot exceed 500 characters'],
        },
        fullDescription: String,
        // Location
        location: {
            address: String,
            city: String,
            state: String,
            country: String,
            coordinates: {
                latitude: Number,
                longitude: Number,
            },
        },
        // Timeline
        startDate: Date,
        completionDate: Date,
        duration: String,
        // Client Info
        clientName: String,
        clientCompany: String,
        clientWebsite: String,
        // Media
        featuredImage: {
            url: String,
            alt: String,
        },
        images: [
            {
                url: { type: String, required: true },
                caption: String,
                order: { type: Number, default: 0 },
            },
        ],
        videos: [
            {
                url: { type: String, required: true },
                title: String,
                thumbnail: String,
            },
        ],
        virtualTourUrl: String,
        // Products Used
        productsUsed: [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product',
                },
                productName: String,
                quantity: Number,
                unit: String,
                notes: String,
            },
        ],
        // Project Details
        projectSize: String,
        budget: String,
        teamSize: Number,
        // Highlights
        keyFeatures: [String],
        challenges: [String],
        solutions: [String],
        // Testimonial
        testimonial: {
            quote: String,
            author: String,
            designation: String,
            company: String,
            avatarUrl: String,
            rating: { type: Number, min: 1, max: 5 },
        },
        // SEO & Discovery
        tags: [String],
        metaTitle: String,
        metaDescription: String,
        keywords: [String],
        // Flags
        isFeatured: {
            type: Boolean,
            default: false,
            index: true,
        },
        displayOnHomepage: {
            type: Boolean,
            default: false,
        },
        // Analytics
        viewCount: {
            type: Number,
            default: 0,
        },
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
projectSchema.index({ title: 'text', shortDescription: 'text', fullDescription: 'text' });
projectSchema.index({ category: 1, status: 1 });
projectSchema.index({ slug: 1 }, { unique: true });
projectSchema.index({ isFeatured: 1, status: 1 });
projectSchema.index({ tags: 1 });
projectSchema.index({ isDeleted: 1 });
projectSchema.index({ completionDate: -1 });
projectSchema.index({ createdAt: -1 });

// Virtual for project duration in days
projectSchema.virtual('durationInDays').get(function () {
    if (this.startDate && this.completionDate) {
        const diff = this.completionDate.getTime() - this.startDate.getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }
    return null;
});

// Middleware to generate slug if not provided
projectSchema.pre('save', function (next) {
    if (!this.slug && this.title) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
    next();
});

// Static method to find by slug
projectSchema.statics.findBySlug = function (this: IProjectModel, slug: string) {
    return this.findOne({ slug, isDeleted: false });
};

// Static method to find by category
projectSchema.statics.findByCategory = function (this: IProjectModel, category: ProjectCategory) {
    return this.find({
        category,
        status: ProjectStatus.COMPLETED,
        isDeleted: false,
    }).sort({ completionDate: -1 });
};

// Static method to find featured projects
projectSchema.statics.findFeatured = function (this: IProjectModel) {
    return this.find({
        isFeatured: true,
        status: ProjectStatus.COMPLETED,
        isDeleted: false,
    }).sort({ completionDate: -1 });
};

// Static method to find completed projects
projectSchema.statics.findCompleted = function (this: IProjectModel) {
    return this.find({
        status: ProjectStatus.COMPLETED,
        isDeleted: false,
    }).sort({ completionDate: -1 });
};

// Export the model
export const ProjectModel = mongoose.model<IProjectDocument, IProjectModel>('Project', projectSchema);
