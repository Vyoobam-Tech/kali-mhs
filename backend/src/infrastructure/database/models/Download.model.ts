import mongoose, { Schema, Document as MongooseDocument } from 'mongoose';

/**
 * Download Tracking Interface
 */
export interface IDownload extends MongooseDocument {
    documentId: mongoose.Types.ObjectId;
    leadId: mongoose.Types.ObjectId;
    ipAddress: string;
    userAgent?: string;
    referrer?: string;
    downloadedAt: Date;
    createdAt: Date;
}

/**
 * Download Schema
 * Tracks all document downloads for analytics
 */
const DownloadSchema = new Schema<IDownload>(
    {
        documentId: {
            type: Schema.Types.ObjectId,
            ref: 'Document',
            required: true,
            index: true,
        },
        leadId: {
            type: Schema.Types.ObjectId,
            ref: 'Lead',
            required: true,
            index: true,
        },
        ipAddress: {
            type: String,
            required: true,
        },
        userAgent: {
            type: String,
        },
        referrer: {
            type: String,
        },
        downloadedAt: {
            type: Date,
            default: Date.now,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for analytics queries
DownloadSchema.index({ documentId: 1, downloadedAt: -1 });
DownloadSchema.index({ leadId: 1, downloadedAt: -1 });

/**
 * Static Methods
 */
DownloadSchema.statics = {
    /**
     * Track a document download
     */
    async trackDownload(
        documentId: string,
        leadId: string,
        ipAddress: string,
        userAgent?: string,
        referrer?: string
    ): Promise<IDownload> {
        return this.create({
            documentId,
            leadId,
            ipAddress,
            userAgent,
            referrer,
            downloadedAt: new Date(),
        });
    },

    /**
     * Get download count for a document
     */
    async getDownloadCount(documentId: string): Promise<number> {
        return this.countDocuments({ documentId });
    },

    /**
     * Get downloads for a document with pagination
     */
    async getDocumentDownloads(
        documentId: string,
        page: number = 1,
        limit: number = 20
    ): Promise<{ downloads: IDownload[]; total: number }> {
        const skip = (page - 1) * limit;
        const [downloads, total] = await Promise.all([
            this.find({ documentId })
                .populate('leadId', 'firstName lastName email company')
                .sort({ downloadedAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            this.countDocuments({ documentId }),
        ]);

        return { downloads, total };
    },

    /**
     * Get download analytics for a document
     */
    async getDocumentAnalytics(documentId: string): Promise<any> {
        const [totalDownloads, uniqueLeads, downloadsByDay] = await Promise.all([
            this.countDocuments({ documentId }),
            this.distinct('leadId', { documentId }).then((leads) => leads.length),
            this.aggregate([
                { $match: { documentId: new mongoose.Types.ObjectId(documentId) } },
                {
                    $group: {
                        _id: {
                            $dateToString: { format: '%Y-%m-%d', date: '$downloadedAt' },
                        },
                        count: { $sum: 1 },
                    },
                },
                { $sort: { _id: -1 } },
                { $limit: 30 },
            ]),
        ]);

        return {
            totalDownloads,
            uniqueLeads,
            downloadsByDay,
        };
    },
};

export const Download = mongoose.model<IDownload>('Download', DownloadSchema);
