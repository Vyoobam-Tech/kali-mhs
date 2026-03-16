import { Router } from 'express';
import { DocumentController } from '@controllers/document.controller';
import { validate } from '@middlewares/validate';
import { authenticate, isAdminOrAbove, optionalAuth } from '@middlewares/auth';
import {
    createDocumentSchema,
    updateDocumentSchema,
    getDocumentByIdSchema,
    getDocumentBySlugSchema,
    getDocumentsQuerySchema,
    downloadDocumentSchema,
    searchDocumentsSchema,
    publishDocumentSchema,
    getDocumentLeadsSchema,
} from '@validations/document.validation';

const router = Router();

/**
 * Public/Semi-Public Routes
 */

/**
 * @route   GET /api/v1/documents
 * @desc    Get all documents with pagination and filtering
 * @access  Public
 */
router.get('/', validate(getDocumentsQuerySchema), DocumentController.getAllDocuments);

/**
 * @route   GET /api/v1/documents/published
 * @desc    Get published documents
 * @access  Public
 */
router.get('/published', DocumentController.getPublishedDocuments);

/**
 * @route   GET /api/v1/documents/search
 * @desc    Search documents
 * @access  Public
 */
router.get('/search', validate(searchDocumentsSchema), DocumentController.searchDocuments);

/**
 * @route   GET /api/v1/documents/category/:category
 * @desc    Get documents by category
 * @access  Public
 */
router.get('/category/:category', DocumentController.getDocumentsByCategory);

/**
 * @route   GET /api/v1/documents/slug/:slug
 * @desc    Get document by slug (with optional auth for access control)
 * @access  Public/Auth (depends on document access level)
 */
router.get(
    '/slug/:slug',
    optionalAuth,
    validate(getDocumentBySlugSchema),
    DocumentController.getDocumentBySlug
);

/**
 * @route   GET /api/v1/documents/download/:token
 * @desc    Download document with signed URL — MUST be before /:id to avoid shadowing
 * @access  Public
 */
router.get('/download/:token', DocumentController.downloadWithToken);

/**
 * @route   GET /api/v1/documents/:id
 * @desc    Get document by ID (with optional auth for access control)
 * @access  Public/Auth (depends on document access level)
 */
router.get(
    '/:id',
    optionalAuth,
    validate(getDocumentByIdSchema),
    DocumentController.getDocumentById
);

/**
 * @route   POST /api/v1/documents/:id/download
 * @desc    Download document (with lead capture for gated content)
 * @access  Public/Auth (depends on document access level)
 */
router.post(
    '/:id/download',
    optionalAuth,
    validate(downloadDocumentSchema),
    DocumentController.downloadDocument
);

/**
 * @route   POST /api/v1/documents/:id/request-access
 * @desc    Request document access (lead capture + signed URL)
 * @access  Public
 */
router.post('/:id/request-access', DocumentController.requestAccess);

/**
 * Protected Routes (Admin & above)
 */

/**
 * @route   POST /api/v1/documents
 * @desc    Create a new document
 * @access  Private (Admin, Super Admin)
 */
router.post(
    '/',
    authenticate,
    isAdminOrAbove,
    validate(createDocumentSchema),
    DocumentController.createDocument
);

/**
 * @route   PUT /api/v1/documents/:id
 * @desc    Update document
 * @access  Private (Admin, Super Admin)
 */
router.put(
    '/:id',
    authenticate,
    isAdminOrAbove,
    validate(updateDocumentSchema),
    DocumentController.updateDocument
);

/**
 * @route   DELETE /api/v1/documents/:id
 * @desc    Delete document (soft delete)
 * @access  Private (Admin, Super Admin)
 */
router.delete(
    '/:id',
    authenticate,
    isAdminOrAbove,
    validate(getDocumentByIdSchema),
    DocumentController.deleteDocument
);

/**
 * @route   POST /api/v1/documents/:id/publish
 * @desc    Publish document
 * @access  Private (Admin, Super Admin)
 */
router.post(
    '/:id/publish',
    authenticate,
    isAdminOrAbove,
    validate(publishDocumentSchema),
    DocumentController.publishDocument
);

/**
 * @route   GET /api/v1/documents/:id/leads
 * @desc    Get document leads (admin only)
 * @access  Private (Admin, Super Admin)
 */
router.get(
    '/:id/leads',
    authenticate,
    isAdminOrAbove,
    validate(getDocumentLeadsSchema),
    DocumentController.getDocumentLeads
);

/**
 * @route   GET /api/v1/documents/:id/analytics
 * @desc    Get document analytics (admin only)
 * @access  Private (Admin, Super Admin)
 */
router.get(
    '/:id/analytics',
    authenticate,
    isAdminOrAbove,
    DocumentController.getAnalytics
);

export { router };
