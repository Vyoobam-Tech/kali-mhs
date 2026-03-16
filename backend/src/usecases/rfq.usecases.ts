import { RFQModel, IRFQDocument } from '@infrastructure/database/models/RFQ.model';
import {
    ICreateRFQ,
    IUpdateRFQ,
    IRFQ,
    RFQStatus,
    RFQPriority,
    IQuoteResponse,
} from '@domain/rfq.interface';
import { AppError } from '@middlewares/errorHandler';

/**
 * RFQ Use Cases
 * Business logic for RFQ management
 */
export class RFQUseCases {
    /**
     * Create a new RFQ (can be submitted by customer or created as draft by admin)
     */
    static async createRFQ(rfqData: ICreateRFQ): Promise<IRFQ> {
        const rfq = new RFQModel({
            ...rfqData,
            status: RFQStatus.DRAFT,
            priority: RFQPriority.MEDIUM,
        });

        await rfq.save();
        return this.toRFQResponse(rfq);
    }

    /**
     * Submit RFQ (change status from DRAFT to SUBMITTED)
     */
    static async submitRFQ(rfqId: string): Promise<IRFQ> {
        const rfq = await RFQModel.findById(rfqId);

        if (!rfq) {
            throw new AppError(404, 'RFQ not found');
        }

        if (rfq.status !== RFQStatus.DRAFT) {
            throw new AppError(400, 'Only draft RFQs can be submitted');
        }

        rfq.status = RFQStatus.SUBMITTED;
        await rfq.save();

        return this.toRFQResponse(rfq);
    }

