import { Request, Response, NextFunction } from 'express';
import { ProductUseCases } from '@usecases/product.usecases';
import { asyncHandler } from '@middlewares/errorHandler';
import { ProductCategory, ProductStatus } from '@domain/product.interface';

/**
 * Product Controller
 * Handles HTTP requests for product endpoints
 */
export class ProductController {
    /**
     * Create a new product
     * POST /api/v1/products
     */
    static createProduct = asyncHandler(async (req: Request, res: Response) => {
        if (!req.user) {
            return res.status(401).json({
                status: 'error',
                message: 'Authentication required',
            });
        }

        const productData = {
            ...req.body,
            createdBy: req.user.userId,
        };

        const product = await ProductUseCases.createProduct(productData);

        res.status(201).json({
            status: 'success',
            message: 'Product created successfully',
            data: { product },
        });
    });

    /**
     * Get all products with pagination and filtering
     * GET /api/v1/products
     */
    static getAllProducts = asyncHandler(async (req: Request, res: Response) => {
        const { page, limit, category, status, search } = req.query;

        const result = await ProductUseCases.getAllProducts(
            page ? parseInt(page as string, 10) : 1,
            limit ? parseInt(limit as string, 10) : 20,
            category as ProductCategory,
            status as ProductStatus,
            search as string
        );

        res.status(200).json({
            status: 'success',
            data: result,
        });
    });

    /**
     * Get product by ID
     * GET /api/v1/products/:id
     */
    static getProductById = asyncHandler(async (req: Request, res: Response) => {
        const product = await ProductUseCases.getProductById(req.params.id);

        res.status(200).json({
            status: 'success',
            data: { product },
        });
    });

    /**
     * Get product by slug
     * GET /api/v1/products/slug/:slug
     */
    static getProductBySlug = asyncHandler(async (req: Request, res: Response) => {
        const product = await ProductUseCases.getProductBySlug(req.params.slug);

        res.status(200).json({
            status: 'success',
            data: { product },
        });
    });

    /**
     * Update product
     * PUT /api/v1/products/:id
     */
    static updateProduct = asyncHandler(async (req: Request, res: Response) => {
        if (!req.user) {
            return res.status(401).json({
                status: 'error',
                message: 'Authentication required',
            });
        }

        const updateData = {
            ...req.body,
            updatedBy: req.user.userId,
        };

        const product = await ProductUseCases.updateProduct(req.params.id, updateData);

        res.status(200).json({
            status: 'success',
            message: 'Product updated successfully',
            data: { product },
        });
    });

    /**
     * Delete product (soft delete)
     * DELETE /api/v1/products/:id
     */
    static deleteProduct = asyncHandler(async (req: Request, res: Response) => {
        if (!req.user) {
            return res.status(401).json({
                status: 'error',
                message: 'Authentication required',
            });
        }

        await ProductUseCases.deleteProduct(req.params.id, req.user.userId);

        res.status(200).json({
            status: 'success',
            message: 'Product deleted successfully',
        });
    });

    /**
     * Get products by category
     * GET /api/v1/products/category/:category
     */
    static getProductsByCategory = asyncHandler(async (req: Request, res: Response) => {
        const products = await ProductUseCases.getProductsByCategory(
            req.params.category as ProductCategory
        );

        res.status(200).json({
            status: 'success',
            data: { products },
        });
    });

    /**
     * Get published products
     * GET /api/v1/products/published
     */
    static getPublishedProducts = asyncHandler(async (req: Request, res: Response) => {
        const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
        const products = await ProductUseCases.getPublishedProducts(limit);

        res.status(200).json({
            status: 'success',
            data: { products },
        });
    });

    /**
     * Add image to product
     * POST /api/v1/products/:id/images
     */
    static addProductImage = asyncHandler(async (req: Request, res: Response) => {
        if (!req.user) {
            return res.status(401).json({
                status: 'error',
                message: 'Authentication required',
            });
        }

        const product = await ProductUseCases.addProductImage(
            req.params.id,
            req.body,
            req.user.userId
        );

        res.status(200).json({
            status: 'success',
            message: 'Image added successfully',
            data: { product },
        });
    });

    /**
     * Remove image from product
     * DELETE /api/v1/products/:id/images
     */
    static removeProductImage = asyncHandler(async (req: Request, res: Response) => {
        if (!req.user) {
            return res.status(401).json({
                status: 'error',
                message: 'Authentication required',
            });
        }

        const product = await ProductUseCases.removeProductImage(
            req.params.id,
            req.body.imageUrl,
            req.user.userId
        );

        res.status(200).json({
            status: 'success',
            message: 'Image removed successfully',
            data: { product },
        });
    });

    /**
     * Update product specifications
     * PUT /api/v1/products/:id/specifications
     */
    static updateSpecifications = asyncHandler(async (req: Request, res: Response) => {
        if (!req.user) {
            return res.status(401).json({
                status: 'error',
                message: 'Authentication required',
            });
        }

        const product = await ProductUseCases.updateSpecifications(
            req.params.id,
            req.body.specifications,
            req.user.userId
        );

        res.status(200).json({
            status: 'success',
            message: 'Specifications updated successfully',
            data: { product },
        });
    });

    /**
     * Search products
     * GET /api/v1/products/search
     */
    static searchProducts = asyncHandler(async (req: Request, res: Response) => {
        const query = req.query.q as string;
        const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;

        const products = await ProductUseCases.searchProducts(query, limit);

        res.status(200).json({
            status: 'success',
            data: { products },
        });
    });

    /**
     * Increment download count
     * POST /api/v1/products/:id/download
     */
    static incrementDownloadCount = asyncHandler(async (req: Request, res: Response) => {
        await ProductUseCases.incrementDownloadCount(req.params.id);

        res.status(200).json({
            status: 'success',
            message: 'Download count incremented',
        });
    });

    /**
     * Increment inquiry count
     * POST /api/v1/products/:id/inquiry
     */
    static incrementInquiryCount = asyncHandler(async (req: Request, res: Response) => {
        await ProductUseCases.incrementInquiryCount(req.params.id);

        res.status(200).json({
            status: 'success',
            message: 'Inquiry count incremented',
        });
    });
}
