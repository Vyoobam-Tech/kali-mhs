import { Request, Response } from 'express';
import { DocumentUseCases } from '@usecases/document.usecases';
import { asyncHandler } from '@middlewares/errorHandler';
import { DocumentCategory, DocumentStatus, DocumentAccessLevel } from '@domain/document.interface';
import { emailService } from '@infrastructure/email/emailService';

/**
 * Document Controller
 * Handles HTTP requests for document endpoints
 */
export class DocumentController {
    /**
     * Create a new document
     * POST /api/v1/documents
     */
    static createDocument = asyncHandler(async (req: Request, res: Response) => {
        if (!req.user) {
            res.status(401).json({
                status: 'error',
                message: 'Authentication required',
            });
            return;
        }

        const documentData = {
            ...req.body,
            createdBy: req.user.userId,
        };

        const document = await DocumentUseCases.createDocument(documentData);

        res.status(201).json({
            status: 'success',
            message: 'Document created successfully',
            data: { document },
        });
    });

    /**
     * Get all documents with pagination and filtering
     * GET /api/v1/documents
     */
    static getAllDocuments = asyncHandler(async (req: Request, res: Response) => {
        const { page, limit, category, status, accessLevel, search } = req.query;

        const result = await DocumentUseCases.getAllDocuments(
            page ? parseInt(page as string, 10) : 1,
            limit ? parseInt(limit as string, 10) : 20,
            category as DocumentCategory,
            status as DocumentStatus,
            accessLevel as DocumentAccessLevel,
            search as string
        );

        res.status(200).json({
            status: 'success',
            data: result,
        });
    });

    /**
     * Get document by ID
     * GET /api/v1/documents/:id
     */
    static getDocumentById = asyncHandler(async (req: Request, res: Response) => {
        const document = await DocumentUseCases.getDocumentById(
            req.params.id,
            req.user?.userId
        );

        res.status(200).json({
            status: 'success',
            data: { document },
        });
    });

    /**
     * Get document by slug
     * GET /api/v1/documents/slug/:slug
     */
    static getDocumentBySlug = asyncHandler(async (req: Request, res: Response) => {
        const document = await DocumentUseCases.getDocumentBySlug(
            req.params.slug,
            req.user?.userId
        );

        res.status(200).json({
            status: 'success',
            data: { document },
        });
    });

    /**
     * Update document
     * PUT /api/v1/documents/:id
     */
    static updateDocument = asyncHandler(async (req: Request, res: Response) => {
        if (!req.user) {
            res.status(401).json({
                status: 'error',
                message: 'Authentication required',
            });
            return;
        }

        const updateData = {
            ...req.body,
            updatedBy: req.user.userId,
        };

        const document = await DocumentUseCases.updateDocument(req.params.id, updateData);

        res.status(200).json({
            status: 'success',
            message: 'Document updated successfully',
            data: { document },
        });
    });

    /**
     * Delete document (soft delete)
     * DELETE /api/v1/documents/:id
     */
    static deleteDocument = asyncHandler(async (req: Request, res: Response) => {
        if (!req.user) {
            res.status(401).json({
                status: 'error',
                message: 'Authentication required',
            });
            return;
        }

        await DocumentUseCases.deleteDocument(req.params.id, req.user.userId);

        res.status(200).json({
            status: 'success',
            message: 'Document deleted successfully',
        });
    });

    /**
     * Download document (with lead capture for gated content)
     * POST /api/v1/documents/:id/download
     */
    static downloadDocument = asyncHandler(async (req: Request, res: Response) => {
        const downloadRequest = {
            documentId: req.params.id,
            userId: req.user?.userId,
            leadInfo: req.body.leadInfo,
        };

        const fileUrl = await DocumentUseCases.downloadDocument(downloadRequest);

        res.status(200).json({
            status: 'success',
            message: 'Document download initiated',
            data: { fileUrl },
        });
    });

