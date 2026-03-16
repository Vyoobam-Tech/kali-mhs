import { DocumentModel, IDocumentDocument } from '@infrastructure/database/models/Document.model';
import {
    ICreateDocument,
    IUpdateDocument,
    IDocument,
    IDocumentDownloadRequest,
    DocumentCategory,
    DocumentStatus,
    DocumentAccessLevel,
} from '@domain/document.interface';
import { AppError } from '@middlewares/errorHandler';
import { urlSigner } from '@infrastructure/services/urlSigner';
import { Download } from '@infrastructure/database/models/Download.model';
import { LeadModel } from '@infrastructure/database/models/Lead.model';
import { config } from '@config/env';

/**
 * Document Use Cases
 * Business logic for document management
 */
export class DocumentUseCases {
    /**
     * Create a new document
     */
    static async createDocument(documentData: ICreateDocument): Promise<IDocument> {
        // Generate slug from title
        const slug = this.generateSlug(documentData.title);

        // Check if slug already exists
        const existingDocument = await DocumentModel.findBySlug(slug);
        if (existingDocument) {
            throw new AppError(409, 'A document with this title already exists');
        }

        const document = new DocumentModel({
            ...documentData,
            slug,
            status: DocumentStatus.DRAFT,
            viewCount: 0,
            downloadCount: 0,
            leads: [],
            isDeleted: false,
        });

        await document.save();
        return this.toDocumentResponse(document);
    }

