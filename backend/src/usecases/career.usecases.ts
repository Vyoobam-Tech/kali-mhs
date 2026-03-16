import {
    JobModel,
    JobApplicationModel,
    IJobDocument,
    IJobApplicationDocument,
} from '@infrastructure/database/models/Career.model';
import {
    ICreateJob,
    IUpdateJob,
    IJob,
    ICreateJobApplication,
    IUpdateJobApplication,
    IJobApplication,
    JobStatus,
    JobType,
    ApplicationStatus,
} from '@domain/career.interface';
import { AppError } from '@middlewares/errorHandler';

/**
 * Career/Jobs Use Cases
 * Business logic for job postings and application management
 */
export class CareerUseCases {
    /**********************
     * JOB POSTING USE CASES
     **********************/

    /**
     * Create a new job posting
     */
    static async createJob(jobData: ICreateJob): Promise<IJob> {
        const slug = this.generateSlug(jobData.title);

        const existingJob = await JobModel.findBySlug(slug);
        if (existingJob) {
            throw new AppError(409, 'A job with this title already exists');
        }

        const job = new JobModel({
            ...jobData,
            slug,
            status: JobStatus.DRAFT,
            viewCount: 0,
            applicationCount: 0,
            isDeleted: false,
        });

        await job.save();
        return this.toJobResponse(job);
    }