    /**
     * Get documents by category
     * GET /api/v1/documents/category/:category
     */
    static getDocumentsByCategory = asyncHandler(async (req: Request, res: Response) => {
        const documents = await DocumentUseCases.getDocumentsByCategory(
            req.params.category as DocumentCategory
        );

        res.status(200).json({
            status: 'success',
            data: { documents },
        });
    });

    /**
     * Get published documents
     * GET /api/v1/documents/published
     */
    static getPublishedDocuments = asyncHandler(async (req: Request, res: Response) => {
        const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
        const documents = await DocumentUseCases.getPublishedDocuments(limit);

        res.status(200).json({
            status: 'success',
            data: { documents },
        });
    });

    /**
     * Search documents
     * GET /api/v1/documents/search
     */
    static searchDocuments = asyncHandler(async (req: Request, res: Response) => {
        const query = req.query.q as string;
        const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;

        const documents = await DocumentUseCases.searchDocuments(query, limit);

        res.status(200).json({
            status: 'success',
            data: { documents },
        });
    });

    /**
     * Get document leads (admin only)
     * GET /api/v1/documents/:id/leads
     */
    static getDocumentLeads = asyncHandler(async (req: Request, res: Response) => {
        if (!req.user) {
            res.status(401).json({
                status: 'error',
                message: 'Authentication required',
            });
            return;
        }

        const leads = await DocumentUseCases.getDocumentLeads(req.params.id);

        res.status(200).json({
            status: 'success',
            data: { leads },
        });
    });

    /**
     * Publish document
     * POST /api/v1/documents/:id/publish
     */
    static publishDocument = asyncHandler(async (req: Request, res: Response) => {
        if (!req.user) {
            res.status(401).json({
                status: 'error',
                message: 'Authentication required',
            });
            return;
        }

        const document = await DocumentUseCases.publishDocument(
            req.params.id,
            req.user.userId
        );

        res.status(200).json({
            status: 'success',
            message: 'Document published successfully',
            data: { document },
        });
    });

    /**
     * Request document access (lead capture + signed URL)
     * POST /api/v1/documents/:id/request-access
     */
    static requestAccess = asyncHandler(async (req: Request, res: Response) => {
        const { firstName, lastName, email, phone, company, jobTitle } = req.body;

        const result = await DocumentUseCases.captureLeadAndGenerateDownloadUrl(
            req.params.id,
            { firstName, lastName, email, phone, company, jobTitle }
        );

        // Send email with download link (non-blocking)
        emailService.sendLeadConfirmation(email, {
            name: `${firstName} ${lastName}`,
            documentTitle: result.documentTitle,
            downloadUrl: result.downloadUrl,
        }).catch((error) => {
            console.error('Email notification failed:', error);
        });

        res.status(200).json({
            status: 'success',
            message: 'Access granted. Download link sent to your email.',
            data: result,
        });
    });

    /**
     * Download document with signed URL
     * GET /api/v1/documents/download/:token
     */
    static downloadWithToken = asyncHandler(async (req: Request, res: Response) => {
        const { token } = req.params;

        const result = await DocumentUseCases.downloadWithSignedUrl(token);

        // Track download
        const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';
        const userAgent = req.headers['user-agent'];
        const referrer = req.headers['referer'];

        // Note: We'd need to extract documentId and leadId from token for tracking
        // This is simplified - in production, decode token to get IDs

        res.status(200).json({
            status: 'success',
            message: 'Download ready',
            data: result,
        });
    });

    /**
     * Get document analytics (admin only)
     * GET /api/v1/documents/:id/analytics
     */
    static getAnalytics = asyncHandler(async (req: Request, res: Response) => {
        if (!req.user) {
            res.status(401).json({
                status: 'error',
                message: 'Authentication required',
            });
            return;
        }

        const analytics = await DocumentUseCases.getDocumentAnalytics(req.params.id);

        res.status(200).json({
            status: 'success',
            data: { analytics },
        });
    });
}
