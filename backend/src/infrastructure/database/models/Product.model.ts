import mongoose, { Schema, Document, Model } from 'mongoose';
import {
    IProduct,
    ProductCategory,
    ProductStatus,
    Model3DStatus,
    Model3DFormat,
    FileType,
} from '@domain/product.interface';

// Extend IProduct with Mongoose Document
export interface IProductDocument extends Omit<IProduct, 'id'>, Document { }

// Product Model interface
export interface IProductModel extends Model<IProductDocument> {
    findBySlug(slug: string): Promise<IProductDocument | null>;
    findByCategory(category: ProductCategory): Promise<IProductDocument[]>;
    findPublished(): Promise<IProductDocument[]>;
}

// Product Schema
const productSchema = new Schema<IProductDocument, IProductModel>(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
            maxlength: [200, 'Product name cannot exceed 200 characters'],
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
        shortDescription: {
            type: String,
            trim: true,
            maxlength: [500, 'Short description cannot exceed 500 characters'],
        },
        fullDescription: {
            type: String,
            trim: true,
        },
        category: {
            type: String,
            enum: Object.values(ProductCategory),
            required: [true, 'Product category is required'],
            index: true,
        },
        subCategory: {
            type: String,
            trim: true,
        },
        sku: {
            type: String,
            trim: true,
            sparse: true,
            index: true,
        },
        status: {
            type: String,
            enum: Object.values(ProductStatus),
            default: ProductStatus.DRAFT,
            required: true,
            index: true,
        },
        // Images
        images: [
            {
                url: { type: String, required: true },
                alt: { type: String, required: true },
                isPrimary: { type: Boolean, default: false },
                order: { type: Number, default: 0 },
            },
        ],
        videos: [String],
        // 3D Model
        model3D: {
            url: String,
            format: {
                type: String,
                enum: Object.values(Model3DFormat),
            },
            size: Number,
            thumbnailUrl: String,
            status: {
                type: String,
                enum: Object.values(Model3DStatus),
                default: Model3DStatus.PENDING,
            },
            uploadedAt: Date,
            processedAt: Date,
        },
        // Specifications
        specifications: [
            {
                name: { type: String, required: true },
                value: { type: String, required: true },
                unit: String,
            },
        ],
        technicalDetails: String,
        // Documents
        documents: [
            {
                title: { type: String, required: true },
                description: String,
                fileUrl: { type: String, required: true },
                fileType: {
                    type: String,
                    enum: Object.values(FileType),
                    required: true,
                },
                fileSize: Number,
                isGated: { type: Boolean, default: false },
                watermarkEnabled: { type: Boolean, default: false },
            },
        ],
        dataSheet: String,
        installationGuide: String,
        // Pricing
        showPrice: {
            type: Boolean,
            default: false,
        },
        basePrice: Number,
        currency: {
            type: String,
            default: 'INR',
        },
        priceUnit: String,
        // Features & Applications
        features: [String],
        applications: [String],
        // Related Products
        relatedProducts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Product',
            },
        ],
        // SEO
        seo: {
            metaTitle: String,
            metaDescription: String,
            keywords: [String],
            ogImage: String,
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
        inquiryCount: {
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
        isDeleted: {
            type: Boolean,
            default: false,
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
productSchema.index({ name: 'text', shortDescription: 'text', fullDescription: 'text' });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ status: 1, createdAt: -1 });
productSchema.index({ slug: 1 }, { unique: true });
productSchema.index({ isDeleted: 1 });

// Middleware to generate slug if not provided
productSchema.pre('save', function (next) {
    if (!this.slug && this.name) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
    next();
});

// Static method to find by slug
productSchema.statics.findBySlug = function (slug: string) {
    return this.findOne({ slug, isDeleted: false });
};

// Static method to find by category
productSchema.statics.findByCategory = function (category: ProductCategory) {
    return this.find({
        category,
        status: ProductStatus.ACTIVE,
        isDeleted: false,
    }).sort({ createdAt: -1 });
};

// Static method to find published products
productSchema.statics.findPublished = function () {
    return this.find({
        status: ProductStatus.ACTIVE,
        isDeleted: false,
    }).sort({ createdAt: -1 });
};

// Export the model
export const ProductModel = mongoose.model<IProductDocument, IProductModel>('Product', productSchema);
