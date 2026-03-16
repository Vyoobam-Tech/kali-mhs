import mongoose, { Schema, Document, Model } from 'mongoose';
import { ICMSPage, ContentStatus } from '@domain/cms.interface';

export interface ICMSPageDocument extends Omit<ICMSPage, 'id'>, Document { }

export interface ICMSPageModel extends Model<ICMSPageDocument> {
    findBySlug(slug: string): Promise<ICMSPageDocument | null>;
    findPublished(): Promise<ICMSPageDocument[]>;
}

const cmsPageSchema = new Schema<ICMSPageDocument, ICMSPageModel>(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
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
        type: {
            type: String,
            enum: ['PAGE', 'BLOG_POST', 'NEWS', 'FAQ'],
            default: 'PAGE',
            required: true,
            index: true,
        },
        status: {
            type: String,
            enum: Object.values(ContentStatus),
            default: ContentStatus.DRAFT,
            required: true,
            index: true,
        },
        content: String,
        excerpt: String,
        featuredImage: String,
        category: String,
        tags: [String],
        // SEO
        metaTitle: String,
        metaDescription: String,
        // Publishing
        publishedAt: Date,
        scheduledAt: Date,
        publishedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
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

cmsPageSchema.index({ title: 'text', content: 'text' });
cmsPageSchema.index({ type: 1, status: 1 });

cmsPageSchema.pre('save', function (next) {
    if (!this.slug && this.title) {
        this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    next();
});

cmsPageSchema.statics.findBySlug = function (this: ICMSPageModel, slug: string) {
    return this.findOne({ slug, isDeleted: false });
};

cmsPageSchema.statics.findPublished = function (this: ICMSPageModel) {
    return this.find({ status: ContentStatus.PUBLISHED, isDeleted: false }).sort({ publishedAt: -1 });
};

export const CMSPageModel = mongoose.model<ICMSPageDocument, ICMSPageModel>('CMSPage', cmsPageSchema);