    /**
     * Get all jobs with pagination and filtering
     */
    static async getAllJobs(
        page: number = 1,
        limit: number = 20,
        status?: JobStatus,
        jobType?: JobType,
        department?: string,
        searchQuery?: string
    ): Promise<{ jobs: IJob[]; total: number; page: number; totalPages: number }> {
        const skip = (page - 1) * limit;

        const filter: any = { isDeleted: false };
        if (status) filter.status = status;
        if (jobType) filter.jobType = jobType;
        if (department) filter.department = department;
        if (searchQuery) {
            filter.$text = { $search: searchQuery };
        }

        const [jobs, total] = await Promise.all([
            JobModel.find(filter)
                .sort(searchQuery ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('hiringManager', 'firstName lastName email')
                .populate('recruiter', 'firstName lastName email'),
            JobModel.countDocuments(filter),
        ]);

        return {
            jobs: jobs.map((j) => this.toJobResponse(j)),
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }

    /**
     * Get job by ID
     */
    static async getJobById(jobId: string): Promise<IJob> {
        const job = await JobModel.findOne({
            _id: jobId,
            isDeleted: false,
        }).populate('hiringManager recruiter', 'firstName lastName email');

        if (!job) {
            throw new AppError(404, 'Job not found');
        }

        await JobModel.findByIdAndUpdate(jobId, { $inc: { viewCount: 1 } });

        return this.toJobResponse(job);
    }

    /**
     * Get job by slug
     */
    static async getJobBySlug(slug: string): Promise<IJob> {
        const job = await JobModel.findBySlug(slug);

        if (!job) {
            throw new AppError(404, 'Job not found');
        }

        await JobModel.findByIdAndUpdate(job._id, { $inc: { viewCount: 1 } });

        return this.toJobResponse(job);
    }

    /**
     * Update job
     */
    static async updateJob(jobId: string, updateData: IUpdateJob): Promise<IJob> {
        const job = await JobModel.findOne({
            _id: jobId,
            isDeleted: false,
        });

        if (!job) {
            throw new AppError(404, 'Job not found');
        }

        // Update fields
        if (updateData.title) {
            job.title = updateData.title;
            job.slug = this.generateSlug(updateData.title);
        }
        if (updateData.department) job.department = updateData.department;
        if (updateData.status) job.status = updateData.status;
        if (updateData.jobType) job.jobType = updateData.jobType;
        if (updateData.description !== undefined) job.description = updateData.description;
        if (updateData.updatedBy) job.updatedBy = updateData.updatedBy as any;

        await job.save();
        return this.toJobResponse(job);
    }

    /**
     * Delete job (soft delete)
     */
    static async deleteJob(jobId: string, deletedBy: string): Promise<void> {
        const job = await JobModel.findOne({
            _id: jobId,
            isDeleted: false,
        });

        if (!job) {
            throw new AppError(404, 'Job not found');
        }

        job.isDeleted = true;
        job.updatedBy = deletedBy as any;
        await job.save();
    }

    /**
     * Get active jobs
     */
    static async getActiveJobs(limit: number = 50): Promise<IJob[]> {
        const jobs = await JobModel.find({
            status: JobStatus.PUBLISHED,
            isDeleted: false,
        }).sort({ createdAt: -1 }).limit(limit);
        return jobs.map((j: any) => this.toJobResponse(j));
    }

    /**
     * Publish job
     */
    static async publishJob(jobId: string, publishedBy: string): Promise<IJob> {
        const job = await JobModel.findOne({
            _id: jobId,
            isDeleted: false,
        });

        if (!job) {
            throw new AppError(404, 'Job not found');
        }

        job.status = JobStatus.ACTIVE;
        job.publishedAt = new Date();
        job.publishedBy = publishedBy as any;
        job.updatedBy = publishedBy as any;

        await job.save();
        return this.toJobResponse(job);
    }

    /**********************
     * JOB APPLICATION USE CASES
     **********************/

    /**
     * Submit job application
     */
    static async submitJobApplication(
        applicationData: ICreateJobApplication
    ): Promise<IJobApplication> {
        // Verify job exists and is active
        const job = await JobModel.findById(applicationData.job);

        if (!job || job.status !== JobStatus.ACTIVE) {
            throw new AppError(400, 'Job is not available for applications');
        }

        // Check if already applied
        const existingApplication = await JobApplicationModel.findOne({
            job: applicationData.job,
            email: applicationData.email,
        });

        if (existingApplication) {
            throw new AppError(409, 'You have already applied for this job');
        }

        const application = new JobApplicationModel({
            ...applicationData,
            status: ApplicationStatus.SUBMITTED,
            submittedAt: new Date(),
        });

        await application.save();

        // Increment application count atomically
        await JobModel.findByIdAndUpdate(applicationData.job, { $inc: { applicationCount: 1 } });

        return this.toApplicationResponse(application);
    }

    /**
     * Get all applications with filtering
     */
    static async getAllApplications(
        page: number = 1,
        limit: number = 20,
        jobId?: string,
        status?: ApplicationStatus,
        assignedTo?: string
    ): Promise<{ applications: IJobApplication[]; total: number; page: number; totalPages: number }> {
        const skip = (page - 1) * limit;

        const filter: any = {};
        if (jobId) filter.job = jobId;
        if (status) filter.status = status;
        if (assignedTo) filter.assignedTo = assignedTo;

        const [applications, total] = await Promise.all([
            JobApplicationModel.find(filter)
                .sort({ submittedAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('job', 'title department')
                .populate('assignedTo', 'firstName lastName email'),
            JobApplicationModel.countDocuments(filter),
        ]);

        return {
            applications: applications.map((a) => this.toApplicationResponse(a)),
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }

    /**
     * Get application by ID
     */
    static async getApplicationById(applicationId: string): Promise<IJobApplication> {
        const application = await JobApplicationModel.findById(applicationId)
            .populate('job', 'title department')
            .populate('assignedTo', 'firstName lastName email');

        if (!application) {
            throw new AppError(404, 'Application not found');
        }

        return this.toApplicationResponse(application);
    }

    /**
     * Update application status
     */
    static async updateApplicationStatus(
        applicationId: string,
        status: ApplicationStatus,
        updatedBy: string
    ): Promise<IJobApplication> {
        const application = await JobApplicationModel.findById(applicationId);

        if (!application) {
            throw new AppError(404, 'Application not found');
        }

        application.status = status;
        application.updatedBy = updatedBy as any;

        // Update timeline
        const now = new Date();
        if (status === ApplicationStatus.UNDER_REVIEW && !application.reviewedAt) {
            application.reviewedAt = now;
        } else if (status === ApplicationStatus.INTERVIEWED && !application.interviewedAt) {
            application.interviewedAt = now;
        }

        await application.save();
        return this.toApplicationResponse(application);
    }

    /**
     * Assign application to recruiter
     */
    static async assignApplication(
        applicationId: string,
        assignedTo: string,
        assignedBy: string
    ): Promise<IJobApplication> {
        const application = await JobApplicationModel.findById(applicationId);

        if (!application) {
            throw new AppError(404, 'Application not found');
        }

        application.assignedTo = assignedTo as any;
        application.updatedBy = assignedBy as any;

        await application.save();
        return this.toApplicationResponse(application);
    }

    /**
     * Schedule interview
     */
    static async scheduleInterview(
        applicationId: string,
        interviewDetails: {
            date: Date;
            time: string;
            location?: string;
            meetingUrl?: string;
            notes?: string;
        },
        scheduledBy: string
    ): Promise<IJobApplication> {
        const application = await JobApplicationModel.findById(applicationId);

        if (!application) {
            throw new AppError(404, 'Application not found');
        }

        application.interviewSchedule = interviewDetails as any;
        application.status = ApplicationStatus.SHORTLISTED;
        application.updatedBy = scheduledBy as any;

        await application.save();
        return this.toApplicationResponse(application);
    }

    /**
     * Search jobs
     */
    static async searchJobs(query: string, limit: number = 10): Promise<IJob[]> {
        const jobs = await JobModel.find({
            $text: { $search: query },
            status: JobStatus.ACTIVE,
            isDeleted: false,
        })
            .sort({ score: { $meta: 'textScore' } })
            .limit(limit);

        return jobs.map((j) => this.toJobResponse(j));
    }

    /**
     * Generate slug
     */
    private static generateSlug(title: string): string {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }

    /**
     * Convert to response DTOs
     */
    private static toJobResponse(job: IJobDocument): IJob {
        return job.toJSON() as IJob;
    }

    private static toApplicationResponse(application: IJobApplicationDocument): IJobApplication {
        return application.toJSON() as IJobApplication;
    }
}
