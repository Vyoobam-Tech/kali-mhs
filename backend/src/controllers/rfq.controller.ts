import { Request, Response } from 'express';
import { RFQUseCases } from '@usecases/rfq.usecases';
import { asyncHandler } from '@middlewares/errorHandler';
import { RFQStatus, RFQPriority } from '@domain/rfq.interface';
import { emailService } from '@infrastructure/email/emailService';
import { mapUploadedFiles } from '@middlewares/upload';

/**
 * RFQ Controller
 * Handles HTTP requests for RFQ endpoints
 */
export class RFQController {
    /**
     * Create a new RFQ (with optional file attachments)
     * POST /api/v1/rfq
     */
    static createRFQ = asyncHandler(async (req: Request, res: Response) => {
        let rfqData: any = {
            ...req.body,
            createdBy: req.user?.userId,
        };

        // When submitted as multipart/form-data (wizard with files),
        // contact / project / items arrive as JSON strings — parse them
        const contentType = req.headers['content-type'] || '';
        if (contentType.includes('multipart/form-data')) {
            try {
                if (typeof rfqData.contact === 'string') rfqData.contact = JSON.parse(rfqData.contact);
                if (typeof rfqData.project === 'string') rfqData.project = JSON.parse(rfqData.project);
                if (typeof rfqData.items === 'string') rfqData.items = JSON.parse(rfqData.items);
            } catch {
                // If parsing fails, leave as-is (multer may have already parsed)
            }
        }

        // Handle uploaded files
        if (req.files && Array.isArray(req.files) && req.files.length > 0) {
            rfqData.attachments = mapUploadedFiles(req.files as Express.Multer.File[]);
        }

        // Always create as SUBMITTED (wizard = customer-initiated final submission)
        rfqData.status = 'SUBMITTED';

        const rfq = await RFQUseCases.createRFQ(rfqData);

        // Send email notifications (non-blocking)
        Promise.all([
            emailService.sendRFQConfirmation(rfq.contact.email, rfq),
            emailService.sendRFQAdminNotification(rfq),
        ]).catch((error) => {
            console.error('Email notification failed:', error);
        });

        res.status(201).json({
            status: 'success',
            message: 'RFQ created successfully',
            data: { rfq },
        });
    });

    /**
     * Submit RFQ (change from DRAFT to SUBMITTED)
     * POST /api/v1/rfq/:id/submit
     */
    static submitRFQ = asyncHandler(async (req: Request, res: Response) => {
        const rfq = await RFQUseCases.submitRFQ(req.params.id);

        res.status(200).json({
            status: 'success',
            message: 'RFQ submitted successfully',
            data: { rfq },
        });
    });

    /**
     * Get all RFQs with pagination and filtering
     * GET /api/v1/rfq
     */
    static getAllRFQs = asyncHandler(async (req: Request, res: Response) => {
        const { page, limit, status, priority, assignedTo } = req.query;

        const result = await RFQUseCases.getAllRFQs(
            page ? parseInt(page as string, 10) : 1,
            limit ? parseInt(limit as string, 10) : 20,
            status as RFQStatus,
            priority as RFQPriority,
            assignedTo as string
        );

        res.status(200).json({
            status: 'success',
            data: result,
        });
    });

    /**
     * Get RFQ by ID
     * GET /api/v1/rfq/:id
     */
    static getRFQById = asyncHandler(async (req: Request, res: Response) => {
        const rfq = await RFQUseCases.getRFQById(req.params.id);

        res.status(200).json({
            status: 'success',
            data: { rfq },
        });
    });

    /**
     * Get RFQ by RFQ number
     * GET /api/v1/rfq/number/:rfqNumber
     */
    static getRFQByNumber = asyncHandler(async (req: Request, res: Response) => {
        const rfq = await RFQUseCases.getRFQByNumber(req.params.rfqNumber);

        res.status(200).json({
            status: 'success',
            data: { rfq },
        });
    });

    /**
     * Update RFQ
     * PUT /api/v1/rfq/:id
     */
    static updateRFQ = asyncHandler(async (req: Request, res: Response) => {
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

        const rfq = await RFQUseCases.updateRFQ(req.params.id, updateData);

        res.status(200).json({
            status: 'success',
            message: 'RFQ updated successfully',
            data: { rfq },
        });
    });