    /**
     * Get all RFQs with pagination and filtering
     */
    static async getAllRFQs(
        page: number = 1,
        limit: number = 20,
        status?: RFQStatus,
        priority?: RFQPriority,
        assignedTo?: string
    ): Promise<{ rfqs: IRFQ[]; total: number; page: number; totalPages: number }> {
        const skip = (page - 1) * limit;

        // Build filter
        const filter: any = {};
        if (status) filter.status = status;
        if (priority) filter.priority = priority;
        if (assignedTo) filter.assignedTo = assignedTo;

        // Get RFQs and total count
        const [rfqs, total] = await Promise.all([
            RFQModel.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('assignedTo', 'firstName lastName email')
                .populate('createdBy', 'firstName lastName email')
                .populate('items.productId', 'name category'),
            RFQModel.countDocuments(filter),
        ]);

        return {
            rfqs: rfqs.map((r) => this.toRFQResponse(r)),
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }

    /**
     * Get RFQ by ID
     */
    static async getRFQById(rfqId: string): Promise<IRFQ> {
        const rfq = await RFQModel.findById(rfqId)
            .populate('assignedTo', 'firstName lastName email')
            .populate('createdBy', 'firstName lastName email')
            .populate('items.productId', 'name category slug')
            .populate('quote.quotedBy', 'firstName lastName email');

        if (!rfq) {
            throw new AppError(404, 'RFQ not found');
        }

        return this.toRFQResponse(rfq);
    }

    /**
     * Get RFQ by RFQ number
     */
    static async getRFQByNumber(rfqNumber: string): Promise<IRFQ> {
        const rfq = await RFQModel.findByRFQNumber(rfqNumber);

        if (!rfq) {
            throw new AppError(404, 'RFQ not found');
        }

        return this.toRFQResponse(rfq);
    }

    /**
     * Update RFQ
     */
    static async updateRFQ(rfqId: string, updateData: IUpdateRFQ): Promise<IRFQ> {
        const rfq = await RFQModel.findById(rfqId);

        if (!rfq) {
            throw new AppError(404, 'RFQ not found');
        }

        // Update fields
        if (updateData.status) rfq.status = updateData.status;
        if (updateData.priority) rfq.priority = updateData.priority;
        if (updateData.assignedTo !== undefined) rfq.assignedTo = updateData.assignedTo as any;
        if (updateData.notes !== undefined) rfq.notes = updateData.notes;
        if (updateData.updatedBy) rfq.updatedBy = updateData.updatedBy as any;

        // If assigning, set assignedAt
        if (updateData.assignedTo && !rfq.assignedAt) {
            rfq.assignedAt = new Date();
        }

        await rfq.save();
        return this.toRFQResponse(rfq);
    }

    /**
     * Assign RFQ to a user
     */
    static async assignRFQ(rfqId: string, assignedTo: string, assignedBy: string): Promise<IRFQ> {
        const rfq = await RFQModel.findById(rfqId);

        if (!rfq) {
            throw new AppError(404, 'RFQ not found');
        }

        rfq.assignedTo = assignedTo as any;
        rfq.assignedAt = new Date();
        rfq.updatedBy = assignedBy as any;

        // Move to UNDER_REVIEW if still in SUBMITTED
        if (rfq.status === RFQStatus.SUBMITTED) {
            rfq.status = RFQStatus.UNDER_REVIEW;
        }

        await rfq.save();
        return this.toRFQResponse(rfq);
    }

    /**
     * Add quote to RFQ
     */
    static async addQuote(
        rfqId: string,
        quoteData: IQuoteResponse,
        quotedBy: string
    ): Promise<IRFQ> {
        const rfq = await RFQModel.findById(rfqId);

        if (!rfq) {
            throw new AppError(404, 'RFQ not found');
        }

        if (rfq.status === RFQStatus.ACCEPTED || rfq.status === RFQStatus.REJECTED) {
            throw new AppError(400, 'Cannot quote an already closed RFQ');
        }

        // Calculate totals if not provided
        if (!quoteData.subtotal) {
            quoteData.subtotal = quoteData.items.reduce((sum, item) => sum + item.totalPrice, 0);
        }
        if (!quoteData.total) {
            quoteData.total = quoteData.subtotal + (quoteData.tax || 0) - (quoteData.discount || 0);
        }

        rfq.quote = {
            ...quoteData,
            quotedBy: quotedBy as any,
            quotedAt: new Date(),
        };
        rfq.status = RFQStatus.QUOTED;
        rfq.updatedBy = quotedBy as any;

        await rfq.save();
        return this.toRFQResponse(rfq);
    }

    /**
     * Accept RFQ (customer accepts the quote)
     */
    static async acceptRFQ(rfqId: string, updatedBy: string): Promise<IRFQ> {
        const rfq = await RFQModel.findById(rfqId);

        if (!rfq) {
            throw new AppError(404, 'RFQ not found');
        }

        if (rfq.status !== RFQStatus.QUOTED && rfq.status !== RFQStatus.NEGOTIATION) {
            throw new AppError(400, 'Only quoted RFQs can be accepted');
        }

        rfq.status = RFQStatus.ACCEPTED;
        rfq.updatedBy = updatedBy as any;
        await rfq.save();

        return this.toRFQResponse(rfq);
    }

    /**
     * Reject RFQ
     */
    static async rejectRFQ(rfqId: string, updatedBy: string, reason?: string): Promise<IRFQ> {
        const rfq = await RFQModel.findById(rfqId);

        if (!rfq) {
            throw new AppError(404, 'RFQ not found');
        }

        rfq.status = RFQStatus.REJECTED;
        rfq.updatedBy = updatedBy as any;
        if (reason) {
            rfq.customerNotes = reason;
        }
        await rfq.save();

        return this.toRFQResponse(rfq);
    }

    /**
     * Get RFQs by status
     */
    static async getRFQsByStatus(status: RFQStatus): Promise<IRFQ[]> {
        const rfqs = await RFQModel.findByStatus(status);
        return rfqs.map((r) => this.toRFQResponse(r));
    }

    /**
     * Get RFQs assigned to a user
     */
    static async getAssignedRFQs(userId: string): Promise<IRFQ[]> {
        const rfqs = await RFQModel.findAssignedTo(userId);
        return rfqs.map((r) => this.toRFQResponse(r));
    }

    /**
     * Search RFQs by customer email or RFQ number
     */
    static async searchRFQs(query: string): Promise<IRFQ[]> {
        // Escape regex special characters to prevent ReDoS attacks.
        // User input is treated as a literal string, not a regex pattern.
        const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const safeRegex = new RegExp(escaped, 'i');

        const rfqs = await RFQModel.find({
            $or: [
                { rfqNumber: safeRegex },
                { 'contact.email': safeRegex },
                { 'contact.firstName': safeRegex },
                { 'contact.lastName': safeRegex },
                { 'contact.company': safeRegex },
            ],
        })
            .sort({ createdAt: -1 })
            .limit(20);

        return rfqs.map((r) => this.toRFQResponse(r));
    }

    /**
     * Get RFQ statistics
     */
    static async getRFQStats(): Promise<{
        total: number;
        byStatus: Record<RFQStatus, number>;
        byPriority: Record<RFQPriority, number>;
    }> {
        const [statusStats, priorityStats, total] = await Promise.all([
            RFQModel.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
            RFQModel.aggregate([{ $group: { _id: '$priority', count: { $sum: 1 } } }]),
            RFQModel.countDocuments(),
        ]);

        const byStatus: any = {};
        statusStats.forEach((stat) => {
            byStatus[stat._id] = stat.count;
        });

        const byPriority: any = {};
        priorityStats.forEach((stat) => {
            byPriority[stat._id] = stat.count;
        });

        return { total, byStatus, byPriority };
    }

    /**
     * Convert RFQ document to response DTO
     */
    private static toRFQResponse(rfq: IRFQDocument): IRFQ {
        return rfq.toJSON() as IRFQ;
    }
}
