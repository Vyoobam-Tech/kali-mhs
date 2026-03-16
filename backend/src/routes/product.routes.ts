import { Router } from 'express';
import { ProductController } from '@controllers/product.controller';
import { validate } from '@middlewares/validate';
import { authenticate, authorize } from '@middlewares/auth';
import { UserRole } from '@domain/user.interface';
import {
    createProductSchema,
    updateProductSchema,
    getProductByIdSchema,
    getProductBySlugSchema,
    getProductsQuerySchema,
    addProductImageSchema,
    removeProductImageSchema,
    updateSpecificationsSchema,
    searchProductsSchema,
} from '@validations/product.validation';

const router = Router();

/**
 * Public Routes (No authentication required)
 */

/**
 * @route   GET /api/v1/products
 * @desc    Get all products with pagination and filtering
 * @access  Public
 */
router.get('/', validate(getProductsQuerySchema), ProductController.getAllProducts);

/**
 * @route   GET /api/v1/products/published
 * @desc    Get published products
 * @access  Public
 */
router.get('/published', ProductController.getPublishedProducts);

/**
 * @route   GET /api/v1/products/search
 * @desc    Search products
 * @access  Public
 */
router.get('/search', validate(searchProductsSchema), ProductController.searchProducts);

/**
 * @route   GET /api/v1/products/category/:category
 * @desc    Get products by category
 * @access  Public
 */
router.get('/category/:category', ProductController.getProductsByCategory);

/**
 * @route   GET /api/v1/products/slug/:slug
 * @desc    Get product by slug
 * @access  Public
 */
router.get('/slug/:slug', validate(getProductBySlugSchema), ProductController.getProductBySlug);

/**
 * @route   GET /api/v1/products/:id
 * @desc    Get product by ID
 * @access  Public
 */
router.get('/:id', validate(getProductByIdSchema), ProductController.getProductById);

/**
 * @route   POST /api/v1/products/:id/download
 * @desc    Increment download count
 * @access  Public
 */
router.post('/:id/download', validate(getProductByIdSchema), ProductController.incrementDownloadCount);

/**
 * @route   POST /api/v1/products/:id/inquiry
 * @desc    Increment inquiry count
 * @access  Public
 */
router.post('/:id/inquiry', validate(getProductByIdSchema), ProductController.incrementInquiryCount);

/**
 * Protected Routes (Admin & above only)
 */

/**
 * @route   POST /api/v1/products
 * @desc    Create a new product
 * @access  Private (Admin, Super Admin)
 */
router.post(
    '/',
    authenticate,
    authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    validate(createProductSchema),
    ProductController.createProduct
);

/**
 * @route   PUT /api/v1/products/:id
 * @desc    Update product
 * @access  Private (Admin, Super Admin)
 */
router.put(
    '/:id',
    authenticate,
    authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    validate(updateProductSchema),
    ProductController.updateProduct
);

/**
 * @route   DELETE /api/v1/products/:id
 * @desc    Delete product (soft delete)
 * @access  Private (Admin, Super Admin)
 */
router.delete(
    '/:id',
    authenticate,
    authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    validate(getProductByIdSchema),
    ProductController.deleteProduct
);

/**
 * @route   POST /api/v1/products/:id/images
 * @desc    Add image to product
 * @access  Private (Admin, Super Admin)
 */
router.post(
    '/:id/images',
    authenticate,
    authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    validate(addProductImageSchema),
    ProductController.addProductImage
);

/**
 * @route   DELETE /api/v1/products/:id/images
 * @desc    Remove image from product
 * @access  Private (Admin, Super Admin)
 */
router.delete(
    '/:id/images',
    authenticate,
    authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    validate(removeProductImageSchema),
    ProductController.removeProductImage
);

/**
 * @route   PUT /api/v1/products/:id/specifications
 * @desc    Update product specifications
 * @access  Private (Admin, Super Admin)
 */
router.put(
    '/:id/specifications',
    authenticate,
    authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    validate(updateSpecificationsSchema),
    ProductController.updateSpecifications
);

export { router };
