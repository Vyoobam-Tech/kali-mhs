import {
    LeadModel,
    LeadActivityModel,
    ILeadDocument,
    ILeadActivityDocument,
} from '@infrastructure/database/models/Lead.model';
import {
    ICreateLead,
    IUpdateLead,
    ILead,
    ICreateLeadActivity,
    ILeadActivity,
    LeadStatus,
    LeadSource,
    LeadPriority,
} from '@domain/lead.interface';
import { AppError } from '@middlewares/errorHandler';

export class LeadUseCases {
    /**
     * Create a new lead
     */
    static async createLead(leadData: ICreateLead): Promise<ILead> {
        // Check if lead already exists
        const existingLead = await LeadModel.findByEmail(leadData.email);
        if (existingLead) {
            throw new AppError(409, 'Lead with this email already exists');
        }

        const lead = new LeadModel({
            ...leadData,
            status: LeadStatus.NEW,
            score: 0,
            activityCount: 0,
            convertedToCustomer: false,
            isDeleted: false,
        });

        await lead.save();
        return this.toLeadResponse(lead);
    }

    /**
     * Get all leads with filtering
     */
    static async getAllLeads(
        page: number = 1,
        limit: number = 20,
        status?: LeadStatus,
        source?: LeadSource,
        assignedTo?: string,
        priority?: LeadPriority,
        searchQuery?: string
    ): Promise<{ leads: ILead[]; total: number; page: number; totalPages: number }> {
        const skip = (page - 1) * limit;

        const filter: any = { isDeleted: false };
        if (status) filter.status = status;
        if (source) filter.source = source;
        if (assignedTo) filter.assignedTo = assignedTo;
        if (priority) filter.priority = priority;
        if (searchQuery) {
            filter.$text = { $search: searchQuery };
        }

        const [leads, total] = await Promise.all([
            LeadModel.find(filter)
                .sort(searchQuery ? { score: { $meta: 'textScore' } } : { score: -1, createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('assignedTo', 'firstName lastName email'),
            LeadModel.countDocuments(filter),
        ]);

        return {
            leads: leads.map((l) => this.toLeadResponse(l)),
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }

    /**
     * Get lead by ID
     */
    static async getLeadById(leadId: string): Promise<ILead> {
        const lead = await LeadModel.findOne({
            _id: leadId,
            isDeleted: false,
        }).populate('assignedTo', 'firstName lastName email');

        if (!lead) {
            throw new AppError(404, 'Lead not found');
        }

        return this.toLeadResponse(lead);
    }

    /**
     * Update lead
     */
    static async updateLead(leadId: string, updateData: IUpdateLead): Promise<ILead> {
        const lead = await LeadModel.findOne({
            _id: leadId,
            isDeleted: false,
        });

        if (!lead) {
            throw new AppError(404, 'Lead not found');
        }

        Object.assign(lead, updateData);
        await lead.save();
        return this.toLeadResponse(lead);
    }

    /**
     * Delete lead
     */
    static async deleteLead(leadId: string, deletedBy: string): Promise<void> {
        const lead = await LeadModel.findOne({
            _id: leadId,
            isDeleted: false,
        });

        if (!lead) {
            throw new AppError(404, 'Lead not found');
        }

        lead.isDeleted = true;
        lead.updatedBy = deletedBy as any;
        await lead.save();
    }

    /**
     * Assign lead to sales rep
     */
    static async assignLead(leadId: string, assignedTo: string, assignedBy: string): Promise<ILead> {
        const lead = await LeadModel.findOne({
            _id: leadId,
            isDeleted: false,
        });

        if (!lead) {
            throw new AppError(404, 'Lead not found');
        }

        lead.assignedTo = assignedTo as any;
        lead.assignedAt = new Date();
        lead.updatedBy = assignedBy as any;

        await lead.save();
        return this.toLeadResponse(lead);
    }

    /**
     * Update lead score
     */
    static async updateLeadScore(leadId: string, score: number): Promise<ILead> {
        const lead = await LeadModel.findOne({
            _id: leadId,
            isDeleted: false,
        });

        if (!lead) {
            throw new AppError(404, 'Lead not found');
        }

        lead.score = Math.min(100, Math.max(0, score));
        await lead.save();
        return this.toLeadResponse(lead);
    }

    /**
     * Convert lead to customer
     */
    static async convertLead(
        leadId: string,
        dealValue: number,
        convertedBy: string
    ): Promise<ILead> {
        const lead = await LeadModel.findOne({
            _id: leadId,
            isDeleted: false,
        });

        if (!lead) {
            throw new AppError(404, 'Lead not found');
        }

        lead.status = LeadStatus.WON;
        lead.convertedToCustomer = true;
        lead.convertedAt = new Date();
        lead.dealValue = dealValue;
        lead.updatedBy = convertedBy as any;

        await lead.save();
        return this.toLeadResponse(lead);
    }

    /**
     * Add activity to lead
     */
    static async addActivity(activityData: ICreateLeadActivity): Promise<ILeadActivity> {
        const lead = await LeadModel.findById(activityData.lead);

        if (!lead) {
            throw new AppError(404, 'Lead not found');
        }

        const activity = new LeadActivityModel(activityData);
        await activity.save();

        // Update lead's last activity
        lead.lastActivityAt = new Date();
        lead.activityCount += 1;
        await lead.save();

        return this.toActivityResponse(activity);
    }

    /**
     * Get lead activities
     */
    static async getLeadActivities(leadId: string): Promise<ILeadActivity[]> {
        const activities = await LeadActivityModel.find({ lead: leadId })
            .sort({ createdAt: -1 })
            .populate('performedBy', 'firstName lastName email');

        return activities.map((a) => this.toActivityResponse(a));
    }

    /**
     * Get leads by status
     */
    static async getLeadsByStatus(status: LeadStatus): Promise<ILead[]> {
        const leads = await LeadModel.findByStatus(status);
        return leads.map((l) => this.toLeadResponse(l));
    }

    /**
     * Get my assigned leads
     */
    static async getMyLeads(userId: string, status?: LeadStatus): Promise<ILead[]> {
        const filter: any = {
            assignedTo: userId,
            isDeleted: false,
        };
        if (status) filter.status = status;

        const leads = await LeadModel.find(filter).sort({ score: -1, createdAt: -1 });
        return leads.map((l) => this.toLeadResponse(l));
    }

    /**
     * Search leads
     */
    static async searchLeads(query: string, limit: number = 10): Promise<ILead[]> {
        const leads = await LeadModel.find({
            $text: { $search: query },
            isDeleted: false,
        })
            .sort({ score: { $meta: 'textScore' } })
            .limit(limit);

        return leads.map((l) => this.toLeadResponse(l));
    }

    /**
     * Get lead statistics
     */
    static async getLeadStats(): Promise<any> {
        const stats = await LeadModel.aggregate([
            { $match: { isDeleted: false } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    avgScore: { $avg: '$score' },
                },
            },
        ]);

        const sourceStats = await LeadModel.aggregate([
            { $match: { isDeleted: false } },
            {
                $group: {
                    _id: '$source',
                    count: { $sum: 1 },
                },
            },
        ]);

        return { byStatus: stats, bySource: sourceStats };
    }

    private static toLeadResponse(lead: ILeadDocument): ILead {
        return lead.toJSON() as ILead;
    }

    private static toActivityResponse(activity: ILeadActivityDocument): ILeadActivity {
        return activity.toJSON() as ILeadActivity;
    }
}
