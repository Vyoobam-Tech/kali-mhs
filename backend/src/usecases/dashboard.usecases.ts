import { RFQModel } from '@infrastructure/database/models/RFQ.model';
import { LeadModel } from '@infrastructure/database/models/Lead.model';
import { JobModel } from '@infrastructure/database/models/Career.model';
import { ProductModel } from '@infrastructure/database/models/Product.model';
import { RFQStatus } from '@domain/rfq.interface';
import { JobStatus } from '@domain/career.interface';
import { ProductStatus } from '@domain/product.interface';

export interface IDashboardStats {
    totalRFQs: number;
    rfqsThisMonth: number;
    totalLeads: number;
    leadsThisMonth: number;
    activeJobs: number;
    activeProducts: number;
    recentRFQs: Array<{
        id: string;
        rfqNumber: string;
        contactName: string;
        contactEmail: string;
        company: string;
        status: string;
        createdAt: Date;
    }>;
}

export class DashboardUseCases {
    static async getStats(): Promise<IDashboardStats> {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const [
            totalRFQs,
            rfqsThisMonth,
            totalLeads,
            leadsThisMonth,
            activeJobs,
            activeProducts,
            recentRFQDocs,
        ] = await Promise.all([
            RFQModel.countDocuments({}),
            RFQModel.countDocuments({ createdAt: { $gte: startOfMonth } }),
            LeadModel.countDocuments({ isDeleted: false }),
            LeadModel.countDocuments({ isDeleted: false, createdAt: { $gte: startOfMonth } }),
            JobModel.countDocuments({ status: JobStatus.PUBLISHED, isDeleted: false }),
            ProductModel.countDocuments({ status: ProductStatus.ACTIVE, isDeleted: false }),
            RFQModel.find({})
                .sort({ createdAt: -1 })
                .limit(5)
                .select('rfqNumber contact.firstName contact.lastName contact.email contact.company status createdAt'),
        ]);

        const recentRFQs = recentRFQDocs.map((r) => ({
            id: (r._id as any).toString(),
            rfqNumber: r.rfqNumber,
            contactName: `${r.contact.firstName} ${r.contact.lastName}`,
            contactEmail: r.contact.email,
            company: r.contact.company || '',
            status: r.status,
            createdAt: (r as any).createdAt,
        }));

        return {
            totalRFQs,
            rfqsThisMonth,
            totalLeads,
            leadsThisMonth,
            activeJobs,
            activeProducts,
            recentRFQs,
        };
    }
}
