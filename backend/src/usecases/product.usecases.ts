import { ProductModel, IProductDocument } from '@infrastructure/database/models/Product.model';
import {
    ICreateProduct,
    IUpdateProduct,
    IProduct,
    ProductCategory,
    ProductStatus,
    IProductImage,
    IProductSpecification,
} from '@domain/product.interface';
import { AppError } from '@middlewares/errorHandler';

/**
 * Product Use Cases
 * Business logic for product management
 */
export class ProductUseCases {
    /**
     * Create a new product
     */
    static async createProduct(productData: ICreateProduct): Promise<IProduct> {
        // Generate slug from name
        const slug = this.generateSlug(productData.name);

        // Check if slug already exists
        const existingProduct = await ProductModel.findBySlug(slug);
        if (existingProduct) {
            throw new AppError(409, 'A product with this name already exists');
        }

        const product = new ProductModel({
            ...productData,
            slug,
            status: ProductStatus.DRAFT,
            images: [],
            documents: [],
            specifications: productData.specifications || [],
            viewCount: 0,
            downloadCount: 0,
            inquiryCount: 0,
            isDeleted: false,
        });

        await product.save();
        return this.toProductResponse(product);
    }

    /**
     * Get all products with pagination and filtering
     */
    static async getAllProducts(
        page: number = 1,
        limit: number = 20,
        category?: ProductCategory,
        status?: ProductStatus,
        searchQuery?: string
    ): Promise<{ products: IProduct[]; total: number; page: number; totalPages: number }> {
        const skip = (page - 1) * limit;

        // Build filter
        const filter: any = { isDeleted: false };
        if (category) filter.category = category;
        if (status) filter.status = status;
        if (searchQuery) {
            filter.$text = { $search: searchQuery };
        }

        // Get products and total count
        const [products, total] = await Promise.all([
            ProductModel.find(filter)
                .sort(searchQuery ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('createdBy', 'firstName lastName email')
                .populate('updatedBy', 'firstName lastName email'),
            ProductModel.countDocuments(filter),
        ]);

        return {
            products: products.map((p) => this.toProductResponse(p)),
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }

    /**
     * Get product by ID
     */
    static async getProductById(productId: string): Promise<IProduct> {
        const product = await ProductModel.findOne({
            _id: productId,
            isDeleted: false,
        })
            .populate('createdBy', 'firstName lastName email')
            .populate('relatedProducts', 'name slug category images');

        if (!product) {
            throw new AppError(404, 'Product not found');
        }

        await ProductModel.findByIdAndUpdate(productId, { $inc: { viewCount: 1 } });

        return this.toProductResponse(product);
    }

    /**
     * Get product by slug
     */
    static async getProductBySlug(slug: string): Promise<IProduct> {
        const product = await ProductModel.findBySlug(slug);

        if (!product) {
            throw new AppError(404, 'Product not found');
        }

        await ProductModel.findByIdAndUpdate(product._id, { $inc: { viewCount: 1 } });

        return this.toProductResponse(product);
    }

    /**
     * Update product
     */
    static async updateProduct(productId: string, updateData: IUpdateProduct): Promise<IProduct> {
        const product = await ProductModel.findOne({
            _id: productId,
            isDeleted: false,
        });

        if (!product) {
            throw new AppError(404, 'Product not found');
        }

        // Update fields
        if (updateData.name) {
            product.name = updateData.name;
            product.slug = this.generateSlug(updateData.name);
        }
        if (updateData.shortDescription !== undefined)
            product.shortDescription = updateData.shortDescription;
        if (updateData.fullDescription !== undefined) product.fullDescription = updateData.fullDescription;
        if (updateData.category) product.category = updateData.category;
        if (updateData.subCategory !== undefined) product.subCategory = updateData.subCategory;
        if (updateData.status) product.status = updateData.status;
        if (updateData.specifications) product.specifications = updateData.specifications;
        if (updateData.showPrice !== undefined) product.showPrice = updateData.showPrice;
        if (updateData.basePrice !== undefined) product.basePrice = updateData.basePrice;
        if (updateData.updatedBy) product.updatedBy = updateData.updatedBy as any;

        await product.save();
        return this.toProductResponse(product);
    }

    /**
     * Delete product (soft delete)
     */
    static async deleteProduct(productId: string, deletedBy: string): Promise<void> {
        const product = await ProductModel.findOne({
            _id: productId,
            isDeleted: false,
        });

        if (!product) {
            throw new AppError(404, 'Product not found');
        }

        product.isDeleted = true;
        product.updatedBy = deletedBy as any;
        await product.save();
    }

    /**
     * Get products by category
     */
    static async getProductsByCategory(category: ProductCategory): Promise<IProduct[]> {
        const products = await ProductModel.findByCategory(category);
        return products.map((p) => this.toProductResponse(p));
    }

    /**
     * Get published products
     */
    static async getPublishedProducts(limit: number = 50): Promise<IProduct[]> {
        const products = await ProductModel.find({
            status: ProductStatus.ACTIVE,
            isDeleted: false,
        }).sort({ createdAt: -1 }).limit(limit);
        return products.map((p) => this.toProductResponse(p));
    }

    /**
     * Add image to product
     */
    static async addProductImage(
        productId: string,
        image: IProductImage,
        updatedBy: string
    ): Promise<IProduct> {
        const product = await ProductModel.findOne({
            _id: productId,
            isDeleted: false,
        });

        if (!product) {
            throw new AppError(404, 'Product not found');
        }

        // If this is set as primary, unset other primary images
        if (image.isPrimary) {
            product.images.forEach((img) => {
                img.isPrimary = false;
            });
        }

        product.images.push(image);
        product.updatedBy = updatedBy as any;
        await product.save();

        return this.toProductResponse(product);
    }

    /**
     * Remove image from product
     */
    static async removeProductImage(
        productId: string,
        imageUrl: string,
        updatedBy: string
    ): Promise<IProduct> {
        const product = await ProductModel.findOne({
            _id: productId,
            isDeleted: false,
        });

        if (!product) {
            throw new AppError(404, 'Product not found');
        }

        product.images = product.images.filter((img) => img.url !== imageUrl);
        product.updatedBy = updatedBy as any;
        await product.save();

        return this.toProductResponse(product);
    }

    /**
     * Update product specifications
     */
    static async updateSpecifications(
        productId: string,
        specifications: IProductSpecification[],
        updatedBy: string
    ): Promise<IProduct> {
        const product = await ProductModel.findOne({
            _id: productId,
            isDeleted: false,
        });

        if (!product) {
            throw new AppError(404, 'Product not found');
        }

        product.specifications = specifications;
        product.updatedBy = updatedBy as any;
        await product.save();

        return this.toProductResponse(product);
    }

    /**
     * Search products
     */
    static async searchProducts(query: string, limit: number = 10): Promise<IProduct[]> {
        const products = await ProductModel.find({
            $text: { $search: query },
            status: ProductStatus.ACTIVE,
            isDeleted: false,
        })
            .sort({ score: { $meta: 'textScore' } })
            .limit(limit);

        return products.map((p) => this.toProductResponse(p));
    }

    /**
     * Increment download count
     */
    static async incrementDownloadCount(productId: string): Promise<void> {
        await ProductModel.findByIdAndUpdate(productId, {
            $inc: { downloadCount: 1 },
        });
    }

    /**
     * Increment inquiry count
     */
    static async incrementInquiryCount(productId: string): Promise<void> {
        await ProductModel.findByIdAndUpdate(productId, {
            $inc: { inquiryCount: 1 },
        });
    }

    /**
     * Generate slug from product name
     */
    private static generateSlug(name: string): string {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }

    /**
     * Convert Product document to response DTO
     */
    private static toProductResponse(product: IProductDocument): IProduct {
        return product.toJSON() as IProduct;
    }
}
