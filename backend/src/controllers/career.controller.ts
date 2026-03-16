import { Request, Response } from 'express';
import { CareerUseCases } from '@usecases/career.usecases';
import { asyncHandler } from '@middlewares/errorHandler';
import { JobStatus, JobType, ApplicationStatus } from '@domain/career.interface';
import { emailService } from '@infrastructure/email/emailService';

export class CareerController {
    // Job Controllers
    static createJob = asyncHandler(async (req: Request, res: Response) => {
        if (!req.user) {
            res.status(401).json({ status: 'error', message: 'Authentication required' });
            return;
        }
        const job = await CareerUseCases.createJob({ ...req.body, createdBy: req.user.userId });
        res.status(201).json({ status: 'success', message: 'Job created', data: { job } });
    });

    static getAllJobs = asyncHandler(async (req: Request, res: Response) => {
        const { page, limit, status, jobType, department, search } = req.query;
        const result = await CareerUseCases.getAllJobs(
            page ? parseInt(page as string) : 1,
            limit ? parseInt(limit as string) : 20,
            status as JobStatus,
            jobType as JobType,
            department as string,
            search as string
        );
        res.json({ status: 'success', data: result });
    });

    static getJobById = asyncHandler(async (req: Request, res: Response) => {
        const job = await CareerUseCases.getJobById(req.params.id);
        res.json({ status: 'success', data: { job } });
    });

    static getJobBySlug = asyncHandler(async (req: Request, res: Response) => {
        const job = await CareerUseCases.getJobBySlug(req.params.slug);
        res.json({ status: 'success', data: { job } });
    });

    static updateJob = asyncHandler(async (req: Request, res: Response) => {
        if (!req.user) {
            res.status(401).json({ status: 'error', message: 'Authentication required' });
            return;
        }
        const job = await CareerUseCases.updateJob(req.params.id, { ...req.body, updatedBy: req.user.userId });
        res.json({ status: 'success', message: 'Job updated', data: { job } });
    });

    static deleteJob = asyncHandler(async (req: Request, res: Response) => {
        if (!req.user) {
            res.status(401).json({ status: 'error', message: 'Authentication required' });
            return;
        }
        await CareerUseCases.deleteJob(req.params.id, req.user.userId);
        res.json({ status: 'success', message: 'Job deleted' });
    });

    static getActiveJobs = asyncHandler(async (req: Request, res: Response) => {
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
        const jobs = await CareerUseCases.getActiveJobs(limit);
        res.json({ status: 'success', data: { jobs } });
    });

    static publishJob = asyncHandler(async (req: Request, res: Response) => {
        if (!req.user) {
            res.status(401).json({ status: 'error', message: 'Authentication required' });
            return;
        }
        const job = await CareerUseCases.publishJob(req.params.id, req.user.userId);
        res.json({ status: 'success', message: 'Job published', data: { job } });
    });

    // Application Controllers
    static submitApplication = asyncHandler(async (req: Request, res: Response) => {
        const body = { ...req.body };

        // If resume was uploaded via multer, set resumeUrl from file path
        const file = (req as any).file as Express.Multer.File | undefined;
        if (file) {
            body.resumeUrl = `/uploads/resumes/${file.filename}`;
        }

        const application = await CareerUseCases.submitJobApplication(body);

        // Send email notifications (non-blocking)
        Promise.all([
            emailService.sendApplicationConfirmation(application.email, application),
            emailService.sendApplicationHRNotification(application),
        ]).catch((error) => {
            console.error('Email notification failed:', error);
        });

        res.status(201).json({ status: 'success', message: 'Application submitted', data: { application } });
    });

    static getAllApplications = asyncHandler(async (req: Request, res: Response) => {
        const { page, limit, jobId, status } = req.query;
        const result = await CareerUseCases.getAllApplications(
            page ? parseInt(page as string) : 1,
            limit ? parseInt(limit as string) : 20,
            jobId as string,
            status as ApplicationStatus
        );
        res.json({ status: 'success', data: result });
    });

    static getApplicationById = asyncHandler(async (req: Request, res: Response) => {
        const application = await CareerUseCases.getApplicationById(req.params.id);
        res.json({ status: 'success', data: { application } });
    });

    static updateApplicationStatus = asyncHandler(async (req: Request, res: Response) => {
        if (!req.user) {
            res.status(401).json({ status: 'error', message: 'Authentication required' });
            return;
        }
        const application = await CareerUseCases.updateApplicationStatus(req.params.id, req.body.status, req.user.userId);
        res.json({ status: 'success', message: 'Application updated', data: { application } });
    });

    /**
     * Score a candidate application
     * POST /api/v1/careers/applications/:id/score
     */
    static scoreApplication = asyncHandler(async (req: Request, res: Response) => {
        if (!req.user) {
            res.status(401).json({ status: 'error', message: 'Authentication required' });
            return;
        }

        const { overall, experience, skills, culture, education } = req.body;

        const { JobApplicationModel } = await import('@infrastructure/database/models/Career.model');
        const application = await JobApplicationModel.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    'candidateScore.overall': overall,
                    'candidateScore.experience': experience,
                    'candidateScore.skills': skills,
                    'candidateScore.culture': culture,
                    'candidateScore.education': education,
                    'candidateScore.autoCalculated': false,
                    'candidateScore.scoredAt': new Date(),
                    'candidateScore.scoredBy': req.user.userId,
                }
            },
            { new: true }
        );

        if (!application) {
            res.status(404).json({ status: 'error', message: 'Application not found' });
            return;
        }

        res.json({ status: 'success', message: 'Candidate scored', data: { application } });
    });

    /**
     * Add internal HR note to application
     * POST /api/v1/careers/applications/:id/notes
     */
    static addApplicationNote = asyncHandler(async (req: Request, res: Response) => {
        if (!req.user) {
            res.status(401).json({ status: 'error', message: 'Authentication required' });
            return;
        }

        const { note } = req.body;
        if (!note?.trim()) {
            res.status(400).json({ status: 'error', message: 'Note cannot be empty' });
            return;
        }

        const { JobApplicationModel } = await import('@infrastructure/database/models/Career.model');
        const application = await JobApplicationModel.findByIdAndUpdate(
            req.params.id,
            {
                $push: {
                    adminNotes: {
                        note: note.trim(),
                        addedBy: req.user.userId,
                        addedAt: new Date(),
                    }
                }
            },
            { new: true }
        );

        if (!application) {
            res.status(404).json({ status: 'error', message: 'Application not found' });
            return;
        }

        res.status(201).json({ status: 'success', message: 'Note added', data: { application } });
    });
}