    /**
     * Assign RFQ to a user
     * POST /api/v1/rfq/:id/assign
     */
    static assignRFQ = asyncHandler(async (req: Request, res: Response) => {
        if (!req.user) {
            return res.status(401).json({
                status: 'error',
                message: 'Authentication required',
            });
        }

        const rfq = await RFQUseCases.assignRFQ(
            req.params.id,
            req.body.assignedTo,
            req.user.userId
        );

        res.status(200).json({
            status: 'success',
            message: 'RFQ assigned successfully',
            data: { rfq },
        });
    });

    /**
     * Add quote to RFQ
     * POST /api/v1/rfq/:id/quote
     */
    static addQuote = asyncHandler(async (req: Request, res: Response) => {
        if (!req.user) {
            return res.status(401).json({
                status: 'error',
                message: 'Authentication required',
            });
        }

        const rfq = await RFQUseCases.addQuote(req.params.id, req.body, req.user.userId);

        res.status(200).json({
            status: 'success',
            message: 'Quote added successfully',
            data: { rfq },
        });
    });

    /**
     * Accept RFQ quote
     * POST /api/v1/rfq/:id/accept
     */
    static acceptRFQ = asyncHandler(async (req: Request, res: Response) => {
        if (!req.user) {
            return res.status(401).json({
                status: 'error',
                message: 'Authentication required',
            });
        }

        const rfq = await RFQUseCases.acceptRFQ(req.params.id, req.user.userId);

        res.status(200).json({
            status: 'success',
            message: 'RFQ accepted successfully',
            data: { rfq },
        });
    });

    /**
     * Reject RFQ
     * POST /api/v1/rfq/:id/reject
     */
    static rejectRFQ = asyncHandler(async (req: Request, res: Response) => {
        if (!req.user) {
            return res.status(401).json({
                status: 'error',
                message: 'Authentication required',
            });
        }

        const rfq = await RFQUseCases.rejectRFQ(
            req.params.id,
            req.user.userId,
            req.body.reason
        );

        res.status(200).json({
            status: 'success',
            message: 'RFQ rejected',
            data: { rfq },
        });
    });

    /**
     * Get RFQs assigned to current user
     * GET /api/v1/rfq/my-rfqs
     */
    static getMyRFQs = asyncHandler(async (req: Request, res: Response) => {
        if (!req.user) {
            return res.status(401).json({
                status: 'error',
                message: 'Authentication required',
            });
        }

        const rfqs = await RFQUseCases.getAssignedRFQs(req.user.userId);

        res.status(200).json({
            status: 'success',
            data: { rfqs },
        });
    });

    /**
     * Search RFQs
     * GET /api/v1/rfq/search
     */
    static searchRFQs = asyncHandler(async (req: Request, res: Response) => {
        const query = req.query.q as string;
        const rfqs = await RFQUseCases.searchRFQs(query);

        res.status(200).json({
            status: 'success',
            data: { rfqs },
        });
    });

    /**
     * Get RFQ statistics
     * GET /api/v1/rfq/stats
     */
    static getRFQStats = asyncHandler(async (req: Request, res: Response) => {
        const stats = await RFQUseCases.getRFQStats();

        res.status(200).json({
            status: 'success',
            data: { stats },
        });
    });

    /**
     * Export RFQ as structured JSON (for AI or external tools)
     * GET /api/v1/rfq/:id/export
     */
    static exportRFQ = asyncHandler(async (req: Request, res: Response) => {
        const rfq = await RFQUseCases.getRFQById(req.params.id);

        const exportData = {
            id: (rfq as any)._id || rfq,
            rfqNumber: (rfq as any).rfqNumber,
            status: (rfq as any).status,
            priority: (rfq as any).priority,
            contact: (rfq as any).contact,
            project: (rfq as any).project,
            items: (rfq as any).items,
            specifications: (rfq as any).specifications,
            notes: (rfq as any).notes,
            attachments: ((rfq as any).attachments || []).map((a: any) => ({
                filename: a.filename,
                originalName: a.originalName,
                size: a.size,
                mimeType: a.mimeType,
                uploadedAt: a.uploadedAt,
            })),
            createdAt: (rfq as any).createdAt,
            updatedAt: (rfq as any).updatedAt,
        };

        res.status(200).json({
            status: 'success',
            message: 'RFQ exported successfully',
            data: exportData,
        });
    });
}