    /**
     * Get all documents with pagination and filtering
     */
    static async getAllDocuments(
        page: number = 1,
        limit: number = 20,
        category?: DocumentCategory,
        status?: DocumentStatus,
        accessLevel?: DocumentAccessLevel,
        searchQuery?: string
    ): Promise<{ documents: IDocument[]; total: number; page: number; totalPages: number }> {
        const skip = (page - 1) * limit;

        // Build filter
        const filter: any = { isDeleted: false };
        if (category) filter.category = category;
        if (status) filter.status = status;
        if (accessLevel) filter.accessLevel = accessLevel;
        if (searchQuery) {
            filter.$text = { $search: searchQuery };
        }

        // Get documents and total count
        const [documents, total] = await Promise.all([
            DocumentModel.find(filter)
                .sort(searchQuery ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('createdBy', 'firstName lastName email')
                .populate('relatedProducts', 'name slug')
                .select('-leads'), // Exclude leads from list view
            DocumentModel.countDocuments(filter),
        ]);

        return {
            documents: documents.map((d) => this.toDocumentResponse(d)),
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }

    /**
     * Get document by ID
     */
    static async getDocumentById(documentId: string, userId?: string): Promise<IDocument> {
        const document = await DocumentModel.findOne({
            _id: documentId,
            isDeleted: false,
        })
            .populate('createdBy', 'firstName lastName email')
            .populate('relatedProducts', 'name slug')
            .select('-leads'); // Exclude leads unless admin

        if (!document) {
            throw new AppError(404, 'Document not found');
        }

        // Check access level
        await this.checkAccess(document, userId);

        await DocumentModel.findByIdAndUpdate(documentId, { $inc: { viewCount: 1 } });

        return this.toDocumentResponse(document);
    }

    /**
     * Get document by slug
     */
    static async getDocumentBySlug(slug: string, userId?: string): Promise<IDocument> {
        const document = await DocumentModel.findBySlug(slug);

        if (!document) {
            throw new AppError(404, 'Document not found');
        }

        // Check access level
        await this.checkAccess(document, userId);

        await DocumentModel.findByIdAndUpdate(document._id, { $inc: { viewCount: 1 } });

        return this.toDocumentResponse(document);
    }

    /**
     * Update document
     */
    static async updateDocument(documentId: string, updateData: IUpdateDocument): Promise<IDocument> {
        const document = await DocumentModel.findOne({
            _id: documentId,
            isDeleted: false,
        });

        if (!document) {
            throw new AppError(404, 'Document not found');
        }

        // Update fields
        if (updateData.title) {
            document.title = updateData.title;
            document.slug = this.generateSlug(updateData.title);
        }
        if (updateData.description !== undefined) document.description = updateData.description;
        if (updateData.category) document.category = updateData.category;
        if (updateData.status) document.status = updateData.status;
        if (updateData.accessLevel) document.accessLevel = updateData.accessLevel;
        if (updateData.watermarkEnabled !== undefined)
            document.watermarkEnabled = updateData.watermarkEnabled;
        if (updateData.tags) document.tags = updateData.tags;
        if (updateData.updatedBy) document.updatedBy = updateData.updatedBy as any;

        await document.save();
        return this.toDocumentResponse(document);
    }

    /**
     * Delete document (soft delete)
     */
    static async deleteDocument(documentId: string, deletedBy: string): Promise<void> {
        const document = await DocumentModel.findOne({
            _id: documentId,
            isDeleted: false,
        });

        if (!document) {
            throw new AppError(404, 'Document not found');
        }

        document.isDeleted = true;
        document.updatedBy = deletedBy as any;
        await document.save();
    }

    /**
     * Download document (with lead capture for gated content)
     */
    static async downloadDocument(downloadRequest: IDocumentDownloadRequest): Promise<string> {
        const document = await DocumentModel.findById(downloadRequest.documentId);

        if (!document) {
            throw new AppError(404, 'Document not found');
        }

        if (document.status !== DocumentStatus.PUBLISHED) {
            throw new AppError(403, 'Document is not published');
        }

        // Check access level and capture lead if gated
        if (document.accessLevel === DocumentAccessLevel.GATED) {
            if (!downloadRequest.leadInfo) {
                throw new AppError(400, 'Lead information required for gated content');
            }

            // Add lead to document
            document.leads.push({
                ...downloadRequest.leadInfo,
                downloadedAt: new Date(),
            });
        } else if (document.accessLevel === DocumentAccessLevel.AUTHENTICATED) {
            if (!downloadRequest.userId) {
                throw new AppError(401, 'Authentication required');
            }
        } else if (document.accessLevel === DocumentAccessLevel.RESTRICTED) {
            // Check user role (implement role check here if needed)
            if (!downloadRequest.userId) {
                throw new AppError(401, 'Authentication required');
            }
        }

        // Increment download count
        document.downloadCount += 1;
        await document.save();

        return document.fileUrl;
    }

    /**
     * Get documents by category
     */
    static async getDocumentsByCategory(category: DocumentCategory): Promise<IDocument[]> {
        const documents = await DocumentModel.findByCategory(category);
        return documents.map((d) => this.toDocumentResponse(d));
    }

    /**
     * Get published documents
     */
    static async getPublishedDocuments(limit: number = 50): Promise<IDocument[]> {
        const documents = await DocumentModel.find({
            status: DocumentStatus.PUBLISHED,
            isDeleted: false,
        }).sort({ createdAt: -1 }).limit(limit).select('-leads');
        return documents.map((d: any) => this.toDocumentResponse(d));
    }

    /**
     * Search documents
     */
    static async searchDocuments(query: string, limit: number = 10): Promise<IDocument[]> {
        const documents = await DocumentModel.find({
            $text: { $search: query },
            status: DocumentStatus.PUBLISHED,
            isDeleted: false,
        })
            .sort({ score: { $meta: 'textScore' } })
            .limit(limit)
            .select('-leads');

        return documents.map((d) => this.toDocumentResponse(d));
    }

    /**
     * Get document leads (admin only)
     */
    static async getDocumentLeads(documentId: string): Promise<any[]> {
        const document = await DocumentModel.findById(documentId);

        if (!document) {
            throw new AppError(404, 'Document not found');
        }

        return document.leads || [];
    }

    /**
     * Publish document
     */
    static async publishDocument(documentId: string, publishedBy: string): Promise<IDocument> {
        const document = await DocumentModel.findOne({
            _id: documentId,
            isDeleted: false,
        });

        if (!document) {
            throw new AppError(404, 'Document not found');
        }

        document.status = DocumentStatus.PUBLISHED;
        document.publishedAt = new Date();
        document.publishedBy = publishedBy as any;
        document.updatedBy = publishedBy as any;

        await document.save();
        return this.toDocumentResponse(document);
    }

    /**
     * Check document access
     */
    private static async checkAccess(document: IDocumentDocument, userId?: string): Promise<void> {
        if (document.status !== DocumentStatus.PUBLISHED) {
            throw new AppError(403, 'Document is not published');
        }

        if (document.accessLevel === DocumentAccessLevel.AUTHENTICATED && !userId) {
            throw new AppError(401, 'Authentication required to view this document');
        }

        if (document.accessLevel === DocumentAccessLevel.RESTRICTED && !userId) {
            throw new AppError(401, 'Authentication required to view this document');
        }

        // Check expiry
        if (document.expiresAt && document.expiresAt < new Date()) {
            throw new AppError(410, 'Document has expired');
        }
    }

    /**
     * Generate slug from document title
     */
    private static generateSlug(title: string): string {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }

    /**
     * Capture lead and generate signed download URL
     */
    static async captureLeadAndGenerateDownloadUrl(
        documentId: string,
        leadData: {
            firstName: string;
            lastName: string;
            email: string;
            phone?: string;
            company?: string;
            jobTitle?: string;
        }
    ): Promise<{ downloadUrl: string; expiresAt: Date; leadId: string; documentTitle: string }> {
        const document = await DocumentModel.findById(documentId);

        if (!document) {
            throw new AppError(404, 'Document not found');
        }

        if (document.status !== DocumentStatus.PUBLISHED) {
            throw new AppError(403, 'Document is not published');
        }

        // Upsert lead — returning visitors must not get a 409 error.
        // Find by email and reuse the existing lead, or create a new one.
        let lead = await LeadModel.findOne({ email: leadData.email, isDeleted: false });
        if (!lead) {
            lead = await LeadModel.create({
                ...leadData,
                source: 'GATED_CONTENT',
                isDeleted: false,
            });
        } else {
            // Update last activity so the CRM reflects this new download intent
            (lead as any).updatedAt = new Date();
            await lead.save();
        }

        // Generate signed URL (expires in 1 hour)
        // Uses the dedicated URL signer secret and the backend API base URL
        const expiresIn = 3600; // 1 hour
        const downloadUrl = urlSigner.generateDownloadUrl(documentId, (lead as any).id || (lead as any)._id.toString(), expiresIn);

        return {
            downloadUrl,
            expiresAt: new Date(Date.now() + expiresIn * 1000),
            leadId: (lead as any).id || (lead as any)._id.toString(),
            documentTitle: document.title,
        };
    }

    /**
     * Track document download
     */
    static async trackDownload(
        documentId: string,
        leadId: string,
        ipAddress: string,
        userAgent?: string,
        referrer?: string
    ): Promise<void> {
        // Track in Download model
        await (Download as any).trackDownload(documentId, leadId, ipAddress, userAgent, referrer);

        // Increment document download count
        await DocumentModel.findByIdAndUpdate(documentId, {
            $inc: { downloadCount: 1 },
        });
    }

    /**
     * Get document analytics
     */
    static async getDocumentAnalytics(documentId: string): Promise<any> {
        const document = await DocumentModel.findById(documentId);

        if (!document) {
            throw new AppError(404, 'Document not found');
        }

        // Get download analytics
        const analytics = await (Download as any).getDocumentAnalytics(documentId);

        return {
            documentId,
            title: document.title,
            viewCount: document.viewCount,
            downloadCount: document.downloadCount,
            ...analytics,
        };
    }

    /**
     * Download document with signed URL
     */
    static async downloadWithSignedUrl(token: string): Promise<{ fileUrl: string; fileName: string }> {
        // Verify signed URL
        const payload = urlSigner.verifySignedUrl(token);

        if (!payload) {
            throw new AppError(401, 'Invalid or expired download link');
        }

        const document = await DocumentModel.findById(payload.documentId);

        if (!document) {
            throw new AppError(404, 'Document not found');
        }

        return {
            fileUrl: document.fileUrl,
            fileName: document.title,
        };
    }

    /**
     * Convert Document document to response DTO
     */
    private static toDocumentResponse(document: IDocumentDocument): IDocument {
        return document.toJSON() as IDocument;
    }
}
