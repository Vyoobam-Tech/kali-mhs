import { Request, Response } from 'express';
import { LeadUseCases } from '@usecases/lead.usecases';
import { asyncHandler } from '@middlewares/errorHandler';
import { LeadStatus, LeadSource, LeadPriority } from '@domain/lead.interface';

export class LeadController {
    static createLead = asyncHandler(async (req: Request, res: Response) => {
        const lead = await LeadUseCases.createLead(req.body);
        res.status(201).json({ status: 'success', message: 'Lead created', data: { lead } });
    });

    static getAllLeads = asyncHandler(async (req: Request, res: Response) => {
        const { page, limit, status, source, priority, search } = req.query;
        const result = await LeadUseCases.getAllLeads(
            page ? parseInt(page as string) : 1,
            limit ? parseInt(limit as string) : 20,
            status as LeadStatus,
            source as LeadSource,
            req.query.assignedTo as string,
            priority as LeadPriority,
            search as string
        );
        res.json({ status: 'success', data: result });
    });

    static getLeadById = asyncHandler(async (req: Request, res: Response) => {
        const lead = await LeadUseCases.getLeadById(req.params.id);
        res.json({ status: 'success', data: { lead } });
    });

    static updateLead = asyncHandler(async (req: Request, res: Response) => {
        if (!req.user) {
            res.status(401).json({ status: 'error', message: 'Authentication required' });
            return;
        }
        const lead = await LeadUseCases.updateLead(req.params.id, { ...req.body, updatedBy: req.user.userId });
        res.json({ status: 'success', message: 'Lead updated', data: { lead } });
    });

    static deleteLead = asyncHandler(async (req: Request, res: Response) => {
        if (!req.user) {
            res.status(401).json({ status: 'error', message: 'Authentication required' });
            return;
        }
        await LeadUseCases.deleteLead(req.params.id, req.user.userId);
        res.json({ status: 'success', message: 'Lead deleted' });
    });

    static assignLead = asyncHandler(async (req: Request, res: Response) => {
        if (!req.user) {
            res.status(401).json({ status: 'error', message: 'Authentication required' });
            return;
        }
        const lead = await LeadUseCases.assignLead(req.params.id, req.body.assignedTo, req.user.userId);
        res.json({ status: 'success', message: 'Lead assigned', data: { lead } });
    });

    static convertLead = asyncHandler(async (req: Request, res: Response) => {
        if (!req.user) {
            res.status(401).json({ status: 'error', message: 'Authentication required' });
            return;
        }
        const lead = await LeadUseCases.convertLead(req.params.id, req.body.dealValue, req.user.userId);
        res.json({ status: 'success', message: 'Lead converted', data: { lead } });
    });

    static addActivity = asyncHandler(async (req: Request, res: Response) => {
        if (!req.user) {
            res.status(401).json({ status: 'error', message: 'Authentication required' });
            return;
        }
        const activity = await LeadUseCases.addActivity({
            lead: req.params.id,
            ...req.body,
            performedBy: req.user.userId,
        });
        res.status(201).json({ status: 'success', message: 'Activity added', data: { activity } });
    });

    static getLeadActivities = asyncHandler(async (req: Request, res: Response) => {
        const activities = await LeadUseCases.getLeadActivities(req.params.id);
        res.json({ status: 'success', data: { activities } });
    });

    static getMyLeads = asyncHandler(async (req: Request, res: Response) => {
        if (!req.user) {
            res.status(401).json({ status: 'error', message: 'Authentication required' });
            return;
        }
        const leads = await LeadUseCases.getMyLeads(req.user.userId, req.query.status as LeadStatus);
        res.json({ status: 'success', data: { leads } });
    });

    static getLeadStats = asyncHandler(async (req: Request, res: Response) => {
        const stats = await LeadUseCases.getLeadStats();
        res.json({ status: 'success', data: stats });
    });
}
